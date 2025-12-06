'use client';

import { BookOpen, ExternalLink, FileText } from 'lucide-react';

interface HeritageItem {
    id: string;
    image: string;
    caption: { en: string; np: string };
}

interface InspirationItem {
    id: string;
    title: { en: string; np: string };
    type: 'book' | 'pdf' | 'article';
    url?: string;
    coverImage?: string;
}

interface HeritageSectionProps {
    heritageItems: HeritageItem[];
    inspirationItems: InspirationItem[];
    locale: string;
}

export function HeritageSection({ heritageItems, inspirationItems, locale }: HeritageSectionProps) {
    if ((!heritageItems || heritageItems.length === 0) && (!inspirationItems || inspirationItems.length === 0)) {
        return null; // Don't render if empty
    }

    const lang = locale === 'np' ? 'np' : 'en';

    return (
        <div className="mb-16 pt-16 border-t border-gray-200 dark:border-gray-800">
            {/* Section Header */}
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                    {locale === 'np' ? 'राष्ट्रिय गौरव र प्रेरणा' : 'National Heritage & Inspirations'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    {locale === 'np'
                        ? 'राष्ट्रिय एकता र संस्कृतिका आधारस्तम्भहरू जसले हाम्रो पहिचान र स्वाभिमानलाई जीवित राख्छन्।'
                        : 'The pillars of national unity and culture that keep our identity and pride alive.'}
                </p>
            </div>

            {/* HERITAGE GALLERY */}
            {heritageItems && heritageItems.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {heritageItems.map((item) => (
                        <div key={item.id} className="group flex flex-col items-center">
                            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 transition-transform duration-300 hover:-translate-y-1">
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.caption[lang] || 'Heritage Image'}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400 bg-gray-200 dark:bg-gray-800">
                                        <span className="text-xs">No Image</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/5 rounded-2xl pointer-events-none"></div>
                            </div>
                            <div className="mt-4 text-center px-4">
                                <h3 className="text-lg font-serif font-medium text-gray-900 dark:text-gray-200">
                                    {item.caption[lang]}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* INSPIRATIONS LIST */}
            {inspirationItems && inspirationItems.length > 0 && (
                <div className="bg-amber-50/50 dark:bg-amber-900/10 rounded-3xl p-8 md:p-12 border border-amber-100 dark:border-amber-900/30">
                    <h3 className="text-2xl font-bold mb-8 text-center text-gray-900 dark:text-white flex items-center justify-center gap-3">
                        <BookOpen className="h-6 w-6 text-amber-600" />
                        {locale === 'np' ? 'प्रेरणादायी स्रोतहरू' : 'Sources of Inspiration'}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {inspirationItems.map((item) => (
                            <a
                                key={item.id}
                                href={item.url || '#'}
                                target={item.url ? '_blank' : undefined}
                                rel="noopener noreferrer"
                                className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-300 ${item.url ? 'hover:bg-white hover:shadow-md dark:hover:bg-gray-800/50 cursor-pointer' : 'cursor-default'}`}
                            >
                                {/* Icon / Thumb */}
                                <div className="shrink-0 w-16 h-20 bg-amber-100 dark:bg-amber-900/40 rounded-lg flex items-center justify-center overflow-hidden border border-amber-200 dark:border-amber-800/50 shadow-sm">
                                    {item.coverImage ? (
                                        <img src={item.coverImage} alt={item.title[lang]} className="w-full h-full object-cover" />
                                    ) : (
                                        item.type === 'book' ? <BookOpen className="h-8 w-8 text-amber-600 dark:text-amber-500" />
                                            : item.type === 'pdf' ? <FileText className="h-8 w-8 text-amber-600 dark:text-amber-500" />
                                                : <ExternalLink className="h-8 w-8 text-amber-600 dark:text-amber-500" />
                                    )}
                                </div>

                                {/* Text */}
                                <div className="flex-1 mt-1">
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 leading-tight mb-1">
                                        {item.title[lang] || (locale === 'np' ? 'शीर्षक छैन' : 'Untitled')}
                                    </h4>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 uppercase tracking-tighter font-medium">
                                        <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px]">
                                            {item.type.toUpperCase()}
                                        </span>
                                        {item.url && <span className="flex items-center gap-1 group-hover:text-amber-600 transition-colors">View <ExternalLink className="h-3 w-3" /></span>}
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
