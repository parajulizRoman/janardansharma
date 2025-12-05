import { supabase } from '@/lib/supabase';
import { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';

export const metadata: Metadata = {
    title: 'Vision & Policies | Janardan Sharma Pravakar',
    description: 'Detailed vision for national development, social justice, and economic revolution.',
};

// Revalidate data every 60 seconds (or logic as needed, standard ISR)
export const revalidate = 60;

export default async function VisionPage() {
    const { data: policies, error } = await supabase
        .from('policies')
        .select('*')
        .order('order', { ascending: true });

    if (error) {
        console.error('Error fetching policies:', error);
    }

    return (
        <div className="bg-white dark:bg-gray-950 py-16 px-4">
            <div className="container mx-auto max-w-4xl">
                <header className="mb-16 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Vision & Policies</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        A roadmap for a prosperous, inclusive, and sovereign Nepal.
                    </p>
                </header>

                {(!policies || policies.length === 0) ? (
                    <div className="prose prose-lg dark:prose-invert mx-auto">
                        <div className="bg-blue-50 dark:bg-gray-900 border-l-4 border-blue-600 p-6 rounded-r-lg">
                            <p className="text-gray-700 dark:text-gray-300 italic">
                                "Our vision is not just about development infrastructure; it's about developing human potential and ensuring social justice for every Nepali."
                            </p>
                            <p className="mt-4 font-bold text-right">— Janardan Sharma</p>
                        </div>

                        <h2 className="mt-12">Core Pillars</h2>
                        <ul>
                            <li><strong>Economic Revolution:</strong> Transforming Nepal from an import-based economy to a production-based self-sufficient economy.</li>
                            <li><strong>Energy Security:</strong> Maximizing hydropower potential for domestic consumption and export to drive prosperity.</li>
                            <li><strong>Social Justice:</strong> Ensuring equal rights and opportunities for Dalits, women, indigenous communities, and marginalized groups.</li>
                            <li><strong>Digital Nepal:</strong> Leveraging technology to improve governance, education, and healthcare access.</li>
                        </ul>
                        <p className="text-sm text-gray-500 italic mt-8 text-center">(Detailed policy documents are being updated.)</p>
                    </div>
                ) : (
                    <div className="space-y-16">
                        {policies.map((policy) => (
                            <section key={policy.id} id={`policy-${policy.id}`} className="scroll-mt-24">
                                <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-800">
                                    {policy.title}
                                </h2>
                                <div className="prose prose-lg dark:prose-invert max-w-none">
                                    <ReactMarkdown>{policy.content}</ReactMarkdown>
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
