"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

type Deliverable = {
  type: string;
  position: string;
  qty: number;
};

type Creator = {
  id: number;
  name: string;
  subs: string;
  views: string;
  niche: string;
  role: string;
  deliverables: Deliverable[];
};

type ProposalData = {
  brand: string;
  notes: string;
  future: string;
  creators: Creator[];
};

const COLOR_MAP: Record<number, string> = {
  1: "bg-blue-600",
  2: "bg-purple-600",
  3: "bg-emerald-600",
  4: "bg-orange-600",
  5: "bg-pink-600",
  6: "bg-cyan-600",
  7: "bg-teal-600",
  8: "bg-violet-600",
  9: "bg-rose-600",
  10: "bg-amber-600",
  11: "bg-lime-600",
  12: "bg-indigo-600",
  13: "bg-sky-600",
  14: "bg-fuchsia-600",
  15: "bg-green-600",
};

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function formatDeliverable(d: Deliverable): string {
  const isYT = d.type.includes("YouTube Integration");
  return `${d.qty}× ${d.type}${isYT && d.position ? ` (${d.position})` : ""}`;
}

function totalQty(deliverables: Deliverable[]): number {
  return deliverables.reduce((s, d) => s + d.qty, 0);
}

function ProposalContent() {
  const params = useSearchParams();
  const raw = params.get("d");

  if (!raw) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-400 text-lg">No proposal data provided.</p>
          <p className="text-zinc-600 text-sm mt-2">Generate a proposal from the builder to view it here.</p>
        </div>
      </div>
    );
  }

  let data: ProposalData;
  try {
    data = JSON.parse(decodeURIComponent(atob(raw)));
  } catch {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-red-400">Invalid proposal data.</p>
      </div>
    );
  }

  const grandTotal = data.creators.reduce((s, c) => s + totalQty(c.deliverables), 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 px-6 py-5">
        <div className="max-w-5xl mx-auto">
          <span className="text-indigo-400 font-semibold text-sm tracking-widest uppercase">Creators Agency</span>
          <h1 className="text-3xl font-bold text-white mt-1">{data.brand}</h1>
          <p className="text-zinc-400 mt-1">A Custom Creator Partnership Proposal</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-14">

        {/* Section 1: The Package */}
        <section>
          <h2 className="text-xs font-semibold tracking-widest uppercase text-indigo-400 mb-4">Section 1 — The Package</h2>
          <div className="bg-zinc-900/60 backdrop-blur border border-zinc-800 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left px-5 py-3.5 text-zinc-400 text-sm font-medium">Creator</th>
                  <th className="text-left px-5 py-3.5 text-zinc-400 text-sm font-medium">Role</th>
                  <th className="text-left px-5 py-3.5 text-zinc-400 text-sm font-medium">Deliverables</th>
                  <th className="text-left px-5 py-3.5 text-zinc-400 text-sm font-medium">Est. Reach</th>
                </tr>
              </thead>
              <tbody>
                {data.creators.map((c, i) => (
                  <tr key={c.id} className={i < data.creators.length - 1 ? "border-b border-zinc-800/60" : ""}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${COLOR_MAP[c.id] ?? "bg-zinc-600"} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                          {initials(c.name)}
                        </div>
                        <span className="text-white font-medium text-sm">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-zinc-300 text-sm">{c.role}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="space-y-0.5">
                        {c.deliverables.map((d, j) => (
                          <p key={j} className="text-zinc-300 text-sm">{formatDeliverable(d)}</p>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-zinc-300 text-sm font-semibold">{c.subs}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-zinc-700 bg-zinc-900/80">
                  <td colSpan={4} className="px-5 py-3.5 text-zinc-400 text-sm">
                    <span className="font-semibold text-white">{grandTotal}</span> total deliverables across{" "}
                    <span className="font-semibold text-white">{data.creators.length}</span> creators
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        {/* Section 2: Creator Profiles */}
        <section>
          <h2 className="text-xs font-semibold tracking-widest uppercase text-indigo-400 mb-4">Section 2 — Creator Profiles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.creators.map((c) => (
              <div key={c.id} className="bg-zinc-900/60 backdrop-blur border border-zinc-800 rounded-2xl p-5">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-full ${COLOR_MAP[c.id] ?? "bg-zinc-600"} flex items-center justify-center text-white font-bold text-base flex-shrink-0`}>
                    {initials(c.name)}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-base">{c.name}</p>
                    <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 mt-1">{c.niche}</span>
                  </div>
                </div>
                <div className="flex gap-6 mb-4">
                  <div>
                    <p className="text-zinc-500 text-xs">Subscribers</p>
                    <p className="text-white font-semibold text-sm">{c.subs}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-xs">Avg. Views</p>
                    <p className="text-white font-semibold text-sm">{c.views}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-xs">Role</p>
                    <p className="text-white font-semibold text-sm">{c.role}</p>
                  </div>
                </div>
                <div className="border-t border-zinc-800 pt-3">
                  <p className="text-zinc-500 text-xs mb-2 uppercase tracking-wide">Deliverables</p>
                  <div className="space-y-1">
                    {c.deliverables.map((d, j) => (
                      <p key={j} className="text-zinc-300 text-sm">{formatDeliverable(d)}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Campaign Timeline */}
        <section>
          <h2 className="text-xs font-semibold tracking-widest uppercase text-indigo-400 mb-4">Section 3 — Campaign Timeline</h2>
          <div className="bg-zinc-900/60 backdrop-blur border border-zinc-800 rounded-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { month: "Month 1", label: "Brief & Contracts", icon: "📋", desc: "Finalize campaign brief, align on messaging, and execute creator agreements." },
                { month: "Month 2", label: "Content Creation", icon: "🎬", desc: "Creators produce and submit content for brand review and approval." },
                { month: "Month 3", label: "Go Live", icon: "🚀", desc: "Content publishes across all creator channels. Live tracking begins." },
              ].map((phase) => (
                <div key={phase.month} className="text-center">
                  <div className="text-3xl mb-3">{phase.icon}</div>
                  <p className="text-indigo-400 font-semibold text-sm">{phase.month}</p>
                  <p className="text-white font-bold text-base mt-1">{phase.label}</p>
                  <p className="text-zinc-500 text-sm mt-2">{phase.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-zinc-600 text-xs text-center mt-6">Exact dates TBD based on brand&apos;s calendar</p>
          </div>
        </section>

        {/* Section 4: Why These Creators */}
        <section>
          <h2 className="text-xs font-semibold tracking-widest uppercase text-indigo-400 mb-4">Section 4 — Why These Creators</h2>
          <div className="bg-zinc-900/60 backdrop-blur border border-zinc-800 rounded-2xl p-6 space-y-4">
            <p className="text-zinc-300 leading-relaxed">
              This lineup was carefully selected to maximize{" "}
              <span className="text-white font-semibold">{data.brand}</span>&apos;s reach within the personal finance and
              investing audience. Each creator brings a distinct voice and audience segment, ensuring broad coverage without
              overlap.
            </p>
            {data.notes && (
              <div className="bg-indigo-950/40 border border-indigo-900/50 rounded-xl p-4">
                <p className="text-indigo-300 text-sm font-medium mb-1">Additional Context</p>
                <p className="text-zinc-300 text-sm leading-relaxed">{data.notes}</p>
              </div>
            )}
          </div>
        </section>

        {/* Section 5: The Case for Finance Creators */}
        <section>
          <h2 className="text-xs font-semibold tracking-widest uppercase text-indigo-400 mb-4">Section 5 — The Case for Finance Creators</h2>
          <div className="bg-zinc-900/60 backdrop-blur border border-zinc-800 rounded-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  stat: "3.2×",
                  label: "higher purchase intent",
                  desc: "Finance YouTubers drive 3.2× higher purchase intent than standard influencer campaigns",
                  source: "Gospel Stats",
                },
                {
                  stat: "$45–$85",
                  label: "average CPM",
                  desc: "Average CPM for finance/investing content, outperforming most verticals",
                  source: "Agentio benchmarks",
                },
                {
                  stat: "2.8×",
                  label: "higher HHI >$100K",
                  desc: "Finance audiences index 2.8× higher for household income above $100K",
                  source: "Audience research",
                },
              ].map((item) => (
                <div key={item.stat} className="text-center">
                  <p className="text-4xl font-bold text-indigo-400">{item.stat}</p>
                  <p className="text-white font-semibold text-sm mt-1">{item.label}</p>
                  <p className="text-zinc-500 text-xs mt-2">{item.desc}</p>
                  <p className="text-zinc-700 text-xs mt-2 italic">{item.source}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 6: Investment */}
        <section>
          <h2 className="text-xs font-semibold tracking-widest uppercase text-indigo-400 mb-4">Section 6 — Investment</h2>
          <div className="bg-zinc-900/60 backdrop-blur border border-zinc-800 rounded-2xl p-6">
            <div className="mb-5">
              <p className="text-white font-semibold text-lg">{grandTotal} Total Deliverables</p>
            </div>
            <div className="space-y-3 mb-6">
              {data.creators.map((c) => (
                <div key={c.id} className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-full ${COLOR_MAP[c.id] ?? "bg-zinc-600"} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5`}>
                    {initials(c.name)[0]}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{c.name}</p>
                    <p className="text-zinc-500 text-xs">{c.deliverables.map(formatDeliverable).join(" · ")}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-zinc-800/50 rounded-xl px-4 py-3 text-zinc-400 text-sm">
              Rates shared separately — this package is a starting point and can be adjusted based on your goals.
            </div>
          </div>

          {data.future && (
            <div className="mt-5 bg-zinc-900/60 backdrop-blur border border-zinc-800 rounded-2xl p-5">
              <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wide mb-3">Recommended for Future Campaigns</p>
              <p className="text-zinc-300 text-sm leading-relaxed">{data.future}</p>
            </div>
          )}
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 px-6 py-6 mt-10">
        <div className="max-w-5xl mx-auto text-center space-y-1">
          <p className="text-zinc-500 text-sm">Prepared by <span className="text-indigo-400">Creators Agency</span> · creatorsagency.co</p>
          <p className="text-zinc-700 text-xs">This proposal is confidential and intended solely for the recipient.</p>
        </div>
      </footer>
    </div>
  );
}

export default function ProposalPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-zinc-500">Loading proposal...</p>
      </div>
    }>
      <ProposalContent />
    </Suspense>
  );
}
