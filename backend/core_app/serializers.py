from __future__ import annotations

from rest_framework import serializers


class AvailableSlotSerializer(serializers.Serializer):
    slot_time = serializers.TimeField()
    duration_minutes = serializers.IntegerField()


class AvailableDateSerializer(serializers.Serializer):
    date = serializers.DateField()


class BookingCreateRequestSerializer(serializers.Serializer):
    slot_date = serializers.DateField()
    slot_time = serializers.TimeField()
    client_name = serializers.CharField(max_length=255)
    client_email = serializers.EmailField()
    client_phone = serializers.CharField(max_length=50, required=False, allow_blank=True)
    age = serializers.IntegerField(min_value=18)
    notes = serializers.CharField(required=False, allow_blank=True)
    consent_given = serializers.BooleanField()

    def validate_consent_given(self, value: bool) -> bool:
        if not value:
            raise serializers.ValidationError(
                "You must agree to the session terms before booking."
            )
        return value


class BookingCreateResponseSerializer(serializers.Serializer):
    booking_id = serializers.IntegerField()
    slot_date = serializers.DateField()
    slot_time = serializers.TimeField()
    razorpay_order_id = serializers.CharField(allow_blank=True)
    razorpay_key_id = serializers.CharField(allow_blank=True)
    amount = serializers.IntegerField()
    currency = serializers.CharField()
    is_pro_bono = serializers.BooleanField()


class BookingVerifyPaymentRequestSerializer(serializers.Serializer):
    booking_id = serializers.IntegerField()
    razorpay_payment_id = serializers.CharField(max_length=255)
    razorpay_order_id = serializers.CharField(max_length=255)
    razorpay_signature = serializers.CharField(max_length=255)


class BookingVerifyPaymentResponseSerializer(serializers.Serializer):
    success = serializers.BooleanField()
    booking_id = serializers.IntegerField()


class ReviewSubmitRequestSerializer(serializers.Serializer):
    display_name = serializers.CharField(required=False, allow_blank=True, max_length=255)
    body = serializers.CharField()
    rating = serializers.IntegerField(min_value=1, max_value=5)


class ReviewSubmitResponseSerializer(serializers.Serializer):
    success = serializers.BooleanField()
    message = serializers.CharField()


class ReviewListItemSerializer(serializers.Serializer):
    display_name = serializers.CharField()
    body = serializers.CharField()
    rating = serializers.IntegerField()
    created_at = serializers.DateTimeField()
