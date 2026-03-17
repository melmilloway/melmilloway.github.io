import CaseStudyCard from "./CaseStudyCard";
import AnimatedHeading from "./AnimatedHeading";
import { caseStudies } from "@/lib/caseStudies";

export default function CaseStudies() {
  return (
    <section
      id="case-studies"
      className="py-24 max-w-[1400px] mx-auto px-6"
      aria-labelledby="case-studies-heading"
    >
      <AnimatedHeading
        id="case-studies-heading"
        className="font-serif text-ink text-[40px] leading-tight tracking-[-0.02em] mb-4"
      >
        Case Studies
      </AnimatedHeading>

      <p className="font-sans italic text-muted text-[16px] mb-12">
        A significant portion of my work is confidential. Available to share on
        request.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {caseStudies.map((cs, i) => (
          <CaseStudyCard
            key={cs.slug}
            slug={cs.slug}
            title={cs.title}
            subtitle={cs.subtitle}
            description={cs.description}
            image={cs.image}
            accentColor={
              i % 3 === 0 ? "purple" : i % 3 === 1 ? "teal" : "terracotta"
            }
            index={i}
          />
        ))}
      </div>
    </section>
  );
}
