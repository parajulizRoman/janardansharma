import { Timeline } from '@/components/about/Timeline';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Biography | Janardan Sharma Pravakar',
    description: 'Learn about the life, political journey, and contributions of Janardan Sharma Pravakar.',
};

export default function AboutPage() {
    return (
        <div className="bg-white dark:bg-gray-950">
            {/* Header Section */}
            <section className="relative bg-gray-100 dark:bg-gray-900 py-20 px-4">
                <div className="container mx-auto max-w-4xl text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Janardan Sharma 'Pravakar'</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                        A leader forged in struggle, dedicated to peace, and committed to the prosperity of Nepal.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16 px-4">
                <div className="container mx-auto max-w-4xl">
                    <div className="prose prose-lg dark:prose-invert mx-auto mb-16">
                        <h2>Introduction</h2>
                        <p>
                            Janardan Sharma, popularly known by his nom de guerre 'Pravakar', is a visionary leader and a key architect of Nepal's political transformation. From the rugged hills of Rukum to the corridors of Singha Durbar, his journey is a testament to resilience and unwavering commitment to the people.
                        </p>
                        <p>
                            As a prominent leader of the Communist Party of Nepal (Maoist Centre), he played a crucial role in the People's War, the peace process, and the drafting of the federal democratic republican constitution.
                        </p>

                        <h2>Key Contributions</h2>
                        <ul>
                            <li><strong>Ending Load-Shedding:</strong> As Minister of Energy, he led the historic campaign to eliminate chronic power cuts, revolutionizing the energy sector.</li>
                            <li><strong>Peace Process:</strong> Played a vital role in the integration of Maoist combatants and the management of arms, ensuring a smooth transition to peace.</li>
                            <li><strong>Federalism:</strong> A fierce advocate for federalism, ensuring rights and representation for marginalized communities and remote regions.</li>
                        </ul>
                    </div>

                    <div className="mb-16">
                        <h2 className="text-3xl font-bold mb-8 text-center">Political Journey</h2>
                        <Timeline />
                    </div>

                    <div className="bg-blue-50 dark:bg-gray-900 p-8 rounded-2xl">
                        <h2 className="text-2xl font-bold mb-4">Personal Life</h2>
                        <p className="text-gray-700 dark:text-gray-300">
                            Beyond politics, Janardan Sharma is known for his literary interests, often expressing his thoughts through poetry and articles. He remains deeply connected to his roots in Rukum, frequently visiting and engaging with local communities to understand their evolving needs.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
