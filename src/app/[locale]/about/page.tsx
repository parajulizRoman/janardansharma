import { Timeline } from '@/components/about/Timeline';
import { SocialCarousel } from '@/components/about/SocialCarousel';
import { HeritageSection } from '@/components/about/HeritageSection';
import { Metadata } from 'next';
import { getTranslations, getLocale } from 'next-intl/server';
import { getSiteSettings } from '@/app/actions';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

export const metadata: Metadata = {
    title: 'Biography | Janardan Sharma Pravakar',
    description: 'Learn about the life, political journey, and contributions of Janardan Sharma Pravakar.',
};

// ... imports
// ...

export default async function AboutPage() {
    const t = await getTranslations('Biography');
    const locale = await getLocale();
    const settings = await getSiteSettings();
    const messages = await getMessages();

    const fatherImage = settings.father_image || 'https://placehold.co/400x500/e2e8f0/1e293b?text=Father';
    const motherImage = settings.mother_image || 'https://placehold.co/400x500/e2e8f0/1e293b?text=Mother';
    const extraImage = settings.family_extra_image; // Optional 3rd image
    const extraImage2 = settings.family_extra_image_2; // Optional 4th image (Tribute 2)
    const extraLabel = settings.family_extra_label || 'Family'; // Optional label
    const extraLabel2 = settings.family_extra_label_2 || 'Start Of The Day'; // Optional label 2
    const tributeMessage = settings.family_tribute_message || 'A heartfelt tribute to the roots that grounded me.'; // Quote

    const biographyData = settings.biography_data || [];
    const socialMentions = settings.social_mentions || [];

    const gridCols = extraImage ? 'md:grid-cols-3' : 'md:grid-cols-2';

    return (
        <div className="bg-white dark:bg-gray-950">
            {/* Header Section */}
            <section className="relative bg-gray-100 dark:bg-gray-900 py-20 px-4" style={{ background: 'linear-gradient(90deg, #F44369, #3E3B92)' }}>
                <div className="container mx-auto max-w-4xl text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-md">{t('title')}</h1>
                    <p className="text-xl text-white/90 leading-relaxed font-light">
                        {t('subtitle')}
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16 px-4">
                <div className="container mx-auto max-w-4xl">

                    <div className="prose prose-lg dark:prose-invert mx-auto mb-16">
                        <h2>{t('introTitle')}</h2>
                        <p>
                            {t('introP1')}
                        </p>
                        <p>
                            {t('introP2')}
                        </p>

                        <h2>{t('contributionsTitle')}</h2>
                        <ul>
                            <li><strong>{t('contribution1Title')}:</strong> {t('contribution1Desc')}</li>
                            <li><strong>{t('contribution2Title')}:</strong> {t('contribution2Desc')}</li>
                            <li><strong>{t('contribution3Title')}:</strong> {t('contribution3Desc')}</li>
                        </ul>
                    </div>

                    {/* Timeline Section - Full Ascending */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold mb-8 text-center">{t('journeyTitle')}</h2>
                        <NextIntlClientProvider messages={messages}>
                            <Timeline events={biographyData} locale={locale} />
                        </NextIntlClientProvider>
                    </div>

                    {/* Family Background */}
                    <div className="mb-16 pt-16 border-t border-gray-200 dark:border-gray-800">
                        <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">{t('familyTitle') || 'Family & Roots'}</h2>

                        <div className="relative flex flex-col items-center">

                            {/* Connecting Line (Vertical) */}
                            <div className="absolute top-20 bottom-20 w-px bg-gradient-to-b from-transparent via-amber-300/50 to-transparent dark:via-amber-700/50 h-full z-0"></div>

                            {/* Parents Grid - Top (Sacred/High position) */}
                            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                                {/* Father */}
                                <div className="group flex flex-col items-center">
                                    <div className="relative p-1.5 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-stone-900 shadow-xl ring-1 ring-amber-900/10 dark:ring-amber-500/20 transform hover:-translate-y-1 transition-transform duration-300">
                                        <div className="w-48 h-60 rounded-xl overflow-hidden bg-stone-200 dark:bg-stone-800">
                                            <img src={fatherImage} alt="Father" className="w-full h-full object-cover sepia-[.15]" />
                                        </div>
                                    </div>
                                    <div className="mt-4 px-4 py-1.5 rounded-full bg-white/80 dark:bg-stone-800/80 backdrop-blur-sm border border-amber-100 dark:border-amber-900/30 shadow-sm">
                                        <h3 className="text-lg font-serif font-medium text-stone-800 dark:text-stone-200 tracking-wide">{t('father')}</h3>
                                    </div>
                                </div>

                                {/* Mother */}
                                <div className="group flex flex-col items-center">
                                    <div className="relative p-1.5 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-stone-900 shadow-xl ring-1 ring-amber-900/10 dark:ring-amber-500/20 transform hover:-translate-y-1 transition-transform duration-300">
                                        <div className="w-48 h-60 rounded-xl overflow-hidden bg-stone-200 dark:bg-stone-800">
                                            <img src={motherImage} alt="Mother" className="w-full h-full object-cover sepia-[.15]" />
                                        </div>
                                    </div>
                                    <div className="mt-4 px-4 py-1.5 rounded-full bg-white/80 dark:bg-stone-800/80 backdrop-blur-sm border border-amber-100 dark:border-amber-900/30 shadow-sm">
                                        <h3 className="text-lg font-serif font-medium text-stone-800 dark:text-stone-200 tracking-wide">{t('mother')}</h3>
                                    </div>
                                </div>
                            </div>

                            {/* Dual Tribute Images - Bottom (The Act of Devotion) */}
                            {(extraImage || extraImage2) && (
                                <div className="relative z-10 mt-12 w-full max-w-4xl mx-auto">
                                    {/* Ornamental Icon/Symbol above the devotion section */}
                                    <div className="absolute left-1/2 -top-10 -translate-x-1/2 w-8 h-8 rounded-full bg-amber-50 dark:bg-stone-900 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-500 shadow-sm z-20">
                                        <span className="text-xs">✦</span>
                                    </div>

                                    <div className={`grid gap-8 ${extraImage && extraImage2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 justify-items-center'}`}>

                                        {/* Tribute Image 1 */}
                                        {extraImage && (
                                            <div className="flex flex-col items-center w-full">
                                                <div className="relative w-full p-3 bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-100 dark:border-stone-800">
                                                    <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800">
                                                        <img src={extraImage} alt={extraLabel} className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/5 rounded-xl pointer-events-none"></div>
                                                    </div>
                                                </div>
                                                <div className="mt-4 text-center">
                                                    <h3 className="text-lg font-serif text-stone-900 dark:text-white">{extraLabel}</h3>
                                                </div>
                                            </div>
                                        )}

                                        {/* Tribute Image 2 */}
                                        {extraImage2 && (
                                            <div className="flex flex-col items-center w-full">
                                                <div className="relative w-full p-3 bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-100 dark:border-stone-800">
                                                    <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800">
                                                        <img src={extraImage2} alt="Tribute 2" className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/5 rounded-xl pointer-events-none"></div>
                                                    </div>
                                                </div>
                                                <div className="mt-4 text-center">
                                                    <h3 className="text-lg font-serif text-stone-900 dark:text-white">{extraLabel2}</h3>
                                                </div>
                                            </div>
                                        )}

                                    </div>

                                    <div className="mt-8 text-center max-w-lg mx-auto">
                                        <p className="text-sm text-stone-500 dark:text-stone-400 font-serif italic">
                                            "{tributeMessage}"
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* National Heritage & Inspirations Section (Dynamic) */}
                    <HeritageSection
                        heritageItems={settings.heritage_gallery || []}
                        inspirationItems={settings.inspiration_references || []}
                        locale={locale}
                    />

                    <div className="bg-blue-50 dark:bg-gray-900 p-8 rounded-2xl border border-blue-100 dark:border-gray-800">
                        <h2 className="text-2xl font-bold mb-4">{t('personalTitle')}</h2>
                        <p className="text-gray-700 dark:text-gray-300">
                            {t('personalText')}
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
