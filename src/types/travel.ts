export interface GalleryImage {
  id: string;
  url: string;
  title: string;
  category?: string;
  caption?: string;
  description?: string;
  type: 'photo' | 'ai'; // 'photo' for actual verified photograph, 'ai' for AI-generated illustrative image
  author?: string;
  authorUrl?: string;
  license?: string;
  licenseUrl?: string;
  sourceUrl?: string;
}

export interface Destination {
  id: string;
  name: string;
  distanceFromIndore: string; // Exact user-supplied label
  modalDistanceLabel?: string;
  day: string; // "Day 1" or "Day 2"
  tagline?: string;
  shortDesc: string;
  thumbnail: string;
  mapX: number; // Percentage on geographic mini map
  mapY: number; // Percentage on geographic mini map
  highlights?: string[];
  gallery?: GalleryImage[];
}

export type NavTabId = 'home' | 'our-trip' | 'destinations' | 'itinerary' | 'about-us' | 'contact';
