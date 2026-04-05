import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Heart, Users, Award, Globe } from "lucide-react";
import { ABOUT_PAGE_CONTENT } from "../../config";

const valueIcons = {
  heart: Heart,
  users: Users,
  award: Award,
  globe: Globe,
};

export default function About() {
  return (
    <div className="bg-[#f5f0e8]">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#f0e7d8] to-[#f7f1e8] py-20 border-b-2 border-stone-300">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-6xl font-serif text-stone-900 mb-6">
            {ABOUT_PAGE_CONTENT.hero.title}
          </h1>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto">
            {ABOUT_PAGE_CONTENT.hero.subtitle}
          </p>
        </div>
      </div>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="rounded-lg overflow-hidden">
              <ImageWithFallback
                src={ABOUT_PAGE_CONTENT.story.image}
                alt="DriPort studio"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-4xl font-serif text-stone-900 mb-6">
                {ABOUT_PAGE_CONTENT.story.title}
              </h2>
              {ABOUT_PAGE_CONTENT.story.paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className={
                    index === ABOUT_PAGE_CONTENT.story.paragraphs.length - 1
                      ? "text-stone-600"
                      : "text-stone-600 mb-4"
                  }
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-serif text-stone-900 text-center mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {ABOUT_PAGE_CONTENT.values.map((value, index) => {
              const ValueIcon = valueIcons[value.icon] ?? Heart;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-stone-100 text-stone-900 mb-6">
                    <ValueIcon size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-stone-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-stone-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-amber-900 to-amber-800 text-amber-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-serif mb-6">
            {ABOUT_PAGE_CONTENT.newsletter.title}
          </h2>
          <p className="text-xl text-stone-900 mb-8 max-w-2xl mx-auto">
            {ABOUT_PAGE_CONTENT.newsletter.subtitle}
          </p>
          <div className="flex gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder={ABOUT_PAGE_CONTENT.newsletter.placeholder}
              className="flex-1 px-4 py-3 rounded bg-amber-800 text-amber-50 placeholder-amber-300 border-2 border-amber-700 focus:outline-none focus:border-amber-500"
            />
            <button className="px-8 py-3 bg-amber-50 text-stone-900 rounded hover:bg-white transition font-semibold">
              {ABOUT_PAGE_CONTENT.newsletter.buttonText}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
