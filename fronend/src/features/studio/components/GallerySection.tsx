import type { Photo } from "../../../types/photo";

type GallerySectionProps = {
  photos: Photo[];
  galleryLoading: boolean;
  galleryError: string | null;
};

export function GallerySection({
  photos,
  galleryLoading,
  galleryError,
}: GallerySectionProps) {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 pt-20 md:px-8" id="gallery">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 text-[0.82rem] font-bold uppercase tracking-[0.12em] text-[#976841]">
            Selected work
          </p>
          <h2 className="m-0 max-w-[12ch] text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] tracking-[-0.04em] text-[#1d140f]">
            Portfolio highlights
          </h2>
        </div>
        {galleryError ? <p className="m-0 text-[0.95rem] text-[#69513d]">{galleryError}</p> : null}
      </div>

      {galleryLoading ? (
        <p className="m-0 text-[0.95rem] text-[#69513d]">Loading gallery...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {photos.map((photo) => (
            <article
              className="overflow-hidden rounded-[24px] bg-[#fffaf4] shadow-[0_18px_50px_rgba(54,33,17,0.08)]"
              key={photo.id ?? photo.url}
            >
              <img
                className="aspect-[0.86] w-full object-cover"
                src={photo.url}
                alt={photo.title ?? "Studio portfolio image"}
              />
              <div className="p-4 pb-5">
                <p className="m-0 text-[rgba(105,81,61,0.9)]">{photo.category ?? "Studio"}</p>
                <h3 className="mt-1 text-xl font-semibold text-[#1d140f]">
                  {photo.title ?? "Untitled frame"}
                </h3>
              </div>
            </article>
          ))}
        </div>
      )}<br/><br/>
      <hr/>
    </section>
  );
}
