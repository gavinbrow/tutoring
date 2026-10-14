import { company, courseOptions, requestInbox, tutors, tutorOptions } from "../../lib/tutoring";

/**
 * Cloudflare Pages Function behind the "Request a session" form. It emails the
 * request to `requestInbox` through MailerSend, with the visitor as reply-to.
 * Both values come from the Pages project's Variables and Secrets, never the
 * repository:
 *   MAILERSEND_API_KEY     MailerSend API token (add it as a secret)
 *   MAILERSEND_FROM_EMAIL  sender address on a domain verified in MailerSend
 */
interface Env {
  MAILERSEND_API_KEY?: string;
  MAILERSEND_FROM_EMAIL?: string;
}

const reply = (status: number, body: object) => Response.json(body, { status });
const escapeHtml = (text: string) => text.replace(/[&<>"']/g, character => `&#${character.charCodeAt(0)};`);

/** A trimmed, non-empty string no longer than `max`, or null. */
function field(value: unknown, max: number) {
  const text = typeof value === "string" ? value.trim() : "";
  return text && text.length <= max ? text : null;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let data: unknown;
  try { data = await request.json(); } catch { data = null; }
  if (!data || typeof data !== "object") return reply(400, { error: "Send the request as JSON." });
  const input = data as Record<string, unknown>;

  // The form enforces the same limits, so only hand-made requests fail here.
  const name = field(input.name, 100)?.replace(/\s+/g, " ");
  const email = field(input.email, 254);
  const goals = field(input.goals, 1500);
  const course = courseOptions.find(option => option === input.course);
  const tutor = tutorOptions.find(option => option === input.tutor);
  if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !goals || !course || !tutor) {
    return reply(400, { error: "Fill in every field with a valid email address." });
  }

  if (!env.MAILERSEND_API_KEY || !env.MAILERSEND_FROM_EMAIL) {
    console.error("Set MAILERSEND_API_KEY and MAILERSEND_FROM_EMAIL in the Pages project's Variables and Secrets.");
    return reply(500, { error: "Email isn’t set up on this site yet." });
  }

  const details: [string, string][] = [
    ["Name", name],
    ["Email", email],
    ["Course", course],
    ["Tutor", tutors.find(person => person.key === tutor)?.name ?? "Either tutor"],
  ];
  const text = `New tutoring request from the website.\n\n${details.map(([label, value]) => `${label}: ${value}`).join("\n")}\n\nWhat they’d like help with:\n${goals}\n\nReply to this email to answer ${name} directly.`;
  const html = `<p>New tutoring request from the website.</p><p>${details.map(([label, value]) => `<strong>${label}:</strong> ${escapeHtml(value)}`).join("<br>")}</p><p><strong>What they’d like help with:</strong><br>${escapeHtml(goals).replace(/\r?\n/g, "<br>")}</p><p>Reply to this email to answer ${escapeHtml(name)} directly.</p>`;

  const response = await fetch("https://api.mailersend.com/v1/email", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.MAILERSEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: { email: env.MAILERSEND_FROM_EMAIL, name: company.name },
      to: [{ email: requestInbox }],
      reply_to: { email, name },
      subject: `Chemistry tutoring request from ${name} — ${course}`,
      text,
      html,
    }),
  });
  if (!response.ok) {
    console.error(`MailerSend refused the email (${response.status}): ${await response.text()}`);
    return reply(502, { error: "The email service didn’t accept the request." });
  }
  return reply(200, { ok: true });
};
