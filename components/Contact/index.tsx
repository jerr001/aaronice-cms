"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

const Contact = () => {
  const [hasMounted, setHasMounted] = React.useState(false);

  const [form, setForm] = React.useState({
    fullName: "",
    email: "",
    subject: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = React.useState(false);
  const [responseMsg, setResponseMsg] = React.useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponseMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setResponseMsg("Message sent successfully.");
        setForm({
          fullName: "",
          email: "",
          subject: "",
          phone: "",
          message: "",
        });
      } else {
        setResponseMsg(data.error || "Failed to send message.");
      }
    } catch (error) {
      setResponseMsg("Failed to send message.");
    }
    setLoading(false);
  };

  React.useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) {
    return null;
  }

  return (
    <>
      <section id="support" className="px-4 md:px-8 2xl:px-0">
        <div className="max-w-c-1390 relative mx-auto px-7.5 pt-10 lg:px-15 lg:pt-15 xl:px-20 xl:pt-20">
          <div className="absolute top-0 left-0 -z-1 h-2/3 w-full rounded-lg bg-linear-to-t from-transparent to-[#dee7ff47] dark:bg-linear-to-t dark:to-[#252A42]"></div>
          <div className="absolute bottom-[-255px] left-0 -z-1 h-full w-full">
            <Image
              src="/images/shape/shape-dotted-light.svg"
              alt="Dotted"
              className="dark:hidden"
              fill
            />
            <Image
              src="/images/shape/shape-dotted-dark.svg"
              alt="Dotted"
              className="hidden dark:block"
              fill
            />
          </div>

          <div className="flex flex-col-reverse flex-wrap gap-8 md:flex-row md:flex-nowrap md:justify-between xl:gap-20">
            <motion.div
              variants={{
                hidden: { opacity: 0, y: -20 },
                visible: { opacity: 1, y: 0 },
              }}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 1, delay: 0.1 }}
              viewport={{ once: true }}
              className="animate_top dark:border-strokedark w-full rounded-xl bg-white p-8 shadow-2xl md:w-3/5 lg:w-3/4 xl:p-16 dark:border dark:bg-black"
            >
              <h2 className="xl:text-sectiontitle2 mb-12 text-3xl font-bold text-orange-500 dark:text-white">
                Send a message
              </h2>

              {responseMsg && (
                <div className="mb-4 text-orange-500 dark:text-white">
                  <p>{responseMsg}</p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-7.5 flex flex-col gap-7.5 lg:flex-row lg:justify-between lg:gap-14">
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full name"
                    value={form.fullName}
                    onChange={handleChange}
                    className="border-stroke focus:border-waterloo dark:border-strokedark dark:focus:border-manatee w-full border-b bg-transparent pb-3.5 focus:placeholder:text-black focus-visible:outline-hidden lg:w-1/2 dark:focus:placeholder:text-white"
                  />

                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email address"
                    className="border-stroke focus:border-waterloo dark:border-strokedark dark:focus:border-manatee w-full border-b bg-transparent pb-3.5 focus:placeholder:text-black focus-visible:outline-hidden lg:w-1/2 dark:focus:placeholder:text-white"
                  />
                </div>

                <div className="mb-12.5 flex flex-col gap-7.5 lg:flex-row lg:justify-between lg:gap-14">
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                    className="border-stroke focus:border-waterloo dark:border-strokedark dark:focus:border-manatee w-full border-b bg-transparent pb-3.5 focus:placeholder:text-black focus-visible:outline-hidden lg:w-1/2 dark:focus:placeholder:text-white"
                  />

                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    type="text"
                    placeholder="Phone number"
                    className="border-stroke focus:border-waterloo dark:border-strokedark dark:focus:border-manatee w-full border-b bg-transparent pb-3.5 focus:placeholder:text-black focus-visible:outline-hidden lg:w-1/2 dark:focus:placeholder:text-white"
                  />
                </div>

                <div className="mb-11.5 flex">
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Message"
                    rows={4}
                    className="border-stroke focus:border-waterloo dark:border-strokedark dark:focus:border-manatee w-full border-b bg-transparent focus:placeholder:text-black focus-visible:outline-hidden dark:focus:placeholder:text-white"
                  ></textarea>
                </div>

                <div className="flex justify-end">
                  <button
                    disabled={loading}
                    aria-label="send message"
                    className="hover:bg-range-400 inline-flex items-center gap-2.5 rounded-full bg-orange-400 px-6 py-3 font-medium text-white duration-300 ease-in-out dark:bg-orange-400"
                  >
                    {loading ? "Sending..." : "Send Message"}
                    <svg
                      className="fill-white"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.4767 6.16664L6.00668 1.69664L7.18501 0.518311L13.6667 6.99998L7.18501 13.4816L6.00668 12.3033L10.4767 7.83331H0.333344V6.16664H10.4767Z"
                        fill=""
                      />
                    </svg>
                  </button>
                </div>
              </form>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: -20 },
                visible: { opacity: 1, y: 0 },
              }}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 2, delay: 0.1 }}
              viewport={{ once: true }}
              className="animate_top w-full md:w-2/5 md:p-7.5 lg:w-[26%] xl:pt-15"
            >
              <h2 className="xl:text-sectiontitle2 mb-12.5 text-3xl font-semibold text-orange-400 dark:text-white">
                Find us
              </h2>

              <div className="mb-7">
                <h3 className="text-metatitle3 mb-4 font-medium text-orange-400 dark:text-white">
                  Our Location
                </h3>
                <p>
                  Building 105, Babalola Street, Behind Union Bank, Iseyin, Oyo
                  State.
                </p>
              </div>
              <div className="mb-7">
                <p className="text-body-color mb-1 text-base font-medium">
                  Email Address
                </p>
                <p className="text-dark text-base font-medium dark:text-white">
                  <a href="mailto:support@aaronice.com">support@aaronice.com</a>
                </p>
              </div>
              <div>
                <p className="text-body-color mb-1 text-base font-medium">
                  Phone Number
                </p>
                <p className="text-dark text-base font-medium dark:text-white">
                  <a href="tel:+2348024727665">+234 802 472 7665</a>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
