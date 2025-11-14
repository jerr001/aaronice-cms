import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;
const client = new MongoClient(uri);
const FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { transactionId } = body;

    const response = await fetch(
      `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
      {
        headers: {
          Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
        },
      },
    );

    const verificationData = await response.json();

    await client.connect();
    const database = client.db("aaronice_db");
    const transactionsCollection = database.collection("transactions");
    const waitlistCollection = database.collection("users"); // This is where waitlist entries are stored

    if (
      verificationData.status === "success" &&
      verificationData.data.status === "successful"
    ) {
      await transactionsCollection.updateOne(
        { txRef: verificationData.data.tx_ref },
        {
          $set: {
            status: "completed",
            verificationData,
            updatedAt: new Date(),
          },
        },
      );

      await waitlistCollection.updateOne(
        { email: verificationData.data.customer.email },
        {
          $set: {
            isPaid: true,
            paymentDate: new Date(),
          },
        },
      );

      return NextResponse.json(
        {
          status: "successful",
          message: "Payment verified successfully",
        },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        {
          status: "failed",
          message: "Payment verification failed",
        },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  } finally {
    await client.close();
  }
}
