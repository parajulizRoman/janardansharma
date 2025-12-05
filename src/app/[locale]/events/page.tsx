import { supabase } from '@/lib/supabase';
import { Metadata } from 'next';
import { Calendar, MapPin, Clock } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Events | Janardan Sharma Pravakar',
    description: 'Upcoming and past events, rallies, and programs.',
};

export const revalidate = 60;

export default async function EventsPage() {
    const { data: upcomingEvents } = await supabase
        .from('events')
        .select('*')
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true });

    const { data: pastEvents } = await supabase
        .from('events')
        .select('*')
        .lt('start_time', new Date().toISOString())
        .order('start_time', { ascending: false })
        .limit(10); // Limit past events

    return (
        <div className="bg-gray-50 dark:bg-gray-950 min-h-screen py-16 px-4">
            <div className="container mx-auto max-w-6xl">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-bold mb-4">Events</h1>
                    <p className="text-gray-600 dark:text-gray-400">Join our movement. Participate in upcoming programs.</p>
                </header>

                {/* Upcoming Events */}
                <section className="mb-20">
                    <h2 className="text-2xl font-bold mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">Upcoming Events</h2>
                    {(!upcomingEvents || upcomingEvents.length === 0) ? (
                        <div className="bg-blue-50 dark:bg-blue-950/20 p-8 rounded-lg text-center">
                            <p className="text-blue-800 dark:text-blue-300">No upcoming events scheduled at the moment.</p>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {upcomingEvents.map((event) => (
                                <div key={event.id} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
                                    <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg p-4 text-center min-w-[80px]">
                                        <span className="block text-sm font-bold uppercase">{new Date(event.start_time).toLocaleString('default', { month: 'short' })}</span>
                                        <span className="block text-3xl font-bold">{new Date(event.start_time).getDate()}</span>
                                        <span className="block text-xs uppercase">{new Date(event.start_time).getFullYear()}</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-bold uppercase tracking-wider bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                                                {event.type}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">{event.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-400 mb-4">{event.description}</p>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                <span>{new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {event.end_time ? new Date(event.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD'}</span>
                                            </div>
                                            {event.location && (
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-4 w-4" />
                                                    <span>{event.location}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Past Events */}
                {pastEvents && pastEvents.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">Past Events</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pastEvents.map((event) => (
                                <div key={event.id} className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-100 dark:border-gray-800 opacity-80 hover:opacity-100 transition-opacity">
                                    <h3 className="text-lg font-bold mb-2">{event.title}</h3>
                                    <div className="text-sm text-gray-500 mb-2">
                                        <span className="mr-3">{new Date(event.start_time).toLocaleDateString()}</span>
                                        <span>{event.location}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
