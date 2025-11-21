import { PageContentContainer } from "@/components/ui/pageContentContainer";
import Link from "next/link"

// Home page will be the welcoming page.
export default function Home() {
  return (
    <PageContentContainer className="flex flex-col items-center mt-10 gap-5">
      <h1 className="text-center">End Your Bias</h1>
      <p className="text-center text-secondary-foreground max-w-3xl">Our innovative recruiter tool leverages AI to create a fairer, more objective hiring process by removing identifying details that could introduce bias. Critical information such as name, gender, ethnicity, and origin is automatically anonymized, allowing recruiters to evaluate candidates solely on skills, experience, and qualifications. By focusing on merit rather than personal characteristics, this tool helps organizations build more diverse, inclusive, and equitable teams.</p>

      <div className="flex flex-row gap-10 pt-10">
        <Link href="/user">User</Link>
        <Link href="/recruiter">Recruiter</Link>
      </div>
    </PageContentContainer>
  );
}