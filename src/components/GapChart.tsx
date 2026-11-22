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

const ROW_H = 44;
const LABEL_W = 148;
const BAR_W = 250;
const BAR_H = 18;
const PAD_T = 86;
const COL_1 = LABEL_W + BAR_W + 20;
const COL_2 = COL_1 + 80;
const COL_3 = COL_2 + 80;

export default function GapChart() {
  const height = PAD_T + ITEMS.length * ROW_H + 8;
  const width = COL_3 + 56;
  // One entry per segment. The same word labels the swatch and the number column,
  // so nothing in the chart is named two different ways.
  const KEYS = [
    {
      word: "CORRECT",
      ink: "var(--color-purple)",
      fill: "var(--color-purple)",
      op: 1,
      def: "cited the correct violation and the correct seriousness",
      x: COL_1,
    },
    {
      word: "MIS-CITED",
      ink: "var(--color-teal)",
      fill: "var(--color-teal)",
      op: 0.45,
      def: "said it was a violation, but cited the wrong one or the wrong seriousness",
      x: COL_2,
    },
    {
      word: "MISSED",
      ink: "var(--color-muted)",
      fill: "var(--color-ink)",
      op: 0.12,
      def: "did not say it was a violation, but it was one",
      x: COL_3,
    },
  ] as const;

  return (
    <figure className="my-8">
      <figcaption className="font-serif text-ink text-[19px] tracking-[-0.01em] mb-1">
        Trainees often see that something is wrong but cannot say which violation
        it is or how serious
      </figcaption>
      <p className="font-sans text-ink/70 text-[13px] leading-relaxed mb-4">
        Each of the six violations at Sunny Side Diner. The three items that are not
        violations are not shown here.
      </p>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        role="img"
        aria-label="All six violations at Sunny Side Diner. Every item here is a violation, so citing nothing is always a miss. Each bar is all the trainees who judged that item, split into cited correctly, mis-cited, and missed. Storage rack, 31 trainees: 61, 10 and 29 percent. Chili, 22 trainees: 59, 18 and 23 percent. Potato salad, 22 trainees: 55, 9 and 36 percent. Handwashing sink, 23 trainees: 22, 74 and 4 percent. Dot the line cook, 19 trainees: 11, 78 and 11 percent. Sanitizer bucket, 21 trainees: 10, 61 and 29 percent."
      >
        <g fontFamily="var(--font-comme), sans-serif">
          {KEYS.map((k, i) => (
            <g key={k.word}>
              <rect x={0} y={2 + i * 19} width={11} height={11} fill={k.fill} opacity={k.op} />
              <text x={18} y={12 + i * 19} fontSize="11.5" fill="var(--color-ink)">
                <tspan fill={k.ink} letterSpacing="0.06em">{k.word}</tspan>
                <tspan dx="7">{k.def}</tspan>
              </text>
            </g>
          ))}

          {KEYS.map((k) => (
            <text key={k.word} x={k.x} y={PAD_T - 10} fontSize="10.5" fill={k.ink} letterSpacing="0.06em">{k.word}</text>
          ))}

          {ITEMS.map((it, i) => {
            const y = PAD_T + i * ROW_H;
            const missed = 100 - it.correct - it.miscited;
            const px = (v: number) => (v / 100) * BAR_W;
            return (
              <g key={it.label}>
                <text x={0} y={y + 12} fontSize="13" fill="var(--color-ink)">{it.label}</text>
                <text x={0} y={y + 27} fontSize="11" fill="var(--color-muted)">{it.n} trainees</text>

                <rect x={LABEL_W} y={y + 2} width={px(it.correct)} height={BAR_H} fill="var(--color-purple)" />
                <rect x={LABEL_W + px(it.correct)} y={y + 2} width={px(it.miscited)} height={BAR_H} fill="var(--color-teal)" opacity="0.45" />
                <rect x={LABEL_W + px(it.correct + it.miscited)} y={y + 2} width={px(missed)} height={BAR_H} fill="var(--color-ink)" opacity="0.12" />

                <text x={COL_1} y={y + 15} fontSize="12.5" fill="var(--color-purple)" fontWeight="500">{it.correct}%</text>
                <text x={COL_2} y={y + 15} fontSize="12.5" fill="var(--color-teal)">{it.miscited}%</text>
                <text x={COL_3} y={y + 15} fontSize="12.5" fill="var(--color-muted)">{missed}%</text>
              </g>
            );
          })}
        </g>
      </svg>
      <p className="font-sans text-muted text-[13px] mt-3 leading-relaxed">
        Each bar is everyone who judged that item, so the three numbers add to 100%.
      </p>
    </figure>
  );
}
