from __future__ import annotations

from django.urls import path

from .views import (
    available_dates,
    available_slots,
    create_booking,
    list_reviews,
    submit_review,
    verify_booking_payment,
)

urlpatterns = [
    path("slots/available/", available_slots, name="available-slots"),
    path("slots/available-dates/", available_dates, name="available-dates"),
    path("bookings/create/", create_booking, name="create-booking"),
    path("bookings/verify-payment/", verify_booking_payment, name="verify-booking-payment"),
    path("reviews/submit/", submit_review, name="submit-review"),
    path("reviews/", list_reviews, name="list-reviews"),
]
