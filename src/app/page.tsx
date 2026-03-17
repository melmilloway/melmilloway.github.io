import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import CaseStudies from "@/components/CaseStudies";
import SpeakingWriting from "@/components/SpeakingWriting";
import About from "@/components/About";
import LetsTalk from "@/components/LetsTalk";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <hr className="section-divider-purple-teal" />
        <CaseStudies />
        <hr className="section-divider-teal-terracotta" />
        <SpeakingWriting />
        <hr className="section-divider-terracotta-purple" />
        <About />
        <hr className="section-divider-purple-teal" />
        <LetsTalk />
      </main>
    </>
  );
}
