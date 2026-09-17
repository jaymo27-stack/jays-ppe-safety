import Link from 'next/link';
import { FOOTWEAR_CHART, WORKSUIT_CHART } from '../../lib/sa-sizes';

export const metadata = {
  title: "Size Guide | Jay's PPE & Safety",
  description:
    'South African sizing charts for safety footwear, gum boots and conti worksuits — SA/UK shoe sizes and the 32–54 conti size curve.',
};

export default function SizeGuidePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:px-8">
      <span className="section-label">Sizing</span>
      <h1 className="mt-4 font-display text-3xl uppercase tracking-wide text-charcoal md:text-4xl">
        South African Size Guide
      </h1>
      <p className="mt-3 max-w-2xl text-steel/80">
        All our sizing follows South African standards. Footwear is sold on the SA (UK) scale, and
        worksuits on the standard SA conti size curve. If you are between sizes, go up — protective
        gear is meant to be worn over your own clothing.
      </p>

      {/* ---------------- FOOTWEAR ---------------- */}
      <section id="footwear" className="mt-12 scroll-mt-24">
        <h2 className="font-display text-2xl uppercase tracking-wide text-charcoal">
          Safety Footwear &amp; Gum Boots
        </h2>
        <p className="mt-2 text-sm text-steel/80">
          South African shoe sizes are the same as UK sizes. Safety boots are stocked in sizes 5–13,
          gum boots in sizes 4–13, in <strong>black</strong> and <strong>brown</strong>.
        </p>

        <div className="mt-5 overflow-x-auto border-2 border-line bg-white">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="bg-charcoal text-safety">
              <tr>
                <th className="px-4 py-3 font-display uppercase tracking-wide">SA Size</th>
                <th className="px-4 py-3 font-display uppercase tracking-wide">UK</th>
                <th className="px-4 py-3 font-display uppercase tracking-wide">EU</th>
                <th className="px-4 py-3 font-display uppercase tracking-wide">US (Men&apos;s)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {FOOTWEAR_CHART.map((row) => (
                <tr key={row.sa} className="odd:bg-bone/50">
                  <td className="px-4 py-2 font-bold text-charcoal">{row.sa}</td>
                  <td className="px-4 py-2 text-steel/80">{row.uk}</td>
                  <td className="px-4 py-2 text-steel/80">{row.eu}</td>
                  <td className="px-4 py-2 text-steel/80">{row.us}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 border-l-4 border-safety bg-white p-4 text-sm text-steel/80">
          <p className="font-bold uppercase tracking-wide text-charcoal">How to measure</p>
          <p className="mt-2">
            Stand on a sheet of paper with your heel against a wall, mark the tip of your longest toe
            and measure the length in centimetres. Measure late in the day when your feet are at their
            largest, and wear the socks you will work in. If you wear thick winter socks, take the
            next size up.
          </p>
        </div>
      </section>

      {/* ---------------- WORKSUITS ---------------- */}
      <section id="worksuit" className="mt-14 scroll-mt-24">
        <h2 className="font-display text-2xl uppercase tracking-wide text-charcoal">
          Conti Worksuits &amp; Overalls
        </h2>
        <p className="mt-2 text-sm text-steel/80">
          Conti suits are sold on the SA size curve — sizes 32 to 54, even numbers only. The size
          refers to the <strong>jacket (chest) size</strong>. The trousers in the set are matched to
          it, so you order one size for the whole two-piece suit.
        </p>

        <div className="mt-4 border-l-4 border-hazard bg-white p-4 text-sm text-steel/80">
          <p className="font-bold uppercase tracking-wide text-charcoal">The quick rule</p>
          <p className="mt-2">
            Take your normal trouser waist and add 4 inches. A 32&quot; waist takes a{' '}
            <strong>size 36</strong> conti suit, a 38&quot; waist takes a <strong>size 42</strong>.
          </p>
        </div>

        <div className="mt-5 overflow-x-auto border-2 border-line bg-white">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="bg-charcoal text-safety">
              <tr>
                <th className="px-4 py-3 font-display uppercase tracking-wide">Conti Size</th>
                <th className="px-4 py-3 font-display uppercase tracking-wide">Chest</th>
                <th className="px-4 py-3 font-display uppercase tracking-wide">Fits Waist</th>
                <th className="px-4 py-3 font-display uppercase tracking-wide">Approx. Intl.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {WORKSUIT_CHART.map((row) => (
                <tr key={row.size} className="odd:bg-bone/50">
                  <td className="px-4 py-2 font-bold text-charcoal">{row.size}</td>
                  <td className="px-4 py-2 text-steel/80">{row.chest}</td>
                  <td className="px-4 py-2 text-steel/80">{row.waist}</td>
                  <td className="px-4 py-2 text-steel/80">{row.intl}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 border-l-4 border-safety bg-white p-4 text-sm text-steel/80">
          <p className="font-bold uppercase tracking-wide text-charcoal">How to measure</p>
          <p className="mt-2">
            Measure around the fullest part of your chest, under the arms, with the tape level and
            your arms down. Measure over a shirt, not bare skin. One-piece overalls are normally worn
            one size larger than a two-piece conti suit.
          </p>
        </div>
      </section>

      <div className="mt-12 flex flex-wrap gap-4 border-t-2 border-line pt-8">
        <Link href="/shop" className="btn-primary">
          Back to Shop
        </Link>
        <a href="tel:0824778280" className="btn-outline">
          Not sure? Call 082 477 8280
        </a>
      </div>

      <p className="mt-6 text-xs text-steel/60">
        Sizes are a guide only and can vary slightly between brands. For bulk or corporate orders we
        can arrange a fitting sample before you commit to a full run.
      </p>
    </div>
  );
}
