export interface CaseStudy {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  image?: string;
  sections: {
    heading: string;
    body: string;
  }[];
  disclaimer?: string;
  liveLink?: { label: string; href: string };
  metaItems?: { iconName: string; label: string; value: string }[];
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "ai-interview-simulation",
    image: "/images/case-studies/interview-sim.png",
    title: "Scaling Personalized Interview Practice with AI",
    subtitle:
      "To strengthen candidate experience and improve hiring quality.",
    description:
      "Traditional interview training happens weeks before it's needed. This AI simulation delivers realistic, personalized practice right before the interview, closing the gap between training and on the job performance.",
    sections: [
      {
        heading: "Business Goal",
        body: "At Amazon, roughly 30K employees go through interviewer training every year. I was part of leading the revamp of that program. The goal was to improve interviewer proficiency at scale. Better interviewers create better candidate experiences, which directly affects hiring quality and employer reputation.",
      },
      {
        heading: "Problem Statement",
        body: "Even after revamping the program, one problem remained. Training happened weeks or months before an interviewer ever sat down with a candidate. By the time the interview came, skills hadn't been practiced recently. We had scale. What we didn't have was training close enough to the actual interview to make a difference.",
      },
      {
        heading: "Solution",
        body: "After leaving Amazon, I built the solution I wished we'd had. An AI-driven simulation that identifies when an interviewer last practiced, detects upcoming interviews on their calendar, and delivers a tailored, realistic practice scenario just before they need it, with actionable feedback built into the experience itself.",
      },
    ],
    metaItems: [
      { iconName: "User", label: "ROLE", value: "Lead Designer & Developer" },
      { iconName: "Clock", label: "TIMELINE", value: "2 weeks" },
      { iconName: "TrendingUp", label: "IMPACT", value: "Post-Amazon proof of concept" },
    ],
  },
  {
    slug: "miro-verified",
    image: "/images/case-studies/miro.png",
    liveLink: {
      label: "View Miro Verified",
      href: "https://academy.miro.com/page/miro-verified",
    },
    title: "Differentiating a Product Through Digital Credentialing",
    subtitle:
      "To turn user skills into a customer acquisition channel and establish a competitive edge in a crowded market.",
    description:
      "When competitors offered no way for users to prove their skills, Miro Verified changed that: a digital credentialing program built from scratch and launched in 4 months.",
    sections: [
      {
        heading: "Business Goal",
        body: "Miro needed a way to stand out in a crowded market of visual workspace tools. Competitors weren't offering users any way to showcase their platform skills publicly. A digital credentialing program would change that, giving users something tangible to show for their expertise while deepening their investment in Miro as a platform.",
      },
      {
        heading: "Problem Statement",
        body: "There was no credentialing program, no badging infrastructure, and no established process for building one. The program needed to be live by Miro's annual user conference in December. It was September.",
      },
      {
        heading: "Solution",
        body: "Built the Miro Verified credentialing program from the ground up in 4 months, selecting and procuring a badging platform, designing badges with brand and marketing, connecting the platform to Miro Academy's LMS, and launching three skill-based badges at the conference.\n\nIn the first three months after launch, the program issued 9,655 badges to 6,271 unique users. Badges aren't automatically added to a profile; users have to actively accept them. A 79.6% acceptance rate, above Credly's platform average of 67%, shows users found the credential worth claiming. The 53% share rate, above Credly's average of 47%, drove traffic back to Miro Academy, putting Miro in front of people who had never used the platform and turning credential shares into a customer acquisition channel.",
      },
    ],
    metaItems: [
      { iconName: "User", label: "ROLE", value: "Sole Owner — Strategy, Procurement, Tech & Launch" },
      { iconName: "Clock", label: "TIMELINE", value: "4 months" },
      { iconName: "TrendingUp", label: "IMPACT", value: "9.6K badges issued in first 3 months · 79.6% acceptance rate" },
    ],
  },
  {
    slug: "amazon-candidate-prep",
    image: "/images/case-studies/candidate-prep.png",
    title: "Standardizing How Amazon Prepares Candidates at Global Scale",
    subtitle:
      "To create a consistent candidate experience and free recruiters to focus on high-touch, relationship-driven work that couldn't be scaled.",
    description:
      "A candidate prep program covering 40+ roles across early career hiring, built with recruiters globally, resulting in 95-96% satisfaction rates across nearly 8K survey responses.",
    sections: [
      {
        heading: "Business Goal",
        body: "Amazon's early career hiring happens at massive scale across 40+ role types globally. Recruiters were spending significant time answering the same candidate questions, and without a centralized program, candidate experience varied depending on the recruiter. The goal was to create a consistent, scalable prep experience for every candidate while freeing recruiters to focus on the high-touch, relationship-driven work that a course or a page of information couldn't replace.",
      },
      {
        heading: "Problem Statement",
        body: "Candidates coming into Amazon interviews, especially early career talent, didn't have a clear picture of what to expect or how to prepare. That gap showed up in the interview process and created extra work for recruiters who were fielding the same questions repeatedly. With 40+ role types and a globally distributed recruiting team, there was no consistent, scalable way to get candidates ready.",
      },
      {
        heading: "Solution",
        body: "Led the development of a candidate prep program built in partnership with recruiters across the globe and tailored to individual job profiles. The courses launched first within three months, followed by candidate prep info pages. For technical roles like SDE, the program included deeper dive content specific to what those candidates needed to know.\n\nOver six months, the SDE track alone collected nearly 8K survey responses. Full-time candidates reported a 95% satisfaction rate and 89% knowledge improvement. Interns reported a 96% satisfaction rate and 90% knowledge improvement.",
      },
    ],
    metaItems: [
      { iconName: "User", label: "ROLE", value: "Program Lead, Global Cross-functional" },
      { iconName: "Clock", label: "TIMELINE", value: "3 months initial launch, ongoing" },
      { iconName: "TrendingUp", label: "IMPACT", value: "95-96% satisfaction across 7.9K SDE responses in 6 months" },
    ],
  },
  {
    slug: "xapi-tools",
    image: "/images/case-studies/tools.png",
    title: "Eliminating Manual Technical Work for Learning Designers",
    subtitle:
      "To give learning designers back the hours spent on repetitive code and open up what they could build.",
    description:
      "A suite of six free tools built for Articulate Rise creators, turning hours of manual technical work into minutes.",
    liveLink: {
      label: "View the live xAPI Code Generator",
      href: "https://xapi-code-generator-for-rise.replit.app/",
    },
    sections: [
      {
        heading: "Business Goal",
        body: "Learning designers using Articulate Rise were spending hours, sometimes entire days, writing and debugging JavaScript by hand just to add xAPI tracking or package content for an LMS. That time wasn't going toward designing better learning. It was going toward technical overhead that repeated on every single project.",
      },
      {
        heading: "Problem Statement",
        body: "Every time the team needed to track learner behavior outside an LMS in Rise, someone had to manually write dozens, sometimes hundreds, of lines of JavaScript, paste it into the published file, and hope nothing broke. One missed comma stopped everything. Fixing it meant starting over. The same problem existed with SCORM packaging, a process that could take four hours per file. These weren't one-time challenges. They were recurring costs on every project.",
      },
      {
        heading: "Solution",
        body: "Built a publicly available suite of six tools for Articulate Rise creators, removing the most time-consuming technical tasks from the design process entirely. Designers type plain language describing what they want to track. The tool generates the code. The SCORM Packager converts HTML files in minutes with no manual setup. The tools are free, live, and used by the broader learning community.\n\nAs an estimation: across an organization of 1K learning designers, each packaging roughly five HTML modules a year, SCORM packaging at four hours per file and $50 an hour adds up to approximately $1 million annually. With the SCORM Packager, that same work takes under five minutes per file, dropping the cost to around $16,000.",
      },
    ],
    metaItems: [
      { iconName: "User", label: "ROLE", value: "Solo project" },
      { iconName: "Clock", label: "TIMELINE", value: "2 weeks · ongoing" },
      { iconName: "TrendingUp", label: "IMPACT", value: "Estimated $1M annual savings for 1K designers" },
    ],
  },
  {
    slug: "pathogen-patrol",
    image: "/images/case-studies/pines.png",
    liveLink: {
      label: "View Pathogen Patrol",
      href: "/portfolio/pathogen-patrol/",
    },
    title: "Leading by Example to Raise the Bar for What Teams Build",
    subtitle:
      "Built to show learning teams that immersive, story-driven experiences were possible with the tools they already had.",
    description:
      "A fully immersive bloodborne pathogen simulation built inside Articulate Rise, complete with character selection, audio storytelling, branching decisions, hidden hotspots, and a custom point-tracking system.",
    sections: [
      {
        heading: "The Problem",
        body: "When leading a learning team, there was a shared assumption that immersive, story-driven experiences required tools we didn't have. Rise was seen as a rapid content tool, good for clean, scrollable courses. Not simulations. Not branching scenarios. Not anything that felt like a real experience. That ceiling was limiting what the team would even attempt.",
      },
      {
        heading: "The Approach",
        body: "The most effective way to change that belief wasn't to tell the team Rise could do more. It was to build something that proved it. I created Pathogen Patrol, a fully immersive simulation inside Rise, built for a fictional senior care community called Knotty Pines. Learners clock into a shift, choose a caregiver persona, and navigate a day of real safety decisions. Audio announcements drive urgency. Hidden hotspots surface what gets missed in real life. A custom Pine Points system tracks progress throughout.\n\nNone of that was what Rise was designed for. All of it was built inside it anyway.",
      },
      {
        heading: "The Result",
        body: "The experience was featured in Tim Slade's eLearning Designer's Academy as a standout example of what's possible in Rise. More importantly, it gave learning designers a concrete example to point to, proof that the ceiling they assumed was fixed wasn't.",
      },
    ],
    metaItems: [
      { iconName: "User", label: "ROLE", value: "Solo project" },
      { iconName: "Clock", label: "TIMELINE", value: "2 weeks" },
      { iconName: "Star", label: "HIGHLIGHT", value: "Featured in Tim Slade's eLearning Designer's Academy" },
    ],
  },
  {
    slug: "cat-cafe-ai-app",
    image: "/images/case-studies/whisker.png",
    title: "Scaling Scenario-Based Learning with AI-Generated Content",
    subtitle:
      "To reduce customer escalations by coaching café leads in the flow of work, before problems happen.",
    description:
      "Instead of sending café leads to a course, this app meets them at the Point of Sale (POS) system at the start of every shift with a fresh, AI-generated scenario based on real store data, with no manual content creation required.",
    disclaimer:
      "This is a proof of concept built to demonstrate how AI can scale scenario-based learning using operational data.",
    sections: [
      {
        heading: "Business Goal",
        body: "Reduce customer escalations by 10% in four weeks by helping café leads start each shift ready to coach their team, set the tone for safety, and handle situations before they escalate.",
      },
      {
        heading: "Problem Statement",
        body: "The same situations kept repeating across locations: a barista freezes during a rush, a customer gets uneasy, a safety issue goes unaddressed. What varied wasn't the situation. It was how each lead handled it. Generic training couldn't account for what was actually happening in a specific café on a specific day. And asking leads to complete a course before their shift wasn't realistic.",
      },
      {
        heading: "Solution",
        body: "Built an AI-powered app that ingests store-level data (modeled on customer review sources) and automatically generates a new coaching scenario every day. When a café lead logs into the POS at the start of their shift, the scenario is already there. No extra steps, no separate platform, no manual content creation. The learning lives where the work happens.",
      },
    ],
    metaItems: [
      { iconName: "User", label: "ROLE", value: "Solo project" },
      { iconName: "Clock", label: "TIMELINE", value: "3 weeks" },
      { iconName: "Lightbulb", label: "IMPACT", value: "Proof of concept" },
    ],
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((cs) => cs.slug === slug);
}
