// app/user/[applicationId]/page.tsx

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption, // om din komponent heter NativeSelectItem byt bara namnet här
} from "@/components/ui/native-select";
import { getJobsForUser } from "@/lib/jobs";

interface ApplyPageProps {
  params: {
    applicationId: string;
  };
}

export default async function ApplyPage({ params }: ApplyPageProps) {
  const jobs = await getJobsForUser();
  const job = jobs.find((j) => j.id === params.applicationId);

  return (
    <main className="min-h-screen flex justify-center pt-12 px-4">
      <section className="w-full max-w-2xl space-y-8">
        {/* Titel + beskrivning */}
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-semibold">
            {job ? `Apply for ${job.title}` : "Apply for this job"}
          </h1>
          {job && (
            <p className="text-sm text-muted-foreground">
              {job.company} · {job.location} · {job.extent}
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            Fill in your contact information to submit your application.
          </p>
        </header>

        {/* FORM – ingen submit-logik ännu */}
        <form className="grid gap-6">
          {/* Rad 1: Namn + Email */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid w-full items-center gap-3">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="Enter your name" />
            </div>

            <div className="grid w-full items-center gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Rad 2: Telefon + Kön */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid w-full items-center gap-3">
              <Label htmlFor="phone">Phone number</Label>
              <Input id="phone" name="phone" type="tel" placeholder="+..." />
            </div>

            <div className="grid w-full items-center gap-3">
              <Label htmlFor="gender">Gender</Label>
              <NativeSelect id="gender" name="gender">
                <NativeSelectOption value="">Select gender</NativeSelectOption>
                <NativeSelectOption value="man">Man</NativeSelectOption>
                <NativeSelectOption value="kvinna">Kvinna</NativeSelectOption>
                <NativeSelectOption value="annat">Annat</NativeSelectOption>
                <NativeSelectOption value="none">
                  Prefer not to say
                </NativeSelectOption>
              </NativeSelect>
            </div>
          </div>

          {/* Här under lägger vi drag & drop senare */}
        </form>
      </section>
    </main>
  );
}
