import { Leaf, ShieldCheck, Sparkles, Heart } from "lucide-react";
import { Reveal } from "../reveal";

const VALUES = [
  { icon: Leaf, title: "Eco Friendly", body: "Sustainable materials for a better tomorrow." },
  { icon: ShieldCheck, title: "Safe & Non-Toxic", body: "Made with natural ingredients, safe for your family." },
  { icon: Sparkles, title: "Easy to Clean", body: "Wash with cool water and reuse again." },
  { icon: Heart, title: "Made with Care", body: "Thoughtfully designed for everyday use." },
];

export function ValueProps() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/60 to-paper">
      <div className="container-page py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.08}>
              <div className="flex flex-col items-center text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-paper text-brand-600 shadow-[var(--shadow-soft)]">
                  <v.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold">{v.title}</h3>
                <p className="mt-1.5 max-w-[16rem] text-sm text-ink-muted">{v.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
