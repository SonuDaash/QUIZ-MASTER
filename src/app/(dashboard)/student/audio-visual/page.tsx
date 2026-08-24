'use client';

import { useState } from 'react';
import {
  Image,
  Flag,
  User,
  MapPin,
  Music,
  Microscope,
  Shapes,
  Volume2,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

const AV_CATEGORIES = [
  { id: 'personality', name: 'Identify Personality', icon: User, count: 120, color: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300' },
  { id: 'place', name: 'Identify Place', icon: MapPin, count: 95, color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' },
  { id: 'flag', name: 'Identify Flag', icon: Flag, count: 195, color: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300' },
  { id: 'logo', name: 'Identify Logo', icon: Shapes, count: 80, color: 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300' },
  { id: 'map', name: 'Identify Map', icon: MapPin, count: 60, color: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300' },
  { id: 'object', name: 'Identify Object', icon: Image, count: 75, color: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300' },
  { id: 'scientific', name: 'Scientific Image', icon: Microscope, count: 110, color: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' },
  { id: 'sound', name: 'Identify Sound', icon: Volume2, count: 45, color: 'bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300' },
  { id: 'music', name: 'Identify Music', icon: Music, count: 30, color: 'bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300' },
];

export default function AudioVisualPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  if (selectedCategory) {
    const category = AV_CATEGORIES.find(c => c.id === selectedCategory);
    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedCategory(null)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Audio Visual
        </button>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{category?.name}</h1>
          <p className="text-muted-foreground mt-1">{category?.count} questions available</p>
        </div>

        {/* Demo AV Question */}
        <div className="max-w-2xl mx-auto mt-8">
          <div className="bg-card rounded-xl border p-8 text-center space-y-6">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Question 1 / {category?.count}
            </p>

            {/* Placeholder media area */}
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center space-y-2">
                {category && <category.icon className="h-16 w-16 mx-auto text-muted-foreground/40" />}
                <p className="text-sm text-muted-foreground">
                  Media content will appear here
                </p>
                <p className="text-xs text-muted-foreground/60">
                  Upload images, audio, or video to questions
                </p>
              </div>
            </div>

            <h2 className="text-xl font-semibold">
              Identify what is shown in the image above.
            </h2>

            <input
              type="text"
              placeholder="Type your answer..."
              className="w-full px-4 py-3 rounded-lg border bg-background text-center text-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />

            <div className="flex gap-3 justify-center">
              <button className="px-6 py-2.5 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors text-sm font-medium">
                Skip
              </button>
              <button className="px-8 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
                Submit Answer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Audio Visual Practice</h1>
        <p className="text-muted-foreground mt-1">
          Practice identifying images, sounds, flags, maps, and more
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {AV_CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className="bg-card rounded-xl border p-6 text-left hover:border-primary/30 hover:shadow-sm transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-lg ${category.color}`}>
                <category.icon className="h-5 w-5" />
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                {category.count} questions
              </span>
            </div>
            <h3 className="font-semibold mt-4 group-hover:text-primary transition-colors">
              {category.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Practice identifying with images and audio
            </p>
          </button>
        ))}
      </div>

      <div className="bg-muted/50 rounded-xl p-6 border border-dashed">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-amber-100 dark:bg-amber-950 rounded-lg">
            <Image className="h-5 w-5 text-amber-700 dark:text-amber-300" />
          </div>
          <div>
            <h3 className="font-medium">Media Content Required</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Audio-visual questions require media attachments (images, audio, video).
              Ask your coordinator to upload media content through the admin panel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
