// Part-1: Imports + Contact Data
import React from "react";
import { MapPin, Phone, Mail, Clock, Send, Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import FAQ from "@/components/modules/Home/FAQ";

const contactData = [
  {
    id: 1,
    icon: MapPin,
    title: "Our Location",
    description: "123 Main Street, Dhaka, Bangladesh",
  },
  {
    id: 2,
    icon: Phone,
    title: "Phone Number",
    description: "+880 1234-567890",
  },
  {
    id: 3,
    icon: Mail,
    title: "Email Address",
    description: "info@example.com",
  },
  {
    id: 4,
    icon: Clock,
    title: "Working Hours",
    description: "Mon - Sat: 9:00 AM - 6:00 PM",
  },
];

export default function Contact() {
  return (
    <>
      {/* Hero Section with Image */}
      <section className="relative w-full h-[350px] md:h-[420px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="https://plus.unsplash.com/premium_photo-1661929519129-7a76946c1d38?w=1200&auto=format&fit=crop&q=80"
            alt="About Us - Hotel Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Content */}
        <div
          className="
      relative 
      z-10 
      h-[280px] 
      md:h-[320px]
      flex 
      flex-col 
      items-center 
      justify-center 
      text-center 
      text-white 
      px-4
    "
        >
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-5">
            <Link
              href="/"
              className="
          hover:text-[#caa05c]
          transition
          flex
          items-center
          gap-1
        "
            >
              <Home size={16} />
              Home
            </Link>

            <span className="text-white/50">/</span>

            <span className="text-[#caa05c]">Contact Us</span>
          </div>

          {/* Heading */}
          <h1
            className="
        text-4xl 
        md:text-5xl 
        lg:text-6xl 
        font-bold 
        mb-4
      "
          >
            Contact Us
          </h1>

          {/* Description */}
          <p
            className="
        text-base
        md:text-lg
        text-white/90
        max-w-2xl
        leading-relaxed
      "
          >
            Have questions or need assistance? Our team is always ready to help
            you with bookings, services, and any inquiries.
          </p>
        </div>
      </section>
      {/* Contact Section */}
      <section className="py-20 bg-[#caa05c1a]">
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid lg:grid-cols-2 gap-14 items-start">
            {/* ================= LEFT SECTION ================= */}
            <div className="space-y-8">
              {/* Heading */}
              <div>
                <p className="text-[#ab8965] font-semibold uppercase tracking-widest mb-3">
                  Get In Touch
                </p>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  We&apos;re Here To
                  <br />
                  Help You
                </h2>
                <p className="text-gray-600 mt-5 max-w-md leading-relaxed">
                  Have questions or need assistance? Our team is always ready to
                  help you. Feel free to contact us anytime.
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-5">
                {contactData.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 group"
                    >
                      <div
                        className="
                          w-14 h-14
                          rounded-full
                          bg-[#caa05c1a]
                          flex items-center justify-center
                          group-hover:bg-[#caa05c]
                          transition duration-300
                        "
                      >
                        <Icon
                          size={25}
                          className="
                            text-[#ab8965]
                            group-hover:text-white
                            transition
                          "
                        />
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {item.title}
                        </h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ================= RIGHT SECTION ================= */}
            <div
              className="
                bg-white
                rounded-2xl
                shadow-xl
                p-8
                md:p-10
              "
            >
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Send Us A Message
              </h3>

              <form className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="
                      w-full
                      px-5
                      py-3
                      rounded-lg
                      border
                      border-gray-200
                      outline-none
                      focus:border-[#caa05c]
                      transition
                    "
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="
                      w-full
                      px-5
                      py-3
                      rounded-lg
                      border
                      border-gray-200
                      outline-none
                      focus:border-[#caa05c]
                      transition
                    "
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter phone number"
                    className="
                      w-full
                      px-5
                      py-3
                      rounded-lg
                      border
                      border-gray-200
                      outline-none
                      focus:border-[#caa05c]
                      transition
                    "
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Write your message..."
                    className="
                      w-full
                      px-5
                      py-3
                      rounded-lg
                      border
                      border-gray-200
                      outline-none
                      focus:border-[#caa05c]
                      transition
                      resize-none
                    "
                  />
                </div>

                {/* Button */}
                <button
                  type="submit"
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    w-full
                    bg-[#caa05c]
                    hover:bg-[#ab8965]
                    text-white
                    font-semibold
                    py-3.5
                    rounded-lg
                    transition
                  "
                >
                  Send Message
                  <Send size={18} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <FAQ />
    </>
  );
}
