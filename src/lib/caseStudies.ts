import type { CaseStudyVideoData } from "@/components/CaseStudyVideo";
import type { GalleryItem } from "@/components/Gallery";

export interface CaseStudy {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  image?: string;
  video?: CaseStudyVideoData;
  sections: {
    heading: string;
    body: string;
    visual?: "gap-chart";
    visualAfter?: number;
  }[];
  disclaimer?: string;
  gallery?: { heading: string; blurb?: string; items: GalleryItem[] };
  liveLink?: { label: string; href: string };
  metaItems?: { iconName: string; label: string; value: string }[];
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "grade-pending",
    gallery: {
      heading: "Inside the game",
      items: [
        {
          src: "/images/case-studies/gallery/grade-pending/01-title-screen.png",
          thumb: "/images/case-studies/gallery/grade-pending/01-title-screen-thumb.png",
          alt: "The Grade Pending title screen over the town of Brightwater",
          caption: "The title screen, over the town of Brightwater.",
          width: 1598, height: 994,
          thumbWidth: 480, thumbHeight: 299,
        },
        {
          src: "/images/case-studies/gallery/grade-pending/02-main-menu.png",
          thumb: "/images/case-studies/gallery/grade-pending/02-main-menu-thumb.png",
          alt: "The main menu, showing the town and how many inspectors have played",
          caption: "The main menu, with a count of how many inspectors have played.",
          width: 1598, height: 994,
          thumbWidth: 480, thumbHeight: 299,
        },
        {
          src: "/images/case-studies/gallery/grade-pending/03-inspecting-the-diner.png",
          thumb: "/images/case-studies/gallery/grade-pending/03-inspecting-the-diner-thumb.png",
          alt: "Inspecting Sunny Side Diner, with the Grubble feed and the tool bar",
          caption: "Inspecting Sunny Side Diner, with the customer feed and the tool bar.",
          width: 1600, height: 900,
          thumbWidth: 480, thumbHeight: 270,
        },
        {
          src: "/images/case-studies/gallery/grade-pending/04-rosa-feedback.png",
          thumb: "/images/case-studies/gallery/grade-pending/04-rosa-feedback-thumb.png",
          alt: "Rosa Delgado giving feedback straight after a decision",
          caption: "Rosa explains the decision right after it is made, citing the 41°F limit.",
          width: 1600, height: 900,
          thumbWidth: 480, thumbHeight: 270,
        },
        {
          src: "/images/case-studies/gallery/grade-pending/05-walk-in-cooler.png",
          thumb: "/images/case-studies/gallery/grade-pending/05-walk-in-cooler-thumb.png",
          alt: "The walk-in cooler, with raw chicken stored above the lettuce",
          caption: "The walk-in cooler, with raw chicken stored above the lettuce.",
          width: 1600, height: 900,
          thumbWidth: 480, thumbHeight: 270,
        },
      ],
    },
    image: "/images/case-studies/grade-pending.png",
    title: "Teaching Judgment Through a 3D Inspection Game",
    subtitle:
      "To improve Food Code judgment through realistic practice.",
    description:
      "A browser-based 3D game where you inspect restaurants as a trainee health inspector, cite which Food Code violation it is and how serious it is, then give the restaurant the grade those violations add up to.",
    liveLink: {
      label: "Play Grade Pending",
      href: "https://content.buildxcl.com/?m=d1b93b80-ffa9-11ef-a5c5-b22df4fb9d51&n=63bb6639-e2a1-11f1-a962-cebbdb442116",
    },
    sections: [
      {
        heading: "Business Goal",
        body: "Restaurants get a grade in their window based on a health inspection, and customers see it before they decide whether to come in. That grade comes from FDA Food Code violations, which add up to a score.\n\nIn Grade Pending, a trainee has to identify the violations in the kitchen, rate how serious each one is, and identify the things that are not violations. After that, they give the restaurant a grade based on the violation totals.\n\nWhat we are measuring is how often a trainee cites the correct Food Code violation and rates its seriousness correctly. Sunny Side Diner has six violations and three items where nothing is wrong. Fifty-nine people played Sunny Side Diner between November 17 and November 21, 2026, with each of the nine items judged by between 19 and 31 of them. Across those plays, trainees identify a violation and rate its seriousness correctly 36% of the time, and correctly leave the three fine items alone 81% of the time. The target is to raise how often trainees cite the correct violation and rate its seriousness correctly from 36% to 72% by the fifth restaurant.\n\nFive restaurants are planned so trainees get enough practice to improve, and so there is enough data to show that improvement. One restaurant only gives us evidence pointing to where our skill gaps may be.",
      },
      {
        heading: "Problem Statement",
        body: "Assume a trainee is familiar with the FDA Food Code. Using the Food Code in a kitchen is a different skill, and that skill is really three skills stacked together.\n\nThe first is taking a reading on an item you cannot judge by looking, and knowing the number that reading has to meet. Potato salad on a prep table looks the same at 48 degrees as it does at 41 degrees. A sanitizer bucket looks the same whether it is mixed strong enough to kill bacteria or not. A trainee has to use a thermometer or a test strip on these items, and then has to know what the Food Code requires.\n\nThe second is judging which Food Code rule a violation breaks and how serious it is: a public health hazard, a critical violation, or a general one.\n\nThe third is grading the restaurant from the violation total. Each level of seriousness adds a different number of points, so a trainee has to total them and work out which grade that total comes to.\n\nSkills like this are usually taught with compliance training, which is not what Grade Pending is. Compliance training gives people a lot of information without being able to help them practice, and usually ends with a quiz. A quiz only shows knowledge transfer, not application. A trainee passes the quiz, then walks into the environment without having practiced right before they need to apply what they learned. People forget what they do not practice, so by the time someone needs the training, much of it is gone and the judgments they make are wrong more often.",
      },
      {
        heading: "Solution",
        body: "Grade Pending puts the learner inside the kitchen to practice, so they can apply what they learned on the job soon after. You are an inspector reporting for duty at Sunny Side Diner. You walk the kitchen and check each thing in it, deciding when to reach for a thermometer or sanitizer test strips, whether what you find breaks the Food Code, and how serious it is. Two things give you feedback after each decision. Rosa Delgado, a senior inspector, tells you whether you were right and what the correct answer was. Grubble, the town's restaurant review app, fills with posts from customers and staff reacting to what you decided. Both come immediately, so you are reinforced on what you got right and corrected on what you got wrong while the decision is still fresh.\n\nBy the time you grade the restaurant, you know which items were violations and how serious each one is. Rules follow the FDA Food Code (2022) and grading is modeled on New York City's restaurant grading system. You still have to total the points and work out which grade that total comes to.\n\nFour awards per restaurant track the behaviors that make a grade defensible: taking every temperature before deciding, citing nothing that is fine, catching the raw chicken stored above the lettuce, and giving the correct grade.\n\nBuilt in Three.js and delivered as an xAPI package. It is hosted and launched through [Build Capable XCL](https://buildcapable.com/xcl/), which handles the learner launch, the sign-in form, and the learning record store. Every decision reports back: what a trainee did with each item, whether they picked the right reason, whether they rated the seriousness right, whether they cited something that was fine, and the grade they gave against the correct one.",
      },
      {
        heading: "What the Data Shows",
        visual: "gap-chart",
        visualAfter: 1,
        body: "Fifty-nine people played Sunny Side Diner between November 17 and November 21, 2026. Each of its nine items was judged by between 19 and 31 of them.\n\nFor every item, a trainee decides whether it breaks the Food Code. If they say it does, they pick which violation it is and how serious. Across the six violations, trainees get both right 36% of the time. On another 42% they say it is a violation but cannot pick the right one or the right seriousness.\n\nThe three items at the top are the standards most trainees already know: hot food at 135 degrees or above, cold food at 41 degrees or below, and raw chicken stored below the lettuce so it cannot drip onto food that is eaten raw. The three at the bottom need a standard most trainees do not know: sanitizer has to read at least 50 parts per million, a handwashing sink has to stay clear of dirty dishes, and a cook with symptoms has to stay home. On every item that needs a tool, 90% or more of trainees used one. A test strip tells a trainee what the sanitizer bucket reads, and the trainee has to already know what that reading has to be. 91% took a reading from the bucket, and one in ten cited it correctly.\n\nThree of the nine items are not violations. The soup, the milk and the tuna salad are all within the Food Code, so the correct move is to cite nothing. Between 20 and 22 trainees judged each of those three. 81% correctly left them alone, and 19% cited a violation that was not there.\n\nSeventeen trainees finished an inspection and gave Sunny Side Diner a grade. Its violations add up to a C, which is the lowest grade in the game. Ten gave it a C, five gave it a B, and two gave it an A. The grade comes from the points a trainee recorded, so every violation they missed or under-rated moves the restaurant toward a better grade.\n\nTo see whether trainees improve with practice, we need the same data from the other four restaurants we plan to release.",
      },
      {
        heading: "Why It Scales",
        body: "Only the restaurant changes between games. Everything else is reused: a 3D kitchen you walk through, a thermometer and sanitizer test strips that give a reading, a mentor who corrects each decision as you make it, and a review app where customers and staff post about what you decided. Every item asks the same four questions: does it break the Food Code, which violation is it, how serious is it, and what grade do the violations add up to. Every decision writes an xAPI statement that records whether the trainee took a reading first, whether they cited the right violation, and whether they rated the seriousness right.\n\nThe same engine works for any job where someone walks into a space, works out what they are looking at, and has to classify it. A delivery driver decides where a package is safe to leave. A technician checks a row of racks in a data center. A safety officer walks a warehouse floor. Building one of those means swapping three things: the 3D space, the rules the trainee applies, and the mentor who corrects them.\n\nAccess is the other constraint the game removes. Practicing on the job means finding a working kitchen that happens to have violations in it the day you need them, and a senior inspector free to walk it with you. Sunny Side Diner has the same nine items waiting every time, including the three items where nothing is wrong, and it runs for one trainee or for fifty on the same afternoon.\n\nGrade Pending is the first game we have built on this engine. The next game starts with the engine already finished, which saves a lot of time.",
      },
    ],
    metaItems: [
      { iconName: "User", label: "ROLE", value: "Solo project" },
      { iconName: "Clock", label: "STATUS", value: "Playable now, still in testing" },
      { iconName: "TrendingUp", label: "EARLY DATA", value: "59 playtesters; they find 78% of violations, cite and rate 36% correctly" },
    ],
  },
  {
    slug: "ai-interview-simulation",
    image: "/images/case-studies/interview-sim.png",
    video: {
      src: "/videos/interview-simulation.mp4",
      poster: "/videos/interview-simulation-poster.jpg",
      captions: "/videos/interview-simulation.vtt",
      heading: "How it works, end to end",
      blurb: "The calendar invite through to the feedback. Captions available.",
      width: 1920,
      height: 1080,
    },
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
    gallery: {
      heading: "Miro Verified",
      items: [
        {
          src: "/images/case-studies/gallery/miro-verified/badges-pilot-1.png",
          thumb: "/images/case-studies/gallery/miro-verified/badges-pilot-1-thumb.png",
          alt: "The Miro Verified page showing the digital badges",
          caption: "The Miro Verified page, with the two pilot badges.",
          width: 1366, height: 2618,
          thumbWidth: 480, thumbHeight: 920,
        },
      ],
    },
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
    gallery: {
      heading: "The candidate-facing prep pages",
      items: [
        {
          src: "/images/case-studies/gallery/amazon-candidate-prep/behavioral-competency-and-amazon-s-leadership-principles-amazon-sde-onli.png",
          thumb: "/images/case-studies/gallery/amazon-candidate-prep/behavioral-competency-and-amazon-s-leadership-principles-amazon-sde-onli-thumb.png",
          alt: "The behavioral competency and Leadership Principles page",
          caption: "The behavioral competency page, built around the Leadership Principles.",
          width: 1600, height: 919,
          thumbWidth: 480, thumbHeight: 276,
        },
        {
          src: "/images/case-studies/gallery/amazon-candidate-prep/interview-journey-amazon-sde-online-assessment-oa-and-interview-prep-cou.png",
          thumb: "/images/case-studies/gallery/amazon-candidate-prep/interview-journey-amazon-sde-online-assessment-oa-and-interview-prep-cou-thumb.png",
          alt: "The interview journey page",
          caption: "The interview journey: the Online Assessment, then the live interview.",
          width: 1600, height: 919,
          thumbWidth: 480, thumbHeight: 276,
        },
        {
          src: "/images/case-studies/gallery/amazon-candidate-prep/online-assessment-overview-amazon-sde-online-assessment-oa-and-interview.png",
          thumb: "/images/case-studies/gallery/amazon-candidate-prep/online-assessment-overview-amazon-sde-online-assessment-oa-and-interview-thumb.png",
          alt: "The Online Assessment overview page",
          caption: "The Online Assessment overview, with the 70-minute coding section in two parts.",
          width: 1600, height: 919,
          thumbWidth: 480, thumbHeight: 276,
        },
        {
          src: "/images/case-studies/gallery/amazon-candidate-prep/online-assessment-prep-for-applied-science-interns-03-04-2026-08-01-pm.png",
          thumb: "/images/case-studies/gallery/amazon-candidate-prep/online-assessment-prep-for-applied-science-interns-03-04-2026-08-01-pm-thumb.png",
          alt: "Online assessment prep for Applied Science interns",
          caption: "The public amazon.jobs page for Applied Science interns.",
          width: 1600, height: 919,
          thumbWidth: 480, thumbHeight: 276,
        },
        {
          src: "/images/case-studies/gallery/amazon-candidate-prep/online-assessment-prep-for-sde-roles-03-04-2026-07-59-pm.png",
          thumb: "/images/case-studies/gallery/amazon-candidate-prep/online-assessment-prep-for-sde-roles-03-04-2026-07-59-pm-thumb.png",
          alt: "Online assessment prep for SDE roles",
          caption: "The public amazon.jobs page for SDE roles, start to finish.",
          width: 1600, height: 7030,
          thumbWidth: 480, thumbHeight: 2109,
        },
        {
          src: "/images/case-studies/gallery/amazon-candidate-prep/practice-your-knowledge-amazon-sde-online-assessment-oa-and-interview-pr.png",
          thumb: "/images/case-studies/gallery/amazon-candidate-prep/practice-your-knowledge-amazon-sde-online-assessment-oa-and-interview-pr-thumb.png",
          alt: "The practice your knowledge page",
          caption: "A knowledge check on the STAR method.",
          width: 1600, height: 919,
          thumbWidth: 480, thumbHeight: 276,
        },
        {
          src: "/images/case-studies/gallery/amazon-candidate-prep/technical-competency-amazon-sde-online-assessment-oa-and-interview-prep-.png",
          thumb: "/images/case-studies/gallery/amazon-candidate-prep/technical-competency-amazon-sde-online-assessment-oa-and-interview-prep--thumb.png",
          alt: "The technical competency page",
          caption: "A guided tour of LiveCode, the platform candidates code in.",
          width: 1600, height: 919,
          thumbWidth: 480, thumbHeight: 276,
        },
        {
          src: "/images/case-studies/gallery/amazon-candidate-prep/technical-competency-amazon-sde-online-assessment-oa-and-interview-prep--2.png",
          thumb: "/images/case-studies/gallery/amazon-candidate-prep/technical-competency-amazon-sde-online-assessment-oa-and-interview-prep--2-thumb.png",
          alt: "The technical competency page",
          caption: "An Amazon SDE walks through a coding example on video.",
          width: 1600, height: 919,
          thumbWidth: 480, thumbHeight: 276,
        },
      ],
    },
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
    gallery: {
      heading: "The six tools",
      items: [
        {
          src: "/images/case-studies/gallery/xapi-tools/tools-for-course-creators-07-29-2026-02-58-pm-1.png",
          thumb: "/images/case-studies/gallery/xapi-tools/tools-for-course-creators-07-29-2026-02-58-pm-1-thumb.png",
          alt: "The xAPI Code Generator writes tracking code to paste into Rise.",
          caption: "The xAPI Code Generator writes tracking code to paste into Rise.",
          width: 1600, height: 2129,
          thumbWidth: 480, thumbHeight: 639,
        },
        {
          src: "/images/case-studies/gallery/xapi-tools/tools-for-course-creators-07-29-2026-02-58-pm.png",
          thumb: "/images/case-studies/gallery/xapi-tools/tools-for-course-creators-07-29-2026-02-58-pm-thumb.png",
          alt: "The landing page, with all six tools.",
          caption: "The landing page, with all six tools.",
          width: 1600, height: 887,
          thumbWidth: 480, thumbHeight: 266,
        },
        {
          src: "/images/case-studies/gallery/xapi-tools/tools-for-course-creators-07-29-2026-02-59-pm-1.png",
          thumb: "/images/case-studies/gallery/xapi-tools/tools-for-course-creators-07-29-2026-02-59-pm-1-thumb.png",
          alt: "The SCORM Leaderboard Generator, with a live preview of the ranking.",
          caption: "The SCORM Leaderboard Generator, with a live preview of the ranking.",
          width: 1600, height: 1624,
          thumbWidth: 480, thumbHeight: 487,
        },
        {
          src: "/images/case-studies/gallery/xapi-tools/tools-for-course-creators-07-29-2026-02-59-pm-2.png",
          thumb: "/images/case-studies/gallery/xapi-tools/tools-for-course-creators-07-29-2026-02-59-pm-2-thumb.png",
          alt: "The Confetti Generator, with sliders and a live preview.",
          caption: "The Confetti Generator, with sliders and a live preview.",
          width: 1600, height: 1694,
          thumbWidth: 480, thumbHeight: 508,
        },
                        {
          src: "/images/case-studies/gallery/xapi-tools/tools-for-course-creators-07-29-2026-03-02-pm.png",
          thumb: "/images/case-studies/gallery/xapi-tools/tools-for-course-creators-07-29-2026-03-02-pm-thumb.png",
          alt: "The HUD Generator, showing points and progress over a Rise course.",
          caption: "The HUD Generator, showing points and progress over a Rise course.",
          width: 1600, height: 2041,
          thumbWidth: 480, thumbHeight: 612,
        },
      ],
    },
    image: "/images/case-studies/tools.png",
    title: "Eliminating Manual Technical Work for Learning Designers",
    subtitle:
      "To give learning designers back the hours spent on repetitive code and open up what they could build.",
    description:
      "A suite of six free tools built for Articulate Rise creators that turned hours of manual technical work into minutes.",
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
        body: "Built a suite of six free tools for Articulate Rise creators, removing the most time-consuming technical tasks from the design process entirely. Designers typed plain language describing what they wanted to track. The tool generated the code. The SCORM Packager converted HTML files in minutes with no manual setup. The tools were free, publicly available, and used by the broader learning community.\n\nAs an estimation: across an organization of 1K learning designers, each packaging roughly five HTML modules a year, SCORM packaging at four hours per file and $50 an hour adds up to approximately $1 million annually. With the SCORM Packager, that same work took under five minutes per file, dropping the cost to around $16,000.",
      },
    ],
    metaItems: [
      { iconName: "User", label: "ROLE", value: "Solo project" },
      { iconName: "Clock", label: "TIMELINE", value: "2 weeks" },
      { iconName: "TrendingUp", label: "IMPACT", value: "Estimated $1M annual savings for 1K designers" },
    ],
  },
  {
    slug: "pathogen-patrol",
    gallery: {
      heading: "Inside the simulation",
      items: [
        {
          src: "/images/case-studies/gallery/pathogen-patrol/01-title-screen.png",
          thumb: "/images/case-studies/gallery/pathogen-patrol/01-title-screen-thumb.png",
          alt: "The Pathogen Patrol title screen at Knotty Pines Senior Community",
          caption: "The title screen at Knotty Pines Senior Community.",
          width: 1600, height: 720,
          thumbWidth: 480, thumbHeight: 216,
        },
        {
          src: "/images/case-studies/gallery/pathogen-patrol/02-staff-announcement.png",
          thumb: "/images/case-studies/gallery/pathogen-patrol/02-staff-announcement-thumb.png",
          alt: "The staff announcement briefing, with audio and a transcript",
          caption: "The shift briefing, as audio with a transcript.",
          width: 1600, height: 1000,
          thumbWidth: 480, thumbHeight: 300,
        },
        {
          src: "/images/case-studies/gallery/pathogen-patrol/03-pick-your-character.png",
          thumb: "/images/case-studies/gallery/pathogen-patrol/03-pick-your-character-thumb.png",
          alt: "Picking a character: Niko, a medical assistant, or Casey, a rehab tech",
          caption: "Choosing a character: Niko, a medical assistant, or Casey, a rehab tech.",
          width: 1600, height: 1000,
          thumbWidth: 480, thumbHeight: 300,
        },
        {
          src: "/images/case-studies/gallery/pathogen-patrol/04-shift-begins.png",
          thumb: "/images/case-studies/gallery/pathogen-patrol/04-shift-begins-thumb.png",
          alt: "The start of the shift, with the Pine Points and shift progress tracker",
          caption: "The shift starts at 7:00 AM, tracking Pine Points and progress.",
          width: 1600, height: 1000,
          thumbWidth: 480, thumbHeight: 300,
        },
        {
          src: "/images/case-studies/gallery/pathogen-patrol/05-branching-decision.png",
          thumb: "/images/case-studies/gallery/pathogen-patrol/05-branching-decision-thumb.png",
          alt: "A branching decision: how to help Ms. Taylor out of bed",
          caption: "A branching decision: how to help Ms. Taylor out of bed.",
          width: 1600, height: 1000,
          thumbWidth: 480, thumbHeight: 300,
        },
      ],
    },
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
    gallery: {
      heading: "The app and the pipeline behind it",
      blurb:
        "Nobody writes these scenarios. At POS login an n8n workflow pulls store review data, sends it to an AI model that writes that day's scenario and shift tip, and posts the result back into the app before the lead starts work.",
      items: [
        {
          src: "/images/case-studies/gallery/cat-cafe-ai-app/whiskerbeans-shift-scenarios-test-n8n-07-29-2026-03-21-pm.png",
          thumb: "/images/case-studies/gallery/cat-cafe-ai-app/whiskerbeans-shift-scenarios-test-n8n-07-29-2026-03-21-pm-thumb.png",
          alt: "The n8n workflow: POS login trigger, Yelp review data, two OpenAI generation nodes, a merge, and a POST back to the app",
          caption:
            "The pipeline that writes them. A POS login pulls store review data, two OpenAI nodes write the scenario and the shift tip, and the merged result posts back to the app.",
          wide: true,
          width: 1320, height: 163,
          thumbWidth: 1320, thumbHeight: 163,
        },
        {
          src: "/images/case-studies/gallery/cat-cafe-ai-app/manager-espresso-shot-whiskerbeans-cafe-training-07-29-2026-03-23-pm.png",
          thumb: "/images/case-studies/gallery/cat-cafe-ai-app/manager-espresso-shot-whiskerbeans-cafe-training-07-29-2026-03-23-pm.png",
          alt: "Clocking in to the WhiskerBeans POS.",
          caption: "Clocking in to the WhiskerBeans POS.",
          frame: "device",
          width: 404, height: 635,
          thumbWidth: 404, thumbHeight: 635,
        },
        {
          src: "/images/case-studies/gallery/cat-cafe-ai-app/manager-espresso-shot-whiskerbeans-cafe-training-07-29-2026-03-23-pm-1.png",
          thumb: "/images/case-studies/gallery/cat-cafe-ai-app/manager-espresso-shot-whiskerbeans-cafe-training-07-29-2026-03-23-pm-1.png",
          alt: "The app writing that shift's scenario with AI, live at clock-in.",
          caption: "The app writing that shift's scenario with AI, live at clock-in.",
          frame: "device",
          width: 404, height: 895,
          thumbWidth: 404, thumbHeight: 895,
        },
        {
          src: "/images/case-studies/gallery/cat-cafe-ai-app/manager-espresso-shot-whiskerbeans-cafe-training-07-29-2026-03-26-pm.png",
          thumb: "/images/case-studies/gallery/cat-cafe-ai-app/manager-espresso-shot-whiskerbeans-cafe-training-07-29-2026-03-26-pm.png",
          alt: "An AI-written scenario: a customer gets frustrated during a rush.",
          caption: "An AI-written scenario: a customer gets frustrated during a rush.",
          frame: "device",
          width: 404, height: 963,
          thumbWidth: 404, thumbHeight: 963,
        },
        {
          src: "/images/case-studies/gallery/cat-cafe-ai-app/manager-espresso-shot-whiskerbeans-cafe-training-07-29-2026-03-35-pm.png",
          thumb: "/images/case-studies/gallery/cat-cafe-ai-app/manager-espresso-shot-whiskerbeans-cafe-training-07-29-2026-03-35-pm.png",
          alt: "A second AI-written scenario, on drink accuracy complaints.",
          caption: "A second AI-written scenario, on drink accuracy complaints.",
          frame: "device",
          width: 404, height: 963,
          thumbWidth: 404, thumbHeight: 963,
        },
        {
          src: "/images/case-studies/gallery/cat-cafe-ai-app/manager-espresso-shot-whiskerbeans-cafe-training-07-29-2026-03-26-pm-1.png",
          thumb: "/images/case-studies/gallery/cat-cafe-ai-app/manager-espresso-shot-whiskerbeans-cafe-training-07-29-2026-03-26-pm-1.png",
          alt: "Feedback on the choice, with the takeaway and a retry.",
          caption: "Feedback on the choice, with the takeaway and a retry.",
          frame: "device",
          width: 404, height: 866,
          thumbWidth: 404, thumbHeight: 866,
        },
        {
          src: "/images/case-studies/gallery/cat-cafe-ai-app/manager-espresso-shot-whiskerbeans-cafe-training-07-29-2026-03-27-pm.png",
          thumb: "/images/case-studies/gallery/cat-cafe-ai-app/manager-espresso-shot-whiskerbeans-cafe-training-07-29-2026-03-27-pm.png",
          alt: "The shift tip, written by the same workflow, with an example.",
          caption: "The shift tip, written by the same workflow, with an example.",
          frame: "device",
          width: 404, height: 536,
          thumbWidth: 404, thumbHeight: 536,
        },
        {
          src: "/images/case-studies/gallery/cat-cafe-ai-app/manager-espresso-shot-whiskerbeans-cafe-training-07-29-2026-03-27-pm-1.png",
          thumb: "/images/case-studies/gallery/cat-cafe-ai-app/manager-espresso-shot-whiskerbeans-cafe-training-07-29-2026-03-27-pm-1.png",
          alt: "The wrap-up: skills practiced and one thing to try next shift.",
          caption: "The wrap-up: skills practiced and one thing to try next shift.",
          frame: "device",
          width: 404, height: 868,
          thumbWidth: 404, thumbHeight: 868,
        },
      ],
    },
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
