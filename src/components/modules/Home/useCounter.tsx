"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// Counter Hook
function useCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;

    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      setCount(Math.floor(current));
    }, 16);

    return () => clearInterval(timer);
  }, [started, target, duration]);

  return { count, setStarted };
}

// Stat Card
function StatCard({
  label,
  target,
  desc,
}: {
  label: string;
  target: number;
  desc: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { count, setStarted } = useCounter(target);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [setStarted]);

  return (
    <div
      ref={ref}
      className="bg-white rounded-2xl p-6 shadow-sm flex flex-col justify-center h-full"
    >
      <p className="text-xs text-gray-400 uppercase mb-3 border-b pb-2">
        {label}
      </p>

      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-4xl font-bold text-gray-900">
          {count.toLocaleString()}
        </span>
        <span className="text-[#caa05c] text-3xl font-bold">+</span>
      </div>

      <p className="text-sm text-gray-400">{desc}</p>
    </div>
  );
}

export default function HotelFacilities() {
  return (
    <section className="py-10 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}{" "}
        <div className="text-center mb-12">
          {" "}
          <p className="text-[#caa05c] text-lg font-bold mb-2">
            {" "}
            Welcome to GrandStay{" "}
          </p>{" "}
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {" "}
            Hotel Facilities{" "}
          </h2>{" "}
          <p className="text-gray-500 text-md max-w-lg mx-auto">
            {" "}
            From premium rooms to full-service amenities, our team ensures a
            comfortable and memorable stay from check-in to check-out.{" "}
          </p>{" "}
        </div>
        {/* 🔥 MAIN */}
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
          {/* LEFT IMAGE */}
          <div className="w-full lg:w-1/2 relative rounded-2xl overflow-hidden min-h-[500px]">
            <Image
              src="/images/economic.png"
              alt="Hotel"
              fill
              className="object-cover"
            />
          </div>

          {/* RIGHT GRID */}
          <div className="w-full lg:w-1/2 grid grid-cols-2 grid-rows-2 gap-4">
            <StatCard label="Total Room" target={180} desc="luxury rooms" />

            <StatCard
              label="Yearly Visitors"
              target={8700}
              desc="Happy guests"
            />

            <StatCard
              label="Signature Menu"
              target={89}
              desc="curated dishes"
            />

            {/* IMAGE CARD */}
            <div className="relative rounded-2xl overflow-hidden h-full">
              <Image
                src="/images/economic-1.png"
                alt="Guest"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
