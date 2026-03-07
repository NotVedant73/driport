import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Heart, Users, Award, Globe } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-amber-50/30">
      {/* Hero */}
      <div className="bg-gradient-to-r from-amber-100 to-amber-50 py-20 border-b-2 border-amber-900/20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-6xl font-serif text-amber-900 mb-6">Our Story</h1>
          <p className="text-xl text-amber-800 max-w-2xl mx-auto">
            Preserving the elegance of the past while celebrating sustainable fashion for the future
          </p>
        </div>
      </div>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="rounded-lg overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1666861585341-5bd1e7b1ed71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwc3RvcmUlMjBjbG90aGluZyUyMGJvdXRpcXVlfGVufDF8fHx8MTc3MDY0OTcwM3ww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Vintage Store"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-4xl font-serif text-amber-900 mb-6">A Passion for Timeless Style</h2>
              <p className="text-amber-800 mb-4">
                Vintage Vogue was born from a deep appreciation for the craftsmanship and artistry of fashion's golden eras. Founded in 2015, we started as a small boutique in the heart of the city, curating unique pieces from the 1950s through the 1980s.
              </p>
              <p className="text-amber-800 mb-4">
                Our mission has always been simple: to give new life to exceptional vintage garments while promoting sustainable fashion choices. Each piece in our collection is carefully selected, authenticated, and lovingly restored to its original glory.
              </p>
              <p className="text-amber-800">
                Today, we serve customers worldwide, but our commitment remains unchanged – to provide authentic vintage fashion that tells a story and stands the test of time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-serif text-amber-900 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 text-amber-900 mb-6">
                <Heart size={32} />
              </div>
              <h3 className="text-xl font-semibold text-amber-900 mb-3">Quality First</h3>
              <p className="text-amber-800">
                Every item is hand-selected for exceptional quality and authentic vintage character.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 text-amber-900 mb-6">
                <Globe size={32} />
              </div>
              <h3 className="text-xl font-semibold text-amber-900 mb-3">Sustainability</h3>
              <p className="text-amber-800">
                Promoting circular fashion and reducing waste through vintage clothing.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 text-amber-900 mb-6">
                <Award size={32} />
              </div>
              <h3 className="text-xl font-semibold text-amber-900 mb-3">Authenticity</h3>
              <p className="text-amber-800">
                100% genuine vintage pieces, each with its own unique history and charm.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 text-amber-900 mb-6">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-semibold text-amber-900 mb-3">Community</h3>
              <p className="text-amber-800">
                Building a community of vintage lovers who appreciate timeless fashion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-amber-50/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-serif text-amber-900 text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Mitchell', role: 'Founder & Curator', image: 'https://images.unsplash.com/photo-1764627511567-af015c644c24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRybyUyMGZhc2hpb24lMjBtb2RlbCUyMHN0eWxlfGVufDF8fHx8MTc3MDY0OTcwM3ww&ixlib=rb-4.1.0&q=80&w=1080' },
              { name: 'Emma Rodriguez', role: 'Head Buyer', image: 'https://images.unsplash.com/photo-1764684808666-ca5969aba565?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwZmFzaGlvbiUyMHdvbWFuJTIwZHJlc3N8ZW58MXx8fHwxNzcwNjQ5NzAxfDA&ixlib=rb-4.1.0&q=80&w=1080' },
              { name: 'James Chen', role: 'Restoration Specialist', image: 'https://images.unsplash.com/photo-1763922756509-a00702811d83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRybyUyMGphY2tldCUyMGxlYXRoZXIlMjB2aW50YWdlfGVufDF8fHx8MTc3MDY0OTcwMXww&ixlib=rb-4.1.0&q=80&w=1080' }
            ].map((member, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden border-2 border-amber-900/10">
                <div className="aspect-square">
                  <ImageWithFallback
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-semibold text-amber-900 text-xl mb-2">{member.name}</h3>
                  <p className="text-amber-700">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-amber-900 to-amber-800 text-amber-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-serif mb-6">Join Our Vintage Community</h2>
          <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for exclusive access to new arrivals, styling tips, and special offers
          </p>
          <div className="flex gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded bg-amber-800 text-amber-50 placeholder-amber-300 border-2 border-amber-700 focus:outline-none focus:border-amber-500"
            />
            <button className="px-8 py-3 bg-amber-50 text-amber-900 rounded hover:bg-white transition font-semibold">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
