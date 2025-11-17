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
  title: string;
  company: string;
  location: string;
  applyUrl: string;
  extent: string;
}

export default function JobRedirectCard({
  title,
  company,
  location,
  applyUrl,
  extent,
}: JobRedirectCardProps) {
  return (
    <Card className="w-[460px]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{company}</CardDescription>
        <CardDescription>{location}</CardDescription>
        <CardDescription>{extent}</CardDescription>
      </CardHeader>

      <CardFooter className="flex justify-end">
        <Button asChild>
          <Link href={applyUrl}>Apply</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
