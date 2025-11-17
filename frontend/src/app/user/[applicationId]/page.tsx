// app/user/[applicationId]/page.tsx

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
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
        {/* Titel */}
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

        {/* FORMULÄR */}
        <form className="grid gap-6">
          {/* GRID: 6 kolumner på desktop */}
          <div className="grid gap-4 md:grid-cols-6">
            {/* Firstname — 2 kolumner */}
            <div className="grid w-full items-center gap-2 md:col-span-2">
              <Label htmlFor="firstname">Firstname</Label>
              <Input
                id="firstname"
                name="firstname"
                placeholder="Your firstname"
                className="h-10"
              />
            </div>

            {/* Lastname — 2 kolumner */}
            <div className="grid w-full items-center gap-2 md:col-span-2">
              <Label htmlFor="lastname">Lastname</Label>
              <Input
                id="lastname"
                name="lastname"
                placeholder="Your lastname"
                className="h-10"
              />
            </div>

            {/* Gender — 2 kolumner */}
            <div className="grid w-full items-center gap-2 md:col-span-2">
              <Label htmlFor="gender">Gender</Label>
              <NativeSelect id="gender" name="gender" className="w-full h-10">
                <NativeSelectOption value="">Select gender</NativeSelectOption>
                <NativeSelectOption value="man">Man</NativeSelectOption>
                <NativeSelectOption value="kvinna">Kvinna</NativeSelectOption>
                <NativeSelectOption value="annat">Annat</NativeSelectOption>
                <NativeSelectOption value="none">
                  Prefer not to say
                </NativeSelectOption>
              </NativeSelect>
            </div>

            {/* Email — span 3 kolumner */}
            <div className="grid w-full items-center gap-2 md:col-span-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                className="h-10"
              />
            </div>

            {/* Phone — span 3 kolumner */}
            <div className="grid w-full items-center gap-2 md:col-span-3">
              <Label htmlFor="phone">Phone number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+46..."
                className="h-10"
              />
            </div>
          </div>

          {/* Drag-and-drop kommer här sen */}
        </form>
      </section>
    </main>
  );
}
