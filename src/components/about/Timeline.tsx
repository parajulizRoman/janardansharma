'use client';

import { useTranslations } from 'next-intl';
import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { SocialCarousel, SocialMention } from './SocialCarousel';

interface TimelineEvent {
    id: string;
    year: string;
    title: { [key: string]: string };
    summary: { [key: string]: string };
    description: { [key: string]: string }; // Rich text HTML
    images: string[];
    references: { title: string; url: string }[];
    socialMentions?: SocialMention[];
}

const defaultEvents: TimelineEvent[] = [
    {
        id: '2025-12-06',
        year: "2025",
        title: { en: "Leadership in Pragatisheel Loktantrik Party" },
        summary: { en: "Leading the new Progressive Democratic Party as a member of the presidential council, advocating for fresh political transformation." },
        description: { en: "At age 62, Janardan Sharma serves on the presidential council of the newly formed Pragatisheel Loktantrik Party. Based in Kathmandu, he continues to advocate for anti-corruption measures, social equity, and progressive reforms, positioning the party as a fresh alternative ahead of the 2027 elections." },
        images: [],
        references: []
    },
    {
        id: '2025-11-23',
        year: "Nov 23, 2025",
        title: { en: "Formation of Pragatisheel Loktantrik Party" },
        summary: { en: "Merged Progressive Campaign Nepal with other progressive forces to form a new party." },
        description: { en: "Merged Progressive Campaign Nepal with groups led by Baburam Bhattarai (Nepal Samajwadi Party - Naya Shakti) and Santosh Pariyar (ex-Rastriya Swatantra Party). Announced as Progressive Democratic Party (Pragatisheel Loktantrik Party) with a five-member presidential council including Sharma. The party aims to unite progressive, patriotic, and socialist forces under a non-communist banner." },
        images: [],
        references: []
    },
    {
        id: '2025-11-04',
        year: "Nov 4, 2025",
        title: { en: "Launch of Progressive Campaign Nepal" },
        summary: { en: "Launched a reformist platform after breaking from CPN (Maoist Centre)." },
        description: { en: "Broke from CPN (Maoist Centre), ending long ties with Prachanda. Launched 'Progressive Campaign Nepal' with allies like Ram Karki, focusing on governance, democracy, and the legacy of the People's War." },
        images: [],
        references: []
    },
    {
        id: '2025-01',
        year: "Jan-Oct 2025",
        title: { en: "Growing Rift and Alliances" },
        summary: { en: "Demanded electoral processes for party roles and opposed unification with CPN (Unified Socialist)." },
        description: { en: "Demanded electoral processes for party roles in January. By April, opposed unification with CPN (Unified Socialist) and boycotted meetings. Formed ties with leaders like Ghanshyam Bhusal and Netra Bikram Chand 'Biplav' amid disciplinary threats." },
        images: [],
        references: []
    },
    {
        id: '2024',
        year: "2024",
        title: { en: "Party Dissent and Advocacy" },
        summary: { en: "Voiced concerns on leadership delays as Deputy General Secretary." },
        description: { en: "As Deputy General Secretary, Sharma voiced concerns on leadership delays and pushed for direct elections and democratic reforms at party conventions. While facing isolation in Karnali, he built alliances with reformists." },
        images: [],
        references: []
    },
    {
        id: '2022-2023',
        year: "2022–2023",
        title: { en: "Parliamentary and Party Activities" },
        summary: { en: "Championed socialism-oriented economy and anti-corruption initiatives." },
        description: { en: "As MP and Joint General Secretary, championed socialism-oriented economy and anti-corruption initiatives." },
        images: [],
        references: []
    },
    {
        id: 'finance-minister',
        year: "2021–2022",
        title: { en: "Minister of Finance (First Term)" },
        summary: { en: "Focused on measures for economic recovery, infrastructure development, and social welfare." },
        description: {
            en: `
                <div class="space-y-6">
                    <p class="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                        Janardan Sharma served as Nepal's Finance Minister during a turbulent period marked by political instability, the lingering effects of the COVID-19 pandemic, and economic recovery efforts. His primary tenure spanned from July 13, 2021, to July 6, 2022, under Prime Minister Sher Bahadur Deuba's coalition government. This period followed the reinstatement of the House of Representatives by the Supreme Court after its dissolution by the previous KP Sharma Oli administration. Sharma's role involved revising the initial 2021-22 budget presented by the prior government and preparing the 2022-23 budget, which he presented on May 29, 2022.
                    </p>
                    <p class="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                        His tenure was cut short by controversy: On July 6, 2022, Sharma resigned amid allegations that unauthorized individuals had influenced last-minute changes to tax rates in the 2022-23 budget. A parliamentary special committee was formed to investigate, but it found insufficient evidence to substantiate the claims. Despite the resignation, Sharma was reappointed to the same post on July 31, 2022, serving briefly until December 26, 2022.
                    </p>
                    <p class="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                        Overall, Sharma's time as Finance Minister was characterized by ambitious fiscal planning aimed at post-COVID recovery. Nepal's economy grew by an estimated 5.8% in FY 2021-22, though experts noted risks from potential COVID waves. The focus was on shifting toward a "production-based economy" from an import-dependent one, with priorities on employment, fiscal discipline, and inclusive growth.
                    </p>

                    <div class="mt-8">
                        <h4 class="text-lg font-bold mb-4 text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Key Reforms and Initiatives</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            <div class="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-100 dark:border-gray-700">
                                <h5 class="font-bold text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-2">
                                    Social Welfare & Health
                                </h5>
                                <ul class="list-disc list-inside text-sm space-y-2 text-gray-700 dark:text-gray-300">
                                    <li>Rs 5,000 monthly grants for cancer, kidney, and spinal injury patients.</li>
                                    <li>Rs 10,000 cash relief to 500,000 extremely poor families.</li>
                                    <li>Rs 50,000 grants to 572 monsoon-affected families for housing.</li>
                                    <li>High priority on health sector funding amid COVID recovery.</li>
                                </ul>
                            </div>

                            <div class="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-100 dark:border-gray-700">
                                <h5 class="font-bold text-green-600 dark:text-green-400 mb-2">Agriculture & Rural Development</h5>
                                <ul class="list-disc list-inside text-sm space-y-2 text-gray-700 dark:text-gray-300">
                                    <li>Rs 5.9 billion for agricultural modernization projects.</li>
                                    <li>National campaign for rural areas as agricultural hubs.</li>
                                    <li>"Made in Nepal" and "Make in Nepal" initiatives to boost local goods.</li>
                                </ul>
                            </div>

                            <div class="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-100 dark:border-gray-700">
                                <h5 class="font-bold text-purple-600 dark:text-purple-400 mb-2">Employment & Youth</h5>
                                <ul class="list-disc list-inside text-sm space-y-2 text-gray-700 dark:text-gray-300">
                                    <li>Target of 344,000 new jobs via ICT and digital literacy.</li>
                                    <li>Seed capital loans up to Rs 2.5 million at 1% interest for startups.</li>
                                    <li>Rs 500,000 interest-free loans for poor families.</li>
                                </ul>
                            </div>

                            <div class="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-100 dark:border-gray-700">
                                <h5 class="font-bold text-orange-600 dark:text-orange-400 mb-2">Infrastructure & Energy</h5>
                                <ul class="list-disc list-inside text-sm space-y-2 text-gray-700 dark:text-gray-300">
                                    <li>Revival of Melamchi Water Supply Project.</li>
                                    <li>Export of 364 MW hydroelectricity to India to reduce trade deficits.</li>
                                    <li>Rs 1.63 trillion revised budget with proposed debt reduction.</li>
                                </ul>
                            </div>
                            
                            <div class="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-100 dark:border-gray-700 md:col-span-2">
                                <h5 class="font-bold text-gray-700 dark:text-gray-200 mb-2">Taxation & Investment</h5>
                                <ul class="list-disc list-inside text-sm space-y-2 text-gray-700 dark:text-gray-300">
                                    <li>90% customs duty waiver on imported sanitary pads.</li>
                                    <li>Automatic approval for foreign investments up to Rs 100 million.</li>
                                    <li>Tax exemptions for EVs and no new taxes on salaried income.</li>
                                </ul>
                            </div>

                        </div>
                    </div>
                </div>
            `
        },
        images: [],
        references: []
    },
    {
        id: '2021',
        year: "2021",
        title: { en: "Return to CPN (Maoist Centre)" },
        summary: { en: "After NCP dissolution, rejoined as Joint General Secretary." },
        description: { en: "After the dissolution of the NCP, Sharma rejoined CPN (Maoist Centre) as Joint General Secretary and was elected MP from Rukum-2." },
        images: [],
        references: []
    },
    {
        id: '2018-2021',
        year: "2018–2021",
        title: { en: "Nepal Communist Party (NCP) Period" },
        summary: { en: "Shaped policies on federalism and economic reforms as Standing Committee member." },
        description: { en: "As a member of the Standing Committee of the merged Nepal Communist Party (NCP), Sharma played a key role in shaping policies on federalism and economic reforms." },
        images: [],
        references: []
    },
    {
        id: '2017-election',
        year: "2017",
        title: { en: "Third Election to Parliament" },
        summary: { en: "Secured a rare third consecutive win from Western Rukum-1." },
        description: { en: "Secured a third consecutive victory in the parliamentary elections from Western Rukum-1, a rare feat in his party, further strengthening his political base in the Karnali region." },
        images: [],
        references: []
    },
    {
        id: 'home-affairs',
        year: "2017",
        title: { en: "Minister of Home Affairs" },
        summary: { en: "Oversaw internal security and disaster management under PM Sher Bahadur Deuba." },
        description: { en: "Briefly served as Minister of Home Affairs (June 7, 2017 – 2018), overseeing internal security and disaster management during a period of political transition." },
        images: [],
        references: []
    },
    {
        id: 'energy-minister',
        year: "2016–2017",
        title: { en: "Minister of Energy" },
        summary: { en: "Led the 'Ujyalo Nepal' campaign, successfully ending years of chronic load-shedding." },
        description: {
            en: `
                <p class="text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                    During his tenure as Minister of Energy (appointed August 14, 2016), Janardan Sharma initiated the groundbreaking 'Ujyalo Nepal' (Bright Nepal) campaign. This ambitious program aimed to eradicate the persistent problem of load-shedding. Through strategic reforms, improved infrastructure, and the appointment of Kulman Ghising as NEA head, the campaign achieved remarkable success, revolutionizing Nepal's energy sector.
                </p>
                <div class="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700 mb-6">
                    <h4 class="font-semibold text-gray-900 dark:text-white mb-4">Key Steps Taken:</h4>
                    <ul class="space-y-4">
                        <li class="text-sm">
                            <strong class="text-gray-900 dark:text-gray-200 block mb-1">Strategic Management:</strong>
                            <span class="text-gray-600 dark:text-gray-400">Optimized hydropower plant operations and prioritized maintenance.</span>
                        </li>
                        <li class="text-sm">
                            <strong class="text-gray-900 dark:text-gray-200 block mb-1">Cross-Border Trade:</strong>
                            <span class="text-gray-600 dark:text-gray-400">Negotiated power purchase agreements with India to manage peak demand.</span>
                        </li>
                        <li class="text-sm">
                            <strong class="text-gray-900 dark:text-gray-200 block mb-1">Combating Theft:</strong>
                            <span class="text-gray-600 dark:text-gray-400">Launched initiatives to reduce illegal tapping and improve revenue collection.</span>
                        </li>
                        <li class="text-sm">
                            <strong class="text-gray-900 dark:text-gray-200 block mb-1">Institutional Reforms:</strong>
                            <span class="text-gray-600 dark:text-gray-400">Strengthened NEA's capacity and ensured efficient operation and planning.</span>
                        </li>
                    </ul>
                </div>
            `
        },
        images: [],
        references: [
            { title: "Cities load shedding free this year: Minister Sharma", url: "https://thehimalayantimes.com/nepal/cities-load-shedding-free-year-minister-sharma" },
            { title: "Load shedding will end within year: Energy Minister Janardan Sharma", url: "https://thehimalayantimes.com/nepal/load-shedding-will-end-within-year-energy-minister-janardan-sharma" },
            { title: "Load shedding schedule won’t be announced anymore: Minister Sharma", url: "http://www.nepalenergyforum.com/load-shedding-schedule-wont-be-announced-anymore-minister-sharma/" },
            { title: "Entire country is now free of loadshedding", url: "https://kathmandupost.com/money/2018/05/14/entire-country-is-now-free-of-loadshedding" },
            { title: "NEA Annual Report", url: "https://www.nea.org.np/annual_report?page=2" },
            { title: "World Bank: Power-less to Powerful", url: "https://www.worldbank.org/en/news/feature/2019/11/25/power-less-to-powerful" }
        ]
    },
    {
        id: '2013-election',
        year: "2013",
        title: { en: "Re-election to Parliament" },
        summary: { en: "Won a second term from Western Rukum-1." },
        description: { en: "Won a second term as MP from Western Rukum-1, where he actively advanced bills related to infrastructure development, poverty reduction, and the implementation of federalism." },
        images: [],
        references: []
    },
    {
        id: 'peace-minister',
        year: "2009–2011",
        title: { en: "Minister of Peace and Reconstruction" },
        summary: { en: "Led ex-combatant rehabilitation and post-conflict recovery." },
        description: { en: "Served as Minister of Peace and Reconstruction in coalition governments. During this time, he led the rehabilitation and reintegration of ex-combatants and oversaw post-conflict recovery efforts, championing inclusive policies for sustainable peace." },
        images: [],
        references: []
    },
    {
        id: '2008-election',
        year: "2008",
        title: { en: "First Election to Parliament" },
        summary: { en: "Elected as MP from Western Rukum-1." },
        description: { en: "Elected to the Constituent Assembly/Parliament from Western Rukum-1 on a CPN (Maoist) ticket, marking his entry into formal governance. He served on various peace and reconstruction committees." },
        images: [],
        references: []
    },
    {
        id: '2006-peace',
        year: "2006",
        title: { en: "Comprehensive Peace Accord" },
        summary: { en: "Contributed to peace talks ending the 10-year civil war." },
        description: { en: "Played a significant role in the peace talks that led to the Comprehensive Peace Accord, ending the 10-year civil war. He transitioned from armed struggle to mainstream politics as the Maoists integrated into the democratic process." },
        images: [],
        references: []
    },
    {
        id: '1996-war',
        year: "1996",
        title: { en: "Start of People's War" },
        summary: { en: "Rose as a deputy commander of the People's Liberation Army (PLA)." },
        description: { en: "As the Maoist insurgency began, Sharma rose to become one of the four deputy commanders of the People's Liberation Army (PLA). He led operations in western Nepal, emphasizing guerrilla strategies and mass mobilization." },
        images: [],
        references: []
    },
    {
        id: '1980s',
        year: "1980s–1990s",
        title: { en: "Entry into Politics and Maoist Movement" },
        summary: { en: "Joined the Communist Party of Nepal (Maoist) advocating for land reforms." },
        description: { en: "Joined the Communist Party of Nepal (Maoist) in its early stages. He became a prominent organizer in the Karnali region, advocating for land reforms and fighting against feudal systems." },
        images: [],
        references: []
    },
    {
        id: '1',
        year: "1963",
        title: { en: "Birth" },
        summary: { en: "Born on April 25 in Rukum, Nepal." },
        description: { en: "Born on April 25, 1963, in Rukum District, western Nepal, into a humble rural family. His upbringing in the remote Karnali region deeply influenced his lifelong focus on social justice and regional development." },
        images: [],
        references: []
    }
];

