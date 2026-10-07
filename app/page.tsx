"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { flushSync } from "react-dom";
import Image from "next/image";
import { Atom, BookOpen, Check, CheckCheck, Copy, GraduationCap, Mail, Menu, MessageCircle, Sparkles, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { company, subjects, tutors, faqs, createEmailDraft, type Course, type TutorKey } from "@/lib/tutoring";

function Brand({ light = false }: { light?: boolean }) {
  return <a className={`brand${light ? " brand-light" : ""}`} href="#" aria-label={`${company.name} home`}><span className="brand-icon"><Atom aria-hidden="true" /></span><span>{company.name.toLowerCase()}<span className="brand-sub">TUTORING</span></span></a>;
}

export default function Home() {
  const [open, setOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [course, setCourse] = useState<Course>("Not sure yet");
  const [tutor, setTutor] = useState<TutorKey>("either");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [goals, setGoals] = useState("");
  const [draft, setDraft] = useState<ReturnType<typeof createEmailDraft> | null>(null);
  const [copyStatus, setCopyStatus] = useState("");
  const draftHeading = useRef<HTMLHeadingElement>(null);

  const startRequest = (selectedCourse: Course = "Not sure yet", selectedTutor: TutorKey = "either") => {
    setCourse(selectedCourse); setTutor(selectedTutor); setDraft(null); setCopyStatus(""); setMobileMenu(false); setOpen(true);
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
        description: "Open the visible session-request form, optionally preselecting a chemistry course and tutor. This only prepares a draft; it does not send email or book a session.",
        inputSchema: { type: "object", properties: { course: { type: "string", enum: [...subjects.map(s => s.name), "Not sure yet"] }, tutor: { type: "string", enum: ["either", "gavin", "felix"] } }, additionalProperties: false },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute(input: unknown) {
          if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Provide a course and/or tutor object.");
          const data = input as Record<string, unknown>;
          if (Object.keys(data).some(key => !["course", "tutor"].includes(key))) throw new Error("Unknown field.");
          const selectedCourse = data.course ?? "Not sure yet";
          const selectedTutor = data.tutor ?? "either";
          if (![...subjects.map(s => s.name), "Not sure yet"].includes(selectedCourse as Course) || !["either", "gavin", "felix"].includes(selectedTutor as string)) throw new Error("Choose a listed chemistry course and tutor.");
          flushSync(() => startRequest(selectedCourse as Course, selectedTutor as TutorKey));
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
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header shell">
      <Brand />
      <nav aria-label="Main navigation"><a href="#subjects">What we teach</a><a href="#tutors">Meet your tutors</a><a href="#approach">Our approach</a></nav>
      <div className="header-actions"><button className="button button-dark" onClick={() => startRequest()}>Let’s talk chemistry</button><button className="mobile-menu-toggle" aria-label={mobileMenu ? "Close navigation" : "Open navigation"} aria-expanded={mobileMenu} aria-controls="mobile-navigation" onClick={() => setMobileMenu(!mobileMenu)}>{mobileMenu ? <X /> : <Menu />}</button></div>
      {mobileMenu && <nav className="mobile-navigation" id="mobile-navigation" aria-label="Mobile navigation">{[["What we teach", "subjects"], ["Meet your tutors", "tutors"], ["Our approach", "approach"], ["Common questions", "questions"]].map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setMobileMenu(false)}>{label}</a>)}</nav>}
    </header>
    <main id="main">
      <section className="hero shell" aria-labelledby="hero-heading">
        <div className="hero-copy"><p className="eyebrow"><span className="tiny-line" /> BIG IDEAS. SMALL BREAKTHROUGHS.</p><h1 id="hero-heading">Find your<br /><em>chemistry.</em></h1><p className="hero-description">From your first chemical equation to organic reaction mechanisms. Personal tutoring that makes the complicated click.</p><div className="hero-actions"><button className="button button-primary" onClick={() => startRequest()}>Find your starting point</button><a className="text-link" href="#subjects">Explore the subjects</a></div><p className="hero-footnote"><Check size={17} aria-hidden="true" /> High school, AP & college chemistry</p></div>
        <div className="hero-visual"><Image className="hero-image" src="/images/molecular-hero.webp" alt="Sculptural molecular model in cobalt, white, and orange on a violet background" width={1120} height={1400} priority unoptimized /><div className="art-caption"><span>A LITTLE CLARITY. A BIG REACTION.</span><Atom size={23} aria-hidden="true" /></div></div>
      </section>
      <div className="credibility"><div className="shell credibility-inner"><GraduationCap size={26} aria-hidden="true" /><p>Learn with chemistry PhD students at the <strong>University of Arkansas.</strong></p><span>Real research. Real understanding.</span></div></div>
      <section className="section shell" id="subjects" aria-labelledby="subjects-heading"><p className="eyebrow">MEET YOUR NEXT BREAKTHROUGH</p><div className="section-heading"><h2 id="subjects-heading">A little support.<br /><em>A whole new perspective.</em></h2><p>Start where you are. We’ll help you connect the concepts, work through problems, and feel more prepared.</p></div>
        <div className="subject-grid">{subjects.map((subject, i) => { const Icon = [BookOpen, Atom, Sparkles][i]; return <article className={`subject-card subject-${i}`} key={subject.name}><div className="subject-top"><span className="subject-icon"><Icon size={26} strokeWidth={1.5} aria-hidden="true" /></span><span className="subject-number">0{i+1}</span></div><p className="course-level">{subject.level}</p><h3>{subject.name}</h3><p>{subject.description}</p><ul className="topic-list">{subject.topics.map(topic => <li key={topic}>{topic}</li>)}</ul><button className="subject-action" onClick={() => startRequest(subject.name)}>Let’s work on {subject.shortName}</button></article>; })}</div>
        <div className="subject-note"><MessageCircle size={19} aria-hidden="true" /><p>Not sure what you need? <button className="inline-link" onClick={() => startRequest()}>Tell us what’s feeling tricky.</button></p></div>
      </section>
      <section className="approach-wrap" id="approach" aria-labelledby="approach-heading"><div className="section shell"><p className="eyebrow">LESS MEMORIZING. MORE “OH, I GET IT.”</p><div className="section-heading"><h2 id="approach-heading">Make it make sense.<br /><em>Then make it stick.</em></h2><p>A good session doesn’t just get you through one problem. It gives you a way to approach the next one.</p></div><div className="approach-grid">{[
        { title: "Start with your questions.", body: "A confusing lecture, a tough problem set, an upcoming exam. We meet you at the point where things stop making sense." },
        { title: "Connect the ideas.", body: "We break down the reasoning, build from what you already know, and work through examples at your pace." },
        { title: "Put it into practice.", body: "Try the next problem yourself, talk through your thinking, and leave with clear ideas about what to practice next." },
      ].map((step, i) => <article key={step.title}><span className="step-number">0{i+1}</span><h3>{step.title}</h3><p>{step.body}</p></article>)}</div></div></section>
      <section className="section shell tutors-section" id="tutors" aria-labelledby="tutors-heading"><p className="eyebrow">CHEMISTRY IS WHAT WE DO</p><div className="section-heading"><h2 id="tutors-heading">Two chemists.<br /><em>In your corner.</em></h2><p>We spend our days asking chemistry questions, too. Let’s work through yours together.</p></div><div className="tutor-grid">{tutors.map(person => <article className={`tutor-card tutor-${person.key}`} key={person.key}><div className="tutor-heading"><span className="tutor-monogram" aria-hidden="true">{person.initials}</span><div><h3>{person.name}</h3><p className="tutor-role">Chemistry PhD student<br /><span>University of Arkansas</span></p></div></div><p>{person.bio}</p><div className="research-tags"><span>Polymer chemistry</span><span>Organic chemistry</span></div><div className="tutor-actions"><button className="text-link" onClick={() => startRequest("Not sure yet", person.key)}>Work with {person.firstName}</button><a className="tutor-email" href={`mailto:${person.email}`} aria-label={`Email ${person.name}`}><Mail size={19} aria-hidden="true" /></a></div></article>)}</div><p className="tutor-footnote">Both tutors work in Dr. Michael McGraw’s polymer and organic chemistry research lab.</p></section>
      <section className="questions-section section shell" id="questions" aria-labelledby="questions-heading"><div><p className="eyebrow">A FEW GOOD QUESTIONS</p><h2 id="questions-heading">Before we<br /><em>get started.</em></h2><p className="questions-intro">Something else on your mind?<br /><a className="inline-link" href={`mailto:${tutors.map(t => t.email).join(",")}`}>We’re happy to talk.</a></p></div><Accordion type="single" collapsible className="faq-list">{faqs.map((faq, i) => <AccordionItem key={faq.question} value={`faq-${i}`}><AccordionTrigger>{faq.question}</AccordionTrigger><AccordionContent>{faq.answer}</AccordionContent></AccordionItem>)}</Accordion></section>
      <section className="contact-banner shell" id="contact" aria-labelledby="contact-heading"><div><p className="eyebrow">YOUR NEXT “I GET IT” STARTS HERE</p><h2 id="contact-heading">Let’s find your<br /><em>good chemistry.</em></h2><p>Bring the questions. We’ll bring a fresh perspective.</p></div><div className="contact-action"><button className="button button-dark" onClick={() => startRequest()}>Plan a tutoring session</button><span>One conversation. A clearer starting point.</span></div></section>
    </main>
    <footer className="site-footer shell"><div className="footer-top"><Brand /><div className="footer-contacts">{tutors.map(person => <a key={person.email} href={`mailto:${person.email}`}><span>{person.name}</span><span>{person.email}</span></a>)}</div></div><div className="footer-bottom"><p>© {new Date().getFullYear()} {company.name}. Chemistry, together.</p><p>Independent tutoring; not a University of Arkansas service.</p></div></footer>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent className="request-dialog"><DialogHeader><p className="eyebrow">A CLEARER STARTING POINT</p><DialogTitle>{draft ? "Your request is ready." : "Let’s talk chemistry."}</DialogTitle><DialogDescription>{draft ? "Review your draft, then open your email app to send it. Your session is confirmed directly with your tutor." : "Tell us a little about what you’re working on. We’ll prepare an email you can review and send to your tutor."}</DialogDescription></DialogHeader>
      {!draft ? <form onSubmit={prepareRequest} className="request-form"><div className="form-grid"><div className="field"><Label htmlFor="request-name">Your name</Label><Input id="request-name" autoComplete="name" maxLength={100} placeholder="Student or parent name" value={name} onChange={e => setName(e.target.value)} required /></div><div className="field"><Label htmlFor="request-email">Your email</Label><Input id="request-email" type="email" autoComplete="email" maxLength={254} placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required /></div></div><div className="form-grid"><div className="field"><Label htmlFor="request-course">Your course</Label><Select value={course} onValueChange={value => setCourse(value as Course)}><SelectTrigger id="request-course"><SelectValue /></SelectTrigger><SelectContent>{[...subjects.map(s => s.name), "Not sure yet"].map(value => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></div><div className="field"><Label htmlFor="request-tutor">Tutor preference</Label><Select value={tutor} onValueChange={value => setTutor(value as TutorKey)}><SelectTrigger id="request-tutor"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="either">Either tutor</SelectItem>{tutors.map(person => <SelectItem key={person.key} value={person.key}>{person.name}</SelectItem>)}</SelectContent></Select></div></div><div className="field"><Label htmlFor="request-goals">What would you like help with?</Label><Textarea id="request-goals" maxLength={1500} rows={4} placeholder="Your topics, upcoming exams, preferred times, and whether you’d prefer online or in-person help…" value={goals} onChange={e => setGoals(e.target.value)} required /><span className="field-help">A few sentences is perfect. Your tutor will confirm rates, timing, and session format.</span></div><button type="submit" className="button button-primary full-width">Prepare my email request</button><p className="privacy-note">Your details stay in this page until you choose to send them through your email app.</p></form> : <div className="draft-stage"><div className="draft-status"><CheckCheck size={22} aria-hidden="true" /><div><h3 ref={draftHeading} tabIndex={-1}>Email draft prepared</h3><p>Nothing has been sent or booked yet.</p></div></div><div className="draft-meta"><p><strong>To</strong> <span>{draft.to}</span></p><p><strong>Subject</strong> <span>{draft.subject}</span></p></div><Textarea aria-label="Your email request draft" className="draft-body" value={draft.body} readOnly rows={9} /><a className="button button-primary full-width" href={draft.href}><Mail size={17} aria-hidden="true" />Open email app</a><div className="draft-secondary"><button type="button" className="text-link" onClick={() => { setDraft(null); setCopyStatus(""); }}>Edit details</button><button type="button" className="text-link copy-button" onClick={copyRequest}><Copy size={15} aria-hidden="true" />Copy email request</button></div><p className="privacy-note" role="status" aria-live="polite">{copyStatus || "No email app configured? Copy the request and send it using your webmail."}</p></div>}
    </DialogContent></Dialog>
  </>;
}
