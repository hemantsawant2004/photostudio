import { Photo } from "../../models/photo";

const fallbackPhotos = [
  {
    title: "Signature Portrait",
    category: "Portrait",
    url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Ceremony Light",
    category: "Wedding",
    url: "https://images.unsplash.com/photo-1525258946800-98cfd641d0de?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Family Story",
    category: "Family",
    url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Editorial Motion",
    category: "Fashion",
    url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
  },
];

export const GalleryService = {
  async getAll() {
    const photos = await Photo.findAll({
      order: [["created_at", "DESC"]],
    });

    if (photos.length === 0) {
      return Photo.bulkCreate(fallbackPhotos);
    }

    return photos;
  },

  async create(data: { title?: string; url: string; category?: string }) {
    const photo = await Photo.create({
      title: data.title ?? null,
      url: data.url,
      category: data.category ?? null,
    });
    return photo;
  },
};
