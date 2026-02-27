import { studioWhatsappNumber } from "../data/content";
import { usePackages } from "../hooks/usePackages";
import type { StudioPackage } from "../../../types/package";

function getWhatsappLink(item: StudioPackage) {
  const text = encodeURIComponent(
    item.enquiry_message ??
      `Hi, I want to enquire about the ${item.name} package priced at ${item.price}. Please share details.`,
  );

  return `https://wa.me/${studioWhatsappNumber}?text=${text}`;
}

export function PackagesSection() {
  const { packages, loading, error } = usePackages();

  return (
    <section className="mx-auto w-full max-w-7xl px-5 pt-20 md:px-8" id="packages">
      <div className="mb-8">
        <p className="mb-3 text-[0.82rem] font-bold uppercase tracking-[0.12em] text-[#976841]">
          Pricing
        </p>
        <h2 className="m-0 max-w-[12ch] text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] tracking-[-0.04em] text-[#1d140f]">
          Packages designed for the work clients actually book.
        </h2>
      </div>
      {loading ? <p className="mb-6 text-[#69513d]">Loading packages...</p> : null}
      {error ? <p className="mb-6 text-[#9d2f2f]">{error}</p> : null}
      <div className="grid gap-5 md:grid-cols-3">
        {packages.map((item) => (
          <a
            className="group rounded-[24px] bg-[#fffaf4] p-6 text-left shadow-[0_18px_60px_rgba(54,33,17,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(54,33,17,0.14)]"
            href={getWhatsappLink(item)}
            key={item.id ?? item.name}
            rel="noreferrer"
            target="_blank"
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <p className="mb-0 font-bold text-[#976841]">{item.price}</p>
              <span className="rounded-full bg-[#e8f7ed] px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#1e7a45]">
                WhatsApp
              </span>
            </div>
            <h3 className="mb-3 text-xl font-semibold text-[#1d140f] group-hover:text-[#7a4a22]">
              {item.name}
            </h3>
            <p className="m-0 leading-7 text-[#69513d]">{item.description}</p>
            <ul className="mt-4 pl-5 leading-8 text-[#443328]">
              {item.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <div className="mt-6 flex items-center justify-between">
              <span className="text-sm font-semibold text-[#1d140f]">Send enquiry to admin</span>
              <span className="text-lg text-[#976841]">+</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
