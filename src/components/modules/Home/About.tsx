"use client";

import Image from "next/image";

export default function About() {
  return (
    <section className="max-w-7xl mx-auto py-16 px-4 md:px-6 lg:6">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        {/* LEFT CONTENT */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-700 mb-4">
            HOTEL RIVORA 1992
          </h2>

          <p className="text-lg text-gray-500 mb-6">
            High quality accommodation services
          </p>

          <p className="text-gray-500 mb-4 leading-relaxed">
            For over three decades, GrandStay Hotel has been the epitome of
            luxury hospitality in the heart of the city. Founded in 1992 with a
            vision to create a sanctuary of elegance and comfort, we have
            welcomed countless guests from around the world, offering them an
            unparalleled experience of refined living.
          </p>
          <p className="text-gray-500 mb-4 leading-relaxed">
            Our commitment to excellence extends beyond luxurious
            accommodations. We believe in creating memorable moments through
            personalized service, attention to detail, and genuine hospitality.
            Every stay with us is crafted to be unique, ensuring that our guests
            leave with cherished memories and a desire to return.
          </p>
        </div>

        {/* RIGHT IMAGES */}
        <div className="relative group w-full h-[400px]">
          {/* BACK IMAGE */}
          <div className="absolute top-10 right-0 w-[85%] h-[85%] rounded-xl overflow-hidden transition-all duration-500 group-hover:top-0 group-hover:right-5">
            <Image
              src="/images/about2.jpg"
              alt="about"
              fill
              className="object-cover"
            />
          </div>

          {/* FRONT IMAGE */}
          <div className="absolute top-0 left-0 w-[85%] h-[85%] rounded-xl overflow-hidden shadow-xl transition-all duration-500 group-hover:top-10 group-hover:left-5">
            <Image
              src="/images/about1.jpg"
              alt="about"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
