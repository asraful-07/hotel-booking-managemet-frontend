import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Home,
  Users,
  Award,
  Clock,
  MapPin,
  Phone,
  Mail,
  ChefHat,
  Sparkles,
  Star,
} from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

// Team members data
const teamMembers = [
  {
    id: 1,
    name: "John Anderson",
    position: "General Manager",
    image:
      "https://plus.unsplash.com/premium_photo-1664476788423-7899ac87bd7f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDM2fHx8ZW58MHx8fHx8",
    social: {
      facebook: "#",
      twitter: "#",
      instagram: "#",
      linkedin: "#",
    },
  },
  {
    id: 2,
    name: "Sarah Mitchell",
    position: "Head of Hospitality",
    image:
      "https://plus.unsplash.com/premium_photo-1691784781482-9af9bce05096?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGdpcmwlMjBwaWN8ZW58MHx8MHx8fDA%3D",
    social: {
      facebook: "#",
      twitter: "#",
      instagram: "#",
      linkedin: "#",
    },
  },
  {
    id: 3,
    name: "Michael Chen",
    position: "Executive Chef",
    image:
      "https://plus.unsplash.com/premium_photo-1669704098824-3bb06bb771f4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fHw%3D",
    social: {
      facebook: "#",
      twitter: "#",
      instagram: "#",
      linkedin: "#",
    },
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    position: "Guest Relations Manager",
    image:
      "https://images.unsplash.com/photo-1663417140976-2c8696d0e27d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D",
    social: {
      facebook: "#",
      twitter: "#",
      instagram: "#",
      linkedin: "#",
    },
  },
];

// Stats data
const stats = [
  { id: 1, number: "500+", label: "Happy Guests", icon: Users },
  { id: 2, number: "50+", label: "Awards Won", icon: Award },
  { id: 3, number: "10+", label: "Years Experience", icon: Clock },
  { id: 4, number: "100%", label: "Guest Satisfaction", icon: Star },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full h-[350px] md:h-[420px] overflow-hidden">
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

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-4">
          <div className="flex items-center gap-2 text-sm mb-5">
            <Link
              href="/"
              className="hover:text-[#caa05c] transition flex items-center gap-1"
            >
              <Home size={16} />
              Home
            </Link>
            <span className="text-white/50">/</span>
            <span className="text-[#caa05c]">About Us</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            About Us
          </h1>
          <p className="text-base md:text-lg text-white/90 max-w-2xl leading-relaxed">
            Discover our story, our values, and the passion that drives us to
            create unforgettable experiences.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Images */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden">
                <Image
                  src="https://reactheme.com/products/wordpress/rivora/wp-content/uploads/2026/01/l1.webp"
                  alt="Hotel exterior"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="grid grid-rows-2 gap-4">
                <div className="relative h-[142px] md:h-[188px] rounded-2xl overflow-hidden">
                  <Image
                    src="https://reactheme.com/products/wordpress/rivora/wp-content/uploads/2026/01/s3.webp"
                    alt="Hotel room"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="relative h-[142px] md:h-[188px] rounded-2xl overflow-hidden bg-[#caa05c] flex items-center justify-center p-6">
                  <div className="text-center text-white">
                    <Sparkles className="w-10 h-10 mx-auto mb-2" />
                    <h3 className="text-xl font-bold">10+ Years</h3>
                    <p className="text-sm opacity-90">Of Excellence</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Content */}
            <div>
              <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-wide bg-[#caa05c1a] text-[#ab8965]">
                About Our Hotel
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-4">
                Where Relaxation Meets Elegance
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Experience refined hospitality designed to make every stay
                memorable and effortless. Our hotel offers thoughtfully curated
                rooms, attentive service, and a welcoming atmosphere where
                comfort and convenience come together seamlessly.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                From restful nights to peaceful mornings, every detail is
                carefully arranged to ensure guests enjoy a relaxing, enjoyable,
                and truly satisfying stay throughout their visit.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.id}
                      className="bg-[#caa05c1a] rounded-xl p-4 text-center"
                    >
                      <Icon className="w-6 h-6 text-[#caa05c] mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">
                        {stat.number}
                      </div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-20 bg-[#caa05c1a]">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center mb-12">
            <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-wide bg-[#caa05c] text-white">
              Our Team
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-4">
              Meet Our Professionals
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Dedicated hospitality professionals working together to deliver
              seamless service and exceptional guest experiences throughout your
              stay.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-5 text-center">
                  <h3 className="text-lg font-bold text-gray-900">
                    {member.name}
                  </h3>
                  <p className="text-sm text-[#ab8965] font-medium mb-3">
                    {member.position}
                  </p>

                  {/* Social Icons */}
                  <div className="flex items-center justify-center gap-3">
                    <a
                      href={member.social.facebook}
                      className="w-8 h-8 rounded-full bg-[#caa05c1a] flex items-center justify-center hover:bg-[#caa05c] transition-colors group/social"
                    >
                      <FaFacebook className="w-4 h-4 text-[#ab8965] group-hover/social:text-white transition-colors" />
                    </a>
                    <a
                      href={member.social.twitter}
                      className="w-8 h-8 rounded-full bg-[#caa05c1a] flex items-center justify-center hover:bg-[#caa05c] transition-colors group/social"
                    >
                      <FaTwitter className="w-4 h-4 text-[#ab8965] group-hover/social:text-white transition-colors" />
                    </a>
                    <a
                      href={member.social.instagram}
                      className="w-8 h-8 rounded-full bg-[#caa05c1a] flex items-center justify-center hover:bg-[#caa05c] transition-colors group/social"
                    >
                      <FaInstagram className="w-4 h-4 text-[#ab8965] group-hover/social:text-white transition-colors" />
                    </a>
                    <a
                      href={member.social.linkedin}
                      className="w-8 h-8 rounded-full bg-[#caa05c1a] flex items-center justify-center hover:bg-[#caa05c] transition-colors group/social"
                    >
                      <FaLinkedin className="w-4 h-4 text-[#ab8965] group-hover/social:text-white transition-colors" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-wide bg-[#caa05c1a] text-[#ab8965]">
                Why Choose Us
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-4">
                A Stay Beyond Expectations
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                We believe that every guest deserves an exceptional experience.
                From the moment you arrive, our dedicated team is committed to
                ensuring your stay is comfortable, memorable, and truly special.
              </p>
              <ul className="space-y-3">
                {[
                  {
                    icon: Award,
                    text: "Award-winning service and hospitality",
                  },
                  {
                    icon: Sparkles,
                    text: "Luxurious rooms with modern amenities",
                  },
                  { icon: ChefHat, text: "Exquisite dining experiences" },
                  { icon: Clock, text: "24/7 guest support and concierge" },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <li
                      key={index}
                      className="flex items-center gap-3 text-gray-700"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#caa05c1a] flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-[#caa05c]" />
                      </div>
                      <span>{item.text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=60"
                alt="Luxury hotel interior"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-4 h-4 fill-[#caa05c] text-[#caa05c]"
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    4.9/5 (2,000+ Reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
