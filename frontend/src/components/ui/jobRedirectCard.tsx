// components/ui/jobRedirectCard.tsx

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface JobRedirectCardProps {
  // Data som representerar ett jobbkort i listan
  title: string;
  company: string;
  location: string;
  extent: string;
  // URL att navigera till när användaren klickar "Apply"
  applyUrl: string;
}

export default function JobRedirectCard({
  title,
  company,
  location,
  applyUrl,
  extent,
}: JobRedirectCardProps) {
  return (
    // Wrapper-komponenten för varje jobbkort
    <Card className="w-[460px]">
      <CardHeader>
        {/* Jobbtitel */}
        <CardTitle>{title}</CardTitle>

        {/* Företag, ort och omfattning (heltid/deltid) */}
        <CardDescription>{company}</CardDescription>
        <CardDescription>{location}</CardDescription>
        <CardDescription>{extent}</CardDescription>
      </CardHeader>

      {/* Footer med "Apply"-knappen */}
      <CardFooter className="flex justify-end">
        {/* asChild gör att <Link> blir själva knappen och får Button-styling */}
        <Button asChild>
          <Link href={applyUrl}>Apply</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
