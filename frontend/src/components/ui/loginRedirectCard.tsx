"use client"

import { User } from "lucide-react";
import { Button } from "./button";
import { 
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle 
} from "./card";
import Link from "next/link";

interface ILoginRedirectCardProps {
    signInAs: string;
    redirectUrl: string;
};

// A card that redirects you, upon pressed, to another url.
export default function LoginRedirectCard(props: ILoginRedirectCardProps) {
    return (
        <Card className="min-w-xs">
            <CardHeader>
                <CardTitle className="text-center text-xl">{props.signInAs}</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center align-middle">
                <User className="w-50 h-full"></User>
            </CardContent>
            <CardFooter>
                <Link href={props.redirectUrl} className="w-full"><Button className="w-full">Sign in</Button></Link>
            </CardFooter>
        </Card>
    );
};