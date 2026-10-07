"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { flushSync } from "react-dom";
import Link from "next/link";
import { Copy, Mail } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { company, courseOptions, subjects, tutors, tutorOptions, faqs, createEmailDraft, type Course, type TutorKey } from "@/lib/tutoring";

const glance = [
  ["Tutors", tutors.map(person => person.name).join(" and ")],
  ["Who we are", "Chemistry PhD students at the University of Arkansas"],
  ["What we teach", "High school, AP, general and organic chemistry"],
  ["How it works", "One student, one tutor, starting from your questions"],
  ["To get started", "Send a request and your tutor confirms rates and timing with you"],
];

const steps = [
  { title: "Start with your questions.", body: "A confusing lecture, a tough problem set, an exam coming up. We begin where things stop making sense." },
  { title: "Connect the ideas.", body: "We break down the reasoning, build from what you already know, and work through examples at your pace." },
  { title: "Try the next one yourself.", body: "You work a problem and talk through your thinking, and you leave with a clear idea of what to practice next." },
];

const bring = [
  "Your lecture notes",
  "The practice problems you’re working on",
  "A few questions about where you’re getting stuck",
  "Before an exam, your course outline or review guide",
];

export function HomePage({ initialCourse, initialTutor }: { initialCourse: Course; initialTutor: TutorKey }) {
  const [course, setCourse] = useState<Course>(initialCourse);
  const [tutor, setTutor] = useState<TutorKey>(initialTutor);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [goals, setGoals] = useState("");
  const [draft, setDraft] = useState<ReturnType<typeof createEmailDraft> | null>(null);
  const [copyStatus, setCopyStatus] = useState("");
  const draftHeading = useRef<HTMLHeadingElement>(null);

  const startRequest = (selection: { course?: Course; tutor?: TutorKey } = {}) => {
    flushSync(() => {
      if (selection.course) setCourse(selection.course);
      if (selection.tutor) setTutor(selection.tutor);
      setDraft(null); setCopyStatus("");
    });
    document.getElementById("request")?.scrollIntoView();
    document.getElementById("request-name")?.focus({ preventScroll: true });
  };

  useEffect(() => { if (draft) draftHeading.current?.focus(); }, [draft]);
  useEffect(() => {
    type Tool = { name: string; title: string; description: string; inputSchema: object; annotations: object; execute: (input: unknown) => object };
    const context = (document as Document & { modelContext?: { registerTool: (tool: Tool, options?: { signal: AbortSignal }) => void | Promise<void> } }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    try {
      void Promise.resolve(context.registerTool({
        name: "start_tutoring_request", title: "Start a tutoring request",
        description: "Scroll to the visible session-request form, optionally preselecting a chemistry course and tutor. This only prepares a draft; it does not send email or book a session.",
        inputSchema: { type: "object", properties: { course: { type: "string", enum: courseOptions }, tutor: { type: "string", enum: tutorOptions } }, additionalProperties: false },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute(input: unknown) {
          if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Provide a course and/or tutor object.");
          const data = input as Record<string, unknown>;
          if (Object.keys(data).some(key => !["course", "tutor"].includes(key))) throw new Error("Unknown field.");
          const selectedCourse = data.course ?? "Not sure yet";
          const selectedTutor = data.tutor ?? "either";
          if (!courseOptions.includes(selectedCourse as Course) || !tutorOptions.includes(selectedTutor as TutorKey)) throw new Error("Choose a listed chemistry course and tutor.");
          startRequest({ course: selectedCourse as Course, tutor: selectedTutor as TutorKey });
          return { status: "draft_open", course: selectedCourse, tutor: selectedTutor, sent: false };
        },
      }, { signal: lifecycle.signal })).catch(() => {});
    } catch { /* Browsers without WebMCP retain the complete visible flow. */ }
    return () => lifecycle.abort();
  }, []);

  function prepareRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !goals.trim()) return;
    setDraft(createEmailDraft({ name: name.trim(), email: email.trim(), course, tutor, goals: goals.trim() }));
    setCopyStatus("");
  }
  async function copyRequest() {
    if (!draft) return;
    try { await navigator.clipboard.writeText(`To: ${draft.to}\nSubject: ${draft.subject}\n\n${draft.body}`); setCopyStatus("Copied. Paste this into your email app and send when you’re ready."); }
    catch { setCopyStatus("Copy isn’t available in this browser. Select and copy the request below."); }
  }

  return <>
    <SiteHeader />
    <main id="main">
      <section className="hero shell" aria-labelledby="hero-heading">
        <h1 id="hero-heading">{company.name} Tutoring</h1>
        <div className="hero-body">
          <div className="hero-copy">
            <p className="lead">We’re chemistry PhD students at the University of Arkansas, and we tutor <mark>one-on-one</mark>, from high school chemistry through organic. Bring the lecture that lost you or the homework that isn’t working out, and we’ll go through it with you.</p>
            <div className="actions">
              <Link className="button" href="/#request">Request a session</Link>
              <Link className="text-link" href="/#courses">See what we teach</Link>
            </div>
          </div>
          <div className="sheet hero-aside">
            <p className="sheet-head"><span>At a glance</span><span>{company.name} tutoring</span></p>
            <dl className="glance">
              {glance.map(([label, value]) => <div key={label}><dt>{label}</dt><dd className="penned">{value}</dd></div>)}
            </dl>
          </div>
        </div>
      </section>

      <section className="shell" id="courses" aria-labelledby="courses-heading">
        <div className="section-inner">
          <div className="section-head">
            <h2 id="courses-heading">What we teach</h2>
            <p>Not sure which one fits? <button className="inline-link" onClick={() => startRequest({ course: "Not sure yet" })}>Tell us what’s feeling tricky</button> and we’ll work it out.</p>
          </div>
          <div className="section-body">
            {subjects.map(subject => (
              <article className="course-row" key={subject.slug}>
                <h3>{subject.title}</h3>
                <p>{subject.description}</p>
                <div>
                  <p className="note">Topics include {subject.topics}.</p>
                  <button className="text-link" onClick={() => startRequest({ course: subject.name })}>Request help with this<span className="sr-only">: {subject.name}</span></button>
                </div>
              </article>
            ))}
            <p className="examples-pointer">Want to see how we explain things? <Link className="inline-link" href="/examples">Look at a few worked examples</Link>.</p>
          </div>
        </div>
      </section>

      <section className="shell" id="sessions" aria-labelledby="sessions-heading">
        <div className="section-inner">
          <div className="section-head"><h2 id="sessions-heading">How a session goes</h2></div>
          <div className="section-body session-body">
            <ol className="steps">
              {steps.map((step, i) => (
                <li key={step.title}>
                  <span className="step-letter" aria-hidden="true">({"abc"[i]})</span>
                  <div><h3>{step.title}</h3><p>{step.body}</p></div>
                </li>
              ))}
            </ol>
            <aside className="bring" aria-labelledby="bring-heading">
              <h3 id="bring-heading">What to bring</h3>
              <ul>{bring.map(item => <li key={item}>{item}</li>)}</ul>
            </aside>
          </div>
        </div>
      </section>

      <section className="shell" id="tutors" aria-labelledby="tutors-heading">
        <div className="section-inner">
          <div className="section-head"><h2 id="tutors-heading">Who we are</h2></div>
          <div className="section-body">
            <p className="lead tutors-intro">We’re both chemistry PhD students at the University of Arkansas, researching polymer and organic chemistry in Dr. Michael McGraw’s lab. We spend our days asking chemistry questions, so bring yours.</p>
            <div className="tutor-grid">
              {tutors.map(person => (
                <article className="tutor" key={person.key}>
                  <h3>{person.name}</h3>
                  <p className="note">PhD student in chemistry, University of Arkansas</p>
                  <p>{person.tagline}</p>
                  <div className="tutor-links">
                    <button className="text-link" onClick={() => startRequest({ tutor: person.key })}>Request a session with {person.firstName}</button>
                    <a className="text-link" href={`mailto:${person.email}`}>{person.email}</a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="shell" id="questions" aria-labelledby="questions-heading">
        <div className="section-inner">
          <div className="section-head">
            <h2 id="questions-heading">Questions</h2>
            <p>Something else on your mind? <a className="inline-link" href={`mailto:${tutors.map(person => person.email).join(",")}`}>Email us both</a>.</p>
          </div>
          <div className="section-body faq">
            {faqs.map(faq => <div key={faq.question}><h3>{faq.question}</h3><p>{faq.answer}</p></div>)}
          </div>
        </div>
      </section>

      <section className="request-band" id="request" aria-labelledby="request-heading">
        <div className="shell section-inner">
          <div className="section-head">
            <h2 id="request-heading">Request a session</h2>
            <p>Nothing is sent from this page. The form writes an email for you to review and send from your own email app. Your tutor replies to confirm rates, timing and format.</p>
          </div>
          {!draft ? (
            <form className="section-body request-form" onSubmit={prepareRequest}>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="request-name">Your name</label>
                  <input id="request-name" autoComplete="name" maxLength={100} placeholder="Student or parent name" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div className="field">
                  <label htmlFor="request-email">Your email</label>
                  <input id="request-email" type="email" autoComplete="email" maxLength={254} placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
              </div>
              <fieldset className="choice">
                <legend>Your course</legend>
                <div>
                  {courseOptions.map(value => (
                    <label key={value}>
                      <input type="radio" name="course" checked={course === value} onChange={() => setCourse(value)} />
                      {subjects.find(subject => subject.name === value)?.label ?? value}
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset className="choice">
                <legend>Tutor</legend>
                <div>
                  {tutorOptions.map(value => (
                    <label key={value}>
                      <input type="radio" name="tutor" checked={tutor === value} onChange={() => setTutor(value)} />
                      {tutors.find(person => person.key === value)?.name ?? "Either tutor"}
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="field-block">
                <label htmlFor="request-goals">What would you like help with?</label>
                <textarea id="request-goals" maxLength={1500} rows={5} placeholder="Your topics, upcoming exams, times that suit you, and whether you’d prefer online or in person." value={goals} onChange={e => setGoals(e.target.value)} required />
                <p className="form-note">A few sentences is plenty.</p>
              </div>
              <div className="actions">
                <button type="submit" className="button">Prepare my email</button>
                <p className="form-note">Your details stay on this page until you choose to send them.</p>
              </div>
            </form>
          ) : (
            <div className="section-body draft">
              <h3 ref={draftHeading} tabIndex={-1}>Your email is ready to review</h3>
              <div className="sheet">
                <p className="sheet-head"><span>Email draft</span><span>Nothing has been sent or booked yet</span></p>
                <dl className="glance">
                  <div><dt>To</dt><dd>{draft.to}</dd></div>
                  <div><dt>Subject</dt><dd>{draft.subject}</dd></div>
                </dl>
                <textarea aria-label="Your email request draft" className="draft-body" value={draft.body} readOnly rows={12} />
              </div>
              <div className="actions">
                <a className="button" href={draft.href}><Mail size={18} aria-hidden="true" />Open email app</a>
                <button type="button" className="text-link" onClick={copyRequest}><Copy size={15} aria-hidden="true" />Copy email request</button>
                <button type="button" className="text-link" onClick={() => { setDraft(null); setCopyStatus(""); }}>Edit details</button>
              </div>
              <p className="form-note" role="status" aria-live="polite">{copyStatus || "No email app configured? Copy the request and send it using your webmail."}</p>
            </div>
          )}
        </div>
      </section>
    </main>
    <SiteFooter />
  </>;
}
