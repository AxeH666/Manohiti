from __future__ import annotations

from django.contrib import admin
from django.db.models import QuerySet
from django.http import HttpRequest

from .models import (
    AvailabilitySlot,
    Booking,
    BookingStatus,
    NotificationLog,
    PaymentRecord,
    Review,
    SlotTemplate,
    TherapistProfile,
)


@admin.action(description="Approve selected reviews")
def approve_selected_reviews(
    modeladmin: admin.ModelAdmin, request: HttpRequest, queryset: QuerySet[Review]
) -> None:
    del modeladmin, request
    queryset.update(is_approved=True)


@admin.action(description="Confirm selected bookings")
def confirm_selected_bookings(
    modeladmin: admin.ModelAdmin, request: HttpRequest, queryset: QuerySet[Booking]
) -> None:
    del modeladmin, request
    queryset.update(status=BookingStatus.CONFIRMED)


@admin.register(TherapistProfile)
class TherapistProfileAdmin(admin.ModelAdmin):
    list_display = ("display_name", "email", "is_active")
    list_filter = ("is_active",)


@admin.register(SlotTemplate)
class SlotTemplateAdmin(admin.ModelAdmin):
    list_display = ("day_of_week", "start_time", "duration_minutes", "is_active")
    list_filter = ("day_of_week", "is_active")


@admin.register(AvailabilitySlot)
class AvailabilitySlotAdmin(admin.ModelAdmin):
    list_display = (
        "therapist",
        "day_of_week",
        "start_time",
        "duration_minutes",
        "is_booked",
    )
    list_filter = ("therapist", "day_of_week", "is_booked")


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        "client_name",
        "client_email",
        "age",
        "slot_date",
        "slot_time",
        "duration_minutes",
        "consent_given",
        "status",
        "created_at",
    )
    list_filter = ("status", "slot_date", "created_at")
    actions = [confirm_selected_bookings]


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("display_name", "rating", "is_approved", "created_at")
    list_filter = ("rating", "is_approved", "created_at")
    actions = [approve_selected_reviews]


@admin.register(PaymentRecord)
class PaymentRecordAdmin(admin.ModelAdmin):
    list_display = ("booking", "provider", "status", "currency", "created_at")
    list_filter = ("provider", "status", "currency", "created_at")


@admin.register(NotificationLog)
class NotificationLogAdmin(admin.ModelAdmin):
    list_display = ("booking", "channel", "recipient", "status", "created_at")
    list_filter = ("channel", "status", "created_at")
