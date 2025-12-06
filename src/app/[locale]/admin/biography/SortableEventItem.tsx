import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash, ChevronUp, ChevronDown, GripVertical, Image as ImageIcon, X, Plus, Twitter } from 'lucide-react';
import TiptapEditor from '@/components/admin/TiptapEditor';

interface TimelineEvent {
    id: string;
    year: string;
    title: { [key: string]: string };
    summary: { [key: string]: string };
    description: { [key: string]: string };
    images: string[];
    references: { title: string; url: string }[];
    socialMentions: any[];
}

interface SortableEventItemProps {
    event: TimelineEvent;
    activeLang: 'en' | 'np';
    expandedId: string | null;
    toggleExpand: (id: string) => void;
    updateEvent: (id: string, updates: Partial<TimelineEvent>) => void;
    removeEvent: (id: string) => void;
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void;
    removeImage: (id: string, url: string) => void;
    addReference: (id: string) => void;
    updateReference: (id: string, idx: number, field: 'title' | 'url', value: string) => void;
    removeReference: (id: string, idx: number) => void;
    addEventSocialMention: (id: string) => void;
    updateEventSocialMention: (id: string, mentionId: string, updates: any) => void;
    removeEventSocialMention: (id: string, mentionId: string) => void;
    detectPlatform: (url: string) => 'twitter' | 'instagram' | 'facebook' | 'youtube' | 'tiktok';
}

export function SortableEventItem({
    event,
    activeLang,
    expandedId,
    toggleExpand,
    updateEvent,
    removeEvent,
    handleImageUpload,
    removeImage,
    addReference,
    updateReference,
    removeReference,
    addEventSocialMention,
    updateEventSocialMention,
    removeEventSocialMention,
    detectPlatform
}: SortableEventItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: event.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-4 ${isDragging ? 'ring-2 ring-blue-500' : ''}`}
        >
            <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                onClick={() => toggleExpand(event.id)}
            >
                <div className="flex items-center gap-4">
                    {/* Drag Handle */}
                    <div
                        {...attributes}
                        {...listeners}
                        className="cursor-grab hover:text-blue-600 p-1 -ml-2"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <GripVertical className="h-5 w-5 text-gray-400" />
                    </div>

                    <span className="font-mono font-bold text-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded">
                        {event.year}
                    </span>
                    <h3 className="font-semibold text-lg">
                        {event.title[activeLang] || '(No Title)'}
                    </h3>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); removeEvent(event.id); }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                        <Trash className="h-4 w-4" />
                    </button>
                    {expandedId === event.id ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
            </div>

            {expandedId === event.id && (
                <div className="p-6 border-t border-gray-200 dark:border-gray-700 space-y-6 cursor-default" onClick={(e) => e.stopPropagation()}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Year</label>
                            <input
                                type="text"
                                value={event.year}
                                onChange={(e) => updateEvent(event.id, { year: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Title ({activeLang === 'en' ? 'English' : 'Nepali'})</label>
                            <input
                                type="text"
                                value={event.title[activeLang] || ''}
                                onChange={(e) => updateEvent(event.id, { title: { ...event.title, [activeLang]: e.target.value } })}
                                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
                                placeholder="Event Title"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Summary ({activeLang === 'en' ? 'English' : 'Nepali'})</label>
                        <textarea
                            value={event.summary[activeLang] || ''}
                            onChange={(e) => updateEvent(event.id, { summary: { ...event.summary, [activeLang]: e.target.value } })}
                            className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 h-20"
                            placeholder="Short description displayed in the timeline list..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Detailed Content ({activeLang === 'en' ? 'English' : 'Nepali'})</label>
                        <TiptapEditor
                            content={event.description[activeLang] || ''}
                            onChange={(html) => updateEvent(event.id, { description: { ...event.description, [activeLang]: html } })}
                        />
                        <p className="text-xs text-gray-500 mt-1">This content appears when 'Read More' is clicked.</p>
                    </div>

                    <div className="space-y-3">
                        <label className="block text-sm font-medium">Images</label>
                        <div className="flex flex-wrap gap-4">
                            {event.images.map((img, idx) => (
                                <div key={idx} className="relative group w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                                    <img src={img} className="w-full h-full object-cover" />
                                    <button
                                        onClick={() => removeImage(event.id, img)}
                                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                            <div className="w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer relative">
                                <ImageIcon className="h-6 w-6 text-gray-400" />
                                <span className="text-xs text-gray-400 mt-1">Upload</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, event.id)}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="block text-sm font-medium">References ({event.references.length})</label>
                            <button onClick={() => addReference(event.id)} className="text-xs flex items-center gap-1 text-blue-600 hover:underline">
                                <Plus className="h-3 w-3" /> Add Ref
                            </button>
                        </div>
                        <div className="space-y-2">
                            {event.references.map((ref, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={ref.title}
                                        onChange={(e) => updateReference(event.id, idx, 'title', e.target.value)}
                                        className="flex-1 px-2 py-1 border rounded text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
                                        placeholder="Source Title"
                                    />
                                    <input
                                        type="url"
                                        value={ref.url}
                                        onChange={(e) => updateReference(event.id, idx, 'url', e.target.value)}
                                        className="flex-1 px-2 py-1 border rounded text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
                                        placeholder="https://..."
                                    />
                                    <button onClick={() => removeReference(event.id, idx)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                                        <Trash className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                            {event.references.length === 0 && <p className="text-xs text-gray-400 italic">No references added.</p>}
                        </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                            <label className="block text-sm font-medium flex items-center gap-2">
                                <Twitter className="h-3 w-3 text-blue-400" />
                                Social Mentions ({(event.socialMentions || []).length})
                            </label>
                            <button onClick={() => addEventSocialMention(event.id)} className="text-xs flex items-center gap-1 text-blue-600 hover:underline">
                                <Plus className="h-3 w-3" /> Add Post
                            </button>
                        </div>
                        <div className="space-y-2">
                            {(event.socialMentions || []).map((mention) => (
                                <div key={mention.id} className="flex flex-col md:flex-row gap-2 items-start md:items-center bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg">
                                    <select
                                        value={mention.platform}
                                        onChange={(e) => updateEventSocialMention(event.id, mention.id, { platform: e.target.value as any })}
                                        className="p-1 border rounded-md text-xs bg-white dark:bg-gray-900 dark:border-gray-700"
                                    >
                                        <option value="twitter">Twitter</option>
                                        <option value="instagram">Instagram</option>
                                        <option value="facebook">Facebook</option>
                                        <option value="youtube">YouTube</option>
                                        <option value="tiktok">TikTok</option>
                                    </select>
                                    <input
                                        type="url"
                                        value={mention.url}
                                        onChange={(e) => {
                                            const newUrl = e.target.value;
                                            updateEventSocialMention(event.id, mention.id, {
                                                url: newUrl,
                                                platform: detectPlatform(newUrl)
                                            });
                                        }}
                                        className="flex-1 px-2 py-1 border rounded text-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
                                        placeholder="Paste Social URL..."
                                    />
                                    <button onClick={() => removeEventSocialMention(event.id, mention.id)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                                        <Trash className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                            {(event.socialMentions || []).length === 0 && <p className="text-xs text-gray-400 italic">No social mentions added for this event.</p>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
