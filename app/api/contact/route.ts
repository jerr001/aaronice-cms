import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { fullName, email, subject, phone, message } = body;

    if (!fullName || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 },
      );
    }

    console.log("=== Email Configuration ===");
    console.log("Host:", process.env.MAIL_HOST);
    console.log("Port:", process.env.MAIL_PORT);
    console.log("Secure:", process.env.MAIL_SECURE);
    console.log("Username:", process.env.MAIL_USERNAME);
    console.log("Password exists:", !!process.env.MAIL_PASSWORD);

    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT || "465"),
      secure: process.env.MAIL_SECURE === "true",
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
    });

    const mailOptions = {
      from: `"Aaronice Website" <${process.env.MAIL_FROM_ADDRESS}>`,
      to: `${process.env.MAIL_TO_ADDRESS}`,
      subject: `New Contact Form: ${subject}`,
      text: `
You have received a new message from the website contact form.

Full Name: ${fullName}
Email: ${email}
Phone: ${phone || "Not provided"}

Message:
${message}
      `,
      html: `
        <h3>New message from website contact form</h3>
        <p><strong>Full Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    };

    console.log("Attempting to send email...");
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");

    return NextResponse.json({ message: "Message sent successfully." });
  } catch (error) {
    console.error("=== Email Error ===");
    console.error("Error details:", error);
    console.error(
      "Error message:",
      error instanceof Error ? error.message : "Unknown error",
    );
    return NextResponse.json(
      {
        error: "Failed to send message.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
