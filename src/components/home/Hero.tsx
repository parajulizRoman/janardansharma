import { Link } from '@/navigation';
import { getTranslations } from 'next-intl/server';
import { getSiteSettings } from '@/app/actions';

export async function Hero() {
    const t = await getTranslations('Hero');
    const settings = await getSiteSettings();

    return (
        <section className="relative w-full overflow-hidden">
            {/* Background Gradient is global now */}

            {/* Content */}
            <div className="container relative z-10 mx-auto px-4 py-20 md:py-28 lg:py-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left Column: Text */}
                    <div className="flex flex-col items-start gap-6">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white drop-shadow-sm">
                            {t('title')}
                        </h1>
                        <p className="text-lg md:text-xl text-white/90 leading-relaxed font-light">
                            {t('description')}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
                            <Link
                                href="/vision"
                                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-blue-900/20 hover:bg-blue-700 transition-all hover:scale-105"
                            >
                                {t('readVision')}
                            </Link>
                            <Link
                                href="/about"
                                className="inline-flex items-center justify-center rounded-md border border-white/30 bg-white/10 px-8 py-3 text-base font-semibold text-white hover:bg-white/20 transition-all backdrop-blur-sm"
                            >
                                {t('biography')}
                            </Link>
                        </div>
                    </div>

                    {/* Right Column: Hero Image */}
                    {settings?.hero_image && (
                        <div className="relative w-full aspect-[4/5] lg:aspect-square max-w-lg mx-auto lg:max-w-none lg:ml-auto">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-2xl md:rounded-[2rem] transform rotate-3 scale-105 blur-xl"></div>
                            <img
                                src={settings.hero_image}
                                alt="Janardan Sharma"
                                className="relative w-full h-full object-cover rounded-2xl md:rounded-[2rem] shadow-2xl ring-1 ring-white/20"
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
