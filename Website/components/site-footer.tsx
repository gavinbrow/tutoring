import { company, tutors } from "@/lib/tutoring";

export function SiteFooter() {
  return (
    <footer className="site-footer shell">
      <div className="footer-top">
        <div>
          <p className="footer-brand">{company.name}</p>
          <p className="note">© {new Date().getFullYear()} {company.name}</p>
        </div>
        <div className="footer-contacts">
          {tutors.map(person => (
            <p key={person.email}>
              <strong>{person.name}</strong>
              <a className="text-link" href={`mailto:${person.email}`}>{person.email}</a>
            </p>
          ))}
        </div>
      </div>
      <p className="footer-fine">Independent tutoring; not a University of Arkansas service.</p>
    </footer>
  );
}
