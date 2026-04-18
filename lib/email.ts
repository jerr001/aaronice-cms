/**
 * Email Service
 * Sends emails using SMTP configuration
 */

import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) {
    return transporter;
  }

  transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT || "465"),
    secure: process.env.MAIL_SECURE === "true", // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  return transporter;
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  try {
    const transporter = getTransporter();

    const mailOptions = {
      from: `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_FROM_ADDRESS}>`,
      to,
      subject,
      text: text || html.replace(/<[^>]*>/g, ""), // Strip HTML tags for plain text
      html,
    };

    console.log("Sending email to:", to);
    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", result.messageId);

    return result;
  } catch (error) {
    console.error("Email send error:", error);
    throw error;
  }
}

/**
 * Test email sending functionality
 * Use this to verify SMTP credentials are working
 */
export async function testEmailConnection() {
  try {
    const transporter = getTransporter();
    await transporter.verify();
    console.log("✅ Email service is ready to send");
    return { success: true, message: "Email service verified" };
  } catch (error) {
    console.error("❌ Email service error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Email service failed",
    };
  }
}
