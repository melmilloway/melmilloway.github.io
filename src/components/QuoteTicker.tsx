const gradients = {
  'terracotta-purple': 'linear-gradient(90deg, rgba(196, 103, 58, 0.3) 0%, rgba(66, 49, 169, 0.3) 100%)',
  'purple-teal': 'linear-gradient(90deg, rgba(66, 49, 169, 0.3) 0%, rgba(45, 110, 110, 0.3) 100%)',
} as const;

type Variant = keyof typeof gradients;

export default function QuoteTicker({ variant }: { variant: Variant }) {
  const border = gradients[variant];
  return (
    <>
      <div style={{ height: '1px', background: border }} />
      <div
        className="overflow-hidden py-4"
        style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}
        aria-label="Quote"
      >
        <div className="marquee-track">
          <span className="font-serif italic text-ink/70 text-[28px] leading-none select-none whitespace-nowrap">
            Artists who seek perfection in everything are those who cannot attain it in anything. ― Eugene Delacroix &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
          <span className="font-serif italic text-ink/70 text-[28px] leading-none select-none whitespace-nowrap" aria-hidden="true">
            Artists who seek perfection in everything are those who cannot attain it in anything. ― Eugene Delacroix &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
        </div>
      </div>
      <div style={{ height: '1px', background: border }} />
    </>
  );
}
