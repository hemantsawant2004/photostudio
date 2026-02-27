import { useEffect, useState } from "react";
import { GalleryApi } from "../../../api/gallery";
import { fallbackPhotos } from "../data/content";
import type { GalleryState } from "../types";

export function useGallery(): GalleryState {
  const [photos, setPhotos] = useState<GalleryState["photos"]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [galleryError, setGalleryError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadGallery = async () => {
      try {
        const data = await GalleryApi.getAll();
        if (!active) {
          return;
        }
        setPhotos(data.length > 0 ? data : fallbackPhotos);
        setGalleryError(
          data.length > 0
            ? null
            : "Using the default portfolio until your backend gallery is populated.",
        );
      } catch {
        if (!active) {
          return;
        }
        setPhotos(fallbackPhotos);
        setGalleryError("Backend gallery unavailable. Showing preview content.");
      } finally {
        if (active) {
          setGalleryLoading(false);
        }
      }
    };

    void loadGallery();

    return () => {
      active = false;
    };
  }, []);

  return {
    photos,
    galleryLoading,
    galleryError,
  };
}
