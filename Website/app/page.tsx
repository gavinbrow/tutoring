import { HomePage } from "@/components/home-page";
import { courseFromSlug, tutorFromKey } from "@/lib/tutoring";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const { course, tutor } = await searchParams;
  return <HomePage initialCourse={courseFromSlug(course)} initialTutor={tutorFromKey(tutor)} />;
}
