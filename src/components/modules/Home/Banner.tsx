/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import { FaArrowRight, FaPlay, FaPause } from "react-icons/fa";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";

export default function Banner() {
  const [isPlaying, setIsPlaying] = useState(true);
  const swiperRef = React.useRef<any>(null);

  const slides = [
    {
      id: 1,
      image: "/images/slider-1.png",
      title: "Experience the Ultimate Harmony",
      subtitle: "of Luxury",
      description:
        "Make your vacation unforgettable with the perfect blend of luxury and comfort designed for total relaxation.",
      buttonText: "Explore Rooms",
      buttonLink: "/room",
    },
    {
      id: 2,
      image: "/images/slider-2.png",
      title: "Indulge in Unparalleled Elegance",
      subtitle: "& Sophistication",
      description:
        "Discover a world of refined luxury where every detail is crafted to perfection for your ultimate comfort.",
      buttonText: "View Suites",
      buttonLink: "/rooms/suite",
    },
    {
      id: 3,
      image: "/images/slider-3.png",
      title: "Create Unforgettable Memories",
      subtitle: "With Your Loved Ones",
      description:
        "From romantic getaways to family vacations, create lasting memories in our world-class accommodations.",
      buttonText: "Book Now",
      buttonLink: "/room",
    },
  ];

  const handlePlayPause = () => {
    if (isPlaying) {
      swiperRef.current?.autoplay?.stop();
    } else {
      swiperRef.current?.autoplay?.start();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden pb-20">
      {/* Swiper Slider with Ken Burns Effect */}
      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        modules={[Autoplay, EffectFade]}
        effect="fade"
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        speed={1500}
        loop={true}
        className="w-full h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full">
              {/* Ken Burns Effect Image */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-black/40 z-10"></div>
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority
                  className="object-cover ken-burns-effect"
                  style={{
                    animation: "kenBurns 20s ease-in-out infinite",
                  }}
                  unoptimized={slide.image.startsWith("http")}
                />
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="text-center text-white px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
                  {/* Animated Title */}
                  <div className="animate-fadeInUp">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
                      <span className="block">{slide.title}</span>
                      <span className="block text-[#caa05c] drop-shadow-lg">
                        {slide.subtitle}
                      </span>
                    </h1>
                  </div>

                  {/* Description */}
                  <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto animate-fadeInUp animation-delay-200">
                    {slide.description}
                  </p>

                  {/* CTA Button */}
                  <div className="animate-fadeInUp animation-delay-400">
                    <Link
                      href={slide.buttonLink}
                      className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#caa05c] to-[#b8894a] text-white font-semibold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
                    >
                      {slide.buttonText}
                      <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Play/Pause Button */}
      <button
        onClick={handlePlayPause}
        className="absolute bottom-8 right-8 z-30 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-[#caa05c] transition-all duration-300 flex items-center justify-center cursor-pointer"
        aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
      >
        {isPlaying ? (
          <FaPause className="w-4 h-4" />
        ) : (
          <FaPlay className="w-4 h-4 ml-0.5" />
        )}
      </button>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-2 bg-white rounded-full mt-2 animate-scroll"></div>
        </div>
      </div>

      {/* Ken Burns Effect Animation */}
      <style jsx>{`
        @keyframes kenBurns {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.1);
          }
        }

        .ken-burns-effect {
          animation: kenBurns 20s ease-in-out infinite;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        @keyframes scroll {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(8px);
            opacity: 0;
          }
        }

        .animate-scroll {
          animation: scroll 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
