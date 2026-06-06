from __future__ import annotations

from datetime import date, time, timedelta
from unittest.mock import MagicMock, patch

from django.test import TestCase, override_settings

from core_app.models import Booking, BookingStatus, NotificationLog
from core_app.notifications import send_booking_confirmation, send_session_reminder
from core_app.scheduler import process_session_reminders
from core_app.services.calendar import booking_starts_at, build_google_calendar_url, build_ics_invite
from core_app.services.whatsapp import is_whatsapp_enabled, normalize_phone_e164


class CalendarInviteTests(TestCase):
    def test_build_ics_contains_booking_times(self) -> None:
        booking = Booking(
            id=42,
            slot_date=date(2026, 6, 10),
            slot_time=time(14, 30),
            duration_minutes=60,
            client_name="Alex Client",
            client_email="alex@example.com",
            age=30,
            consent_given=True,
        )
        ics = build_ics_invite(booking, "heti3215@gmail.com")
        self.assertIn("BEGIN:VCALENDAR", ics)
        self.assertIn("BEGIN:VEVENT", ics)
        self.assertIn("METHOD:PUBLISH", ics)
        self.assertIn("Alex Client", ics)
        self.assertIn("BEGIN:VTIMEZONE", ics)
        self.assertIn("TZID:Asia/Kolkata", ics)
        self.assertIn("20260610T143000", ics)
        self.assertIn("20260610T153000", ics)
        self.assertRegex(ics, r"DTSTAMP:\d{8}T\d{6}Z")

    def test_google_calendar_url_contains_event_times(self) -> None:
        booking = Booking(
            id=42,
            slot_date=date(2026, 6, 10),
            slot_time=time(14, 30),
            duration_minutes=60,
            client_name="Alex Client",
            client_email="alex@example.com",
            age=30,
            consent_given=True,
        )
        url = build_google_calendar_url(booking)
        self.assertIn("calendar.google.com", url)
        self.assertIn("20260610T143000", url)
        self.assertIn("20260610T153000", url)
        self.assertIn("Asia%2FKolkata", url)


class WhatsAppHelperTests(TestCase):
    @override_settings()
    def test_whatsapp_disabled_by_default(self) -> None:
        with patch.dict("os.environ", {"WHATSAPP_ENABLED": "False"}, clear=False):
            self.assertFalse(is_whatsapp_enabled())

    def test_normalize_indian_mobile(self) -> None:
        self.assertEqual(normalize_phone_e164("9876543210"), "+919876543210")
        self.assertEqual(normalize_phone_e164("+919876543210"), "+919876543210")


