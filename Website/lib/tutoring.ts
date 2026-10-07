/** Business details are kept here so the placeholder brand is easy to replace. */
export const company = { name: "Good Chemistry", isPlaceholderName: true };
/** The production address. Change it here (and in public/robots.txt and public/sitemap.xml) when a custom domain is added. */
export const siteUrl = "https://tutoring-9f8.pages.dev";
export const subjects = [
  { slug: "high-school", name: "High School & AP Chemistry", title: "High school & AP Chemistry", label: "High school & AP", description: "Make sense of the fundamentals and build confidence for class, homework and the AP exam.", topics: "atoms and bonding, stoichiometry, acids and bases" },
  { slug: "general", name: "General Chemistry", title: "General Chemistry I & II", label: "General Chemistry", description: "Turn equations into understanding. We work through the ideas and the calculations behind your college course.", topics: "equilibrium, thermodynamics, kinetics" },
  { slug: "organic", name: "Organic Chemistry", title: "Organic Chemistry I & II", label: "Organic Chemistry", description: "Find the patterns behind the reactions, connect structure to reactivity, and get the hard parts to make sense.", topics: "stereochemistry, mechanisms, synthesis" },
] as const;
export type Course = typeof subjects[number]["name"] | "Not sure yet";
export type TutorKey = "either" | "gavin" | "felix";
export const tutors = [
  { key: "gavin" as const, name: "Gavin Brown", firstName: "Gavin", email: "glb001@uark.edu", tagline: "Work with Gavin to explore the concepts behind your course, one question at a time." },
  { key: "felix" as const, name: "Felix Campbell", firstName: "Felix", email: "fcampbell@uark.edu", tagline: "Work with Felix to unpack tricky topics and connect the ideas in your chemistry course." },
];
export const courseOptions: Course[] = [...subjects.map(subject => subject.name), "Not sure yet"];
export const tutorOptions: TutorKey[] = ["either", ...tutors.map(tutor => tutor.key)];
export const faqs = [
  { question: "Which chemistry courses can you help with?", answer: "High school chemistry, AP Chemistry, college General Chemistry I and II, and Organic Chemistry I and II. Send us your course name and the topics you’re working on so we can confirm the fit." },
  { question: "How do I arrange a session?", answer: "Fill in the request form below with your course, goals and preferred times. It prepares an email to Gavin, Felix, or both. Send it from your email app and your tutor will confirm the details with you directly." },
  { question: "What are your rates?", answer: "Your tutor will confirm the rate and session length with you before you book. Include your course and what you’d like to work on so we can discuss the right approach." },
  { question: "Are sessions online or in person?", answer: "Tell us which you’d prefer when you get in touch. We’ll confirm the format, timing and any location with you before booking." },
  { question: "Do I need to choose a tutor first?", answer: "No. Choose “Either tutor” on the form and your email will be addressed to both Gavin and Felix. You can also contact either of us directly. Students and parents are both welcome to get in touch." },
];
/** Links such as /?course=organic#request preselect the request form. */
export function courseFromSlug(slug: unknown): Course {
  return subjects.find(subject => subject.slug === slug)?.name ?? "Not sure yet";
}
export function tutorFromKey(key: unknown): TutorKey {
  return tutorOptions.find(option => option === key) ?? "either";
}
export type RequestDetails = { name: string; email: string; course: Course; tutor: TutorKey; goals: string };
export function createEmailDraft(details: RequestDetails) {
  const selected = details.tutor === "either" ? tutors : tutors.filter(tutor => tutor.key === details.tutor);
  const to = selected.map(tutor => tutor.email).join(",");
  const subject = `Chemistry tutoring request — ${details.course}`;
  const greeting = details.tutor === "either" ? "Hi Gavin and Felix," : `Hi ${selected[0].firstName},`;
  const body = `${greeting}\n\nI’d like to discuss chemistry tutoring.\n\nName: ${details.name}\nReply email: ${details.email}\nCourse: ${details.course}\n\nWhat I’d like help with:\n${details.goals}\n\nPlease let me know about availability, rates, and next steps.\n\nThank you,\n${details.name}`;
  return { to, subject, body, href: `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` };
}
