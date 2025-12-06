'use client';

import { useState, useEffect } from 'react';
import { getSiteSettings, updateSiteSetting } from '@/app/actions';
import { supabase } from '@/lib/supabase';
import { Loader2, Plus, Save, ArrowUp, ArrowDown, RotateCcw, Clock, Landmark, Users } from 'lucide-react';
import { HeritageManager, HeritageItem, InspirationItem } from './HeritageManager';
import { FamilyManager } from './FamilyManager';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableEventItem } from './SortableEventItem';

interface TimelineEvent {
    id: string;
    year: string;
    title: { [key: string]: string };
    summary: { [key: string]: string };
    description: { [key: string]: string };
    images: string[];
    references: { title: string; url: string }[];
    socialMentions: SocialMention[];
}

interface SocialMention {
    id: string;
    platform: 'twitter' | 'instagram' | 'facebook' | 'youtube' | 'tiktok';
    url: string;
}

const DEFAULT_EVENTS: TimelineEvent[] = [
    {
        id: '2025-12-06',
        year: "December 6, 2025 (Present)",
        title: { en: "Leadership in Pragatisheel Loktantrik Party", np: "" },
        summary: { en: "Selected to the presidential council of the newly formed party.", np: "" },
        description: { en: "At 62, serves on the presidential council of the new party from Kathmandu. Continues advocating for anti-corruption, social equity, and progressive reforms, positioning the party as a fresh alternative ahead of 2027 elections. Active in public discourse on Nepal's political transformation.", np: "" },
        images: [],
        references: [],
        socialMentions: []
    },
    {
        id: '2025-11-23',
        year: "November 23, 2025",
        title: { en: "Formation of Pragatisheel Loktantrik Party", np: "" },
        summary: { en: "Merged Progressive Campaign Nepal with other progressive forces to form a new party.", np: "" },
        description: { en: "Merged Progressive Campaign Nepal with groups led by Baburam Bhattarai (Nepal Samajwadi Party - Naya Shakti) and Santosh Pariyar (ex-Rastriya Swatantra Party). Announced as Progressive Democratic Party with a five-member presidential council (including Sharma, Pariyar, Durga Sob). Bhattarai as patron. Aims to unite progressive, patriotic, and socialist forces under a non-communist banner.", np: "" },
        images: [],
        references: [],
        socialMentions: []
    },
    {
        id: '2025-11-04',
        year: "November 4, 2025",
        title: { en: "Launch of Progressive Campaign Nepal", np: "" },
        summary: { en: "Broke from CPN (Maoist Centre) to launch a reformist platform.", np: "" },
        description: { en: "Broke from CPN (Maoist Centre), ending long ties with Prachanda. Launched reformist platform with allies like Ram Karki, focusing on governance, democracy, and People's War legacy.", np: "" },
        images: [],
        references: [],
        socialMentions: []
    },
    {
        id: '2025-01',
        year: "2025 (Jan–Oct)",
        title: { en: "Growing Rift and Alliances", np: "" },
        summary: { en: "Demanded electoral processes and opposed unification with CPN (Unified Socialist).", np: "" },
        description: { en: "Demanded electoral processes for party roles (Jan 7). Opposed unification with CPN (Unified Socialist) in April, boycotting meetings. Formed ties with leaders like Ghanshyam Bhusal and Netra Bikram Chand 'Biplav'. Faced disciplinary threats by August.", np: "" },
        images: [],
        references: [],
        socialMentions: []
    },
    {
        id: '2024',
        year: "2024",
        title: { en: "Party Dissent and Advocacy", np: "" },
        summary: { en: "Voiced concerns on leadership delays as Deputy General Secretary.", np: "" },
        description: { en: "As Deputy General Secretary, voiced concerns on leadership delays and pushed for direct elections and democratic reforms at party conventions. Faced isolation in Karnali but allied with reformists.", np: "" },
        images: [],
        references: [],
        socialMentions: []
    },
    {
        id: '2022-2023',
        year: "2022–2023",
        title: { en: "Parliamentary and Party Activities", np: "" },
        summary: { en: "Championed socialism-oriented economy and anti-corruption initiatives.", np: "" },
        description: { en: "As MP and Joint General Secretary, championed socialism-oriented economy and anti-corruption initiatives.", np: "" },
        images: [],
        references: [],
        socialMentions: []
    },
    {
        id: 'finance-minister-term1',
        year: "2021–2022",
        title: { en: "Minister of Finance (First Term)", np: "" },
        summary: { en: "Focused on economic recovery, pro-poor grants, and EV incentives.", np: "" },
        description: { en: "Appointed July 13, 2021, under PM Deuba. Presented revised FY 2021-22 budget focusing on post-COVID recovery, pro-poor grants, EV incentives, and youth entrepreneurship. Resigned July 6, 2022, over allegations (later cleared). Reappointed July 31–December 26, 2022, emphasizing fiscal prudence and hydro exports.", np: "" },
        images: [],
        references: [],
        socialMentions: []
    },
    {
        id: '2021',
        year: "2021",
        title: { en: "Return to CPN (Maoist Centre)", np: "" },
        summary: { en: "Rejoined as Joint General Secretary after NCP dissolution.", np: "" },
        description: { en: "After NCP dissolution, rejoined as Joint General Secretary. Elected MP from Rukum-2.", np: "" },
        images: [],
        references: [],
        socialMentions: []
    },
    {
        id: '2018-2021',
        year: "2018–2021",
        title: { en: "Nepal Communist Party (NCP) Period", np: "" },
        summary: { en: "Shaped policies on federalism and economic reforms.", np: "" },
        description: { en: "Part of the merged NCP (Maoist Centre–UML). As Standing Committee member, shaped policies on federalism and economic reforms.", np: "" },
        images: [],
        references: [],
        socialMentions: []
    },
    {
        id: '2017-election',
        year: "2017",
        title: { en: "Third Election to Parliament", np: "" },
        summary: { en: "Secured a rare third consecutive win from Western Rukum-1.", np: "" },
        description: { en: "Secured third consecutive win from Western Rukum-1, a rare feat in his party, strengthening his Karnali base.", np: "" },
        images: [],
        references: [],
        socialMentions: []
    },
    {
        id: 'home-affairs',
        year: "2017",
        title: { en: "Minister of Home Affairs", np: "" },
        summary: { en: "Oversaw internal security and disaster management.", np: "" },
        description: { en: "Briefly served (June 7, 2017–2018) under PM Sher Bahadur Deuba, overseeing internal security and disaster management during political shifts.", np: "" },
        images: [],
        references: [],
        socialMentions: []
    },
    {
        id: 'energy-minister',
        year: "2016–2017",
        title: { en: "Minister of Energy, Water Resources and Irrigation", np: "" },
        summary: { en: "Launched 'Ujyalo Nepal' campaign, ending chronic load-shedding.", np: "" },
        description: { en: "Appointed August 14, 2016, under PM Pushpa Kamal Dahal. Launched 'Ujyalo Nepal' campaign, ending chronic load-shedding through hydropower optimization, anti-theft measures, and India power agreements. Appointed Kulman Ghising as NEA head, revolutionizing Nepal's energy sector. Tenure ended May 31, 2017.", np: "" },
        images: [],
        references: [],
        socialMentions: []
    },
    {
        id: '2013-election',
        year: "2013",
        title: { en: "Re-election to Parliament", np: "" },
        summary: { en: "Won a second term from Western Rukum-1.", np: "" },
        description: { en: "Won a second term from Western Rukum-1, advancing bills on infrastructure, poverty reduction, and federalism.", np: "" },
        images: [],
        references: [],
        socialMentions: []
    },
    {
        id: 'peace-minister',
        year: "2009–2011",
        title: { en: "Minister of Peace and Reconstruction", np: "" },
        summary: { en: "Led ex-combatant rehabilitation and post-conflict recovery.", np: "" },
        description: { en: "Served in coalition governments under PMs Madhav Kumar Nepal and Baburam Bhattarai. Led ex-combatant rehabilitation, reintegration, and post-conflict recovery efforts, promoting inclusive policies.", np: "" },
        images: [],
        references: [],
        socialMentions: []
    },
    {
        id: '2008-election',
        year: "2008",
        title: { en: "First Election to Parliament", np: "" },
        summary: { en: "Elected as MP from Western Rukum-1 on a CPN (Maoist) ticket.", np: "" },
        description: { en: "Elected as Member of Parliament (MP) from Western Rukum-1 on a CPN (Maoist) ticket, entering formal governance and serving on peace and reconstruction committees.", np: "" },
        images: [],
        references: [],
        socialMentions: []
    },
    {
        id: '2006-peace',
        year: "2006",
        title: { en: "Comprehensive Peace Accord", np: "" },
        summary: { en: "Contributed significantly to peace talks, helping end the civil war.", np: "" },
        description: { en: "Contributed significantly to peace talks, helping end the 10-year civil war. Transitioned from armed struggle to mainstream politics as Maoists integrated into democracy.", np: "" },
        images: [],
        references: [],
        socialMentions: []
    },
    {
        id: '1996-war',
        year: "1996",
        title: { en: "Start of People's War", np: "" },
        summary: { en: "Rose as a deputy commander of the People's Liberation Army (PLA).", np: "" },
        description: { en: "As the Maoist insurgency began, Sharma rose as one of four deputy commanders of the People's Liberation Army (PLA), leading operations in western Nepal with emphasis on guerrilla strategies and mass mobilization.", np: "" },
        images: [],
        references: [],
        socialMentions: []
    },
    {
        id: '1980s',
        year: "1980s–1990s",
        title: { en: "Entry into Politics and Maoist Movement", np: "" },
        summary: { en: "Joined the Communist Party of Nepal (Maoist) in its early stages.", np: "" },
        description: { en: "Joined the Communist Party of Nepal (Maoist) in its early stages. Became a prominent organizer in the Karnali region, advocating for land reforms and against feudal systems.", np: "" },
        images: [],
        references: [],
        socialMentions: []
    },
    {
        id: '1',
        year: "1963",
        title: { en: "Birth", np: "" },
        summary: { en: "Born on April 25 in Rukum District, western Nepal.", np: "" },
        description: { en: "Born on April 25 in Rukum District, western Nepal, into a rural family. His upbringing in the Karnali region influenced his focus on social justice and regional development.", np: "" },
        images: [],
        references: [],
        socialMentions: []
    }
];

