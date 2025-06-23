import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { fullName, email, subject, phone, message } = body;

    if (!fullName || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Create reusable transporter object using SMTP transport (configure below)
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST, // for gmail SMTP
      port: process.env.MAIL_PORT, // default is 587 for TLS
      secure: process.env.MAIL_SECURE, // true for 465, false for other ports
     // requireTLS: true, 
      auth: {
        user: process.env.MAIL_USERNAME, // your gmail or SMTP email
        pass: process.env.MAIL_PASSWORD, // your gmail app password or SMTP password
      },
    });
    console.log(process.env.MAIL_FROM_NAME, process.env.MAIL_HOST, process.env.MAIL_PORT, process.env.MAIL_USERNAME, process.env.MAIL_PASSWORD, process.env.MAIL_SECURE);

    // Email message content
    const mailOptions = {
      from: `"Aaronice Website Contact:" <${process.env.MAIL_FROM_NAME}>`,
      to: `${process.env.MAIL_FROM_ADDRESS}`, // your receiving email
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

    // Send mail
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Message sent successfully." });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send message." },
      { status: 500 }
    );
  }
}
