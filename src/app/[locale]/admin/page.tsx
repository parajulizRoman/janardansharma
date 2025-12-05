'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { FileText, Image as ImageIcon, Plus } from 'lucide-react';

export default function AdminDashboard() {
    const { user } = useAuth();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Logged in as {user?.email}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Quick Action: New Post */}
                <Link href="/admin/posts/new" className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow group">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <Plus className="h-6 w-6" />
                        </div>
                        <h3 className="font-bold text-lg">New Post</h3>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Write a news article, press release, or statement.</p>
                </Link>

                {/* Quick Action: Manage Media */}
                <Link href="/admin/media" className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow group">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
                            <ImageIcon className="h-6 w-6" />
                        </div>
                        <h3 className="font-bold text-lg">Manage Media</h3>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Add photos or videos to the gallery.</p>
                </Link>

                {/* Quick Action: View Site */}
                <a href="/" target="_blank" className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow group">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg group-hover:bg-green-600 group-hover:text-white transition-colors">
                            <FileText className="h-6 w-6" />
                        </div>
                        <h3 className="font-bold text-lg">View Site</h3>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Visit the public facing website.</p>
                </a>
            </div>
        </div>
    );
}
