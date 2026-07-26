"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFoundContent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-5">
      <div className="text-center max-w-lg">
        {/* Image Animation */}
        <motion.div
          animate={{
            y: [0, -15, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mb-8"
        >
          <Image
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5NxOmBr37rMnNfHHsY7hfJZC8tHipjv_hpU3Xs21NTw&s=10"
            alt="Page Not Found"
            width={350}
            height={350}
          />
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
        >
          <h1 className="text-5xl font-bold text-gray-900">404</h1>

          <h2 className="text-2xl font-semibold mt-3">Page Not Found</h2>

          <p className="text-gray-600 mt-4">
            Sorry, the page you are looking for does not exist.
          </p>

          <Link
            href="/"
            className="
              inline-block
              mt-8
              px-8
              py-3
              bg-[#caa05c]
              text-white
              rounded-full
              hover:scale-105
              transition
            "
          >
            Return Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
