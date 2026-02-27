import type {
  BookingFormState,
  HeroStat,
  IntroItem,
  Testimonial,
} from "../types";
import type { Photo } from "../../../types/photo";

export const studioWhatsappNumber =
  import.meta.env.VITE_WHATSAPP_NUMBER ?? "8600617543";

export const testimonials: Testimonial[] = [
  {
    quote:
      "They turned a standard portrait booking into a complete brand refresh. Direction was precise and the final edits felt premium.",
    author: "Ava Brooks",
    role: "Founder, Northline Studio",
  },
  {
    quote:
      "The team handled our engagement shoot with zero awkwardness. Fast delivery, strong communication, and the photos actually looked like us.",
    author: "Milan and Harper",
    role: "Wedding clients",
  },
  {
    quote:
      "Lighting, styling, and pacing were all dialed in. This is the first studio shoot where the process felt as polished as the result.",
    author: "Jordan Lee",
    role: "Creative director",
  },
];

export const introItems: IntroItem[] = [
  {
    title: "Pre-shoot planning",
    description: "Wardrobe, mood, timing, and shot lists are aligned before the session starts.",
  },
  {
    title: "Intentional lighting",
    description: "Natural light, strobes, and set styling are matched to the story you want to tell.",
  },
  {
    title: "Refined delivery",
    description: "Final galleries are edited for consistency, skin tone accuracy, and print-ready finish.",
  },
];

export const heroStats: HeroStat[] = [
  { value: "250+", label: "Sessions delivered" },
  { value: "72 hrs", label: "Preview turnaround" },
  { value: "4.9/5", label: "Average client rating" },
];

export const fallbackPhotos: Photo[] = [
  {
    id: 1,
    title: "Window Light Portrait",
    category: "Portrait",
    url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    title: "Editorial Couple Frame",
    category: "Wedding",
    url: "https://images.unsplash.com/photo-1525258946800-98cfd641d0de?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    title: "Soft Family Session",
    category: "Family",
    url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    title: "Studio Fashion Set",
    category: "Fashion",
    url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
  },
];

export const initialBookingForm: BookingFormState = {
  name: "",
  email: "",
  phone: "",
  date: "",
  time_slot: "10:00 AM",
  package: "Portrait Session",
  message: "",
};
