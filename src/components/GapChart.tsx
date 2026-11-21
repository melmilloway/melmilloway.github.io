// identified = share who called it a violation; correct = share who also picked
// the right rule and seriousness. Both are shares of the same group of trainees.
const ITEMS = [
  { label: "Dot, the line cook", n: 19, identified: 89, correct: 11 },
  { label: "Handwashing sink", n: 23, identified: 96, correct: 22 },
  { label: "Sanitizer bucket", n: 21, identified: 71, correct: 10 },
  { label: "Chili", n: 22, identified: 77, correct: 55 },
  { label: "Storage rack", n: 30, identified: 73, correct: 60 },
  { label: "Potato salad", n: 22, identified: 64, correct: 55 },
];

const ROW_H = 44;
const LABEL_W = 148;
const BAR_W = 250;
const BAR_H = 18;
const PAD_T = 86;
const COL_1 = LABEL_W + BAR_W + 16;
const COL_2 = COL_1 + 74;

export default function GapChart() {
  const height = PAD_T + ITEMS.length * ROW_H + 8;
  const width = COL_2 + 46;
  const legend = [
    ["var(--color-purple)", 1, "Picked the correct rule and seriousness"],
    ["var(--color-teal)", 0.45, "Said it was a violation, but picked the wrong rule or seriousness"],
    ["var(--color-ink)", 0.12, "Did not say it was a violation"],
  ] as const;

  return (
    <figure className="my-8">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        role="img"
        aria-label="Each bar is all the trainees who judged that item. Dot the line cook, 19 trainees: 11 percent picked the correct rule and seriousness, 78 percent said it was a violation but picked the wrong rule or seriousness, 11 percent did not say it was a violation. Handwashing sink, 23 trainees: 22, 74 and 4 percent. Sanitizer bucket, 21 trainees: 10, 61 and 29 percent. Chili, 22 trainees: 55, 22 and 23 percent. Storage rack, 30 trainees: 60, 13 and 27 percent. Potato salad, 22 trainees: 55, 9 and 36 percent."
      >
        <g fontFamily="var(--font-comme), sans-serif">
          {legend.map(([fill, op, text], i) => (
            <g key={text}>
              <rect x={0} y={2 + i * 19} width={11} height={11} fill={fill} opacity={op} />
              <text x={18} y={12 + i * 19} fontSize="11.5" fill="var(--color-ink)">{text}</text>
            </g>
          ))}

          <text x={COL_1} y={PAD_T - 10} fontSize="10.5" fill="var(--color-purple)" letterSpacing="0.06em">CORRECT</text>
          <text x={COL_2} y={PAD_T - 10} fontSize="10.5" fill="var(--color-teal)" letterSpacing="0.06em">WRONG</text>

          {ITEMS.map((it, i) => {
            const y = PAD_T + i * ROW_H;
            const ok = it.correct;
            const partial = it.identified - it.correct;
            const missed = 100 - it.identified;
            const px = (v: number) => (v / 100) * BAR_W;
            return (
              <g key={it.label}>
                <text x={0} y={y + 12} fontSize="13" fill="var(--color-ink)">{it.label}</text>
                <text x={0} y={y + 27} fontSize="11" fill="var(--color-muted)">{it.n} trainees</text>

                <rect x={LABEL_W} y={y + 2} width={px(ok)} height={BAR_H} fill="var(--color-purple)" />
                <rect x={LABEL_W + px(ok)} y={y + 2} width={px(partial)} height={BAR_H} fill="var(--color-teal)" opacity="0.45" />
                <rect x={LABEL_W + px(ok + partial)} y={y + 2} width={px(missed)} height={BAR_H} fill="var(--color-ink)" opacity="0.12" />

                <text x={COL_1} y={y + 15} fontSize="12.5" fill="var(--color-purple)" fontWeight="500">{ok}%</text>
                <text x={COL_2} y={y + 15} fontSize="12.5" fill="var(--color-teal)">{partial}%</text>
              </g>
            );
          })}
        </g>
      </svg>
      <figcaption className="font-sans text-muted text-[13px] mt-3 leading-relaxed">
        Sunny Side Diner, November 17 to 20, 2026. Each bar is everyone who judged
        that item.
      </figcaption>
    </figure>
  );
}
