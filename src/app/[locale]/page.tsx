import { Hero } from '@/components/home/Hero';
import { BioTeaser } from '@/components/home/BioTeaser';
import { LatestNews } from '@/components/home/LatestNews';
import { UpcomingEvents } from '@/components/home/UpcomingEvents';

export default function Home() {
  return (
    <>
      <Hero />
      <BioTeaser />
      <UpcomingEvents />
      <LatestNews />

      {/* Newsletter / CTA Section */}
      <section className="py-20 bg-slate-900 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Stay Connected</h2>
          <p className="text-slate-300 max-w-2xl mx-auto mb-8">
            Subscribe to receive the latest updates, press releases, and event notifications directly to your inbox.
          </p>
          <div className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 rounded-md border-0 px-4 py-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
