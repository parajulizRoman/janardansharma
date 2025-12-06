'use client';

import { Link, usePathname, useRouter } from '@/navigation';
import { Menu, Globe } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

export function Header() {
    const t = useTranslations('Navigation');
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const toggleLanguage = () => {
        const nextLocale = locale === 'en' ? 'np' : 'en';
        router.replace(pathname, { locale: nextLocale });
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/10 backdrop-blur-md dark:border-gray-800 border-white/20">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white">
                    <span>{locale === 'en' ? 'Janardan Sharma' : 'जनार्दन शर्मा'}</span>
                </Link>
                <div className="flex items-center gap-6">
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-white/90">
                        <Link href="/about" className="hover:text-white transition-colors">{t('biography')}</Link>
                        <Link href="/vision" className="hover:text-white transition-colors">{t('vision')}</Link>
                        {/* <Link href="/news" className="hover:text-white transition-colors">News</Link> */}
                        {/* <Link href="/events" className="hover:text-white transition-colors">Events</Link> */}
                        <Link href="/media" className="hover:text-white transition-colors">{t('media')}</Link>
                        <Link href="/press" className="hover:text-white transition-colors">{t('press')}</Link>
                        <Link href="/contact" className="hover:text-white transition-colors">{t('contact')}</Link>
                        <Link href="/admin" className="hover:text-white transition-colors">{t('admin')}</Link>
                    </nav>

                    <button
                        onClick={toggleLanguage}
                        className="flex items-center gap-1 text-xs font-bold bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-full transition-colors"
                    >
                        <Globe className="h-3 w-3" />
                        {locale === 'en' ? 'NEP' : 'ENG'}
                    </button>

                    <button className="md:hidden p-2 text-white">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle menu</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
