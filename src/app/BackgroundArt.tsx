// Faint background art using Zubair's own anime drawings. It's purely
// decorative (aria-hidden, pointer-events-none) and sits BEHIND everything
// (-z-10). The drawings are dark line-art on white, so we invert them to light
// lines and drop the opacity way down so they read as subtle silhouettes on
// the dark background without hurting readability.
export default function BackgroundArt() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div
        className="absolute bottom-0 -right-20 h-[75vh] w-[55vh] opacity-[0.13]"
        style={{
          backgroundImage: "url('/art2.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "bottom right",
          filter: "invert(1) grayscale(1)",
        }}
      />
      <div
        className="absolute -left-28 top-20 h-[60vh] w-[65vh] opacity-[0.11]"
        style={{
          backgroundImage: "url('/art1.jpeg')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "top left",
          filter: "invert(1) grayscale(1)",
        }}
      />
    </div>
  );
}
