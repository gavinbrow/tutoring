import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SubstitutionScheme, SynthesisScheme } from "@/components/reaction-schemes";
import { company, subjects, tutors } from "@/lib/tutoring";

export const metadata: Metadata = {
  title: `Worked examples | ${company.name}`,
  description: "A few chemistry problems from high school, general and organic chemistry, worked the way we go through them in a tutoring session.",
};

const [highSchool, general, organic] = subjects;

function Fraction({ top, bottom }: { top: ReactNode; bottom: ReactNode }) {
  return <span className="fraction"><span>{top}</span><span>{bottom}</span></span>;
}

export default function Examples() {
  return <>
    <SiteHeader current="/examples" />
    <main id="main">
      <section className="hero hero-examples shell" aria-labelledby="hero-heading">
        <h1 id="hero-heading">Bring the problem you’re stuck on.</h1>
        <div className="hero-body">
          <div className="hero-copy">
            <p className="lead">Bring the lecture that lost you or the homework that isn’t working out. We’ll go through it with you, then show you how to approach the next one. Here is how that looks on a few problems, one from each course.</p>
            <div className="actions">
              <a className="button" href="/#request">Request a session</a>
              <a className="text-link" href="#examples">More examples below</a>
            </div>
            <p className="taught-by">Taught by {tutors.map((person, i) => <span key={person.key}>{i > 0 && " and "}<strong>{person.name}</strong></span>)}, chemistry PhD students at the University of Arkansas.</p>
          </div>
          <figure className="hero-aside">
            <div className="sheet">
              <p className="sheet-head"><span>Worked example</span><span>Organic Chemistry I, substitution</span></p>
              <div className="sheet-body">
                <p className="problem problem-large">(<i>R</i>)-2-Bromobutane is treated with sodium cyanide in DMSO. Draw the product, including stereochemistry.</p>
                <div className="scheme scheme-wide"><SubstitutionScheme /></div>
                <ol className="pen-notes">
                  <li><span aria-hidden="true">1</span><span>Cyanide attacks the carbon from the side opposite bromine.</span></li>
                  <li><span aria-hidden="true">2</span><span>The C–Br bond breaks as the new C–C bond forms. One step, no intermediate.</span></li>
                </ol>
                <p className="pen-note pen-note-large"><mark>Backside attack inverts the stereocenter: (R) goes in, (S) comes out.</mark></p>
                <p className="pen-note pen-aside">Inversion doesn’t always change the letter, so re-rank the groups every time.</p>
              </div>
            </div>
            <figcaption>The kind of problem students bring, marked up the way we’d go through it in a session.</figcaption>
          </figure>
        </div>
      </section>

      <section className="shell" id="examples" aria-labelledby="examples-heading">
        <div className="section-inner">
          <div className="section-head">
            <h2 id="examples-heading">More examples</h2>
            <p>One from each course we teach. Printed text is the question; blue is our working.</p>
          </div>
          <div className="section-body">
            <article className="example-row">
              <div>
                <h3>{highSchool.title}</h3>
                <p>A stoichiometry problem: turning a mass of fuel into a mass of product.</p>
                <a className="text-link" href={`/?course=${highSchool.slug}#request`}>Request help with high school or AP</a>
              </div>
              <div className="sheet">
                <p className="sheet-head"><span>Sample problem</span><span>Stoichiometry</span></p>
                <div className="sheet-body">
                  <p className="problem">How many grams of CO<sub>2</sub> form when 22.0 g of propane, C<sub>3</sub>H<sub>8</sub>, burns completely?</p>
                  <div className="working">
                    <p>C<sub>3</sub>H<sub>8</sub> + 5 O<sub>2</sub> → 3 CO<sub>2</sub> + 4 H<sub>2</sub>O</p>
                    <p className="chain">
                      <span>22.0 g</span>
                      <span>×</span>
                      <Fraction top={<>1 mol C<sub>3</sub>H<sub>8</sub></>} bottom="44.10 g" />
                      <span>×</span>
                      <Fraction top={<>3 mol CO<sub>2</sub></>} bottom={<>1 mol C<sub>3</sub>H<sub>8</sub></>} />
                      <span>×</span>
                      <Fraction top="44.01 g" bottom={<>1 mol CO<sub>2</sub></>} />
                      <span>= <span className="answer">65.9 g CO<sub>2</sub></span></span>
                    </p>
                    <p className="pen-note"><mark>Grams → moles → mole ratio → grams.</mark> The route is the same every time.</p>
                  </div>
                </div>
              </div>
            </article>

            <article className="example-row">
              <div>
                <h3>{general.title}</h3>
                <p>A weak-acid equilibrium: setting up the table, then checking the shortcut.</p>
                <a className="text-link" href={`/?course=${general.slug}#request`}>Request help with general chemistry</a>
              </div>
              <div className="sheet">
                <p className="sheet-head"><span>Sample problem</span><span>Weak acids</span></p>
                <div className="sheet-body">
                  <p className="problem">What is the pH of 0.10 M acetic acid? (<i>K</i><sub>a</sub> = 1.8 × 10<sup>−5</sup>)</p>
                  <div className="working">
                    <table className="ice">
                      <caption className="sr-only">ICE table for acetic acid</caption>
                      <thead>
                        <tr><td /><th scope="col">CH<sub>3</sub>COOH</th><th scope="col">H<sup>+</sup></th><th scope="col">CH<sub>3</sub>COO<sup>−</sup></th></tr>
                      </thead>
                      <tbody>
                        <tr><th scope="row">I</th><td>0.10</td><td>0</td><td>0</td></tr>
                        <tr><th scope="row">C</th><td>−<i>x</i></td><td>+<i>x</i></td><td>+<i>x</i></td></tr>
                        <tr><th scope="row">E</th><td>0.10 − <i>x</i></td><td><i>x</i></td><td><i>x</i></td></tr>
                      </tbody>
                    </table>
                    <p className="chain">
                      <span><i>K</i><sub>a</sub> =</span>
                      <Fraction top={<><i>x</i><sup>2</sup></>} bottom={<>0.10 − <i>x</i></>} />
                      <span>≈</span>
                      <Fraction top={<><i>x</i><sup>2</sup></>} bottom="0.10" />
                      <span>= 1.8 × 10<sup>−5</sup></span>
                    </p>
                    <p><i>x</i> = √(1.8 × 10<sup>−6</sup>) = 1.34 × 10<sup>−3</sup> M</p>
                    <p>pH = −log(1.34 × 10<sup>−3</sup>) = <span className="answer">2.87</span></p>
                    <p className="pen-note">Check the shortcut: <i>x</i> is 1.3% of 0.10. <mark>Under 5%, so dropping it was fair.</mark></p>
                  </div>
                </div>
              </div>
            </article>

            <article className="example-row">
              <div>
                <h3>{organic.title}</h3>
                <p>A short synthesis, planned backwards from the product.</p>
                <a className="text-link" href={`/?course=${organic.slug}#request`}>Request help with organic chemistry</a>
              </div>
              <div className="sheet">
                <p className="sheet-head"><span>Sample problem</span><span>Synthesis</span></p>
                <div className="sheet-body">
                  <p className="problem">Propose a synthesis of 2-butanone from <i>trans</i>-2-butene.</p>
                  <div className="scheme"><SynthesisScheme /></div>
                  <p className="pen-note"><mark>Work backwards.</mark> A ketone comes from a secondary alcohol, and the alcohol comes from adding water across the alkene. The alkene is symmetrical, so there is only one alcohol to make.</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="request-band" aria-labelledby="own-heading">
        <div className="shell section-inner">
          <div className="section-head"><h2 id="own-heading">Got one of your own?</h2></div>
          <div className="section-body">
            <p className="lead">Tell us your course and the topics you’re working on. Your tutor will reply to confirm rates, timing and format.</p>
            <div className="actions">
              <a className="button" href="/#request">Request a session</a>
              <a className="text-link" href="/">Back to the home page</a>
            </div>
          </div>
        </div>
      </section>
    </main>
    <SiteFooter />
  </>;
}