export function Timeline({ events = [], locale = 'en' }: { events?: unknown[], locale?: string }) {
    const t = useTranslations('Biography.timeline');
    const [expandedIds, setExpandedIds] = useState<string[]>([]);
    const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');

    // Cast events to TimelineEvent[] or use defaults
    const displayEvents = (events.length > 0 ? events : defaultEvents) as TimelineEvent[];

    const toggleExpand = (id: string) => {
        setExpandedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const isYoutube = (url: string) => {
        return url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
    };

    const getYoutubeId = (url: string) => {
        const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    return (
        <div className="relative border-l border-gray-200 dark:border-gray-700 ml-3 md:ml-6 space-y-10 py-8">
            {displayEvents.map((item, index) => {
                const title = item.title?.[locale] || item.title?.['en'] || '';
                const summary = item.summary?.[locale] || item.summary?.['en'] || '';
                const description = item.description?.[locale] || item.description?.['en'] || '';
                const hasDetails = description || (item.images && item.images.length > 0) || (item.references && item.references.length > 0);
                const isExpanded = expandedIds.includes(item.id);

                return (
                    <div key={item.id || index} className="mb-10 ml-6">
                        <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                            <svg className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                            </svg>
                        </span>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {title}
                            </h3>
                            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 w-fit">
                                {item.year}
                            </span>
                        </div>

                        <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                            {summary}
                        </p>

                        {hasDetails && (
                            <div>
                                <div className="flex items-center gap-4 mb-4">
                                    <button
                                        onClick={() => toggleExpand(item.id)}
                                        className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 transition-colors"
                                    >
                                        {isExpanded ? (
                                            <>Read Less <ChevronUp className="h-4 w-4 ml-1" /></>
                                        ) : (
                                            <>Read More <ChevronDown className="h-4 w-4 ml-1" /></>
                                        )}
                                    </button>

                                    {isExpanded && description && (
                                        <button
                                            onClick={() => setFontSize(prev => prev === 'normal' ? 'large' : 'normal')}
                                            className="text-xs font-bold px-2 py-1 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
                                            title="Toggle Text Size"
                                        >
                                            {fontSize === 'normal' ? 'A+' : 'A-'}
                                        </button>
                                    )}
                                </div>

                                {isExpanded && (
                                    <div className="mt-4 space-y-6 animate-in slide-in-from-top-2 duration-200">
                                        {/* Rich Text Description */}
                                        {description && (
                                            <div
                                                className={`prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed ${fontSize === 'large' ? 'prose-lg' : 'prose-sm'}`}
                                                dangerouslySetInnerHTML={{ __html: description }}
                                            />
                                        )}

                                        {/* Images Grid */}
                                        {item.images && item.images.length > 0 && (
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-6">
                                                {item.images.map((img, idx) => (
                                                    <div key={idx} className="rounded-lg overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 aspect-video">
                                                        <img src={img} alt={`${title} image ${idx + 1}`} className="w-full h-full object-cover" />
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* References & Videos */}
                                        {item.references && item.references.length > 0 && (
                                            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                                    {locale === 'np' ? 'सन्दर्भ र स्रोतहरू' : 'References & Citations'}
                                                </h4>

                                                <div className="space-y-4">
                                                    {/* Video Embeds */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                        {item.references.filter(ref => isYoutube(ref.url)).map((ref, i) => (
                                                            <div key={`vid-${i}`} className="aspect-video rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 bg-black">
                                                                <iframe
                                                                    src={`https://www.youtube.com/embed/${getYoutubeId(ref.url)}`}
                                                                    title={ref.title || 'Video'}
                                                                    className="w-full h-full"
                                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                    allowFullScreen
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Link List */}
                                                    <ul className="space-y-2">
                                                        {item.references.filter(ref => !isYoutube(ref.url)).map((ref, i) => (
                                                            <li key={i}>
                                                                <a href={ref.url} target="_blank" rel="noopener noreferrer" className="flex items-center text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors break-all">
                                                                    <ExternalLink className="h-3 w-3 mr-1.5 flex-shrink-0" />
                                                                    {ref.title || ref.url}
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Social Context Carousel */}
                        {isExpanded && item.socialMentions && item.socialMentions.length > 0 && (
                            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                                    {locale === 'np' ? 'सामाजिक सञ्जालबाट' : 'From Social Media'}
                                </h4>
                                <div className="max-w-full overflow-hidden">
                                    <SocialCarousel mentions={item.socialMentions} />
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div >
    );
}
