import type { Photo } from "../../types/photo";

export type BookingFormState = {
  name: string;
  email: string;
  phone: string;
  date: string;
  time_slot: string;
  package: string;
  message: string;
};

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
};

export type IntroItem = {
  title: string;
  description: string;
};

export type HeroStat = {
  value: string;
  label: string;
};

export type GalleryState = {
  photos: Photo[];
  galleryLoading: boolean;
  galleryError: string | null;
};
