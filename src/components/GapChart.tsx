// correct  = cited the correct violation and the correct seriousness
// miscited = said it was a violation, but cited the wrong one or the wrong seriousness
// missed   = did not say it was a violation
// All three are shares of the same trainees, so they add to 100.
const ITEMS = [
  { label: "Storage rack", n: 31, correct: 61, miscited: 10 },
  { label: "Chili", n: 22, correct: 59, miscited: 18 },
  { label: "Potato salad", n: 22, correct: 55, miscited: 9 },
  { label: "Handwashing sink", n: 23, correct: 22, miscited: 74 },
  { label: "Dot, the line cook", n: 19, correct: 11, miscited: 78 },
  { label: "Sanitizer bucket", n: 21, correct: 10, miscited: 61 },
];

// One entry per segment. The same word labels the swatch and the number column,
// so nothing in the chart is named two different ways.
const KEYS = [
  {
    word: "CORRECT",
    ink: "text-purple",
    bar: "bg-purple",
    swatch: "bg-purple",
    def: "cited the correct violation and the correct seriousness",
  },
  {
    word: "MIS-CITED",
    ink: "text-teal",
    bar: "bg-teal/45",
    swatch: "bg-teal/45",
    def: "said it was a violation, but cited the wrong one or the wrong seriousness",
  },
  {
    word: "MISSED",
    ink: "text-muted",
    bar: "bg-ink/12",
    swatch: "bg-ink/12",
    def: "did not say it was a violation, but it was one",
  },
] as const;

export default function GapChart() {
  return (
    <figure className="my-8 font-sans">
      <figcaption className="font-serif text-ink text-[19px] leading-snug tracking-[-0.01em] mb-1">
        Trainees often see that something is wrong but cannot say which violation
        it is or how serious
      </figcaption>
      <p className="text-ink/70 text-[13px] leading-relaxed mb-4">
        Each of the six violations at Sunny Side Diner. The three items that are not
        violations are not shown here.
      </p>

      {/* Legend */}
      <ul className="mb-6 space-y-1.5">
        {KEYS.map((k) => (
          <li key={k.word} className="flex gap-2.5 text-[12.5px] leading-snug">
            <span className={`mt-[3px] h-[11px] w-[11px] shrink-0 ${k.swatch}`} aria-hidden="true" />
            <span className="text-ink">
              <span className={`${k.ink} font-semibold tracking-[0.05em]`}>{k.word}</span>{" "}
              {k.def}
            </span>
          </li>
        ))}
      </ul>

      {/* Column headers, wide screens only — the numbers are labelled inline below */}
      <div className="hidden sm:flex items-end gap-x-4 mb-2 text-[10.5px] tracking-[0.06em] font-semibold">
        <span className="w-[136px] shrink-0" />
        <span className="flex-1 min-w-0" />
        {KEYS.map((k) => (
          <span key={k.word} className={`w-[64px] shrink-0 whitespace-nowrap ${k.ink}`}>{k.word}</span>
        ))}
      </div>

      <div className="space-y-3.5">
        {ITEMS.map((it) => {
          const missed = 100 - it.correct - it.miscited;
          const vals = [it.correct, it.miscited, missed];
          return (
            <div
              key={it.label}
              className="flex flex-wrap items-center gap-x-4 gap-y-1.5 sm:flex-nowrap"
            >
              <div className="w-full sm:w-[136px] sm:shrink-0">
                <div className="text-ink text-[13.5px] leading-tight">{it.label}</div>
                <div className="text-muted text-[11.5px]">{it.n} trainees</div>
              </div>

              <div className="flex h-[18px] w-full sm:flex-1 sm:w-auto sm:min-w-0 overflow-hidden">
                {KEYS.map((k, i) => (
                  <span key={k.word} className={k.bar} style={{ width: `${vals[i]}%` }} />
                ))}
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1 sm:contents">
                {KEYS.map((k, i) => (
                  <span
                    key={k.word}
                    className={`whitespace-nowrap sm:w-[64px] sm:shrink-0 text-[12.5px] tabular-nums ${k.ink} ${i === 0 ? "font-medium" : ""}`}
                  >
                    <span className="sm:hidden text-[10px] tracking-[0.05em] font-semibold mr-1">
                      {k.word}
                    </span>
                    {vals[i]}%
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-muted text-[13px] mt-4 leading-relaxed">
        Each bar is everyone who judged that item, so the three numbers add to 100%.
      </p>
    </figure>
  );
}
