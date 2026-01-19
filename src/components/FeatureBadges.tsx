import { Shield, Zap, Sparkles } from "lucide-react";

const badges = [
  { icon: Sparkles, label: "100% Free", color: "text-primary" },
  { icon: Shield, label: "Secure & Private", color: "text-secondary" },
  { icon: Zap, label: "Lightning Fast", color: "text-accent" },
];

export function FeatureBadges() {
  return (
    <div className="flex flex-wrap justify-center gap-4 md:gap-8">
      {badges.map((badge) => {
        const Icon = badge.icon;
        return (
          <div
            key={badge.label}
            className="flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-border"
          >
            <Icon className={`w-4 h-4 ${badge.color}`} />
            <span className="text-sm font-medium text-foreground">{badge.label}</span>
          </div>
        );
      })}
    </div>
  );
}
