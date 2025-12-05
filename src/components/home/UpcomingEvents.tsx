import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { MapPin, Clock } from 'lucide-react';

export async function UpcomingEvents() {
    if (!supabase) return null;

    const { data: events, error } = await supabase
        .from('events')
        .select('id, title, location, start_time, type')
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(3);

    if (error || !events || events.length === 0) {
        // Don't render section if no upcoming events
        return null;
    }

    return (
        <section className="py-16 bg-blue-600 text-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">Upcoming Events</h2>
                        <p className="text-blue-100">Join Janardan Sharma at these upcoming programs.</p>
                    </div>
                    <Link
                        href="/events"
                        className="px-6 py-2 bg-white text-blue-600 rounded-full font-medium hover:bg-blue-50 transition-colors"
                    >
                        View Calendar
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <div key={event.id} className="bg-blue-700 rounded-xl p-6 border border-blue-500">
                            <div className="flex items-start justify-between mb-4">
                                <span className="bg-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide text-blue-100">
                                    {event.type}
                                </span>
                                <div className="text-center bg-white text-blue-900 rounded-lg p-2 min-w-[60px]">
                                    <span className="block text-xs font-bold uppercase">{new Date(event.start_time).toLocaleString('default', { month: 'short' })}</span>
                                    <span className="block text-xl font-bold">{new Date(event.start_time).getDate()}</span>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mb-3 line-clamp-2">{event.title}</h3>
                            <div className="space-y-2 text-sm text-blue-100">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 opacity-75" />
                                    <span>{new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                {event.location && (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 opacity-75" />
                                        <span>{event.location}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
