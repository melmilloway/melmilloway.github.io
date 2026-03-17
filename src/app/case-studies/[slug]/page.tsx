import Link from "next/link";
import { caseStudies, getCaseStudy } from "@/lib/caseStudies";
import { notFound } from "next/navigation";
import { User, Clock, TrendingUp, Lightbulb, Star, type LucideIcon } from "lucide-react";
import CaseStudyHeader from "@/components/CaseStudyHeader";
import CaseStudySection from "@/components/CaseStudySection";

const iconMap: Record<string, LucideIcon> = { User, Clock, TrendingUp, Lightbulb, Star };

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return caseStudies.map((cs) => ({ slug: cs.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) return {};
  return {
    title: `${cs.title} | Mel Milloway`,
    description: cs.description,
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) notFound();

  return (
    <main className="min-h-screen bg-cream pt-28 pb-24">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Back link */}
        <Link
          href="/#case-studies"
          className="group inline-flex items-center gap-2 font-sans text-[14px] font-medium text-muted hover:text-purple transition-colors mb-10"
          style={{ animation: "fadeIn 0.4s cubic-bezier(0.22,1,0.36,1) both" }}
        >
          <span className="transition-transform duration-200 group-hover:-translate-x-1">{"\u2190\uFE0E"}</span>
          Case Studies
        </Link>

        {/* Header — image left, title/subtitle right */}
        <CaseStudyHeader
          title={cs.title}
          subtitle={cs.subtitle}
          disclaimer={cs.disclaimer}
          image={cs.image}
          liveLink={cs.liveLink}
        />

        {/* Metadata row */}
        {cs.metaItems && (
          <div
            className="flex flex-col md:flex-row items-stretch mb-12 divide-y md:divide-y-0 md:divide-x divide-[#e8e4de]"
            style={{ borderTop: "1px solid #e8e4de", borderBottom: "1px solid #e8e4de", paddingTop: "20px", paddingBottom: "20px" }}
          >
            {cs.metaItems.map((item, i) => {
              const Icon = iconMap[item.iconName];
              return (
                <div
                  key={item.label}
                  className={`flex flex-1 items-center gap-3 py-4 md:py-0${i > 0 ? " md:pl-6" : ""}`}
                  style={{ animation: `fadeIn 0.4s cubic-bezier(0.22,1,0.36,1) ${0.3 + i * 0.08}s both` }}
                >
                  {Icon && <Icon size={16} className="text-muted shrink-0" />}
                  <div>
                    <p style={{ fontFamily: "var(--font-comme)", fontSize: "11px", letterSpacing: "0.1em", color: "#4a4845", textTransform: "uppercase", marginBottom: "2px" }}>
                      {item.label}
                    </p>
                    <p style={{ fontFamily: "var(--font-comme)", fontSize: "14px", fontWeight: 500, color: "#1a1814" }}>
                      {item.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Sections — two-column grid */}
        <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
          {cs.sections.map((section, i) => (
            <CaseStudySection
              key={section.heading}
              heading={section.heading}
              body={section.body}
              index={i}
            />
          ))}
        </div>

        {/* Live link (xAPI tools) */}
        {cs.liveLink && (
          <div className="mt-12 pt-8 border-t border-ink/10">
            <a
              href={cs.liveLink.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans font-semibold text-[14px] text-white bg-purple px-6 py-3 rounded-none hover:bg-purple-medium transition-colors inline-block"
            >
              {cs.liveLink.label} {"\u2197\uFE0E"}
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
