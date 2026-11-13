/*
 * Trust Check content. All learner-facing copy lives here, word for word
 * from SPEC.md. Mel can edit any string below.
 */
window.TC_CONTENT = {
  /* Open item: replace this placeholder before the session. */
  shortLink: "[SHORT LINK]",
  linkedIn: "https://linkedin.com/in/melmilloway",

  welcome: {
    headlineLead: "Your team's performance starts with ",
    headlineAccent: "trusting you.",
    hook: "If you were getting something wrong and your team knew it, would they tell you?",
    /* Where the big welcome headline breaks: one phrase per line, each shorter
       than the last. Must join (with spaces) to exactly the hook above. */
    hookLines: ["If you were getting something", "wrong and your team knew it,", "would they tell you?"],
    body: "This check looks at 11 everyday cues to show where you are with a team: Build, Grow, or Sustain. Then it gives you tips for what to do next. Use it for a team you lead or any group you work with.",
    details: "About 4 minutes · Saved only in your browser",
    pdf: "At the end, download your results as a PDF so you can compare when you take it again.",
    start: "Start",
    comingBack: "Coming back to retake it?"
  },

  welcomeBack: {
    headline: "Welcome back.",
    retake: "Retake",
    startFresh: "Start fresh"
  },

  ask: {
    headline: "What do you want people to start doing?",
    body: "Keep one thing in mind as you answer. It could be a new process, a habit, or a way of working together.",
    examples: [
      "Using a standard process anyone on the team can follow",
      "Writing content out for review before building"
    ],
    placeholder: "Type it here, or just keep it in mind",
    optional: "Optional",
    hint: "Type the change you have in mind. It will show with your results and in your PDF.",
    skip: "Skip",
    max: 150
  },

  tried: {
    headline: "What have you tried since last time?",
    optional: "Optional",
    hint: "Type what you've tried. It will show with your results and in your PDF.",
    skip: "Skip",
    max: 250
  },

  stages: {
    headlineLead: "Trust happens in ",
    headlineAccent: "three stages.",
    intro: "Your answers to the 11 statements add up to a score that places you in one of these stages. At the end, your results show which stage you're in and give you tips for what to do next.",
    footer: "Next, rate 11 statements about the people you have in mind.",
    button: "Begin",
    list: [
      {
        zone: "Build",
        where: "You don't have their trust yet.",
        what: "Help people before you need anything from them. Learn what matters to them, help with their work, and keep small promises. This takes time, and it can't be rushed."
      },
      {
        zone: "Grow",
        where: "You've started to earn their trust, but you don't fully have it yet.",
        what: "Do more to support them. Get them the tools they need, bring them into real problems, and follow through on the commitments you make together."
      },
      {
        zone: "Sustain",
        where: "You have their trust.",
        what: "Keep watching how people act with you. Notice when someone changes, check in, and admit your own mistakes quickly."
      }
    ]
  },

  ratings: ["Rarely", "Sometimes", "About half the time", "Often", "Almost always"],

  groups: [
    { name: "Knowing my team", items: [0, 1, 2] },
    { name: "Telling me hard things", items: [3, 4, 5] },
    { name: "Sharing ideas and concerns", items: [6, 7, 8] },
    { name: "Admitting mistakes and asking for help", items: [9, 10] }
  ],

  statements: [
    {
      group: "Knowing my team",
      text: "I know what matters to people outside of work.",
      why: "People share personal things with people they feel safe with. If you know what matters to them, it's usually because they chose to tell you. Some people prefer to keep their lives private, and that's okay. What matters is whether they'd feel comfortable telling you.",
      there: "A teammate mentions their dad's surgery is next month. You plan ahead together so someone can cover the client deliverable due that week, and it's delivered on time.",
      missing: "The same teammate goes quiet and misses the deadline. You find out why only after the client complains to your manager."
    },
    {
      group: "Knowing my team",
      text: "I know what people want from their careers.",
      why: "Telling you where they want to go means trusting you won't hold it against them and might help them get there.",
      there: "You know a colleague wants to facilitate, so you bring them in to co-lead the next workshop. They get the experience they wanted, and the team gains another facilitator.",
      missing: "Your team's strongest designer leaves for a job with more room to grow. Three projects in progress lose the person who knew them best, and the team spends months hiring and onboarding a replacement."
    },
    {
      group: "Knowing my team",
      text: "When a problem comes up, I ask others how they'd solve it before offering my own answer.",
      why: "When you give your answer first, people learn their job is to follow it, not to think about the problem. Asking first shows you trust their judgment and gives them a chance to prove it.",
      there: "Course completion rates drop, so you ask the people working on it what's going on. A designer who talks to learners says the module is broken on mobile, and it's fixed in a day.",
      missing: "You decide the course is too long and push for a redesign. Two months later, completion is still low, because the real problem was the mobile bug nobody brought up."
    },
    {
      group: "Telling me hard things",
      text: "People bring problems to me before they turn into emergencies.",
      why: "Raising a problem early means risking being the one with bad news. People only do it when they expect help, not blame.",
      there: "A vendor delay gets flagged three weeks before launch. You move the date once, and stakeholders barely notice.",
      missing: "The same delay comes out two days before launch. You cancel a rollout people cleared their calendars for, and leadership starts questioning your team's timelines."
    },
    {
      group: "Telling me hard things",
      text: "People tell me when they disagree with me.",
      why: "Telling you they disagree is a risk, whether they say it in a meeting or one-on-one. People take it when they trust the relationship can handle it.",
      there: "In planning, someone says the new tool won't integrate with your LMS. You catch it before signing the contract.",
      missing: "Everyone agrees in the meeting. Six weeks into rollout, the integration problem surfaces, and the budget is already spent."
    },
    {
      group: "Telling me hard things",
      text: "When I ask for feedback, I get specific answers.",
      why: "Vague feedback is safe feedback. Specific answers mean people believe you really want to hear them.",
      there: "Someone tells you your last-minute requests are breaking up their focus time. You start batching requests, and deadlines stop being missed.",
      missing: "Everyone says everything is fine. The frustration shows up in an exit interview, when it's too late to fix."
    },
    {
      group: "Sharing ideas and concerns",
      text: "When I ask for input, people respond in their own way, even the quieter ones.",
      why: "Trust doesn't look the same for everyone. Quieter people often show it through other channels.",
      there: "Your quietest team member messages you after a meeting about a flaw in the rollout plan nobody else caught. You fix it before launch.",
      missing: "They see the same flaw and keep it to themselves. It shows up after launch as rework."
    },
    {
      group: "Sharing ideas and concerns",
      text: "When I suggest something new, people share their questions or concerns, in the moment or afterward.",
      why: "Questions and concerns, whether they come right away or a day later, mean people are working out how to make it succeed. When none come at all, they may have decided it won't.",
      there: "You introduce a new intake process, and people ask how it handles rush requests. You adjust it, and the team actually uses it.",
      missing: "People say \"sounds good,\" then keep emailing you requests directly. Three months later, you're managing two systems."
    },
    {
      group: "Sharing ideas and concerns",
      text: "People offer ideas I didn't ask for.",
      why: "Sharing an unrequested idea risks having it dismissed. People do it when they believe their input changes things.",
      there: "A teammate suggests templating the onboarding module they rebuild every quarter. It saves the team a week each time.",
      missing: "They keep rebuilding it by hand, and you never learn where that week went."
    },
    {
      group: "Admitting mistakes and asking for help",
      text: "People admit mistakes to me.",
      why: "Admitting a mistake means trusting that you'll focus on the fix, not the blame.",
      there: "Someone tells you they sent the wrong course version to the pilot group. You send a correction that afternoon.",
      missing: "The wrong version goes out to every learner, and you hear about it from a VP."
    },
    {
      group: "Admitting mistakes and asking for help",
      text: "People come to me for help when they're stuck.",
      why: "Asking for help means admitting you're stuck. People do it when they trust you won't think less of them for it.",
      there: "A new hire asks for help with the authoring tool on day two. Ten minutes with a teammate, and they're productive that week.",
      missing: "They figure it out alone for a week, miss their first deadline, and start wondering whether they made the right choice to join."
    }
  ],

  card: {
    heading: "Why this matters",
    there: "When it's there",
    missing: "When it's missing",
    next: "Next",
    last: "See my results"
  },

  zones: {
    Build: {
      range: "11–25",
      meaning: "Your team doesn't know yet whether it's safe to be honest with you. That's normal for new teams, new managers, and teams that were treated badly by a past leader.",
      focus: "Follow up and follow through, again and again. Trust grows from steady actions, and rushing won't speed it up.",
      tips: [
        ["Follow up on what people tell you.", "If someone mentions something that matters to them, ask later how it turned out. Many small follow-ups do more than one great conversation."],
        ["Do what you said you'd do.", "If you say you'll check on a tool license by Friday, come back on Friday, even if the answer is no."],
        ["Ask for their ideas before sharing yours.", "When a problem comes up, ask \"What would you try?\" before sharing your idea, and be open to theirs being better."],
        ["Wait before introducing major changes.", "If a change adds oversight or takes away control, wait until trust has grown, or bring the team the problem instead of your solution."]
      ],
      watchTitle: "Watch out for rushing",
      watch: "Getting to know people quickly and then introducing a major change can feel like a trick. People may wonder whether you were friendly only to get something from them.",
      note: "You don't need a title for this. Trust can start building before you're anyone's manager, as a peer, a teammate, or a project lead."
    },
    Grow: {
      range: "26–40",
      meaning: "People are starting to open up, but they're still testing what happens when they take a risk with you.",
      focus: "When someone takes a risk with you, like raising a problem or disagreeing, make sure it goes well for them.",
      tips: [
        ["Make their work easier.", "Ask, \"What's one thing I could do to make your work easier?\" Then do it, like getting them the right tool or stopping a report nobody reads."],
        ["Set a regular time to hear concerns.", "Set up a recurring time when anything can be raised, including concerns about how you lead. Act on at least one thing each time, so people see it leads somewhere."],
        ["Thank people when they disagree or admit a mistake.", "The first time someone disagrees with you or admits a mistake, your reaction decides whether they'll do it again. Thank them before you respond to what they said."],
        ["Let the team make a real decision on their own.", "Let the team fully own one decision, like how to structure the next project kickoff, and don't override it."]
      ],
      watchTitle: "Watch out for asking for ideas and then doing nothing",
      watch: "You ask the team, \"What should we change about how requests come in?\" They give you five ideas. Weeks go by, nothing changes, and you never mention it again. The next time you ask, no one answers. Always follow up, even when the answer is no: tell the team what you'll do, what you won't, and why.",
      note: ""
    },
    Sustain: {
      range: "41–55",
      meaning: "People bring you problems, ideas, and disagreement. You have trust, and the work now is keeping it, which starts with watching yourself as closely as you watch the team.",
      focus: "Keep noticing how people respond to you and how you treat them, so you catch it early if trust starts to slip.",
      tips: [
        ["Notice your own small missteps.", "Small missteps still happen at high trust, like thanking one person publicly for a project and leaving out someone else who helped. You may not notice it, but they will."],
        ["Notice when someone acts differently than usual.", "Compare each person to their own normal, not to the rest of the team. A usually talkative person giving short answers in a 1:1 is a sign."],
        ["Check in privately when something seems off.", "Ask privately, \"How are things going for you lately?\" Leave room for them to share, or not. When trust is high, people will tell you, and that's how you know it's still there."],
        ["Admit your own mistakes quickly.", "Apologize for the specific thing, and fix what you can, like recognizing their work too, in a way they're comfortable with. How you handle a misstep can strengthen trust more than never making one."],
        ["Give the team more ownership, and keep checking trust.", "This is when practices that need trust actually work, like open forums or full ownership of an initiative. Retake this check regularly and after major changes. New team members start at Build, even if the rest of the team is at Sustain."]
      ],
      watchTitle: "Watch out for assuming trust is permanent",
      watch: "The higher the trust, the more people notice when you make a mistake. Asking how you're doing makes it easier for them to tell you.",
      note: ""
    }
  },

  grid: {
    planTitle: "Planning a change with your team?",
    yourChange: "The change you typed earlier",
    skipped: "You skipped this earlier",
    reflect: "Think about one change you want people to make, like a new process, a habit, or a way of working together.",
    choose: "Choose one to see where you land.",
    question: "How much will this change affect your team?",
    note: "Telling people to change takes more trust than asking them.",
    sizes: [
      { id: "small", label: "Minor", desc: "Low risk, little changes for them. For example, sharing what's slowing them down." },
      { id: "medium", label: "Moderate", desc: "Changes how they work, and they help shape it. For example, a standard process the team decides together." },
      { id: "big", label: "Major", desc: "Takes away control or adds oversight. For example, a required review step before building." }
    ],
    cells: {
      Build: { small: "Go ahead", medium: "Create it together", big: "Build trust first" },
      Grow: { small: "Go ahead", medium: "Go ahead", big: "Create it together" },
      Sustain: { small: "Go ahead", medium: "Go ahead", big: "Go ahead" }
    },
    lines: {
      "Go ahead": "You have the trust to introduce this change.",
      "Create it together": "Create the change with your team before it starts, while trust grows.",
      "Build trust first": "Build trust before you introduce this change."
    },
    /* One concrete action for each result, shown in the result box and the PDF. */
    actions: {
      "Go ahead": "Introduce the change, explain why it matters, and check in with the team to see how it's going.",
      "Create it together": "Share the problem with your team and ask how they would solve it before you decide on the change.",
      "Build trust first": "Hold off on this change for now. Use the ways to build trust above, then retake this check before you introduce it."
    }
  },

  results: {
    mapLabel: "On this page",
    mapDownload: "Download PDF",
    mapPart1: "Your results and how to build trust",
    mapPart2: "Planning a change with your team (optional)",
    part1: "Part 1",
    part2: "Part 2 \u00b7 Optional",
    tipsLabel: { Build: "Ways to build trust in Build", Grow: "Ways to build trust in Grow", Sustain: "Ways to keep trust in Sustain" },
    tipsScope: "These apply to anyone in {zone}, whatever change you're planning.",
    nextStepLabel: "Next step",
    cuesToggle: "See all 11 cues and your scores",
    bigReason: "Every one of these cues affects whether your team will take on the changes you want. When trust is there, people bring you problems, ideas, and effort. When it isn't, you're working without the information and energy your team already has.",
    download: "Download my results (PDF)",
    downloadNote: "Your results are saved only in this browser, and they can be cleared. Download your PDF so you can compare next time.",
    noStorage: "Your browser isn't saving results, so download your PDF to compare later.",
    comparePdf: "Compare these results with your PDF from last time.",
    howToRead: "A statement you cared about went up: what you're doing is working. No change: keep going, since trust builds slowly. Your zone went up: you may be ready to introduce a larger change.",
    askLabel: "What I want people to start doing",
    triedLabel: "What I've tried since last time",
    startFresh: "Start fresh",
    retakeLater: "Retake later at "
  },

  home: {
    label: "Trust Check: go to the start",
    heading: "Go back to the start?",
    body: "Your answers so far won't be saved.",
    stay: "Keep going",
    go: "Go to the start"
  },

  steps: {
    button: "Steps",
    heading: "Jump to a step",
    intro: "Go back to any step you've already seen. The next questions open as you answer.",
    results: "Your results",
    locked: "Locked",
    close: "Close"
  },

  startFresh: {
    heading: "Start fresh?",
    body: "This clears all your saved results from this browser, including your comparison history. You can't undo this.",
    note: "Download your PDF first if you want to keep them.",
    download: "Download PDF",
    clear: "Clear and start fresh",
    cancel: "Cancel"
  },

  cleared: {
    heading: "We couldn't find your results from last time.",
    body: "Your browser's local storage may have been cleared, or you may be on a different device or browser. Open the PDF you downloaded last time, take the check again, and compare your new results with it side by side.",
    button: "Take it again",
    back: "Back"
  },

  leave: {
    heading: "Download your results before you go?",
    download: "Download PDF",
    leave: "Leave without downloading"
  }
};
