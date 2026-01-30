import { useMouseParallax } from "@/hooks/useMouseParallax";

export function CursorGlow() {
  const { x, y } = useMouseParallax();

  return (
    <>
      {/* Main glow */}
      <div
        className="pointer-events-none fixed z-50 w-80 h-80 rounded-full opacity-20 blur-3xl transition-transform duration-100 ease-out hidden md:block"
        style={{
          background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)",
          transform: `translate(${x - 160}px, ${y - 160}px)`,
        }}
      />
      {/* Secondary accent glow */}
      <div
        className="pointer-events-none fixed z-50 w-40 h-40 rounded-full opacity-30 blur-2xl transition-transform duration-75 ease-out hidden md:block"
        style={{
          background: "radial-gradient(circle, hsl(var(--accent)) 0%, transparent 70%)",
          transform: `translate(${x - 80}px, ${y - 80}px)`,
        }}
      />
    </>
  );
}
