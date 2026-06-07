from __future__ import annotations

from calendar import monthrange
from datetime import date, datetime
import os

import razorpay
from django.db import transaction
from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response

from .notifications import send_booking_confirmation
from .models import AvailabilitySlot, Booking, BookingStatus, Review, TherapistProfile
from .serializers import (
    AvailableDateSerializer,
    AvailableSlotSerializer,
    BookingCreateRequestSerializer,
    BookingCreateResponseSerializer,
    BookingVerifyPaymentRequestSerializer,
    BookingVerifyPaymentResponseSerializer,
    ReviewListItemSerializer,
    ReviewSubmitRequestSerializer,
    ReviewSubmitResponseSerializer,
)


def _parse_date(raw_value: str | None) -> date | None:
    if not raw_value:
        return None
    try:
        return datetime.strptime(raw_value, "%Y-%m-%d").date()
    except ValueError:
        return None


def _parse_month(raw_value: str | None) -> tuple[int, int] | None:
    if not raw_value:
        return None
    try:
        month_dt = datetime.strptime(raw_value, "%Y-%m")
        return month_dt.year, month_dt.month
    except ValueError:
        return None


@api_view(["GET"])
@authentication_classes([])
@permission_classes([AllowAny])
def available_slots(request: Request) -> Response:
    query_date = _parse_date(request.query_params.get("date"))
    if query_date is None:
        return Response(
            {"detail": "Query param 'date' is required in format YYYY-MM-DD."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    therapist = TherapistProfile.objects.filter(is_active=True).first()
    if therapist is None:
        return Response([], status=status.HTTP_200_OK)

    slots = AvailabilitySlot.objects.filter(
        therapist=therapist,
        day_of_week=query_date.weekday(),
        is_booked=False,
    ).order_by("start_time")

    confirmed_times = set(
        Booking.objects.filter(
            slot_date=query_date,
            status=BookingStatus.CONFIRMED,
        ).values_list("slot_time", flat=True)
    )
    available = [
        {"slot_time": slot.start_time, "duration_minutes": slot.duration_minutes}
        for slot in slots
        if slot.start_time not in confirmed_times
    ]
    serializer = AvailableSlotSerializer(available, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET"])
@authentication_classes([])
@permission_classes([AllowAny])
def available_dates(request: Request) -> Response:
    parsed_month = _parse_month(request.query_params.get("month"))
    if parsed_month is None:
        return Response(
            {"detail": "Query param 'month' is required in format YYYY-MM."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    therapist = TherapistProfile.objects.filter(is_active=True).first()
    if therapist is None:
        return Response([], status=status.HTTP_200_OK)

    year, month = parsed_month
    days_in_month = monthrange(year, month)[1]
    base_slots = list(
        AvailabilitySlot.objects.filter(therapist=therapist, is_booked=False).order_by(
            "start_time"
        )
    )

    confirmed_bookings = Booking.objects.filter(
        slot_date__year=year,
        slot_date__month=month,
        status=BookingStatus.CONFIRMED,
    ).values_list("slot_date", "slot_time")

    confirmed_by_date: dict[date, set] = {}
    for booking_date, booking_time in confirmed_bookings:
        if booking_date not in confirmed_by_date:
            confirmed_by_date[booking_date] = set()
        confirmed_by_date[booking_date].add(booking_time)

    available_date_rows: list[dict[str, date]] = []
    for day in range(1, days_in_month + 1):
        current_date = date(year, month, day)
        day_slots = [slot for slot in base_slots if slot.day_of_week == current_date.weekday()]
        if not day_slots:
            continue

        confirmed_times = confirmed_by_date.get(current_date, set())
        has_available = any(slot.start_time not in confirmed_times for slot in day_slots)
        if has_available:
            available_date_rows.append({"date": current_date})

    serializer = AvailableDateSerializer(available_date_rows, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


def _dispatch_booking_confirmation(booking_id: int) -> None:
    try:
        booking = Booking.objects.get(id=booking_id)
    except Booking.DoesNotExist:
        return
    send_booking_confirmation(booking)


def _booking_create_payload(booking: Booking, **extra: object) -> dict[str, object]:
    return {
        "booking_id": booking.id,
        "slot_date": booking.slot_date,
        "slot_time": booking.slot_time,
        **extra,
    }


@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def create_booking(request: Request) -> Response:
    serializer = BookingCreateRequestSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    payload = serializer.validated_data

    slot_date = payload["slot_date"]
    slot_time = payload["slot_time"]

    has_confirmed = Booking.objects.filter(
        slot_date=slot_date,
        slot_time=slot_time,
        status=BookingStatus.CONFIRMED,
    ).exists()
    if has_confirmed:
        return Response(
            {"detail": "This slot is already confirmed for the selected date and time."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    therapist = TherapistProfile.objects.filter(is_active=True).first()
    if therapist is None:
        return Response(
            {"detail": "No active therapist profile found."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    slot = AvailabilitySlot.objects.filter(
        therapist=therapist,
        day_of_week=slot_date.weekday(),
        start_time=slot_time,
        is_booked=False,
    ).first()
    if slot is None:
        return Response(
            {"detail": "No matching availability slot found for the requested time."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    amount_rupees = int(os.getenv("SESSION_PRICE", "0") or 0)
    amount_paise = max(amount_rupees * 100, 0)
    currency = "INR"
    razorpay_key_id = os.getenv("RAZORPAY_KEY_ID", "")

    if amount_paise == 0:
        booking = Booking.objects.create(
            slot_date=slot_date,
            slot_time=slot_time,
            duration_minutes=slot.duration_minutes,
            client_name=payload["client_name"],
            client_email=payload["client_email"],
            client_phone=payload.get("client_phone", ""),
            age=payload["age"],
            notes=payload.get("notes", ""),
            consent_given=payload["consent_given"],
            status=BookingStatus.CONFIRMED,
            razorpay_order_id="",
        )
        transaction.on_commit(
            lambda booking_id=booking.id: _dispatch_booking_confirmation(booking_id)
        )
        response_payload = _booking_create_payload(
            booking,
            razorpay_order_id="",
            razorpay_key_id="",
            amount=0,
            currency=currency,
            is_pro_bono=True,
        )
        response_serializer = BookingCreateResponseSerializer(response_payload)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

    razorpay_key_secret = os.getenv("RAZORPAY_KEY_SECRET", "")
    if not razorpay_key_id or not razorpay_key_secret:
        return Response(
            {"detail": "Razorpay credentials are not configured."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    razorpay_client = razorpay.Client(auth=(razorpay_key_id, razorpay_key_secret))
    order_payload = {"amount": amount_paise, "currency": currency, "payment_capture": 1}
    order = razorpay_client.order.create(data=order_payload)
    razorpay_order_id = str(order.get("id", ""))

    booking = Booking.objects.create(
        slot_date=slot_date,
        slot_time=slot_time,
        duration_minutes=slot.duration_minutes,
        client_name=payload["client_name"],
        client_email=payload["client_email"],
        client_phone=payload.get("client_phone", ""),
        age=payload["age"],
        notes=payload.get("notes", ""),
        consent_given=payload["consent_given"],
        status=BookingStatus.PENDING_PAYMENT,
        razorpay_order_id=razorpay_order_id,
    )

    response_payload = _booking_create_payload(
        booking,
        razorpay_order_id=razorpay_order_id,
        razorpay_key_id=razorpay_key_id,
        amount=amount_paise,
        currency=currency,
        is_pro_bono=False,
    )
    response_serializer = BookingCreateResponseSerializer(response_payload)
    return Response(response_serializer.data, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def verify_booking_payment(request: Request) -> Response:
    serializer = BookingVerifyPaymentRequestSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    payload = serializer.validated_data

    try:
        booking = Booking.objects.get(id=payload["booking_id"])
    except Booking.DoesNotExist:
        return Response(
            {"detail": "Booking not found."}, status=status.HTTP_404_NOT_FOUND
        )

    razorpay_key_id = os.getenv("RAZORPAY_KEY_ID", "")
    razorpay_key_secret = os.getenv("RAZORPAY_KEY_SECRET", "")
    if not razorpay_key_id or not razorpay_key_secret:
        return Response(
            {"detail": "Razorpay credentials are not configured."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    razorpay_client = razorpay.Client(auth=(razorpay_key_id, razorpay_key_secret))
    signature_payload = {
        "razorpay_order_id": payload["razorpay_order_id"],
        "razorpay_payment_id": payload["razorpay_payment_id"],
        "razorpay_signature": payload["razorpay_signature"],
    }

    try:
        razorpay_client.utility.verify_payment_signature(signature_payload)
    except Exception as exc:
        return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

    booking.status = BookingStatus.CONFIRMED
    booking.razorpay_payment_id = payload["razorpay_payment_id"]
    booking.razorpay_order_id = payload["razorpay_order_id"]
    booking.save(update_fields=["status", "razorpay_payment_id", "razorpay_order_id"])
    transaction.on_commit(
        lambda booking_id=booking.id: _dispatch_booking_confirmation(booking_id)
    )

    response_serializer = BookingVerifyPaymentResponseSerializer(
        {"success": True, "booking_id": booking.id}
    )
    return Response(response_serializer.data, status=status.HTTP_200_OK)


@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def submit_review(request: Request) -> Response:
    serializer = ReviewSubmitRequestSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    payload = serializer.validated_data

    display_name = (payload.get("display_name", "") or "").strip() or "Anonymous"
    Review.objects.create(
        display_name=display_name,
        body=payload["body"],
        rating=payload["rating"],
        is_approved=False,
    )
    response_serializer = ReviewSubmitResponseSerializer(
        {
            "success": True,
            "message": "Your review has been submitted. It will appear once approved.",
        }
    )
    return Response(response_serializer.data, status=status.HTTP_200_OK)


@api_view(["GET"])
@authentication_classes([])
@permission_classes([AllowAny])
def list_reviews(request: Request) -> Response:
    del request
    reviews = Review.objects.filter(is_approved=True).order_by("-created_at")
    payload = [
        {
            "display_name": review.display_name,
            "body": review.body,
            "rating": review.rating,
            "created_at": review.created_at,
        }
        for review in reviews
    ]
    serializer = ReviewListItemSerializer(payload, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
