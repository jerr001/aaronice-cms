import WaitlistForm from "@/components/Waitlist";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Waitlist Signup",
  description: "Join our waitlist for upcoming courses",
};

// Use dynamic rendering since the form uses useSearchParams
export const dynamic = "force-dynamic";

const WaitlistPage = () => {
  return (
    <>
      <section className="pt-32 pb-16 md:pt-36 md:pb-20 lg:pt-40 lg:pb-28">
        <div className="container mx-auto">
          <div className="border-body-color/[.15] border-b pb-16 md:pb-20 lg:pb-28 dark:border-white/[.15]">
            <div className="flex flex-wrap items-center justify-center">
              <div className="w-full max-w-[800px] px-4">
                <div className="mx-auto max-w-[700px] text-center">
                  <h1 className="mb-5 text-3xl leading-tight font-bold text-black sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight dark:text-white">
                    Join Our Waitlist
                  </h1>
                  <p className="text-body-color mb-12 text-base !leading-relaxed font-medium sm:text-lg md:text-xl dark:text-white dark:opacity-90">
                    Sign up to be notified when new courses become available
                  </p>
                </div>
                <WaitlistForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default WaitlistPage;
