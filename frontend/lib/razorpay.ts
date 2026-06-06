type RazorpayHandlerResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: { color: string };
  handler: (response: RazorpayHandlerResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
};

type RazorpayInstance = {
  open: () => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

const SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

let scriptPromise: Promise<void> | null = null;

export function loadRazorpayScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Razorpay can only load in the browser"));
  }
  if (window.Razorpay) {
    return Promise.resolve();
  }
  if (scriptPromise) {
    return scriptPromise;
  }
  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay"));
    document.body.appendChild(script);
  });
  return scriptPromise;
}

export type OpenRazorpayCheckoutParams = {
  key: string;
  amount: number;
  currency: string;
  orderId: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  onSuccess: (response: RazorpayHandlerResponse) => void;
  onDismiss?: () => void;
};

export async function openRazorpayCheckout(
  params: OpenRazorpayCheckoutParams,
): Promise<void> {
  await loadRazorpayScript();
  if (!window.Razorpay) {
    throw new Error("Razorpay unavailable");
  }

  const instance = new window.Razorpay({
    key: params.key,
    amount: params.amount,
    currency: params.currency,
    name: "Manohiti",
    description: "Individual therapy session",
    order_id: params.orderId,
    prefill: {
      name: params.clientName,
      email: params.clientEmail,
      contact: params.clientPhone,
    },
    theme: { color: "#0D2622" },
    handler: params.onSuccess,
    modal: { ondismiss: params.onDismiss },
  });
  instance.open();
}

export type { RazorpayHandlerResponse };
