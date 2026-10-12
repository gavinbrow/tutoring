import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { company } from "@/lib/tutoring";

const gameFile = "/games/organic-exam-two.html";
const description = "A free organic chemistry study game for substitution and elimination reactions (SN1, SN2, E1, E2), made by Felix Campbell. Plays in your browser, nothing to install.";

export const metadata: Metadata = {
  title: `Substitution & Elimination Study Game | ${company.name}`,
  description,
  alternates: { canonical: "/game" },
  // A page's openGraph replaces the layout's rather than merging, so repeat the image.
  openGraph: {
    type: "website",
    siteName: company.name,
    url: "/game",
    title: `Substitution & Elimination Study Game | ${company.name}`,
    description,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: `${company.name}: chemistry tutoring with Gavin Brown and Felix Campbell` }],
  },
};

export default function Game() {
  return <>
    <SiteHeader current="/game" />
    <main id="main">
      <section className="game shell" aria-labelledby="game-heading">
        <div className="game-head">
          <div>
            <h1 id="game-heading">Substitution and elimination study game</h1>
            <p className="note">Made by Felix Campbell for Organic Chemistry exam two. It plays in your browser and scores last for the current run only.</p>
          </div>
          <a className="text-link" href={gameFile}>Open full screen</a>
        </div>
        <iframe className="game-frame" src={gameFile} title="Substitution and Elimination Reactions study game" />
        <p className="note game-foot">The game is a large file (about 20 MB), so give it a moment to load. It works best on a laptop or tablet. Stuck on one of these reactions? <a className="inline-link" href="/?course=organic#request">Ask us about organic chemistry</a>.</p>
      </section>
    </main>
    <SiteFooter />
  </>;
}
