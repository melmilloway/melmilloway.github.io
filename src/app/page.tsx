import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import CaseStudies from "@/components/CaseStudies";
import SpeakingWriting from "@/components/SpeakingWriting";
import About from "@/components/About";
import LetsTalk from "@/components/LetsTalk";
import QuoteTicker from "@/components/QuoteTicker";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <div className="section-divider-purple-teal" aria-hidden="true" />
        <CaseStudies />
        <div className="section-divider-teal-terracotta" aria-hidden="true" />
        <SpeakingWriting />
        <QuoteTicker variant="terracotta-purple" />
        <About />
        <QuoteTicker variant="purple-teal" />
        <LetsTalk />
      </main>
    </>
  );
}
