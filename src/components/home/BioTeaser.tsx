import { Link } from '@/navigation';
import { ArrowRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { getSiteSettings } from '@/app/actions';
import { BioCarousel } from './BioCarousel';

export async function BioTeaser() {
    const t = await getTranslations('BioTeaser');
    const settings = await getSiteSettings();
    const galleryImages = settings.bio_gallery && Array.isArray(settings.bio_gallery) ? settings.bio_gallery : [];

    return (
        <section className="py-16 md:py-24" style={{ background: 'linear-gradient(90deg, #FF0F7B, #F89B29)' }}>
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white text-shadow-sm">{t('title')}</h2>
                        <div className="space-y-4 text-lg text-white/95 font-medium">
                            <p>
                                {t('p1')}
                            </p>
                            <p>
                                {t('p2')}
                            </p>
                        </div>
                        <div className="mt-8">
                            <Link href="/about" className="inline-flex items-center gap-2 text-white font-bold hover:text-white/80 hover:underline">
                                {t('readMore')} <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                    <div className="order-1 md:order-2 flex justify-center">
                        <BioCarousel images={galleryImages} />
                    </div>
                </div>
            </div>
        </section>
    );
}