export default function BiographyManager() {
    const [activeTab, setActiveTab] = useState<'timeline' | 'heritage' | 'family'>('timeline');

    // Timeline State
    const [events, setEvents] = useState<TimelineEvent[]>([]);

    // Heritage State
    const [heritageItems, setHeritageItems] = useState<HeritageItem[]>([]);
    const [inspirationItems, setInspirationItems] = useState<InspirationItem[]>([]);

    // Family State
    const [fatherImage, setFatherImage] = useState('');
    const [motherImage, setMotherImage] = useState('');
    const [familyExtraImage, setFamilyExtraImage] = useState('');
    const [familyExtraImage2, setFamilyExtraImage2] = useState('');
    const [familyExtraLabel, setFamilyExtraLabel] = useState('');
    const [familyExtraLabel2, setFamilyExtraLabel2] = useState('');
    const [familyTributeMessage, setFamilyTributeMessage] = useState('');

    // Common State
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [activeLang, setActiveLang] = useState<'en' | 'np'>('en');

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const settings = await getSiteSettings();

        // Load Timeline
        if (settings.biography_data && Array.isArray(settings.biography_data) && settings.biography_data.length > 0) {
            setEvents(settings.biography_data);
        } else {
            setEvents(DEFAULT_EVENTS);
        }

        // Load Heritage
        if (settings.heritage_gallery) setHeritageItems(settings.heritage_gallery);
        if (settings.inspiration_references) setInspirationItems(settings.inspiration_references);

        // Load Family
        if (settings.father_image) setFatherImage(settings.father_image);
        if (settings.mother_image) setMotherImage(settings.mother_image);
        if (settings.family_extra_image) setFamilyExtraImage(settings.family_extra_image);
        if (settings.family_extra_image_2) setFamilyExtraImage2(settings.family_extra_image_2);
        if (settings.family_extra_label) setFamilyExtraLabel(settings.family_extra_label);
        if (settings.family_extra_label_2) setFamilyExtraLabel2(settings.family_extra_label_2);
        if (settings.family_tribute_message) setFamilyTributeMessage(settings.family_tribute_message);

        setLoading(false);
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage('');

        const updates = [
            updateSiteSetting('biography_data', events),
            updateSiteSetting('heritage_gallery', heritageItems),
            updateSiteSetting('inspiration_references', inspirationItems),
            updateSiteSetting('father_image', fatherImage),
            updateSiteSetting('mother_image', motherImage),
            updateSiteSetting('family_extra_image', familyExtraImage),
            updateSiteSetting('family_extra_image_2', familyExtraImage2),
            updateSiteSetting('family_extra_label', familyExtraLabel),
            updateSiteSetting('family_extra_label_2', familyExtraLabel2),
            updateSiteSetting('family_tribute_message', familyTributeMessage),
        ];

        const results = await Promise.all(updates);
        const errors = results.filter(r => r.error).map(r => r.error);

        setSaving(false);

        if (errors.length > 0) {
            setMessage(`Error: ${errors.join(', ')}`);
        } else {
            setMessage('All changes saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const resetToDefaults = () => {
        if (confirm('This will replace all current events with the system defaults. Any unsaved changes will be lost. Continue?')) {
            setEvents(DEFAULT_EVENTS);
            setMessage('Defaults loaded. Click "Save Changes" to persist.');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setEvents((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id);
                const newIndex = items.findIndex((i) => i.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const sortEvents = (direction: 'asc' | 'desc') => {
        const sorted = [...events].sort((a, b) => {
            const yearA = parseInt(a.year) || 0;
            const yearB = parseInt(b.year) || 0;
            return direction === 'asc' ? yearA - yearB : yearB - yearA;
        });
        setEvents(sorted);
    };

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const addEvent = () => {
        const newEvent: TimelineEvent = {
            id: Date.now().toString(),
            year: new Date().getFullYear().toString(),
            title: { en: '', np: '' },
            summary: { en: '', np: '' },
            description: { en: '', np: '' },
            images: [],
            references: [],
            socialMentions: []
        };
        setEvents(prev => [newEvent, ...prev]);
        setExpandedId(newEvent.id);
    };

    const removeEvent = (id: string) => {
        if (confirm('Are you sure you want to delete this event?')) {
            setEvents(prev => prev.filter(e => e.id !== id));
        }
    };

    const updateEvent = (id: string, updates: Partial<TimelineEvent>) => {
        setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    };

    // Helper functions for SortableEventItem
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, eventId: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `bio_${eventId}_${Date.now()}.${fileExt}`;
            const filePath = `uploads/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('media')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('media')
                .getPublicUrl(filePath);

            const event = events.find(ev => ev.id === eventId);
            if (event) {
                const newImages = [...event.images, data.publicUrl];
                updateEvent(eventId, { images: newImages });
            }

        } catch (error: any) {
            alert('Upload failed: ' + error.message);
        }
    };

    const removeImage = (eventId: string, imgUrl: string) => {
        const event = events.find(ev => ev.id === eventId);
        if (event) {
            updateEvent(eventId, { images: event.images.filter(url => url !== imgUrl) });
        }
    };

    const addReference = (eventId: string) => {
        const event = events.find(ev => ev.id === eventId);
        if (event) {
            updateEvent(eventId, { references: [...event.references, { title: 'Reference', url: '' }] });
        }
    };

    const updateReference = (eventId: string, refIdx: number, field: 'title' | 'url', value: string) => {
        const event = events.find(ev => ev.id === eventId);
        if (event) {
            const newRefs = [...event.references];
            newRefs[refIdx] = { ...newRefs[refIdx], [field]: value };
            updateEvent(eventId, { references: newRefs });
        }
    };

    const removeReference = (eventId: string, refIdx: number) => {
        const event = events.find(ev => ev.id === eventId);
        if (event) {
            updateEvent(eventId, { references: event.references.filter((_, i) => i !== refIdx) });
        }
    };

    const detectPlatform = (url: string): 'twitter' | 'instagram' | 'facebook' | 'youtube' | 'tiktok' => {
        if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter';
        if (url.includes('instagram.com')) return 'instagram';
        if (url.includes('facebook.com')) return 'facebook';
        if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
        if (url.includes('tiktok.com')) return 'tiktok';
        return 'twitter';
    };

    const addEventSocialMention = (eventId: string) => {
        const event = events.find(ev => ev.id === eventId);
        if (event) {
            const newMentions = [...(event.socialMentions || []), { id: Date.now().toString(), platform: 'twitter' as const, url: '' }];
            updateEvent(eventId, { socialMentions: newMentions });
        }
    };

    const updateEventSocialMention = (eventId: string, mentionId: string, updates: Partial<SocialMention>) => {
        const event = events.find(ev => ev.id === eventId);
        if (event && event.socialMentions) {
            const newMentions = event.socialMentions.map(m => m.id === mentionId ? { ...m, ...updates } : m);
            updateEvent(eventId, { socialMentions: newMentions });
        }
    };

    const removeEventSocialMention = (eventId: string, mentionId: string) => {
        const event = events.find(ev => ev.id === eventId);
        if (event && event.socialMentions) {
            const newMentions = event.socialMentions.filter(m => m.id !== mentionId);
            updateEvent(eventId, { socialMentions: newMentions });
        }
    };

    if (loading) return <div className="p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="max-w-5xl mx-auto pb-20">
            {/* Page Header with Save Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Biography Data Manager</h1>
                    <p className="text-gray-500">Manage timeline, family details, and heritage gallery.</p>
                </div>
                <div className="flex items-center gap-4">
                    {message && <span className="text-green-600 font-medium animate-fade-in">{message}</span>}

                    {activeTab === 'timeline' && (
                        <button
                            onClick={resetToDefaults}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-700"
                            title="Load default system events"
                        >
                            <RotateCcw className="h-4 w-4" />
                            Reset
                        </button>
                    )}

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 shadow-sm"
                    >
                        {saving ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
                        Save All Changes
                    </button>
                </div>
            </div>

            {/* TAB NAVIGATION */}
            <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-8 w-fit overflow-x-auto">
                <button
                    onClick={() => setActiveTab('timeline')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${activeTab === 'timeline' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/50'}`}
                >
                    <Clock className="h-4 w-4" />
                    Timeline Events
                </button>
                <button
                    onClick={() => setActiveTab('family')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${activeTab === 'family' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/50'}`}
                >
                    <Users className="h-4 w-4" />
                    Family Background
                </button>
                <button
                    onClick={() => setActiveTab('heritage')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${activeTab === 'heritage' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/50'}`}
                >
                    <Landmark className="h-4 w-4" />
                    Heritage & Inspirations
                </button>
            </div>

            {/* TIMELINE TAB CONTENT */}
            {activeTab === 'timeline' && (
                <>
                    {/* Language & Sorting Controls */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6 sticky top-0 z-20 flex flex-wrap gap-4 justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-500">Editing Language:</span>
                            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                                <button
                                    onClick={() => setActiveLang('en')}
                                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeLang === 'en' ? 'bg-white dark:bg-gray-600 shadow text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
                                >
                                    English
                                </button>
                                <button
                                    onClick={() => setActiveLang('np')}
                                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeLang === 'np' ? 'bg-white dark:bg-gray-600 shadow text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
                                >
                                    Nepali
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-500">Sort:</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => sortEvents('asc')}
                                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <ArrowUp className="h-3 w-3" /> Oldest
                                </button>
                                <button
                                    onClick={() => sortEvents('desc')}
                                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <ArrowDown className="h-3 w-3" /> Newest
                                </button>
                            </div>
                        </div>
                    </div>

                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={events.map(e => e.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-4">
                                {events.map((event) => (
                                    <SortableEventItem
                                        key={event.id}
                                        event={event}
                                        activeLang={activeLang}
                                        expandedId={expandedId}
                                        toggleExpand={toggleExpand}
                                        updateEvent={updateEvent}
                                        removeEvent={removeEvent}
                                        handleImageUpload={handleImageUpload}
                                        removeImage={removeImage}
                                        addReference={addReference}
                                        updateReference={updateReference}
                                        removeReference={removeReference}
                                        addEventSocialMention={addEventSocialMention}
                                        updateEventSocialMention={updateEventSocialMention}
                                        removeEventSocialMention={removeEventSocialMention}
                                        detectPlatform={detectPlatform}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>

                    <button
                        onClick={addEvent}
                        className="mt-8 w-full py-4 border-2 border-dashed border-blue-200 dark:border-blue-900 rounded-xl flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors font-medium"
                    >
                        <Plus className="h-5 w-5" />
                        Add New Timeline Event
                    </button>
                </>
            )}

            {/* FAMILY TAB CONTENT */}
            {activeTab === 'family' && (
                <FamilyManager
                    fatherImage={fatherImage}
                    setFatherImage={setFatherImage}
                    motherImage={motherImage}
                    setMotherImage={setMotherImage}
                    familyExtraImage={familyExtraImage}
                    setFamilyExtraImage={setFamilyExtraImage}
                    familyExtraImage2={familyExtraImage2}
                    setFamilyExtraImage2={setFamilyExtraImage2}
                    familyExtraLabel={familyExtraLabel}
                    setFamilyExtraLabel={setFamilyExtraLabel}
                    familyExtraLabel2={familyExtraLabel2}
                    setFamilyExtraLabel2={setFamilyExtraLabel2}
                    familyTributeMessage={familyTributeMessage}
                    setFamilyTributeMessage={setFamilyTributeMessage}
                />
            )}

            {/* HERITAGE TAB CONTENT */}
            {activeTab === 'heritage' && (
                <HeritageManager
                    heritageItems={heritageItems}
                    inspirationItems={inspirationItems}
                    setHeritageItems={setHeritageItems}
                    setInspirationItems={setInspirationItems}
                />
            )}

        </div>
    );
}