class NotificationTests(TestCase):
    def setUp(self) -> None:
        self.booking = Booking.objects.create(
            slot_date=date(2026, 6, 15),
            slot_time=time(10, 0),
            duration_minutes=60,
            client_name="Jordan",
            client_email="jordan@example.com",
            client_phone="9876543210",
            age=28,
            consent_given=True,
            status=BookingStatus.CONFIRMED,
        )

    @patch("core_app.notifications.EmailMessage.send")
    def test_confirmation_sends_client_and_therapist_email(
        self, mock_send: MagicMock
    ) -> None:
        with patch.dict(
            "os.environ",
            {"THERAPIST_EMAIL": "heti3215@gmail.com", "WHATSAPP_ENABLED": "False"},
            clear=False,
        ):
            send_booking_confirmation(self.booking)

        mock_send.assert_called()
        logs = NotificationLog.objects.filter(
            subject="booking_confirmation_client", status="sent"
        )
        self.assertEqual(logs.count(), 1)
        therapist_logs = NotificationLog.objects.filter(
            subject="booking_confirmation_therapist", status="sent"
        )
        self.assertEqual(therapist_logs.count(), 1)

    @patch("core_app.notifications.EmailMessage.send")
    def test_reminder_is_idempotent(self, mock_send: MagicMock) -> None:
        with patch.dict("os.environ", {"WHATSAPP_ENABLED": "False"}, clear=False):
            send_session_reminder(self.booking, "24h")
            send_session_reminder(self.booking, "24h")

        client_logs = NotificationLog.objects.filter(
            subject="reminder_24h_client", channel="email", status="sent"
        )
        self.assertEqual(client_logs.count(), 1)
        self.assertEqual(mock_send.call_count, 2)

    @patch("core_app.notifications.send_whatsapp_text")
    @patch("core_app.notifications.EmailMessage.send")
    def test_whatsapp_skipped_when_disabled(
        self, mock_send: MagicMock, mock_wa: MagicMock
    ) -> None:
        with patch.dict("os.environ", {"WHATSAPP_ENABLED": "False"}, clear=False):
            send_booking_confirmation(self.booking)
        mock_wa.assert_not_called()

    @patch("core_app.notifications.send_whatsapp_text", return_value=(True, ""))
    @patch("core_app.notifications.EmailMessage.send")
    def test_whatsapp_sent_when_enabled(
        self, mock_send: MagicMock, mock_wa: MagicMock
    ) -> None:
        with patch.dict(
            "os.environ",
            {
                "WHATSAPP_ENABLED": "True",
                "WHATSAPP_ACCESS_TOKEN": "token",
                "WHATSAPP_PHONE_NUMBER_ID": "123",
                "THERAPIST_WHATSAPP_NUMBER": "+919999999999",
                "THERAPIST_EMAIL": "heti3215@gmail.com",
            },
            clear=False,
        ):
            send_booking_confirmation(self.booking)
        self.assertTrue(mock_wa.called)


class SchedulerReminderTests(TestCase):
    @patch("core_app.scheduler.send_session_reminder")
    def test_process_reminders_24h_window(self, mock_reminder: MagicMock) -> None:
        from django.utils import timezone as dj_tz

        ist = booking_starts_at(
            Booking(
                slot_date=date(2026, 6, 20),
                slot_time=time(15, 0),
                duration_minutes=60,
                client_name="Test",
                client_email="t@example.com",
                age=25,
                consent_given=True,
            )
        )
        fake_now = ist - timedelta(hours=24)
        booking = Booking.objects.create(
            slot_date=date(2026, 6, 20),
            slot_time=time(15, 0),
            duration_minutes=60,
            client_name="Test",
            client_email="t@example.com",
            age=25,
            consent_given=True,
            status=BookingStatus.CONFIRMED,
        )

        with patch("core_app.scheduler.timezone.now") as mock_now:
            mock_now.return_value = fake_now.astimezone(dj_tz.get_current_timezone())
            process_session_reminders()

        mock_reminder.assert_called_once_with(booking, "24h")


class SeedDefaultsTests(TestCase):
    def test_ensure_heti_therapist_and_slots(self) -> None:
        from core_app.models import AvailabilitySlot, TherapistProfile
        from core_app.seed_defaults import ensure_default_weekly_slots, ensure_heti_therapist

        therapist, created = ensure_heti_therapist()
        self.assertTrue(created)
        self.assertEqual(therapist.display_name, "Heti Mehra")
        self.assertTrue(therapist.is_active)

        therapist_again, created_again = ensure_heti_therapist()
        self.assertFalse(created_again)
        self.assertEqual(therapist.id, therapist_again.id)

        created_count, existing_count = ensure_default_weekly_slots(therapist)
        self.assertEqual(created_count, 10)
        self.assertEqual(existing_count, 0)
        self.assertEqual(
            AvailabilitySlot.objects.filter(therapist=therapist).count(), 10
        )

        created_count_2, existing_count_2 = ensure_default_weekly_slots(therapist)
        self.assertEqual(created_count_2, 0)
        self.assertEqual(existing_count_2, 10)
        self.assertEqual(TherapistProfile.objects.filter(is_active=True).count(), 1)
