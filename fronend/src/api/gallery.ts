import { api } from "./client";
import type { Photo } from "../types/photo";

export const GalleryApi = {
  async getAll(): Promise<Photo[]> {
    const res = await api.get("/gallery");
    return res.data.data;
  },
};