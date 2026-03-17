export default function HeroBlob() {
  return (
    <div
      className="blob-cont"
      aria-hidden="true"
      style={{ animation: "fadeIn 1.2s ease forwards" }}
    >
      {/* blob-1 — medium purple */}
      <div className="blob blob-1" />
      {/* blob-2 — light periwinkle */}
      <div className="blob blob-2" />
      {/* blob-3 — base purple */}
      <div className="blob blob-3" />
    </div>
  );
}
