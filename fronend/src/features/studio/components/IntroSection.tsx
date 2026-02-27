import { introItems } from "../data/content";

export function IntroSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 pt-20 md:px-8">
      <div className="mb-8">
        <p className="mb-3 text-[0.82rem] font-bold uppercase tracking-[0.12em] text-[#976841]">
          Studio approach
        </p>
        <h2 className="m-0 max-w-[12ch] text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] tracking-[-0.04em] text-[#1d140f]">
          Clear planning, strong art direction, and delivery that doesn't drag.
        </h2>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {introItems.map((item) => (
          <article
            className="rounded-[24px] bg-[#fffaf4] p-6 shadow-[0_18px_60px_rgba(54,33,17,0.08)]"
            key={item.title}
          >
            <h3 className="mb-3 text-xl font-semibold text-[#1d140f]">{item.title}</h3>
            <p className="m-0 leading-7 text-[#69513d]">{item.description}</p>
          </article>
        ))}
      </div><br/><br/>
      <hr/>
    </section>
   
  );
}
