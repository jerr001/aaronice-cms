import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request: Request) {
  console.log("=== Waitlist API called ===");

  try {
    const body = await request.json();
    console.log("Request body:", body);

    const {
      name,
      email,
      phone,
      course,
      paymentOption,
      totalAmount,
      paymentAmount,
    } = body;

    if (!name || !email || !phone || !course) {
      console.error("Missing required fields:", { name, email, phone, course });
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }

    console.log("Connecting to MongoDB...");

    // Add timeout wrapper for MongoDB connection
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Database connection timeout")), 15000);
    });

    const dbPromise = (async () => {
      const client = await clientPromise;

      // Test connection with ping
      try {
        await client.db().command({ ping: 1 });
        console.log("Connected to MongoDB successfully");
      } catch (pingError) {
        console.error("MongoDB ping failed:", pingError);
        throw new Error("Database connection failed");
      }

      const database = client.db("aaronice_db");
      const collection = database.collection("users");

      console.log("Checking for existing user:", email);
      const existingUser = await collection.findOne({ email });

      if (existingUser) {
        console.log("User already exists:", email);
        return { exists: true };
      }

      console.log("Inserting new user...");
      const result = await collection.insertOne({
        name,
        email,
        phone,
        course,
        paymentOption: paymentOption || "full",
        totalAmount: totalAmount || 0,
        paidAmount: 0,
        balanceAmount: totalAmount || 0,
        createdAt: new Date(),
        isPaid: false,
        isFullyPaid: false,
      });

      console.log("User inserted successfully:", result.insertedId);
      return { exists: false, id: result.insertedId };
    })();

    const dbResult = (await Promise.race([dbPromise, timeoutPromise])) as {
      exists: boolean;
      id?: any;
    };

    if (dbResult.exists) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "Successfully joined waitlist", id: dbResult.id },
      { status: 201 },
    );
  } catch (error) {
    console.error("=== Waitlist API Error ===");
    console.error("Error type:", error?.constructor?.name);
    console.error(
      "Error message:",
      error instanceof Error ? error.message : "Unknown error",
    );
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace",
    );

    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
        type: error?.constructor?.name || "UnknownError",
      },
      { status: 500 },
    );
  }
}
