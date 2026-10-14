"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { flushSync } from "react-dom";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { company, courseOptions, subjects, tutors, tutorOptions, faqs, createEmailDraft, courseFromSlug, tutorFromKey, type Course, type TutorKey } from "@/lib/tutoring";

/** Cloudflare Turnstile's public site key, inlined at build time. Without it the form shows no spam check. */
const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
type Turnstile = {
  render: (container: HTMLElement, options: { sitekey: string; theme: "light"; size: "flexible" }) => string;
  reset: (widget: string) => void;
  remove: (widget: string) => void;
};
let turnstileScript: Promise<Turnstile> | undefined;
function loadTurnstile() {
  turnstileScript ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.onload = () => {
      const api = (window as Window & { turnstile?: Turnstile }).turnstile;
      if (api) resolve(api); else reject(new Error("Turnstile did not load."));
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return turnstileScript;
}

const glance = [
  ["Tutors", tutors.map(person => person.name).join(" and ")],
  ["Who we are", "Chemistry PhD students at the University of Arkansas"],
  ["What we teach", "High school, AP, general and organic chemistry"],
  ["How it works", "One student, one tutor, starting from your questions"],
  ["To get started", "Send a request and your tutor confirms rates and timing with you"],
];

export function HomePage() {
  const [course, setCourse] = useState<Course>("Not sure yet");
  const [tutor, setTutor] = useState<TutorKey>("either");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [goals, setGoals] = useState("");
  const [status, setStatus] = useState<"idle" | "unverified" | "sending" | "sent" | "failed">("idle");
  const sentHeading = useRef<HTMLHeadingElement>(null);
  const turnstileBox = useRef<HTMLDivElement>(null);
  const turnstileWidget = useRef<{ api: Turnstile; id: string } | null>(null);
  const formShown = status !== "sent";

  const startRequest = (selection: { course?: Course; tutor?: TutorKey } = {}) => {
    flushSync(() => {
      if (selection.course) setCourse(selection.course);
      if (selection.tutor) setTutor(selection.tutor);
      setStatus(current => current === "sending" ? current : "idle");
    });
    document.getElementById("request")?.scrollIntoView();
    document.getElementById("request-name")?.focus({ preventScroll: true });
  };

  // The page is prerendered, so read ?course= and ?tutor= preselection in the
  // browser after hydration; reading it during render would mismatch the HTML.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCourse(courseFromSlug(params.get("course")));
    setTutor(tutorFromKey(params.get("tutor")));
  }, []);
  useEffect(() => { if (status === "sent") sentHeading.current?.focus(); }, [status]);
  useEffect(() => {
    const box = turnstileBox.current;
    if (!turnstileSiteKey || !formShown || !box) return;
    let cancelled = false;
    loadTurnstile().then(api => {
      if (!cancelled) turnstileWidget.current = { api, id: api.render(box, { sitekey: turnstileSiteKey, theme: "light", size: "flexible" }) };
    }).catch(() => { /* Without the widget there is no token, and the form offers the email fallback. */ });
    return () => {
      cancelled = true;
      if (turnstileWidget.current) turnstileWidget.current.api.remove(turnstileWidget.current.id);
      turnstileWidget.current = null;
    };
  }, [formShown]);
  useEffect(() => {
    type Tool = { name: string; title: string; description: string; inputSchema: object; annotations: object; execute: (input: unknown) => object };
    const context = (document as Document & { modelContext?: { registerTool: (tool: Tool, options?: { signal: AbortSignal }) => void | Promise<void> } }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    try {
      void Promise.resolve(context.registerTool({
        name: "start_tutoring_request", title: "Start a tutoring request",
        description: "Scroll to the visible session-request form, optionally preselecting a chemistry course and tutor. It does not fill in or send the form, and it does not book a session.",
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
          return { status: "form_open", course: selectedCourse, tutor: selectedTutor, sent: false };
        },
      }, { signal: lifecycle.signal })).catch(() => {});
    } catch { /* Browsers without WebMCP retain the complete visible flow. */ }
    return () => lifecycle.abort();
  }, []);

  const details = { name: name.trim(), email: email.trim(), course, tutor, goals: goals.trim() };

  // functions/api/request-session.ts checks the spam fields and emails the request through MailerSend.
  async function sendRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!details.name || !details.email || !details.goals || status === "sending") return;
    const fields = new FormData(event.currentTarget);
    const turnstileToken = fields.get("cf-turnstile-response");
    if (turnstileSiteKey && !turnstileToken) { setStatus("unverified"); return; }
    setStatus("sending");
    try {
      const response = await fetch("/api/request-session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...details, website: fields.get("website"), turnstileToken }) });
      if (response.ok) { setStatus("sent"); return; }
    } catch { /* Reported below. */ }
    setStatus("failed");
    // Each Turnstile token works once, so a retry needs a fresh one.
    if (turnstileWidget.current) turnstileWidget.current.api.reset(turnstileWidget.current.id);
  }
  const emailInstead = <a className="inline-link" href={createEmailDraft(details).href}>email it to us instead</a>;

  return <>
    <SiteHeader />
    <main id="main">
      <section className="hero shell" aria-labelledby="hero-heading">
        <h1 id="hero-heading">{company.name}</h1>
        <div className="hero-body">
          <div className="hero-copy">
            <p className="lead">We’re chemistry PhD students at the University of Arkansas, and we tutor <mark>one-on-one</mark>, from high school chemistry through organic. Bring the lecture that lost you or the homework that isn’t working out, and we’ll go through it with you.</p>
            <div className="actions">
              <a className="button" href="/#request">Request a session</a>
              <a className="text-link" href="/#courses">See what we teach</a>
            </div>
          </div>
          <div className="sheet hero-aside">
            <p className="sheet-head"><span>At a glance</span><span>{company.name}</span></p>
            <dl className="glance">
              {glance.map(([label, value]) => <div key={label}><dt>{label}</dt><dd className="penned">{value}</dd></div>)}
            </dl>
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
                  {person.photo && <img className="tutor-photo" src={person.photo} alt={`${person.name}, chemistry tutor`} loading="lazy" />}
                  <h3>{person.name}</h3>
                  <p className="note">PhD student in chemistry, University of Arkansas</p>
                  <div className="tutor-links">
                    <a className="text-link" href={`mailto:${person.email}`}>{person.email}</a>
                  </div>
                </article>
              ))}
            </div>
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
            <p className="examples-pointer">Want to see how we explain things? <a className="inline-link" href="/examples">Look at a few worked examples</a>.</p>
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
            <p>Send us a few details and your request comes straight to our inbox. Your tutor replies by email to confirm rates, timing and format.</p>
          </div>
          {status !== "sent" ? (
            <form className="section-body request-form" onSubmit={sendRequest}>
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
              <div className="trap" aria-hidden="true">
                <label htmlFor="request-website">Leave this empty</label>
                <input id="request-website" name="website" tabIndex={-1} autoComplete="off" />
              </div>
              {turnstileSiteKey && <div className="turnstile" ref={turnstileBox} />}
              <div className="actions">
                <button type="submit" className="button" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Send request"}</button>
                <p className="form-note" role="status" aria-live="polite">
                  {status === "failed" && <>Your request didn’t go through. Try again, or {emailInstead}.</>}
                  {status === "unverified" && <>The spam check hasn’t finished. Wait a moment and send again, or {emailInstead}.</>}
                </p>
              </div>
            </form>
          ) : (
            <div className="section-body request-sent">
              <h3 ref={sentHeading} tabIndex={-1}>Thanks, {details.name}. Your request has been sent.</h3>
              <p>Your tutor will reply to {details.email} to confirm rates, timing and format.</p>
              <div className="actions">
                <button type="button" className="text-link" onClick={() => { setGoals(""); setStatus("idle"); }}>Send another request</button>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
    <SiteFooter />
  </>;
}
