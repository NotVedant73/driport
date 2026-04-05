import { Link } from "react-router-dom";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { ArrowRight, Play } from "lucide-react";
import { STORE_CONFIG } from "../../config";
import { useEffect, useState } from "react";

export default function Home() {
  const [activeSlideMap, setActiveSlideMap] = useState(() =>
    STORE_CONFIG.landingCards.reduce((acc, card) => {
      acc[card.id] = 0;
      return acc;
    }, {}),
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlideMap((current) => {
        const next = { ...current };
        STORE_CONFIG.landingCards.forEach((card) => {
          const currentIndex = current[card.id] || 0;
          next[card.id] = (currentIndex + 1) % card.slides.length;
        });
        return next;
      });
    }, 2600);
    return () => clearInterval(timer);
  }, []);

  const heroCards = STORE_CONFIG.landingCards.slice(0, 2);
  const reviewCard = STORE_CONFIG.landingCards[2];
  const reviewIndex = reviewCard ? activeSlideMap[reviewCard.id] || 0 : 0;
  const reviewSlide = reviewCard ? reviewCard.slides[reviewIndex] : null;

  return (
    <div className="bg-[#f5f0e8]">
      {/* ── HERO ── */}
      <section
        className="
          relative min-h-[calc(100svh-64px)]
          bg-[url('/images/hero-fashion.jpg')] bg-cover bg-center bg-no-repeat
          overflow-hidden
        "
      >
        {/* cream overlay — left heavy for text, transparent right for image */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#f5f0e8]/95 via-[#f5f0e8]/80 to-[#f5f0e8]/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#f5f0e8]/30 via-transparent to-[#f5f0e8]/40" />

        {/* 2-col layout: text left, cards right */}
        <div className="relative z-10 min-h-[calc(100svh-64px)] flex items-center px-6 md:px-10 lg:px-16 py-8">
          <div className="w-full max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-8 lg:gap-12 items-center">
            {/* ── LEFT: Text + CTAs ── */}
            <div className="flex flex-col justify-center">
              <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400 mb-5">
                Spring / Summer 2026
              </p>

              <h1 className="font-serif text-stone-900 leading-[1.05] tracking-tight text-3xl md:text-4xl lg:text-5xl">
                {STORE_CONFIG.tagline || (
                  <>
                    New arrivals,
                    <br />
                    <span className="italic text-stone-500">considered.</span>
                  </>
                )}
              </h1>

              <div className="mt-5 mb-5 w-10 h-px bg-stone-300" />

              <p className="text-stone-500 text-sm leading-relaxed max-w-xs">
                Curated drops updated weekly. Minimal silhouettes, quality
                fabrics, lasting wear.
              </p>

              <div className="mt-7 flex flex-col sm:flex-row flex-wrap gap-2.5">
                <Link
                  to="/shop?sort=newest"
                  className="
                    group inline-flex items-center justify-center gap-2
                    bg-stone-900 text-white text-[11px] tracking-[0.18em] uppercase font-medium
                    px-6 py-3
                    hover:bg-stone-700 hover:scale-[1.02] hover:shadow-lg
                    transition-all duration-200
                  "
                >
                  Shop the Drop
                  <ArrowRight
                    size={12}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </Link>

                <a
                  href={STORE_CONFIG.instagram.profileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    group inline-flex items-center justify-center gap-2
                    border border-stone-400 text-stone-700 text-[11px] tracking-[0.18em] uppercase font-medium
                    px-6 py-3
                    hover:border-stone-700 hover:text-stone-900 hover:scale-[1.02]
                    transition-all duration-200
                  "
                >
                  Instagram
                  <ArrowRight
                    size={12}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </a>

                <Link
                  to="/ai-stylist"
                  className="
                    inline-flex items-center justify-center gap-1.5
                    text-stone-500 text-[11px] tracking-[0.18em] uppercase
                    border-b border-stone-300 pb-px
                    hover:text-stone-800 hover:border-stone-600
                    transition-all duration-200
                  "
                >
                  Try AI Stylist
                </Link>
              </div>

              <p className="mt-8 text-[10px] tracking-widest uppercase text-stone-400">
                Free shipping on orders over ₹999
              </p>
            </div>

            {/* ── RIGHT: 2 Product Cards ── */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {heroCards.map((card) => {
                const currentIndex = activeSlideMap[card.id] || 0;
                const currentSlide = card.slides[currentIndex];

                return (
                  <Link
                    key={card.id}
                    to={currentSlide.to}
                    className="group relative overflow-hidden aspect-[3/4] bg-stone-200"
                  >
                    <ImageWithFallback
                      src={currentSlide.image}
                      alt={card.heading}
                      className="
                        absolute inset-0 w-full h-full object-cover
                        group-hover:scale-[1.04]
                        transition-transform duration-500 ease-out
                      "
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

                    <div
                      className="
                      absolute top-2.5 right-2.5
                      w-6 h-6 rounded-full bg-white/80 backdrop-blur-sm
                      flex items-center justify-center
                      opacity-0 group-hover:opacity-100
                      transition-opacity duration-300
                    "
                    >
                      <Play size={10} className="text-stone-800 ml-px" />
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 px-3 pb-3">
                      <h3 className="text-white text-[10px] tracking-[0.15em] uppercase font-medium truncate">
                        {card.heading}
                      </h3>
                      <p className="text-white/55 text-[9px] mt-0.5 tracking-wider uppercase truncate">
                        {card.subheading}
                      </p>
                      <div className="flex gap-1 mt-2">
                        {card.slides.map((_, index) => (
                          <span
                            key={index}
                            className={`block h-px rounded-full transition-all duration-300 ${
                              index === currentIndex
                                ? "w-4 bg-white"
                                : "w-1.5 bg-white/35"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── CUSTOMER PRAISE ── */}
      {reviewCard && reviewSlide && (
        <section className="bg-[#f5f0e8] px-6 md:px-10 lg:px-16 py-10 md:py-12">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-6 md:gap-10 items-center">
            <Link
              to={reviewSlide.to}
              className="group relative overflow-hidden aspect-[4/5] md:aspect-[3/4] bg-stone-200 max-w-[360px]"
            >
              <ImageWithFallback
                src={reviewSlide.image}
                alt={reviewCard.heading}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
              <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Play size={10} className="text-stone-800 ml-px" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 px-3 pb-3">
                <h3 className="text-white text-[10px] tracking-[0.15em] uppercase font-medium truncate">
                  {reviewCard.heading}
                </h3>
                <p className="text-white/55 text-[9px] mt-0.5 tracking-wider uppercase truncate">
                  {reviewCard.subheading}
                </p>
              </div>
            </Link>

            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400 mb-3">
                Customer Voice
              </p>
              <h3 className="font-serif text-stone-900 text-2xl md:text-3xl leading-tight">
                Loved by customers who wear DriPort every day.
              </h3>
              <div className="mt-4 w-12 h-px bg-stone-300" />
              <p className="mt-4 text-stone-600 text-sm md:text-base leading-relaxed max-w-2xl">
                From fabric quality to fit and delivery, our community
                highlights the same thing: DriPort pieces feel premium,
                wearable, and reliable. Real reviews and repeat customers are
                what keep each new drop moving.
              </p>
              <p className="mt-4 text-stone-500 text-xs tracking-[0.14em] uppercase">
                "Best quality for the price. Every order feels worth it."
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── CATEGORY FINDER ── */}
      <section className="bg-white py-16 md:py-20 px-6 md:px-10 lg:px-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400 mb-1.5">
                Browse
              </p>
              <h2 className="font-serif text-stone-900 text-2xl md:text-3xl">
                What are you looking for?
              </h2>
            </div>
            <Link
              to="/shop"
              className="hidden md:inline-flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase text-stone-400 border-b border-stone-300 pb-px hover:text-stone-700 hover:border-stone-600 transition-all duration-200"
            >
              All categories <ArrowRight size={11} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {STORE_CONFIG.categoryCards.map((card) => (
              <Link
                key={card.id}
                to={card.to}
                className="group relative overflow-hidden aspect-[3/4] bg-stone-100"
              >
                <ImageWithFallback
                  src={card.image}
                  alt={card.label}
                  className="
                    absolute inset-0 w-full h-full object-cover
                    group-hover:scale-[1.04]
                    transition-transform duration-500 ease-out
                  "
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 px-3 pb-3.5">
                  <p className="text-white text-[10px] tracking-[0.18em] uppercase font-medium">
                    {card.label}
                  </p>
                  <div className="mt-1.5 w-0 group-hover:w-full h-px bg-white/50 transition-all duration-300 ease-out" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
