"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const PaymentSuccessPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to WhatsApp after 3 seconds
    const timer = setTimeout(() => {
      const whatsappNumber =
        process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2348024727665";
      window.location.href = `https://wa.me/${whatsappNumber}?text=Hi! I've completed my registration.`;
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-16 md:py-20 lg:py-28">
      <div className="container">
        <div className="border-body-color/[.15] border-b pb-16 md:pb-20 lg:pb-28 dark:border-white/[.15]">
          <div className="-mx-4 flex flex-wrap items-center">
            <div className="w-full px-4">
              <div className="mx-auto max-w-[700px] text-center">
                <h1 className="mb-5 text-3xl leading-tight font-bold text-black sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight dark:text-white">
                  Payment Successful!
                </h1>
                <p className="text-body-color mb-12 text-base !leading-relaxed font-medium sm:text-lg md:text-xl dark:text-white dark:opacity-90">
                  Thank you for your payment. You will be redirected to our
                  WhatsApp group shortly...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentSuccessPage;
