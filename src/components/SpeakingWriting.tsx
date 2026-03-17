const speakingEvents = [
  "ATD 2026, May 2026",
  "CLO Exchange Austin, April 2026",
  "DevLearn 2025: From Product Roadmap to Prototype",
  "DevLearn 2025: Tracking Impact with xAPI and Articulate Rise",
  "Articuland 2025: Design AI Simulations",
  "ATD AI Intensive 2025: Using GenAI to Power Learning Design and Development",
  "ATD AI Intensive 2025: Design AI Simulations",
  "DevLearn 2024: AI Face Off: Solutions in the Spotlight",
  "DevLearn 2024: E-Learning Trends: Perspectives from the Articulate Community",
  "Adobe Learning World 2024: Empowering Learning Teams with UX in Instructional Design",
];

import AnimatedHeading from "./AnimatedHeading";

export default function SpeakingWriting() {
  return (
    <section
      id="speaking"
      className="py-24 bg-white/40"
      aria-labelledby="speaking-heading"
    >
      <div className="max-w-[1400px] mx-auto px-6">
        <AnimatedHeading
          id="speaking-heading"
          className="font-serif text-ink text-[40px] leading-tight tracking-[-0.02em] mb-4"
        >
          Speaking & Writing
        </AnimatedHeading>

        <div className="grid md:grid-cols-3 gap-12">
          {/* The Book */}
          <div>
            <h3 className="font-serif text-ink text-[24px] tracking-[-0.01em] mb-4">
              My Book
            </h3>
            <p className="font-serif italic text-ink text-[17px] mb-3 leading-snug">
              Title coming soon
            </p>
            <p className="font-sans text-muted text-[15px] mb-2">
              Publishing with ATD.
            </p>
            <p className="font-sans text-ink/80 text-[16px] leading-relaxed mb-4">
              Learning designers don't get a playbook. This book is the next
              best thing. A practical guide for the gray areas, unclear
              direction, changing priorities, and figuring out what to build
              when everyone tells you what they want but not what they need.
              Centered around stories from me and practitioners across the
              industry, with try-it activities you can apply the same day you
              read them.
            </p>
            <p className="font-sans italic text-muted text-[15px]">
              Follow along on{" "}
              <a
                href="https://linkedin.com/in/melmilloway"
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline text-purple underline decoration-purple underline-offset-4 hover:text-purple-medium transition-colors not-italic"
              >
                LinkedIn
              </a>{" "}
              for updates on the release.
            </p>
          </div>

          {/* Speaking */}
          <div>
            <h3 className="font-serif text-ink text-[24px] tracking-[-0.01em] mb-4">
              Speaking
            </h3>
            <p className="font-sans text-ink/80 text-[16px] leading-relaxed mb-6">
              I speak regularly at industry events on learning strategy, AI in
              learning design, and building experiences that scale. Upcoming and
              recent:
            </p>
            <ul className="flex flex-col gap-2" role="list">
              {speakingEvents.map((event) => (
                <li
                  key={event}
                  className="font-sans text-ink/80 text-[15px] leading-snug pl-3 border-l border-teal/40"
                >
                  {event}
                </li>
              ))}
            </ul>
            <p className="font-sans italic text-muted text-[15px] mt-6">
              Interested in having me speak?{" "}
              <a
                href="#contact"
                className="no-underline text-purple underline decoration-purple underline-offset-4 hover:text-purple-medium transition-colors not-italic"
              >
                Get in touch.
              </a>
            </p>
          </div>

          {/* Community & Recognition */}
          <div className="pl-4 border-l-2 border-teal/40">
            <h3 className="font-serif text-ink text-[24px] tracking-[-0.01em] mb-4">
              Community &amp; Recognition
            </h3>
            <p className="font-sans text-ink/80 text-[16px] leading-relaxed mb-4">
              LinkedIn Top Voice in Education with 114K+ followers, sharing
              ideas on learning design, AI, and building work that scales.
            </p>
            <p className="font-sans text-ink/80 text-[16px] leading-relaxed">
              Featured in Amazon&apos;s internal Impact Stories distributed to
              Jeff Bezos&apos;s direct reports for process improvements that
              raised team performance scores from 25% to 80% in five months.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
