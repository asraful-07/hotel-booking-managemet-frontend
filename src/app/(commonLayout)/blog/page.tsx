"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Home, Calendar, User, Clock, ArrowRight, Tag } from "lucide-react";

// Blog post data
const blogPosts = [
  {
    id: 1,
    title: "10 Tips for a Perfect Hotel Stay",
    excerpt:
      "Discover the secrets to making your hotel experience unforgettable with these expert tips and insider knowledge.",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=60",
    category: "Travel Tips",
    author: "Sarah Johnson",
    date: "July 25, 2026",
    readTime: "5 min read",
    featured: true,
  },
  {
    id: 2,
    title: "Exploring Local Cuisine: A Food Lover's Guide",
    excerpt:
      "From street food to fine dining, explore the best culinary experiences our city has to offer.",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=60",
    category: "Food & Dining",
    author: "Michael Chen",
    date: "July 22, 2026",
    readTime: "4 min read",
    featured: false,
  },
  {
    id: 3,
    title: "Wellness Retreat: Rejuvenate Your Mind and Body",
    excerpt:
      "Discover our wellness programs designed to help you relax, recharge, and find your inner peace.",
    image:
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&auto=format&fit=crop&q=60",
    category: "Wellness",
    author: "Emily Davis",
    date: "July 20, 2026",
    readTime: "6 min read",
    featured: false,
  },
  {
    id: 4,
    title: "The Ultimate Guide to Business Travel",
    excerpt:
      "Everything you need to know about traveling for business, from packing tips to staying productive on the road.",
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=60",
    category: "Business",
    author: "David Wilson",
    date: "July 18, 2026",
    readTime: "7 min read",
    featured: false,
  },
  {
    id: 5,
    title: "Family Vacation: Activities for All Ages",
    excerpt:
      "Plan the perfect family getaway with our curated list of activities that everyone from toddlers to grandparents will love.",
    image:
      "https://images.unsplash.com/photo-1533873984035-25970ab07461?w=800&auto=format&fit=crop&q=60",
    category: "Family Travel",
    author: "Lisa Thompson",
    date: "July 15, 2026",
    readTime: "5 min read",
    featured: false,
  },
  {
    id: 6,
    title: "Sustainable Travel: How to Be an Eco-Friendly Guest",
    excerpt:
      "Learn how you can reduce your environmental impact while enjoying a luxurious hotel experience.",
    image:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=60",
    category: "Sustainability",
    author: "Emma Green",
    date: "July 12, 2026",
    readTime: "4 min read",
    featured: false,
  },
];

// Categories for filter
const categories = [
  "All",
  "Travel Tips",
  "Food & Dining",
  "Wellness",
  "Business",
  "Family Travel",
  "Sustainability",
];

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogPosts.find((post) => post.featured);

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full h-[350px] md:h-[420px] overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="https://plus.unsplash.com/premium_photo-1661929519129-7a76946c1d38?w=1200&auto=format&fit=crop&q=80"
            alt="Blog - Hotel Background"
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
            <span className="text-[#caa05c]">Blog</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Our Blog
          </h1>
          <p className="text-base md:text-lg text-white/90 max-w-2xl leading-relaxed">
            Discover stories, tips, and insights from our hotel experts. Stay
            inspired for your next journey.
          </p>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16 bg-[#caa05c1a]">
        <div className="max-w-7xl mx-auto px-5">
          {/* Filter and Search Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-5 mb-10">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-[#caa05c] text-white"
                      : "bg-white text-gray-600 hover:bg-[#caa05c1a]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="w-full md:w-64">
              <input
                type="text"
                placeholder="Search blog..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-full border border-gray-200 outline-none focus:border-[#caa05c] bg-white"
              />
            </div>
          </div>

          {/* Featured Post */}
          {featuredPost && (
            <div className="mb-12">
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative h-64 md:h-auto min-h-[300px]">
                    <Image
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-[#caa05c] text-white px-3 py-1 rounded-full text-xs font-medium">
                      Featured
                    </div>
                  </div>
                  <div className="p-6 md:p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-3 text-sm text-[#ab8965] mb-3">
                      <span className="flex items-center gap-1">
                        <Tag size={14} />
                        {featuredPost.category}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {featuredPost.date}
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                      {featuredPost.title}
                    </h2>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <User size={14} />
                        <span>{featuredPost.author}</span>
                        <span>•</span>
                        <Clock size={14} />
                        <span>{featuredPost.readTime}</span>
                      </div>
                      <Link
                        href={`/blog/${featuredPost.id}`}
                        className="flex items-center gap-1 text-[#caa05c] hover:text-[#ab8965] font-medium transition-colors"
                      >
                        Read More
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Blog Grid */}
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl">
              <p className="text-gray-500 text-lg">
                No blog posts found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#caa05c] text-white px-2.5 py-1 rounded-full text-xs font-medium">
                      {post.category}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <Calendar size={12} />
                      <span>{post.date}</span>
                      <span>•</span>
                      <Clock size={12} />
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 hover:text-[#caa05c] transition-colors">
                      <Link href={`/blog/${post.id}`}>{post.title}</Link>
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <User size={12} />
                        <span>{post.author}</span>
                      </div>
                      <Link
                        href={`/blog/${post.id}`}
                        className="text-[#caa05c] hover:text-[#ab8965] text-sm font-medium transition-colors flex items-center gap-1"
                      >
                        Read More
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {filteredPosts.length > 6 && (
            <div className="text-center mt-12">
              <button className="px-8 py-3 bg-[#caa05c] hover:bg-[#ab8965] text-white font-semibold rounded-full transition-colors">
                Load More Posts
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
