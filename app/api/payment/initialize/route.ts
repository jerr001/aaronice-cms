import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY;

// Validate environment variables on module load
if (!FLUTTERWAVE_SECRET_KEY) {
  console.error("FLUTTERWAVE_SECRET_KEY is not set in environment variables");
}

// Helper function to retry Flutterwave API calls
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 3,
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok || response.status < 500) {
        return response;
      }
      // Retry only on 5xx errors
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
      }
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error("Max retries reached");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, amount, name, phone, paymentOption, totalAmount } = body;

    console.log("Payment initialization request:", {
      email,
      amount,
      name,
      phone,
      paymentOption,
      totalAmount,
    });

    // Validate required fields
    if (!email || !amount || !name || !phone) {
      console.error("Missing required fields:", { email, amount, name, phone });
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate Flutterwave key
    if (!FLUTTERWAVE_SECRET_KEY) {
      console.error("Flutterwave secret key not configured");
      return NextResponse.json(
        { message: "Payment system not configured" },
        { status: 500 },
      );
    }

    // Get redirect URLs with fallback
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://aaronice.org";
    const redirectUrl = `${baseUrl}/payment-success`;
    const cancelUrl = `${baseUrl}/payment-cancelled`;

    console.log("Redirect URL:", redirectUrl);
    console.log("Cancel URL:", cancelUrl);

    const txRef = `TX-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;

    console.log("Initializing Flutterwave payment...", {
      email,
      amount,
      txRef,
    });

    // Get logo URL with fallback
    const logoUrl = process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}/images/logo/logo-light.svg`
      : "https://aaronice.org/images/logo/logo-light.svg";

    // Use retry logic for Flutterwave API call with 30 second timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetchWithRetry(
        "https://api.flutterwave.com/v3/payments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
          },
          body: JSON.stringify({
            tx_ref: txRef,
            amount: amount,
            currency: "NGN",
            redirect_url: redirectUrl,
            meta: {
              cancel_url: cancelUrl,
            },
            customer: {
              email,
              name,
              phonenumber: phone,
            },
            customizations: {
              title: "Aaronice Course Registration",
              description:
                paymentOption === "part"
                  ? `Part Payment (65%) - Course Registration`
                  : "Course registration payment",
              logo: logoUrl,
            },
          }),
          signal: controller.signal,
        },
      );
      clearTimeout(timeout);

      const flutterwaveResponse = await response.json();
      console.log("Flutterwave response status:", flutterwaveResponse.status);

      if (flutterwaveResponse.status === "success") {
        try {
          console.log("Saving transaction to database...");
          const client = await clientPromise;
          const database = client.db("aaronice_db");
          const collection = database.collection("transactions");

          await collection.insertOne({
            txRef,
            email,
            amount,
            totalAmount: totalAmount || amount,
            paymentOption: paymentOption || "full",
            name,
            phone,
            status: "pending",
            createdAt: new Date(),
            paymentLink: flutterwaveResponse.data.link,
          });

          console.log("Transaction saved successfully");
          return NextResponse.json(
            {
              paymentLink: flutterwaveResponse.data.link,
              txRef,
            },
            { status: 200 },
          );
        } catch (dbError) {
          console.error("Database error:", dbError);
          // Return payment link even if DB save fails
          return NextResponse.json(
            {
              paymentLink: flutterwaveResponse.data.link,
              txRef,
              warning: "Payment link generated but database save failed",
            },
            { status: 200 },
          );
        }
      } else {
        console.error("Flutterwave error:", flutterwaveResponse);
        throw new Error(
          flutterwaveResponse.message || "Payment initialization failed",
        );
      }
    } catch (error) {
      clearTimeout(timeout);
      console.error("Payment initialization error:", error);

      // Check if it's a timeout error
      if (error instanceof Error && error.name === "AbortError") {
        return NextResponse.json(
          {
            message: "Payment request timed out. Please try again.",
            error: "Request timeout",
          },
          { status: 504 },
        );
      }

      return NextResponse.json(
        {
          message: "Payment initialization failed",
          error: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Payment initialization error:", error);
    return NextResponse.json(
      {
        message: "Payment initialization failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
