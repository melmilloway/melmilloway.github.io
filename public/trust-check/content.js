/*
 * Trust Check content. All learner-facing copy lives here, word for word
 * from SPEC.md. Mel can edit any string below.
 */
window.TC_CONTENT = {
  linkedIn: "https://linkedin.com/in/melmilloway",
  footer: { owner: "\u00a9 2026 Mel Milloway", privacy: "Your answers stay in this browser. No cookies or tracking." },

  welcome: {
    headlineLead: "Your team's performance starts with ",
    headlineAccent: "trusting you.",
    hook: "If you were getting something wrong and your team knew it, would they tell you?",
    /* Where the big welcome headline breaks: one phrase per line, each shorter
       than the last. Must join (with spaces) to exactly the hook above. */
    hookLines: ["If you were getting something", "wrong and your team knew it,", "would they tell you?"],
    body: "This check looks at 11 everyday cues to show where you are with a team: Build, Grow, or Sustain. Then it gives you tips for building the trust that drives results.",
    use: "Use it for a team you lead or any group you work with.",
    details: "About 4 minutes · Saved only in your browser",
    pdf: "At the end, download your results as a PDF so you can compare when you take it again.",
    start: "Start",
    viewPrevious: "View previous results"
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
    max: 800
  },

  tried: {
    headline: "What have you tried since last time?",
    optional: "Optional",
    hint: "Type what you've tried. It will show with your results and in your PDF.",
    skip: "Skip",
    max: 800
  },

  stages: {
    headlineLead: "Trust happens in ",
    headlineAccent: "three stages.",
    /* Intro under the heading: what you'll do (with the four areas), then what the score means. */
    rateLead: "You'll rate 11 statements about the people you have in mind, in four areas:",
    intro: "Your answers add up to a score that places you in one of these stages. At the end, your results show which stage you're in and give you tips for what to do next.",
    ready: "Ready? It takes about 4 minutes.",
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
        what: "Do more to support them. Get them the tools they need, bring them into the problems you're solving, and follow through on the commitments you make together."
      },
      {
        zone: "Sustain",
        where: "You have their trust.",
        what: "Keep watching how people act with you. Notice when someone changes, check in, and admit your own mistakes quickly."
      }
    ]
  },

  ratings: ["Rarely", "Sometimes", "Often", "Almost always"],

  groups: [
    { name: "Knowing my team", items: [0, 1, 2] },
    { name: "Telling me difficult things", items: [3, 4, 5] },
    { name: "Joining in with ideas and questions", items: [6, 7, 8] },
    { name: "Admitting mistakes and asking for help", items: [9, 10] }
  ],

  statements: [
    {
      group: "Knowing my team",
      text: "When someone on my team has something big going on outside of work, I know about it.",
      why: "When you know what matters to people outside work, like a new baby, a sick parent or a race they're training for, they feel like you see them as a person. People who feel known by their manager care more about the team and its goals. Some people prefer to keep their lives private, and that's okay. What matters is whether they'd feel comfortable telling you.",
      there: "A teammate tells you their dad is having surgery next month. You move a deadline and make sure their work is covered, so they're not rushing beforehand and can be with him without checking email. When they're back, you ask how he's doing. They feel like part of the team, and the next time someone else needs time off, they're the first to offer help.",
      missing: "The same teammate puts the time off on the calendar but doesn't say why. Maybe you've never asked about life outside work, or the last time they shared something, you moved straight on to the agenda. In the weeks before, they rush to finish everything while juggling appointments, and their work isn't up to their usual standard. You don't know why, so you can't help. When they're back, no one asks how their dad is. They feel like a name on a project list, and a few months later they take a job on a team where they feel known.",
      try: "Start your next one-on-one with a few minutes that aren't about work, like \"How was your weekend?\" If they've mentioned something before, ask about it, like \"How did your daughter's recital go?\" Remember what they share and bring it up next time."
    },
    {
      group: "Knowing my team",
      text: "When a new project or stretch opportunity comes up, I know who on my team would want it.",
      why: "Telling you what they want from their career means trusting you won't hold it against them, and that you might help them get to that next step.",
      there: "You know a colleague wants to facilitate, so you bring them in to co-lead the next workshop. They get the experience they wanted, and the team gains another facilitator.",
      missing: "Your team's strongest designer leaves for a job with more room to grow. Three projects in progress lose the person who knew them best, and the team spends months hiring and onboarding a replacement.",
      try: "In your next one-on-one, ask about their work right now, like \"What part of your job do you enjoy most, and would you like to do more of it?\" or \"Is there a skill you'd like to build this year?\" It's okay if they don't have a plan. Write down what they say, and look for one project or person that could help."
    },
    {
      group: "Knowing my team",
      text: "When a problem comes up, I ask others how they'd solve it before offering my own answer.",
      why: "When you give your answer first, people learn to wait for your answer instead of solving the problem themselves. Asking first shows you trust their judgment, and you get the benefit of what they know about the work, like a learner complaint you hadn't heard.",
      there: "Course completion rates drop, so you ask the people working on it what's going on. A designer who talks to learners says the module is broken on mobile, and it's working the next day.",
      missing: "You decide the course is too long and push for a redesign. Two months later, completion is still low, because the problem was the mobile bug nobody brought up.",
      try: "Next time someone brings you a problem, ask \"What have you tried?\" or \"What would you try?\" and wait before sharing your idea. If the risk is small, let them go with their approach, even if you'd do it differently."
    },
    {
      group: "Telling me difficult things",
      text: "People bring problems to me before they turn into emergencies.",
      why: "Raising a problem before it turns into an emergency means risking being the one with bad news. People only raise problems when they expect help, not blame.",
      there: "A team member tells you about a vendor delay three weeks before launch. You move the date once, and stakeholders barely notice.",
      missing: "The same delay comes out two days before launch. You cancel a rollout people cleared their calendars for, and leadership starts questioning your team's timelines.",
      try: "When someone brings you bad news, thank them before you ask any questions. Then ask \"What do you need from me?\""
    },
    {
      group: "Telling me difficult things",
      text: "People tell me when they disagree with me.",
      why: "Disagreeing with their manager is a risk, whether they say it in a meeting or one-on-one. People disagree with you when they trust you won't hold it against them, like giving them less interesting projects afterward.",
      there: "In planning, someone says the new tool won't integrate with your LMS. You catch it before signing the contract.",
      missing: "Everyone agrees in the meeting. Six weeks into rollout, the integration problem comes out, and the budget is already spent.",
      try: "Before you make your next decision, share your thinking and ask the team \"What are your thoughts?\" or \"What would you change?\" Thank each person who answers, especially anyone who disagrees with you."
    },
    {
      group: "Telling me difficult things",
      text: "When I ask for feedback, I get specific answers.",
      why: "Vague feedback is safe feedback. Specific answers mean people believe you want to hear the answer.",
      there: "Someone tells you your last-minute requests are breaking up the time they set aside for deep work. You start batching requests, and deadlines stop slipping.",
      missing: "Everyone says everything is fine. The frustration comes out in an exit interview, when it's too late to change anything.",
      try: "Swap \"Any feedback?\" for a narrower question, like \"What's one thing I could do differently in our team meetings?\" or \"What would make our one-on-ones more useful for you?\" Then tell them what you changed because of it."
    },
    {
      group: "Joining in with ideas and questions",
      text: "When I ask for input, people respond, even if they respond in their own way, like a message after a meeting.",
      why: "Not everyone shares ideas out loud in a meeting. People who rarely speak up in meetings often share in other ways, like a message afterward.",
      there: "A team member who rarely speaks up in meetings messages you after a meeting about a flaw in the rollout plan nobody else caught. You update the plan before launch.",
      missing: "They see the same flaw and keep it to themselves. Customers find the flaw after launch, and the team spends weeks redoing the rollout.",
      try: "Offer more than one way to give input. You could say \"Share it in the meeting, drop it in the chat, or message me afterward. They all count the same.\" Then give credit for ideas that come in each way."
    },
    {
      group: "Joining in with ideas and questions",
      text: "When I suggest something new, people ask questions or suggest changes, right away or afterward.",
      why: "When people ask questions or suggest changes to something new, they're open to it and thinking about how to use it. If no one says anything, they may have already decided against it.",
      there: "You introduce a new intake process, and people ask how it handles rush requests. You adjust it, and the team uses it.",
      missing: "People say \"sounds good,\" then keep emailing you requests directly. Three months later, you're managing two systems.",
      try: "When you share something new, end with \"What questions do you have, or what would make this work better for you? You can tell me now or send them later.\" Then get back to each person who responds. When they see you took their question seriously, they're more likely to speak up again next time."
    },
    {
      group: "Joining in with ideas and questions",
      text: "People offer ideas I didn't ask for.",
      why: "Sharing an idea no one asked for risks having it brushed off. People do it when they've seen their past ideas get used, or at least taken seriously.",
      there: "A teammate suggests templating the onboarding module they rebuild every quarter. It saves the team a week each time.",
      missing: "They keep rebuilding the onboarding module by hand, and you never find out the team loses a week to it every quarter.",
      try: "When someone offers an idea you didn't ask for, thank them for bringing it to you, and mean it. Then ask a follow-up question, like \"What gave you the idea?\" or \"How would that work?\" You don't have to say yes or no on the spot. If it's low risk and the team has room for it, let them try it. If it's not a priority right now, tell them you're glad they raised it, think it through, then let them know what you decided and why."
    },
    {
      group: "Admitting mistakes and asking for help",
      text: "People admit mistakes to me.",
      why: "When someone tells you they made a mistake, like sending the wrong file to a client, they're trusting you to help them sort it out instead of holding it against them. People only take that risk when they've seen you respond calmly before.",
      there: "Someone tells you they sent the wrong course version to the pilot group. You send a correction that afternoon.",
      missing: "The wrong version goes out to every learner, and you hear about it from a VP.",
      try: "When someone tells you about a mistake, thank them for telling you before anything else. Then ask \"How can I help?\" It also helps to share one of your own mistakes and what you did next, so it's easier for them to share theirs."
    },
    {
      group: "Admitting mistakes and asking for help",
      text: "When people have tried what they can and are still stuck, they come to me for help.",
      why: "When people ask you for help, they're admitting they're stuck. They do it when they trust they won't be penalized for it, like getting passed over for the next project.",
      there: "A new hire tries the help guide for the authoring tool, still can't publish, and asks you for help on day two. Ten minutes with a teammate, and they're productive that week.",
      missing: "They run out of ideas and keep struggling alone for a week, fall behind on their first deadline, and start wondering whether they made the right choice to join.",
      try: "When someone comes to you for help, thank them for asking. Then talk it through together: what they've tried, where they got stuck and what might help next. You can also mention something you got help with recently and who helped, so asking for help looks like a normal part of the job."
    }
  ],

  card: {
    heading: "Why this matters",
    there: "When it's there",
    missing: "When it's missing",
    tryThis: "Try this",
    next: "Next",
    last: "See my results"
  },

  zones: {
    Build: {
      range: "11–22",
      meaning: "Your team doesn't know yet whether it's safe to tell you about problems or disagree with you. That's normal for new teams, new managers, and teams that were treated badly by a past leader.",
      focus: "Follow up and follow through, again and again. Trust grows when people see you keep small promises week after week, and rushing won't speed it up.",
      tips: [
        ["Follow up on what people tell you.", "If someone mentions something that matters to them, ask later how it turned out. Many small follow-ups do more than one great conversation."],
        ["Do what you said you'd do.", "If you say you'll check on a tool license by Friday, come back on Friday, even if the answer is no."],
        ["Ask for their ideas before sharing yours.", "When a problem comes up, ask \"What would you try?\" before sharing your idea, and be open to theirs being better."],
        ["Admit what you don't know.", "When someone asks something you can't answer, say \"I don't know\" and tell them how you'll find out. Then come back with the answer. When you say you don't know, your team sees it's okay for them to say it too."]
      ],
      watchTitle: "Watch out for rushing",
      watch: "Getting to know people quickly can feel like a tactic, especially if you start asking for more right after. People may wonder whether you were friendly only to get something from them.",
      note: "You don't need a title for this. Trust can start building before you're anyone's manager, as a peer, a teammate, or a project lead."
    },
    Grow: {
      range: "23–32",
      meaning: "People are starting to open up, like raising a small problem or disagreeing with you in a one-on-one. They're watching how you react before they raise a problem or disagree again.",
      focus: "When someone raises a problem or disagrees with you, thank them and act on what they said, so they're willing to speak up again.",
      tips: [
        ["Make their work easier.", "Ask, \"What's one thing I could do to make your work easier?\" Then do it, like getting them the right tool or stopping a report nobody reads."],
        ["Set a regular time to hear concerns.", "Set up a recurring time when anything can be raised, including concerns about how you lead. Act on at least one thing each time, so people see that raising a concern leads to a change."],
        ["Thank people when they disagree or admit a mistake.", "The first time someone disagrees with you or admits a mistake, your reaction decides whether they'll do it again. Thank them before you respond to what they said."],
        ["Let the team make a decision on their own.", "Let the team fully own one decision, like how to structure the next project kickoff, and don't override it."]
      ],
      watchTitle: "Watch out for not following through on your part",
      watch: "You ask the team, \"What should we change about how requests come in?\" You agree on next steps: they'll track where requests get stuck, and you'll ask the other team for a new intake form. They do their part. Weeks go by, and you never do yours. The next time you ask, no one answers. When you split the work, follow through on what you own and tell the team when it's done. If your plans change, say so and say why.",
      note: ""
    },
    Sustain: {
      range: "33–44",
      meaning: "People bring you problems, ideas, and disagreement. You have trust, and the work now is keeping it, which starts with noticing your own small missteps, like forgetting to credit someone who helped.",
      focus: "Keep noticing how people respond to you and how you treat them, so you can tell right away when trust starts to slip.",
      tips: [
        ["Notice your own small missteps.", "Small missteps still happen at high trust, like thanking one person publicly for a project and leaving out someone else who helped. You may not notice it, but they will."],
        ["Notice when someone acts differently than usual.", "Compare each person to their own normal, not to the rest of the team. A usually talkative person giving short answers in a 1:1 is a sign."],
        ["Check in privately when something seems off.", "Ask privately, \"How are things going for you lately?\" Leave room for them to share, or not. When trust is high, people will tell you, and that's how you know it's still there."],
        ["Admit your own mistakes quickly.", "When you get something wrong, tell the person what it was and apologize. Then do something about it, like recognizing the person you left out, in a way they're comfortable with. When your team sees you handle your own mistake this way, they're more likely to tell you when they make one."],
        ["Give the team more ownership, and keep checking trust.", "This is when practices that need trust start to work, like open forums or full ownership of an initiative. Retake this check regularly and after major changes. New team members start at Build, even if the rest of the team is at Sustain."]
      ],
      watchTitle: "Watch out for assuming trust is permanent",
      watch: "The higher the trust, the more people notice when you make a mistake. Ask regularly, \"What's one thing I could do better?\" so it's easier for them to tell you when you get something wrong.",
      note: ""
    }
  },

  grid: {
    planTitle: "Planning a change with your team?",
    changeQuestion: "What change are you planning?",
    changeHint: "Optional. If you type it, it will show in your PDF.",
    yourChange: "The change you typed earlier",
    skipped: "You skipped this earlier",
    reflect: "Think about one change you want people to make, like a new process, a habit, or a way of working together.",
    choose: "Choose one to see what it means for a team in {zone}.",
    question: "How much will this change affect your team?",
    note: "Telling people to change takes more trust than asking them.",
    sizes: [
      { id: "small", label: "Minor", desc: "Barely changes how people work. For example, adding a shared notes doc to your weekly meeting." },
      { id: "medium", label: "Moderate", desc: "Changes how they work, and they help decide what the change looks like. For example, a standard process the team agrees on together." },
      { id: "big", label: "Major", desc: "Takes away control or adds oversight. For example, a required review step before building." }
    ],
    cells: {
      Build: { small: "Go ahead", medium: "Create it together", big: "Build trust first" },
      Grow: { small: "Go ahead", medium: "Go ahead", big: "Create it together" },
      Sustain: { small: "Go ahead", medium: "Go ahead", big: "Go ahead" }
    },
    lines: {
      "Go ahead": "You have the trust to introduce this change.",
      "Create it together": "Ask your team to help design the change before you introduce it.",
      "Build trust first": "Build trust before you introduce this change."
    },
    /* One concrete action for each result, shown in the result box and the PDF. */
    actions: {
      "Go ahead": "Introduce the change, explain why it matters, delegate the work, and check in with the team to see how it's going.",
      "Create it together": "Share the problem with your team and ask how they would solve it before you decide on the change. Then move forward with the change together.",
      "Build trust first": "Hold off on this change unless it's business critical. Use the ways to build trust above, then retake this check before you introduce it."
    }
  },

  results: {
    intro: "Below are the 11 cues behind your score and {tips}. If you're planning a change, the {planner} helps you see whether there's enough trust for it to go well. At the bottom, you can download a PDF of everything to compare next time.",
    plannerLink: "optional planner",
    mapLabel: "On this page",
    mapDownload: "Download PDF",
    mapPart1: "Your results and how to build trust",
    mapPart2: "Planning a change with your team (optional)",
    part1Heading: "Part 1: {tips}",
    part2Heading: "Part 2: Planning a change with your team in {zone} (optional)",
    part1: "Part 1",
    part2: "Part 2 \u00b7 Optional",
    tipsLabel: { Build: "Ways to build trust in Build", Grow: "Ways to build trust in Grow", Sustain: "Ways to keep trust in Sustain" },
    tipsScope: "Use these day to day with your team, whether or not you're planning a change.",
    capNote: "Your total is in the Sustain range, but {area} is lower than the rest, so you're in Grow until it catches up.",
    capNoteMany: "Your total is in the Sustain range, but {count} areas are lower than the rest: {areas}. You're in Grow until they catch up.",
    meterMoved: "{n} out of {max}, in the {from} range, moved to {zone}",
    liftNote: "Your total is in the Build range, but most of your low ratings are in {area}, so you're in Grow. {area} is the place to start.",
    tableDownload: "Download as a table (spreadsheet)",
    updateResults: "Update my results",
    nextStepLabel: "Next step",
    scoreLine: "Your score: {n} out of 44",
    cuesHeading: "What's behind your score",
    cuesToggle: "See how you rated all 11 cues",
    bigReason: "Every one of these cues affects whether your team will take on the changes you want. When trust is there, people tell you about problems while there's still time to solve them, suggest better ways to do the work, and put in extra effort. When it isn't, people keep problems and ideas to themselves and do only what's asked. You find out about problems late, and you make decisions without what your team knows.",
    download: "Download my results (PDF)",
    downloadNote: "Your results are saved only in this browser, and they can be cleared. Download your PDF so you can compare next time.",
    saveHeading: "Save your results",
    noStorageHeading: "Your browser isn't saving results",
    noStorage: "Download your PDF so you can compare your results next time.",
    comparePdf: "Compare these results with your PDF from last time.",
    howToRead: "A statement you cared about went up: what you're doing is working. No change: keep going, since trust builds slowly. Your zone went up: you may be ready to introduce a larger change.",
    askLabel: "The change I'm planning",
    pdfAnswersTitle: "Your answers, and why each one matters",
    pdfYourAnswer: "Your answer",
    pdfFirstTake: "First take",
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
    button: "Menu",
    heading: "Go back to any part",
    intro: "You can open anything you've already seen. The next questions open as you answer.",
    results: "Your results",
    answer: "Your answer:",
    locked: "Locked",
    close: "Close"
  },

  startFresh: {
    heading: "Start fresh?",
    body: "This clears your saved results from this browser. You can't undo this.",
    note: "Download your PDF first if you want to keep them.",
    download: "Download PDF",
    clear: "Clear and start fresh",
    cancel: "Cancel"
  },

  cleared: {
    heading: "We couldn't find any saved results.",
    body: "Your results may have been cleared, or you may be on a different device or browser. If you downloaded a PDF last time, it has everything. You can also take the check again and compare your new results with that PDF.",
    button: "Take it again",
    back: "Back"
  },

  leave: {
    heading: "Download your results before you go?",
    download: "Download PDF",
    leave: "Leave without downloading"
  }
};
