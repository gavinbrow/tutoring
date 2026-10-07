/** Business details are kept here so the placeholder brand is easy to replace. */
export const company = { name: "Good Chemistry", isPlaceholderName: true };
export const subjects = [
  { name: "High School & AP Chemistry", shortName: "the foundations", level: "BUILD A STRONG FOUNDATION", description: "Make sense of the fundamentals and build confidence for class, homework, and AP exam preparation.", topics: ["Atoms & bonding", "Stoichiometry", "Acids & bases"] },
  { name: "General Chemistry", shortName: "general chemistry", level: "GENERAL CHEMISTRY I & II", description: "Turn equations into understanding. Work through the ideas and calculations behind your college course.", topics: ["Equilibrium", "Thermodynamics", "Kinetics"] },
  { name: "Organic Chemistry", shortName: "organic chemistry", level: "ORGANIC CHEMISTRY I & II", description: "Find the patterns behind the reactions, connect structure to reactivity, and make mechanisms make sense.", topics: ["Stereochemistry", "Mechanisms", "Synthesis"] },
] as const;
export type Course = typeof subjects[number]["name"] | "Not sure yet";
export type TutorKey = "either" | "gavin" | "felix";
export const tutors = [
  { key: "gavin" as const, name: "Gavin Brown", firstName: "Gavin", initials: "GB", email: "glb001@uark.edu", bio: "Gavin is a chemistry PhD student at the University of Arkansas, researching polymer and organic chemistry in Dr. Michael McGraw’s lab. Work with Gavin to explore the concepts behind your course, one question at a time." },
  { key: "felix" as const, name: "Felix Campbell", firstName: "Felix", initials: "FC", email: "fcampbell@uark.edu", bio: "Felix is a chemistry PhD student at the University of Arkansas, researching polymer and organic chemistry in Dr. Michael McGraw’s lab. Work with Felix to unpack tricky topics and connect the ideas in your chemistry course." },
];
export const faqs = [
  { question: "Which chemistry courses can you help with?", answer: "We focus on high school chemistry, AP Chemistry, college General Chemistry I and II, and Organic Chemistry I and II. Send us your course name and the topics you’re working on so we can confirm the right fit." },
  { question: "How do I arrange a session?", answer: "Use the session planner to tell us about your course, goals, and preferred times. It prepares an email to Gavin, Felix, or both. Send it from your email app, and your tutor will confirm the details with you directly." },
  { question: "What are your rates?", answer: "Your tutor will confirm the rate and session length with you before you book. Include your course and what you’d like to work on in your request so we can discuss the right approach." },
  { question: "Are sessions online or in person?", answer: "Let us know your preferred format when you get in touch. We’ll discuss what works for both you and your tutor and confirm the format, timing, and any location before booking." },
  { question: "What should I bring to a session?", answer: "Bring your lecture notes, relevant practice problems, and a few questions about where you’re getting stuck. If you’re preparing for an exam, your course outline or review guide helps us focus the session." },
  { question: "Do I need to choose a tutor first?", answer: "No. Choose “Either tutor” in the session planner and your email will be addressed to both Gavin and Felix. You can also contact either tutor directly. Students and parents are welcome to get in touch." },
];
export type RequestDetails = { name: string; email: string; course: Course; tutor: TutorKey; goals: string };
export function createEmailDraft(details: RequestDetails) {
  const selected = details.tutor === "either" ? tutors : tutors.filter(tutor => tutor.key === details.tutor);
  const to = selected.map(tutor => tutor.email).join(",");
  const subject = `Chemistry tutoring request — ${details.course}`;
  const greeting = details.tutor === "either" ? "Hi Gavin and Felix," : `Hi ${selected[0].firstName},`;
  const body = `${greeting}\n\nI’d like to discuss chemistry tutoring.\n\nName: ${details.name}\nReply email: ${details.email}\nCourse: ${details.course}\n\nWhat I’d like help with:\n${details.goals}\n\nPlease let me know about availability, rates, and next steps.\n\nThank you,\n${details.name}`;
  return { to, subject, body, href: `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` };
}
