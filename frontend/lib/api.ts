import axios from "axios";

function normalizeApiBase(rawUrl: string | undefined): string {
  const fallback = "http://localhost:8000";
  const trimmed = (rawUrl ?? fallback).trim().replace(/\/$/, "");
  if (!trimmed) {
    return fallback;
  }
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

const API_BASE = normalizeApiBase(process.env.NEXT_PUBLIC_API_URL);

const client = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

export type AvailableDate = {
  date: string;
};

export type AvailableSlot = {
  slot_time: string;
  duration_minutes: number;
};

export type BookingCreatePayload = {
  slot_date: string;
  slot_time: string;
  client_name: string;
  client_email: string;
  client_phone?: string;
  age: number;
  notes?: string;
  consent_given: boolean;
};

export type BookingCreateResponse = {
  booking_id: number;
  razorpay_order_id: string;
  razorpay_key_id: string;
  amount: number;
  currency: string;
  is_pro_bono: boolean;
};

export type BookingVerifyPayload = {
  booking_id: number;
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

export type BookingVerifyResponse = {
  success: boolean;
  booking_id: number;
};

export type Review = {
  display_name: string;
  body: string;
  rating: number;
  created_at: string;
};

export type ReviewSubmitPayload = {
  display_name?: string;
  body: string;
  rating: number;
};

export type ReviewSubmitResponse = {
  success: boolean;
  message: string;
};

export async function fetchReviews(): Promise<Review[]> {
  const { data } = await client.get<Review[]>("/api/reviews/");
  return data;
}

export async function submitReview(
  payload: ReviewSubmitPayload,
): Promise<ReviewSubmitResponse> {
  const { data } = await client.post<ReviewSubmitResponse>(
    "/api/reviews/submit/",
    payload,
  );
  return data;
}

export async function fetchAvailableDates(month: string): Promise<AvailableDate[]> {
  const { data } = await client.get<AvailableDate[]>("/api/slots/available-dates/", {
    params: { month },
  });
  return data;
}

export async function fetchAvailableSlots(date: string): Promise<AvailableSlot[]> {
  const { data } = await client.get<AvailableSlot[]>("/api/slots/available/", {
    params: { date },
  });
  return data;
}

export async function createBooking(
  payload: BookingCreatePayload,
): Promise<BookingCreateResponse> {
  const { data } = await client.post<BookingCreateResponse>(
    "/api/bookings/create/",
    payload,
  );
  return data;
}

export async function verifyBookingPayment(
  payload: BookingVerifyPayload,
): Promise<BookingVerifyResponse> {
  const { data } = await client.post<BookingVerifyResponse>(
    "/api/bookings/verify-payment/",
    payload,
  );
  return data;
}

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as Record<string, unknown> | undefined;
    const detail = data?.detail;
    if (typeof detail === "string") {
      return detail;
    }
    if (Array.isArray(detail)) {
      return detail.join(", ");
    }
    if (data && typeof data === "object") {
      const fieldMessages = Object.values(data)
        .flatMap((value) => (Array.isArray(value) ? value : [value]))
        .filter((value): value is string => typeof value === "string");
      if (fieldMessages.length > 0) {
        return fieldMessages.join(", ");
      }
    }
  }
  return "Something went wrong. Please try again.";
}
