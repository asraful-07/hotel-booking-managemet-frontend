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
    question: "How long does shipping usually take?",
    answer:
      "Most orders arrive within 3–5 business days. You'll get a tracking link by email as soon as your order ships, so you can follow it the whole way.",
  },
  {
    question: "What's your return policy?",
    answer:
      "You can return any unused item within 30 days of delivery for a full refund. Start a return from your order page and we'll email you a prepaid label.",
  },
  {
    question: "Do you offer international shipping?",
    answer:
      "Yes, we ship to over 40 countries. Rates and delivery times are calculated at checkout based on your address, so there are no surprises.",
  },
  {
    question: "Can I change or cancel my order after placing it?",
    answer:
      "Orders can be changed or cancelled within 1 hour of purchase. After that, we've likely already started preparing it, so reach out and we'll do our best to help.",
  },
  {
    question: "How do I get in touch with support?",
    answer:
      "Our team is available every day from 9am to 6pm through live chat or email. Most messages get a reply within a couple of hours.",
  },
  {
    question: "Do you offer gift cards?",
    answer:
      "Our gift cards are available in $25, $50, and $100 denominations. They can be purchased online and sent via email or printed at home.",
  },
];

export default function FAQ() {
  return (
    <section className="w-full bg-background pb-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-12 text-center sm:mb-16">
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-wide"
            style={{
              backgroundColor: "var(--secondBackground)",
              color: "var(--secondary)",
            }}
          >
            FAQ
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-balance text-muted-foreground">
            Everything you need to know before you get started. Can&apos;t find
            what you&apos;re looking for? Reach out to our team.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-border"
            >
              <AccordionTrigger className="group py-5 text-left text-base font-medium text-foreground hover:no-underline sm:text-lg [&>svg]:hidden">
                <span className="flex w-full items-center gap-4">
                  <span
                    className="text-sm font-medium tabular-nums"
                    style={{ color: "var(--primary)" }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1">{faq.question}</span>
                  <span
                    className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors duration-200"
                    style={{ backgroundColor: "var(--secondBackground)" }}
                  >
                    <span
                      className="absolute h-[1.5px] w-3 rounded-full transition-transform duration-200 group-data-[state=open]:rotate-180"
                      style={{ backgroundColor: "var(--primary)" }}
                    />
                    <span
                      className="absolute h-[1.5px] w-3 rotate-90 rounded-full transition-transform duration-200 group-data-[state=open]:rotate-0"
                      style={{ backgroundColor: "var(--primary)" }}
                    />
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-5 pl-9 pr-10 text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div
          className="mt-12 flex flex-col items-center gap-3 rounded-2xl border border-border px-6 py-8 text-center sm:flex-row sm:justify-between sm:text-left"
          style={{ backgroundColor: "var(--secondBackground)" }}
        >
          <div>
            <p className="font-medium text-foreground">Still have questions?</p>
            <p className="text-sm text-muted-foreground">
              Our support team is happy to help you out.
            </p>
          </div>
          <a
            href="#contact"
            className="inline-flex shrink-0 items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--primary)" }}
          >
            Contact support
          </a>
        </div>
      </div>
    </section>
  );
}
