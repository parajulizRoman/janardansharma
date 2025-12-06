import Link from 'next/link';

export function Footer() {
    return (
        <footer className="w-full border-t border-gray-200 bg-gray-50 py-12 dark:border-gray-800 dark:bg-gray-950 text-gray-900 dark:text-gray-200">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Janardan Sharma</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Dedicated to the development and prosperity of Nepal.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <li><Link href="/about" className="hover:text-blue-600 hover:underline transition-colors">Biography</Link></li>
                            <li><Link href="/vision" className="hover:text-blue-600 hover:underline transition-colors">Vision & Policies</Link></li>
                            <li><Link href="/news" className="hover:text-blue-600 hover:underline transition-colors">Press Releases</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">Connect</h4>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <li><Link href="https://facebook.com/janardansharmapravakar" target="_blank" className="hover:text-blue-600 hover:underline transition-colors">Facebook</Link></li>
                            <li><Link href="https://twitter.com/JanardanSharma" target="_blank" className="hover:text-blue-600 hover:underline transition-colors">Twitter</Link></li>
                            <li><Link href="/contact" className="hover:text-blue-600 hover:underline transition-colors">Contact Office</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">Newsletter</h4>
                        <form className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                            />
                            <button
                                type="submit"
                                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
                <div className="mt-12 border-t border-gray-200 pt-8 text-center text-sm text-gray-500 dark:border-gray-800">
                    © {new Date().getFullYear()} Janardan Sharma Pravakar. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
