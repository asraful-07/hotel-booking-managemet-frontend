"use client";

import Image from "next/image";

type BlogPost = {
  title: string;
  category: string;
  date: string;
  description: string;
  image: string;
};

const posts: BlogPost[] = [
  {
    title: "Designing spaces that breathe",
    category: "Interior",
    date: "Apr 18, 2026",
    description:
      "Thoughtful interior design is about more than furniture and colour palettes—it is about creating spaces that feel calm, functional, and timeless. By carefully balancing natural light, open layouts, and intentional negative space, every room gains a sense of harmony that enhances everyday living. Discover how small architectural choices can transform an ordinary home into a peaceful environment that encourages comfort, creativity, and meaningful moments.",
    image:
      "https://demo2.themelexus.com/erios2/wp-content/uploads/2026/04/blog-10.jpg",
  },
  {
    title: "The quiet return of warm tones",
    category: "Trends",
    date: "Apr 12, 2026",
    description:
      "Design trends are shifting away from cool minimalism and embracing the warmth of earthy neutrals, rich wood textures, and elegant brass accents. These timeless colour combinations create inviting interiors that feel both sophisticated and comfortable. Explore how warm tones can add depth, personality, and a welcoming atmosphere without overwhelming your living space.",
    image:
      "https://demo2.themelexus.com/erios2/wp-content/uploads/2026/04/blog-9.jpg",
  },
  {
    title: "Small rooms, bigger ideas",
    category: "Guides",
    date: "Apr 06, 2026",
    description:
      "Limited square footage does not have to limit creativity. Smart furniture placement, multifunctional pieces, clever storage solutions, and thoughtful lighting can make even the smallest room feel spacious and practical. Learn simple design techniques that maximise every corner while maintaining a clean, modern, and visually balanced interior.",
    image:
      "https://demo2.themelexus.com/erios2/wp-content/uploads/2026/04/blog-7.jpg",
  },
  {
    title: "Materials that age well",
    category: "Craft",
    date: "Mar 29, 2026",
    description:
      "The best interiors are built with materials that become more beautiful over time. Natural oak develops character, brass gains a unique patina, and linen softens with every passing year. This article explores why investing in authentic, high-quality materials creates lasting value and timeless elegance that outlives temporary design trends.",
    image:
      "https://demo2.themelexus.com/erios2/wp-content/uploads/2026/04/blog-5.jpg",
  },
  {
    title: "A conversation with the studio",
    category: "Interview",
    date: "Mar 22, 2026",
    description:
      "Go behind the scenes with our lead designer as we discuss the creative journey behind each project. From understanding client lifestyles to refining every detail through sketches, material selection, and collaboration, discover how thoughtful design decisions evolve into beautiful, functional spaces tailored to each client's unique vision.",
    image:
      "https://demo2.themelexus.com/erios2/wp-content/uploads/2026/04/blog-3.jpg",
  },
  {
    title: "Behind the latest collection",
    category: "Journal",
    date: "Mar 15, 2026",
    description:
      "Every furniture collection begins with inspiration and countless hours of experimentation. Follow the journey from initial concept sketches to handcrafted prototypes and the final refined pieces. This behind-the-scenes story reveals the craftsmanship, design philosophy, and attention to detail that shape a collection designed to remain relevant for years to come.",
    image:
      "https://demo2.themelexus.com/erios2/wp-content/uploads/2026/04/blog-1.jpg",
  },
];

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <div className="group relative w-[340px] shrink-0 sm:w-[380px]">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl">
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="380px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        <div
          className="absolute inset-0 flex flex-col justify-end p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(180deg, rgba(20,15,8,0) 35%, rgba(20,15,8,0.88) 100%)",
          }}
        >
          <div className="flex translate-y-3 flex-col gap-3 transition-transform duration-300 group-hover:translate-y-0">
            <div className="flex items-center gap-3 text-xs font-medium text-white/85">
              <span
                className="rounded-full px-2.5 py-1"
                style={{ backgroundColor: "var(--primary)", color: "#fff" }}
              >
                {post.category}
              </span>
              <span>{post.date}</span>
            </div>

            <p className="line-clamp-3 text-sm leading-relaxed text-white/90">
              {post.description}
            </p>

            <a
              href="#"
              className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-white underline-offset-4 hover:underline"
            >
              Read more
              <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </div>

      <h3 className="mt-4 text-base font-semibold text-foreground">
        {post.title}
      </h3>
    </div>
  );
}

export default function BlogPage() {
  const loop = [...posts, ...posts];

  return (
    <div className="w-full bg-background py-16 sm:py-24">
      <div className="mx-auto mb-10 max-w-3xl px-6 text-center sm:mb-14">
        <span
          className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-wide"
          style={{
            backgroundColor: "var(--secondBackground)",
            color: "var(--secondary)",
          }}
        >
          Blog
        </span>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Stories from the studio
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-balance text-muted-foreground">
          Notes on design, materials, and the ideas behind our work.
        </p>
      </div>

      <div className="marquee-mask relative overflow-hidden">
        <div className="marquee-track flex w-max gap-6 px-6">
          {loop.map((post, index) => (
            <BlogCard key={index} post={post} />
          ))}
        </div>
      </div>

      <style>{`
        .marquee-track {
          animation: blog-marquee 22s linear infinite;
        }
        .marquee-mask:hover .marquee-track {
          animation-play-state: paused;
        }
        .marquee-mask {
          -webkit-mask-image: linear-gradient(
            90deg,
            transparent 0,
            #000 5%,
            #000 95%,
            transparent 100%
          );
          mask-image: linear-gradient(
            90deg,
            transparent 0,
            #000 5%,
            #000 95%,
            transparent 100%
          );
        }
        @keyframes blog-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
