export interface CaseStudyVideoData {
  src: string;
  poster: string;
  captions?: string;
  heading: string;
  blurb?: string;
  width: number;
  height: number;
}

export default function CaseStudyVideo({
  src,
  poster,
  captions,
  heading,
  blurb,
  width,
  height,
}: CaseStudyVideoData) {
  return (
    <section className="mt-16 md:mt-20" aria-labelledby="video-heading">
      <h2
        id="video-heading"
        className="font-serif text-ink text-[24px] tracking-[-0.01em] mb-1"
      >
        {heading}
      </h2>
      {blurb && <p className="font-sans text-muted text-[13px] mb-6">{blurb}</p>}
      <video
        className="w-full h-auto block bg-ink"
        style={{ aspectRatio: `${width} / ${height}` }}
        width={width}
        height={height}
        poster={poster}
        controls
        preload="metadata"
        playsInline
      >
        <source src={src} type="video/mp4" />
        {captions && (
          <track kind="captions" srcLang="en" label="English" src={captions} default />
        )}
        Your browser cannot play this video.{" "}
        <a href={src} download>
          Download it instead.
        </a>
      </video>
    </section>
  );
}
