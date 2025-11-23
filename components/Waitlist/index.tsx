"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

const WaitlistForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCourse = searchParams.get("course") || "";

  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingPaymentData, setPendingPaymentData] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "+234", // Default to Nigeria
    course: preselectedCourse,
    paymentOption: "full", // "full" or "part"
  });

  // Load form data from sessionStorage if returning from payment
  useEffect(() => {
    const savedFormData = sessionStorage.getItem("waitlistFormData");
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        setFormData(parsedData);
        toast.success("You can now edit your details before proceeding");
      } catch (error) {
        console.error("Error parsing saved form data:", error);
      }
    }
  }, []);

  const coursePricing: { [key: string]: number } = {
    frontend: 150000,
    "data-analysis": 120000,
    "product-design": 100000,
    "ai-automation": 100000,
    "digital-marketing": 80000,
    "project-management": 80000,
    "graphic-design": 80000,
    "content-creation": 60000,
    "virtual-assistant": 60000,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Form submission started", formData);

    try {
      const coursePrice = coursePricing[formData.course] || 5000;
      // Calculate amount based on payment option
      const paymentAmount =
        formData.paymentOption === "part"
          ? Math.round(coursePrice * 0.65) // 65% for part payment
          : coursePrice; // Full payment

      console.log("Course price:", coursePrice);
      console.log("Payment option:", formData.paymentOption);
      console.log("Payment amount:", paymentAmount);

      // Save form data to sessionStorage before proceeding to payment
      sessionStorage.setItem("waitlistFormData", JSON.stringify(formData));

      console.log("Saving to waitlist...");

      // Combine country code with phone number
      const fullPhoneNumber = `${formData.countryCode}${formData.phone}`;

      const waitlistResponse = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          phone: fullPhoneNumber, // Send complete phone number with country code
          totalAmount: coursePrice,
          paymentAmount: paymentAmount,
        }),
      });

      console.log("Waitlist response status:", waitlistResponse.status);
      console.log(
        "Waitlist response headers:",
        Object.fromEntries(waitlistResponse.headers.entries()),
      );

      let waitlistData: any = null;
      let responseText = "";

      try {
        responseText = await waitlistResponse.text();
        console.log("Raw waitlist response:", responseText);
        console.log("Response text length:", responseText.length);

        if (responseText && responseText.trim().length > 0) {
          try {
            waitlistData = JSON.parse(responseText);
            console.log("Parsed waitlist response:", waitlistData);
          } catch (parseError) {
            console.error("JSON parse error:", parseError);
            console.error(
              "Failed to parse text:",
              responseText.substring(0, 200),
            );
            throw new Error(
              `Invalid JSON response from server: ${parseError.message}`,
            );
          }
        } else {
          console.error("Empty response from waitlist API");
          console.error("Response status:", waitlistResponse.status);
          console.error("Response statusText:", waitlistResponse.statusText);
          throw new Error(
            `Server returned empty response (Status: ${waitlistResponse.status})`,
          );
        }
      } catch (error) {
        if (error instanceof Error && error.message.includes("Invalid JSON")) {
          throw error;
        }
        console.error("Failed to read response:", error);
        throw new Error(
          `Server communication error: ${waitlistResponse.status} - ${waitlistResponse.statusText}`,
        );
      }

      if (!waitlistResponse.ok) {
        console.error("=== Waitlist API returned error ===");
        console.error("Status:", waitlistResponse.status);
        console.error("Status Text:", waitlistResponse.statusText);
        console.error("Response Data:", JSON.stringify(waitlistData, null, 2));
        console.error("Error Message:", waitlistData?.message);
        console.error("Error Field:", waitlistData?.error);

        const errorMessage =
          waitlistData?.message ||
          waitlistData?.error ||
          `Server error: ${waitlistResponse.status} - ${waitlistResponse.statusText}`;

        console.error("Throwing error:", errorMessage);
        throw new Error(errorMessage);
      }

      console.log("Waitlist registration successful!");
      console.log("Initializing payment...");

      // Show confirmation modal instead of immediately redirecting
      const paymentInfo = {
        formData,
        paymentAmount,
        coursePrice,
      };
      setPendingPaymentData(paymentInfo);
      setShowConfirmation(true);
      setIsLoading(false);
    } catch (error) {
      console.error("=== Form Submission Error ===");
      console.error("Error type:", error?.constructor?.name);
      console.error("Error object:", error);
      console.error(
        "Error message:",
        error instanceof Error ? error.message : String(error),
      );
      console.error(
        "Error stack:",
        error instanceof Error ? error.stack : "No stack",
      );

      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      console.error("Displaying error to user:", errorMessage);

      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  const handleClearForm = () => {
    sessionStorage.removeItem("waitlistFormData");
    setFormData({
      name: "",
      email: "",
      phone: "",
      countryCode: "+234",
      course: preselectedCourse,
      paymentOption: "full",
    });
    toast.success("Form cleared");
  };

  const proceedToPayment = async () => {
    if (!pendingPaymentData) return;

    setIsLoading(true);
    setShowConfirmation(false);

    try {
      const { formData: data, paymentAmount, coursePrice } = pendingPaymentData;

      const paymentResponse = await fetch("/api/payment/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          amount: paymentAmount,
          totalAmount: coursePrice,
          paymentOption: data.paymentOption,
        }),
      });

      const paymentData = await paymentResponse.json();
      console.log("Payment response:", paymentData);

      if (!paymentResponse.ok) {
        console.error("Payment error:", paymentData);
        throw new Error(paymentData.message || "Payment initialization failed");
      }

      if (paymentData.paymentLink) {
        console.log("Redirecting to payment page:", paymentData.paymentLink);
        toast.success("Redirecting to payment...");
        setTimeout(() => {
          window.location.href = paymentData.paymentLink;
        }, 500);
      } else {
        console.error("No payment link in response:", paymentData);
        throw new Error("No payment link received");
      }
    } catch (error) {
      console.error("Payment initialization error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  const handleEditDetails = () => {
    setShowConfirmation(false);
    setPendingPaymentData(null);
    toast.success("You can now edit your details");
  };

  const verifyPayment = async (transactionId: string) => {
    try {
      const response = await fetch("/api/payment/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transactionId }),
      });

      const data = await response.json();

      if (response.ok && data.status === "successful") {
        toast.success("Payment successful!");
        router.push("/payment-success");
      } else {
        toast.error("Payment verification failed");
      }
    } catch (error) {
      toast.error("Payment verification failed");
    }
  };

  return (
    <div className="mx-auto w-full max-w-[500px] px-4">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="name"
            className="text-dark mb-3 block text-sm font-medium dark:text-white"
          >
            Full Name
          </label>
          <input
            type="text"
            placeholder="Enter your full name"
            className="text-body-color placeholder-body-color shadow-one dark:shadow-signUp w-full rounded-md border border-transparent px-6 py-3 text-base outline-none focus:border-orange-500 focus-visible:shadow-none dark:bg-[#242B51]"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="text-dark mb-3 block text-sm font-medium dark:text-white"
          >
            Email Address
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            className="text-body-color placeholder-body-color shadow-one dark:shadow-signUp w-full rounded-md border border-transparent px-6 py-3 text-base outline-none focus:border-orange-500 focus-visible:shadow-none dark:bg-[#242B51]"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="text-dark mb-3 block text-sm font-medium dark:text-white"
          >
            Phone Number
          </label>
          <div className="flex gap-2">
            <select
              value={formData.countryCode}
              onChange={(e) =>
                setFormData({ ...formData, countryCode: e.target.value })
              }
              className="text-body-color shadow-one dark:shadow-signUp w-32 appearance-none rounded-md border border-transparent bg-white px-3 py-3 text-base outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus-visible:shadow-none dark:bg-[#242B51] dark:text-white"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23f97316' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: "right 0.5rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.5em 1.5em",
                paddingRight: "2rem",
              }}
            >
              <option value="+1">🇺🇸 +1</option>
              <option value="+44">🇬🇧 +44</option>
              <option value="+234">🇳🇬 +234</option>
              <option value="+27">🇿🇦 +27</option>
              <option value="+254">🇰🇪 +254</option>
              <option value="+233">🇬🇭 +233</option>
              <option value="+256">🇺🇬 +256</option>
              <option value="+255">🇹🇿 +255</option>
              <option value="+91">🇮🇳 +91</option>
              <option value="+86">🇨🇳 +86</option>
              <option value="+971">🇦🇪 +971</option>
              <option value="+966">🇸🇦 +966</option>
              <option value="+1">🇨🇦 +1</option>
              <option value="+61">🇦🇺 +61</option>
              <option value="+49">🇩🇪 +49</option>
              <option value="+33">🇫🇷 +33</option>
            </select>
            <input
              type="tel"
              placeholder="8024727665"
              className="text-body-color placeholder-body-color shadow-one dark:shadow-signUp flex-1 rounded-md border border-transparent px-6 py-3 text-base outline-none focus:border-orange-500 focus-visible:shadow-none dark:bg-[#242B51]"
              required
              value={formData.phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  phone: e.target.value.replace(/[^0-9]/g, ""),
                })
              }
              pattern="[0-9]*"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="course"
            className="text-dark mb-3 block text-sm font-medium dark:text-white"
          >
            Selected Course
          </label>
          <select
            className="text-body-color placeholder-body-color shadow-one dark:shadow-signUp w-full appearance-none rounded-md border border-transparent bg-white px-6 py-3 text-base outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus-visible:shadow-none dark:bg-[#242B51] dark:text-white"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23f97316' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: "right 0.5rem center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "1.5em 1.5em",
              paddingRight: "2.5rem",
            }}
            required
            value={formData.course}
            onChange={(e) =>
              setFormData({ ...formData, course: e.target.value })
            }
          >
            <option value="">Select a course</option>
            <option value="frontend">Frontend (Web Design) - ₦150,000</option>
            <option value="data-analysis">Data Analysis - ₦120,000</option>
            <option value="product-design">Product Design - ₦100,000</option>
            <option value="ai-automation">AI Automation - ₦100,000</option>
            <option value="digital-marketing">
              Digital Marketing - ₦80,000
            </option>
            <option value="project-management">
              Project Management - ₦80,000
            </option>
            <option value="graphic-design">Graphic Design - ₦80,000</option>
            <option value="content-creation">Content Creation - ₦60,000</option>
            <option value="virtual-assistant">
              Virtual Assistant - ₦60,000
            </option>
          </select>
        </div>
        <div>
          <label className="text-dark mb-3 block text-sm font-medium dark:text-white">
            Payment Option
          </label>
          <div className="space-y-3">
            <div
              className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                formData.paymentOption === "full"
                  ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                  : "border-gray-300 hover:border-orange-300 dark:border-gray-600"
              }`}
              onClick={() =>
                setFormData({ ...formData, paymentOption: "full" })
              }
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="paymentOption"
                  value="full"
                  checked={formData.paymentOption === "full"}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentOption: e.target.value })
                  }
                  className="mt-1 h-4 w-4 text-orange-500 focus:ring-orange-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-black dark:text-white">
                      Full Payment
                    </h4>
                    <span className="text-sm font-medium text-orange-500">
                      Recommended
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    Pay the complete course fee upfront
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                formData.paymentOption === "part"
                  ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                  : "border-gray-300 hover:border-orange-300 dark:border-gray-600"
              }`}
              onClick={() =>
                setFormData({ ...formData, paymentOption: "part" })
              }
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="paymentOption"
                  value="part"
                  checked={formData.paymentOption === "part"}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentOption: e.target.value })
                  }
                  className="mt-1 h-4 w-4 text-orange-500 focus:ring-orange-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-black dark:text-white">
                      Part Payment (65% Now)
                    </h4>
                  </div>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    Pay 65% now, remaining 35% later
                  </p>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {formData.course && coursePricing[formData.course] ? (
                      <>
                        Initial: ₦
                        {Math.round(
                          coursePricing[formData.course] * 0.65,
                        ).toLocaleString()}{" "}
                        • Balance: ₦
                        {Math.round(
                          coursePricing[formData.course] * 0.35,
                        ).toLocaleString()}
                      </>
                    ) : (
                      <span>&nbsp;</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <button
            type="submit"
            className="w-full cursor-pointer rounded-md border border-orange-500 bg-orange-500 px-6 py-3 text-base font-medium text-white transition duration-300 ease-in-out hover:border-orange-600 hover:bg-orange-600 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Join Waitlist"}
          </button>
        </div>
        <div>
          <button
            type="button"
            onClick={handleClearForm}
            className="w-full cursor-pointer rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 transition duration-300 ease-in-out hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:bg-transparent dark:text-white dark:hover:border-gray-500 dark:hover:bg-gray-800"
          >
            Start Over
          </button>
        </div>
      </form>

      {/* Confirmation Modal */}
      {showConfirmation && pendingPaymentData && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-bold text-black dark:text-white">
              Confirm Your Details
            </h3>
            <div className="mb-6 space-y-3 text-sm">
              <p className="text-gray-600 dark:text-gray-300">
                <strong>Name:</strong> {formData.name}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <strong>Email:</strong> {formData.email}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <strong>Phone:</strong> {formData.countryCode}
                {formData.phone}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <strong>Course:</strong>{" "}
                {formData.course
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <strong>Payment Option:</strong>{" "}
                {formData.paymentOption === "full"
                  ? "Full Payment"
                  : "Part Payment (65%)"}
              </p>
              <p className="text-lg font-bold text-orange-500">
                <strong>Amount to Pay:</strong> ₦
                {pendingPaymentData.paymentAmount.toLocaleString()}
              </p>
            </div>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              Please review your details carefully before proceeding to payment.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleEditDetails}
                className="flex-1 cursor-pointer rounded-md border-2 border-orange-500 bg-transparent px-4 py-3 text-base font-medium text-orange-500 transition duration-300 ease-in-out hover:bg-orange-50 dark:hover:bg-orange-900/20"
                disabled={isLoading}
              >
                Edit Details
              </button>
              <button
                onClick={proceedToPayment}
                className="flex-1 cursor-pointer rounded-md border border-orange-500 bg-orange-500 px-4 py-3 text-base font-medium text-white transition duration-300 ease-in-out hover:border-orange-600 hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Proceed to Payment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaitlistForm;
