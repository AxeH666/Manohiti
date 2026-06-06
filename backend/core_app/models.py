from __future__ import annotations

from django.conf import settings
from django.db import models


class TherapistProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="therapist_profile",
    )
    display_name = models.CharField(max_length=255)
    email = models.EmailField()
    bio = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self) -> str:
        return self.display_name


class SlotTemplate(models.Model):
    day_of_week = models.IntegerField()
    start_time = models.TimeField()
    duration_minutes = models.IntegerField(default=60)
    is_active = models.BooleanField(default=True)

    def __str__(self) -> str:
        return f"{self.day_of_week} {self.start_time} ({self.duration_minutes}m)"


class AvailabilitySlot(models.Model):
    therapist = models.ForeignKey(
        TherapistProfile,
        on_delete=models.CASCADE,
        related_name="availability_slots",
    )
    day_of_week = models.IntegerField()
    start_time = models.TimeField()
    duration_minutes = models.IntegerField(default=60)
    is_booked = models.BooleanField(default=False)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["therapist", "day_of_week", "start_time"],
                name="uniq_therapist_slot_day_time",
            )
        ]

    def __str__(self) -> str:
        return f"{self.therapist.display_name}: {self.day_of_week} {self.start_time}"


class BookingStatus(models.TextChoices):
    PENDING_PAYMENT = "PENDING_PAYMENT", "Pending Payment"
    CONFIRMED = "CONFIRMED", "Confirmed"
    CANCELLED = "CANCELLED", "Cancelled"


class Booking(models.Model):
    slot_date = models.DateField()
    slot_time = models.TimeField()
    duration_minutes = models.IntegerField()
    client_name = models.CharField(max_length=255)
    client_email = models.EmailField()
    client_phone = models.CharField(max_length=50, blank=True)
    age = models.IntegerField()
    notes = models.TextField(blank=True)
    consent_given = models.BooleanField(default=False)
    status = models.CharField(
        max_length=32,
        choices=BookingStatus.choices,
        default=BookingStatus.PENDING_PAYMENT,
    )
    razorpay_order_id = models.CharField(max_length=255, blank=True)
    razorpay_payment_id = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.client_name} {self.slot_date} {self.slot_time}"


class RatingChoices(models.IntegerChoices):
    ONE = 1, "1"
    TWO = 2, "2"
    THREE = 3, "3"
    FOUR = 4, "4"
    FIVE = 5, "5"


class Review(models.Model):
    display_name = models.CharField(max_length=255, default="Anonymous")
    body = models.TextField()
    rating = models.IntegerField(choices=RatingChoices.choices)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.display_name} ({self.rating}/5)"


class PaymentProvider(models.TextChoices):
    RAZORPAY = "razorpay", "Razorpay"
    STRIPE = "stripe", "Stripe"


class PaymentStatus(models.TextChoices):
    CREATED = "created", "Created"
    AUTHORIZED = "authorized", "Authorized"
    CAPTURED = "captured", "Captured"
    FAILED = "failed", "Failed"
    REFUNDED = "refunded", "Refunded"


class PaymentRecord(models.Model):
    booking = models.ForeignKey(
        Booking,
        on_delete=models.CASCADE,
        related_name="payment_records",
    )
    provider = models.CharField(max_length=20, choices=PaymentProvider.choices)
    provider_order_id = models.CharField(max_length=255, blank=True)
    provider_payment_id = models.CharField(max_length=255, blank=True)
    currency = models.CharField(max_length=10, default="INR")
    amount_minor = models.IntegerField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=PaymentStatus.choices)
    raw_payload = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.provider} {self.status} ({self.booking_id})"


class NotificationLog(models.Model):
    booking = models.ForeignKey(
        Booking,
        on_delete=models.CASCADE,
        related_name="notification_logs",
    )
    channel = models.CharField(max_length=50, default="email")
    recipient = models.CharField(max_length=255)
    subject = models.CharField(max_length=255)
    status = models.CharField(max_length=50)
    error_message = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.channel} {self.status} ({self.recipient})"
