"use client";

import React, { useRef, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

// Fake JSON data for customer feedback with image URLs
const customerFeedback = [
  {
    id: 1,
    title: "Save more on every order",
    description:
      "The best food app cheaper than the rest. I put my order on here and also did the same for Uber as Uber takes a larger cut.",
    customerName: "Jamie Crawford",
    rating: 5,
    imageUrl:
      "https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bWFuJTIwcGljfGVufDB8fDB8fHww",
  },
  {
    id: 2,
    title: "Easy to use with good selection",
    description:
      "Very easy to use the app and very good selection of places. I use this app a lot and never had a problem.",
    customerName: "Julie Podmore",
    rating: 5,
    imageUrl:
      "https://images.unsplash.com/photo-1645834890548-6d5476948c77?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDExfHx8ZW58MHx8fHx8",
  },
  {
    id: 3,
    title: "Perfect for lazy nights",
    description:
      "The app is smooth. I can find food near me quickly, reorder my usual, and get it delivered easily.",
    customerName: "Alexander McKenzie",
    rating: 5,
    imageUrl:
      "https://images.unsplash.com/photo-1692643364123-3406d812e384?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEwfHx8ZW58MHx8fHx8",
  },
  {
    id: 4,
    title: "Smooth ordering experience",
    description:
      "I have used this platform several times now and I'm highly satisfied. Ordering is always smooth.",
    customerName: "Rosemary Anne",
    rating: 5,
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1664476788423-7899ac87bd7f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDM2fHx8ZW58MHx8fHx8",
  },
  {
    id: 5,
    title: "Best delivery app",
    description:
      "Lower service fees, great restaurant selection, and food always arrives hot.",
    customerName: "Michael Thompson",
    rating: 5,
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1691784781482-9af9bce05096?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGdpcmwlMjBwaWN8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: 6,
    title: "Amazing variety",
    description:
      "From Italian to Thai, Indian to Mexican – there's something for everyone.",
    customerName: "Sarah Williams",
    rating: 5,
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1669704098824-3bb06bb771f4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fHw%3D",
  },
  {
    id: 7,
    title: "Quick delivery",
    description:
      "I order twice a week and delivery is always prompt. Highly recommended!",
    customerName: "David Martinez",
    rating: 5,
    imageUrl:
      "https://images.unsplash.com/photo-1663417140976-2c8696d0e27d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D",
  },
  {
    id: 8,
    title: "Great deals",
    description:
      "The promotional offers are fantastic. I've saved a lot of money.",
    customerName: "Emma Johnson",
    rating: 5,
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1770663720013-50dd31159fbf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D",
  },
  {
    id: 9,
    title: "Excellent customer service",
    description:
      "When there was an issue with my order, support resolved it immediately.",
    customerName: "Robert Chen",
    rating: 5,
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1723377603985-ec9c62ce6a72?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE1fHx8ZW58MHx8fHx8",
  },
  {
    id: 10,
    title: "Always fresh food",
    description:
      "The quality is consistently high and food arrives fresh every time.",
    customerName: "Lisa Garcia",
    rating: 5,
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1663054943700-9dc1a1521479?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDIwfHx8ZW58MHx8fHx8",
  },
];

export default function FeedBack() {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const CARD_WIDTH = 280;
  const GAP = 24;
  const SCROLL_AMOUNT = CARD_WIDTH + GAP;
  const AUTO_SCROLL_INTERVAL = 1200; // Reduced from 2000ms to 1200ms for faster scrolling
  const VISIBLE_CARDS = 3; // Number of cards visible at once

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const newIndex =
      direction === "left"
        ? Math.max(0, currentIndex - 1)
        : Math.min(customerFeedback.length - VISIBLE_CARDS, currentIndex + 1);

    setCurrentIndex(newIndex);

    container.scrollTo({
      left: newIndex * SCROLL_AMOUNT,
      behavior: "smooth",
    });

    resetAutoScroll();
  };

  const autoScroll = () => {
    const container = scrollContainerRef.current;
    if (!container || isHovering || !isAutoScrolling) return;

    const maxIndex = customerFeedback.length - VISIBLE_CARDS;
    const nextIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;

    setCurrentIndex(nextIndex);

    container.scrollTo({
      left: nextIndex * SCROLL_AMOUNT,
      behavior: "smooth",
    });
  };

  const startAutoScroll = () => {
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
    }

    autoScrollIntervalRef.current = setInterval(
      autoScroll,
      AUTO_SCROLL_INTERVAL,
    );
  };

  const stopAutoScroll = () => {
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
      autoScrollIntervalRef.current = null;
    }
  };

  const resetAutoScroll = () => {
    stopAutoScroll();
    if (isAutoScrolling) {
      startAutoScroll();
    }
  };

  const toggleAutoScroll = () => {
    if (isAutoScrolling) {
      stopAutoScroll();
    } else {
      startAutoScroll();
    }
    setIsAutoScrolling(!isAutoScrolling);
  };

  // Initialize and cleanup auto-scroll
  useEffect(() => {
    if (isAutoScrolling) {
      startAutoScroll();
    }

    return () => {
      stopAutoScroll();
    };
  }, [isAutoScrolling]);

  // Handle hover state
  useEffect(() => {
    if (isHovering) {
      stopAutoScroll();
    } else if (isAutoScrolling) {
      startAutoScroll();
    }
  }, [isHovering, isAutoScrolling]);

  // Update currentIndex on scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const index = Math.round(container.scrollLeft / SCROLL_AMOUNT);
      setCurrentIndex(Math.min(index, customerFeedback.length - VISIBLE_CARDS));
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 pt-14">
      <div
        className="rounded-3xl p-8 relative"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Why Customers Choose Rivora
          </h2>

          <div className="flex items-center gap-4">
            {/* Navigation buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => scroll("left")}
                disabled={currentIndex === 0}
                className="p-2 rounded-full bg-white shadow hover:bg-gray-100 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={() => scroll("right")}
                disabled={
                  currentIndex >= customerFeedback.length - VISIBLE_CARDS
                }
                className="p-2 rounded-full bg-white shadow hover:bg-gray-100 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Left gradient fade */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />

          {/* Carousel */}
          <div
            ref={scrollContainerRef}
            className="grid grid-flow-col auto-cols-max gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {customerFeedback.map((feedback) => (
              <Card
                key={feedback.id}
                className="w-[280px] rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex-shrink-0"
              >
                <CardContent className="p-6 flex flex-col h-full">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {feedback.title}
                  </h3>

                  <p className="text-sm text-gray-600 italic mb-6 flex-grow">
                    &quot;{feedback.description}&quot;
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-3">
                      {/* Customer Avatar */}
                      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                        <Image
                          src={feedback.imageUrl}
                          alt={feedback.customerName}
                          fill
                          className="object-cover"
                          sizes="40px"
                          unoptimized
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {feedback.customerName}
                        </p>
                        <p className="text-xs text-gray-500">
                          Regular Customer
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-1">
                      {[...Array(feedback.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400">
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Right gradient fade */}
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        </div>

        {/* Scroll indicator dots */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({
            length: customerFeedback.length - VISIBLE_CARDS + 1,
          }).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                const container = scrollContainerRef.current;
                if (container) {
                  setCurrentIndex(index);
                  container.scrollTo({
                    left: index * SCROLL_AMOUNT,
                    behavior: "smooth",
                  });
                  resetAutoScroll();
                }
              }}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentIndex === index
                  ? "bg-gray-800"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
