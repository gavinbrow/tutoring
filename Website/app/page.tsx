import type { Metadata } from "next";
import { HomePage } from "@/components/home-page";
import { company, siteUrl, subjects, tutors } from "@/lib/tutoring";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Structured data so search engines can tell who teaches what, and where.
const structuredData = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "@id": `${siteUrl}/#organization`,
  name: company.name,
  url: `${siteUrl}/`,
  logo: `${siteUrl}/favicon.svg`,
  image: `${siteUrl}/og.png`,
  description: "Personal chemistry tutoring for high school, AP, general and organic chemistry students.",
  areaServed: { "@type": "City", name: "Fayetteville, Arkansas" },
  knowsAbout: subjects.map(subject => subject.name),
  member: tutors.map(tutor => ({
    "@type": "Person",
    name: tutor.name,
    email: `mailto:${tutor.email}`,
    jobTitle: "Chemistry tutor",
    affiliation: { "@type": "CollegeOrUniversity", name: "University of Arkansas" },
  })),
};

export default function Home() {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <HomePage />
  </>;
}
