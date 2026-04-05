/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
  FaTripadvisor,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaPaypal,
  FaApplePay,
  FaGooglePay,
} from "react-icons/fa";
import { IoMdHeart } from "react-icons/io";
import { BiChevronRight } from "react-icons/bi";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: "/rooms", label: "All Rooms" },
    { href: "/rooms/suite", label: "Suites" },
    { href: "/rooms/deluxe", label: "Deluxe Rooms" },
    { href: "/rooms/standard", label: "Standard Rooms" },
    { href: "/special-offers", label: "Special Offers" },
  ];

  const aboutLinks = [
    { href: "/about", label: "About Us" },
    { href: "/blog", label: "Blog" },
    { href: "/gallery", label: "Gallery" },
    { href: "/testimonials", label: "Testimonials" },
    { href: "/faq", label: "FAQ" },
  ];

  const services = [
    { href: "/services", label: "All Services" },
    { href: "/spa", label: "Spa & Wellness" },
    { href: "/restaurant", label: "Restaurant & Bar" },
    { href: "/conference", label: "Conference Hall" },
    { href: "/wedding", label: "Wedding Venue" },
  ];

  const supportLinks = [
    { href: "/contact", label: "Contact Us" },
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms-conditions", label: "Terms & Conditions" },
    { href: "/cancellation-policy", label: "Cancellation Policy" },
    { href: "/help", label: "Help Center" },
  ];

  const socialIcons = [
    { icon: FaFacebookF, href: "https://facebook.com", label: "Facebook" },
    { icon: FaTwitter, href: "https://twitter.com", label: "Twitter" },
    { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
    { icon: FaYoutube, href: "https://youtube.com", label: "YouTube" },
    { icon: FaLinkedinIn, href: "https://linkedin.com", label: "LinkedIn" },
    {
      icon: FaTripadvisor,
      href: "https://tripadvisor.com",
      label: "TripAdvisor",
    },
  ];

  const paymentIcons = [
    { icon: FaCcVisa, label: "Visa" },
    { icon: FaCcMastercard, label: "Mastercard" },
    { icon: FaCcAmex, label: "American Express" },
    { icon: FaPaypal, label: "PayPal" },
    { icon: FaApplePay, label: "Apple Pay" },
    { icon: FaGooglePay, label: "Google Pay" },
  ];

  return (
    <footer className="bg-[#574640] text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/images/footer.logo.png"
                alt="Logo"
                width={140}
                height={140}
                className="object-contain group-hover:scale-105 transition"
              />
            </Link>
            <p className="text-sm text-[#e8d9cc] mb-6 leading-relaxed">
              Experience luxury and comfort at GrandStay Hotel. We provide
              world-class accommodation with exceptional service to make your
              stay unforgettable.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-5 relative">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-[#caa05c]"></span>
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#e8d9cc] hover:text-[#caa05c] transition-colors flex items-center gap-2 group"
                  >
                    <BiChevronRight className="text-[#caa05c] group-hover:translate-x-1 transition-transform text-xs" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-5 relative">
              About
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-[#caa05c]"></span>
            </h3>
            <ul className="space-y-2.5">
              {aboutLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#e8d9cc] hover:text-[#caa05c] transition-colors flex items-center gap-2 group"
                  >
                    <BiChevronRight className="text-[#caa05c] group-hover:translate-x-1 transition-transform text-xs" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-5 relative">
              Services
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-[#caa05c]"></span>
            </h3>
            <ul className="space-y-2.5">
              {services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#e8d9cc] hover:text-[#caa05c] transition-colors flex items-center gap-2 group"
                  >
                    <BiChevronRight className="text-[#caa05c] group-hover:translate-x-1 transition-transform text-xs" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-5 relative">
              Support
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-[#caa05c]"></span>
            </h3>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#e8d9cc] hover:text-[#caa05c] transition-colors flex items-center gap-2 group"
                  >
                    <BiChevronRight className="text-[#caa05c] group-hover:translate-x-1 transition-transform text-xs" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Information Row - Centered with proper spacing */}
        <div className="mt-12 pt-8 border-t border-[#6e5544]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Location */}
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-10 h-10 rounded-full bg-[#6e5544] flex items-center justify-center flex-shrink-0">
                <FaMapMarkerAlt className="text-[#caa05c] text-lg" />
              </div>
              <div>
                <p className="text-xs text-[#e8d9cc] font-medium">Location</p>
                <p className="text-sm text-white">123 Luxury Avenue</p>
                <p className="text-sm text-white">Downtown, City</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-10 h-10 rounded-full bg-[#6e5544] flex items-center justify-center flex-shrink-0">
                <FaPhoneAlt className="text-[#caa05c] text-lg" />
              </div>
              <div>
                <p className="text-xs text-[#e8d9cc] font-medium">Phone</p>
                <a
                  href="tel:+1234567890"
                  className="text-sm text-white hover:text-[#caa05c] transition-colors"
                >
                  +1 (234) 567-890
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-10 h-10 rounded-full bg-[#6e5544] flex items-center justify-center flex-shrink-0">
                <FaEnvelope className="text-[#caa05c] text-lg" />
              </div>
              <div>
                <p className="text-xs text-[#e8d9cc] font-medium">Email</p>
                <a
                  href="mailto:info@grandstay.com"
                  className="text-sm text-white hover:text-[#caa05c] transition-colors"
                >
                  rivora@gmail.com
                </a>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-10 h-10 rounded-full bg-[#6e5544] flex items-center justify-center flex-shrink-0">
                <FaClock className="text-[#caa05c] text-lg" />
              </div>
              <div>
                <p className="text-xs text-[#e8d9cc] font-medium">Hours</p>
                <p className="text-sm text-white">24/7 Service</p>
                <p className="text-xs text-[#e8d9cc]">
                  Check-in: 2PM | Check-out: 12PM
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t border-[#6e5544]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-sm text-[#e8d9cc]">
                Get exclusive offers, travel tips, and updates delivered to your
                inbox.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 bg-[#6e5544] border border-[#8b6b58] rounded-lg text-white placeholder:text-[#e8d9cc]/60 focus:outline-none focus:border-[#caa05c] transition-colors"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-[#caa05c] to-[#b8894a] text-white font-semibold rounded-lg hover:shadow-lg transition-all hover:scale-105">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Social & Payment Section */}
        <div className="mt-8 pt-8 border-t border-[#6e5544]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Social Links */}
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <span className="text-sm text-[#e8d9cc]">Follow Us:</span>
              {socialIcons.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 bg-[#6e5544] rounded-full flex items-center justify-center text-[#e8d9cc] hover:bg-[#caa05c] hover:text-white transition-all duration-300"
                    aria-label={social.label}
                  >
                    <Icon className="text-sm" />
                  </a>
                );
              })}
            </div>

            {/* Payment Methods */}
            <div className="flex flex-wrap items-center gap-4 justify-center md:justify-end">
              <span className="text-sm text-[#e8d9cc]">We Accept:</span>
              <div className="flex items-center gap-3">
                {paymentIcons.map((payment) => {
                  const Icon = payment.icon;
                  return (
                    <div
                      key={payment.label}
                      className="text-2xl text-[#e8d9cc] hover:text-[#caa05c] transition-colors"
                      title={payment.label}
                    >
                      <Icon />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Partners Section */}
        <div className="mt-8 pt-8 border-t border-[#6e5544]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#e8d9cc]">We Payment With:</span>
              <div className="bg-[#6e5544] rounded-lg p-2">
                <img
                  src="https://i.ibb.co/QFNjq6Qs/footer.png"
                  alt="Delivery Partners"
                  className="h-10 w-auto object-contain"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#e8d9cc]">Certified:</span>
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#6e5544] text-[#e8d9cc]">
                  ISO 9001
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#6e5544] text-[#e8d9cc]">
                  Green Key
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-[#3d2e26] mt-8 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center">
            <p className="text-sm text-[#e8d9cc]">
              © {currentYear} GrandStay Hotel. All rights reserved.
            </p>
            <p className="text-sm text-[#e8d9cc] flex items-center gap-1">
              Made with <IoMdHeart className="text-red-500 animate-pulse" /> by
              GrandStay Team
            </p>
            <div className="flex gap-4">
              <Link
                href="/sitemap"
                className="text-xs text-[#e8d9cc] hover:text-[#caa05c] transition-colors"
              >
                Sitemap
              </Link>
              <Link
                href="/accessibility"
                className="text-xs text-[#e8d9cc] hover:text-[#caa05c] transition-colors"
              >
                Accessibility
              </Link>
              <Link
                href="/cookies"
                className="text-xs text-[#e8d9cc] hover:text-[#caa05c] transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
