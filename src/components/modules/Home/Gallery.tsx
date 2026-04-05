"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Camera,
  Hotel,
  Utensils,
  Dumbbell,
  Sparkles,
  ZoomIn,
} from "lucide-react";

const images = [
  "/images/gallery-1.webp",
  "/images/gallery-2.webp",
  "/images/gallery-3.webp",
  "/images/gallery-4.webp",
  "/images/gallery-5.webp",
  "/images/gallery-6.webp",
  "/images/gallery-7.webp",
  "/images/gallery-8.webp",
  "/images/gallery-9.webp",
  "/images/gallery-10.webp",
  "/images/gallery-11.webp",
  "/images/gallery-12.webp",
];

const roomImages = images.slice(0, 6);
const diningImages = images.slice(6, 10);
const facilitiesImages = images.slice(10);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Gallery() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const tabItems = [
    { value: "all", label: "View All", icon: Camera },
    { value: "rooms", label: "Rooms", icon: Hotel },
    { value: "dining", label: "Dining", icon: Utensils },
    { value: "facilities", label: "Facilities", icon: Dumbbell },
  ];

  const getImages = () => {
    switch (activeTab) {
      case "rooms":
        return roomImages;
      case "dining":
        return diningImages;
      case "facilities":
        return facilitiesImages;
      default:
        return images;
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-[#faf8f5] to-[#f5f0ea] py-24 px-4 sm:px-6 lg:px-6">
      {/* Wrapper FULL WIDTH */}
      <div className="w-full max-w-screen-xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#caa05c]/10 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-[#caa05c]" />
            <span className="text-sm font-medium text-[#caa05c]">
              Our Gallery
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-[#2c1810] mb-4">
            Captured Moments
          </h2>

          <p className="text-[#ab8965] max-w-2xl mx-auto">
            Explore our stunning spaces through the lens
          </p>
        </motion.div>

        {/* Tabs FULL WIDTH */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Tabs List FIXED FULL WIDTH */}
          <TabsList className="mx-auto flex w-fit gap-3 bg-white/70 backdrop-blur-md p-2 rounded-xl border border-[#e8d9cc] shadow-sm">
            {tabItems.map((item) => (
              <TabsTrigger
                key={item.value}
                value={item.value}
                className="px-5 py-2.5 rounded-lg text-sm font-medium
      text-[#8b6946]
      data-[state=active]:bg-[#caa05c]
      data-[state=active]:text-white
      hover:bg-[#f3e7d3] transition"
              >
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Content */}
          <TabsContent value={activeTab} className="mt-10 w-full">
            <motion.div
              key={activeTab}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full"
            >
              {getImages().map((src, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="relative group overflow-hidden rounded-2xl shadow-md cursor-pointer"
                  onClick={() => setSelectedImage(src)}
                >
                  <div className="relative w-full h-60">
                    <Image
                      src={src}
                      alt={`gallery-${index}`}
                      fill
                      className="object-cover group-hover:scale-110 transition duration-500"
                    />
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <ZoomIn className="text-white w-6 h-6" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full max-w-5xl h-[80vh] mx-4">
            <Image
              src={selectedImage}
              alt="full"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
