import Link from 'next/link';

export function Footer() {
    return (
        <footer className="w-full border-t border-gray-200 bg-gray-50 py-12 dark:border-gray-800 dark:bg-gray-950">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold">Janardan Sharma</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Dedicated to the development and prosperity of Nepal.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold uppercase tracking-wider">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/about" className="hover:underline">Biography</Link></li>
                            <li><Link href="/vision" className="hover:underline">Vision & Policies</Link></li>
                            <li><Link href="/news" className="hover:underline">Press Releases</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold uppercase tracking-wider">Connect</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="https://facebook.com/janardansharmapravakar" target="_blank" className="hover:underline">Facebook</Link></li>
                            <li><Link href="https://twitter.com/JanardanSharma" target="_blank" className="hover:underline">Twitter</Link></li>
                            <li><Link href="/contact" className="hover:underline">Contact Office</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold uppercase tracking-wider">Newsletter</h4>
                        <form className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                            />
                            <button
                                type="submit"
                                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
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
