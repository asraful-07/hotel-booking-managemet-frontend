"use client";

import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type FaqItem = {
  question: string;
  answer: string;
};

const faqs: FaqItem[] = [
  {
    question: "What are your check-in and check-out times?",
    answer:
      "Check-in is from 3:00 PM and check-out is until 11:00 AM. Early check-in and late check-out are subject to availability and may incur additional charges.",
  },
  {
    question: "Do you offer airport transportation?",
    answer:
      "Yes, we offer airport shuttle services at an additional cost. Please contact our front desk at least 24 hours in advance to arrange your transportation.",
  },
  {
    question: "Is breakfast included in the room rate?",
    answer:
      "Breakfast is included in select room packages. You can choose to add breakfast to your booking for an additional fee of $25 per person per day.",
  },
  {
    question: "Do you have parking facilities?",
    answer:
      "Yes, we offer secure on-site parking for our guests. Self-parking is available at $15 per night, and valet parking is available at $25 per night.",
  },
  {
    question: "Can I bring my pet?",
    answer:
      "We are a pet-friendly hotel! We welcome well-behaved pets with a non-refundable fee of $50 per stay. Please inform us in advance about your pet.",
  },
  {
    question: "Do you have accessible rooms?",
    answer:
      "Yes, we offer fully accessible rooms with wheelchair-accessible features, including roll-in showers, grab bars, and lowered countertops. Please request when booking.",
  },
  {
    question: "What amenities are available at the hotel?",
    answer:
      "We offer a range of amenities including a fitness center, outdoor pool, spa services, restaurant, bar, business center, and complimentary high-speed Wi-Fi throughout the property.",
  },
  {
    question: "How can I make changes to my reservation?",
    answer:
      "You can modify your reservation by contacting our reservations team directly. Changes are subject to availability and may incur rate differences.",
  },
];

export default function FAQ() {
  return (
    <section className="w-full bg-[#caa05c1a] py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Section - Heading */}
          <div className="sticky top-24">
            <span
              className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium tracking-wide"
              style={{
                backgroundColor: "#caa05c1a",
                color: "#ab8965",
              }}
            >
              FAQ
            </span>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-5xl leading-tight">
              Everything You Need
              <br />
              to Know About
              <br />
              Staying With Us
            </h2>
            <p className="mt-6 text-gray-600 max-w-md leading-relaxed">
              Find answers to the most commonly asked questions about our hotel,
              amenities, policies, and services. Can&apos;t find what
              you&apos;re looking for? Our team is here to help.
            </p>
          </div>

          {/* Right Section - Accordion */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-gray-200 last:border-0"
                >
                  <AccordionTrigger className="group py-4 text-left text-base font-medium text-gray-900 hover:no-underline sm:text-lg [&>svg]:hidden">
                    <span className="flex w-full items-center gap-4">
                      <span
                        className="text-sm font-medium tabular-nums min-w-[30px]"
                        style={{ color: "#caa05c" }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1">{faq.question}</span>
                      <span
                        className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors duration-200"
                        style={{ backgroundColor: "#caa05c1a" }}
                      >
                        <span
                          className="absolute h-[2px] w-3.5 rounded-full transition-transform duration-200 group-data-[state=open]:rotate-180"
                          style={{ backgroundColor: "#caa05c" }}
                        />
                        <span
                          className="absolute h-[2px] w-3.5 rotate-90 rounded-full transition-transform duration-200 group-data-[state=open]:rotate-0"
                          style={{ backgroundColor: "#caa05c" }}
                        />
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 pl-14 pr-4 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
