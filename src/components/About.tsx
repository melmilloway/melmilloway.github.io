import Image from "next/image";
import AnimatedHeading from "./AnimatedHeading";

const dropShadowSm = 'drop-shadow(rgba(0, 0, 0, 0.12) 0px 4px 16px)';
const dropShadowLg = 'drop-shadow(rgba(0, 0, 0, 0.12) 0px 8px 32px)';

const textParagraphs = (
  <>
    <p className="font-sans text-ink/80 text-[16px] leading-relaxed mb-5">
      I&apos;m Mel, based in Seattle, Washington.
    </p>
    <p className="font-sans text-ink/80 text-[16px] leading-relaxed mb-5">
      I work backwards from business problems. Usually there&apos;s a
      recurring challenge somewhere, something that keeps happening, and
      the question I&apos;m asking is whether a product or system could
      solve it at scale. That&apos;s been true whether I&apos;m leading a
      team or building something myself, and I&apos;ve done both.
    </p>
    <p className="font-sans text-ink/80 text-[16px] leading-relaxed mb-5">
      Outside of work I make things. I design 3D printed and laser-cut
      jewelry inspired by art and history, melting clocks, broken Roman
      columns, that kind of thing. I also ran a 3D printing business for
      a few years, did the market research, made the products, and sold
      over 3.5K of them. That&apos;s the part I&apos;m probably most
      proud of.
    </p>
    <p className="font-sans text-ink/80 text-[16px] leading-relaxed">
      I live with a Brussels Griffon named Ziti (like the pasta). The
      breed allegedly inspired the Ewoks. When I&apos;m not making
      something I&apos;m watching bad reality TV or lost in a fantasy
      novel.
    </p>
  </>
);

export default function About() {
  return (
    <section
      id="about"
      className="py-24 max-w-[1400px] mx-auto px-6"
      aria-labelledby="about-heading"
    >
      <AnimatedHeading
        id="about-heading"
        className="font-serif text-ink text-[40px] leading-tight tracking-[-0.02em] mb-4"
      >
        About
      </AnimatedHeading>

      {/* ── Mobile layout (< lg) ── */}
      <div className="lg:hidden">
        <div className="mb-8" style={{ filter: dropShadowLg }}>
          <Image
            alt="Mel Milloway"
            width={840}
            height={680}
            src="/images/main-page/mel.png"
            className="w-full h-auto block"
            priority
          />
        </div>
        <div className="max-w-xl">{textParagraphs}</div>
      </div>

      {/* ── Tablet layout (lg–xl) ── */}
      <div
        className="hidden lg:grid xl:hidden"
        style={{ gap: '64px', alignItems: 'end', gridTemplateColumns: '1fr 1fr' }}
      >
        <div className="max-w-xl">{textParagraphs}</div>
        {/* Right col: Mel only at this size */}
        <div style={{ alignSelf: 'end' }}>
          <div style={{ filter: dropShadowLg, marginBottom: '-24px' }}>
            <Image alt="Mel Milloway" width={840} height={680} src="/images/main-page/mel.png" className="w-full h-auto block" priority />
          </div>
        </div>
      </div>

      {/* ── Desktop layout (xl+) ── */}
      <div
        className="hidden xl:grid"
        style={{ gap: '64px', alignItems: 'stretch', gridTemplateColumns: '1fr 760px' }}
      >
        <div className="max-w-xl">{textParagraphs}</div>
        <div style={{ position: 'relative' }}>
          {/* Mel */}
          <div className="wiggle-hover" style={{ position: 'absolute', left: 0, bottom: '-24px', height: 'calc(100% + 24px)', width: 'auto', zIndex: 2, filter: dropShadowLg }}>
            <Image alt="Mel Milloway" width={840} height={680} src="/images/main-page/mel.png" style={{ height: '100%', width: 'auto' }} className="block" priority />
          </div>
          {/* Clocks — exact positions */}
          <div className="wiggle-hover" style={{ position: 'absolute', top: '-2px', right: '139px', width: '185px', transform: 'rotate(6deg)', zIndex: 3, filter: dropShadowSm }}>
            <Image src="/images/main-page/clocks.png" alt="Melting clock jewelry by Mel" width={420} height={540} className="w-full h-auto block" />
          </div>
          {/* Ziti — exact positions */}
          <div className="wiggle-hover" style={{ position: 'absolute', bottom: '-18px', right: '76px', width: '168px', transform: 'rotate(-6deg)', zIndex: 3, filter: dropShadowSm }}>
            <Image src="/images/main-page/ziti.png" alt="Ziti, a Brussels Griffon" width={420} height={540} className="w-full h-auto block" />
          </div>
        </div>
      </div>
    </section>
  );
}
