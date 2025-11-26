import Link from "next/link";
import ThemeToggle from "../../ui/themeToggle";

// Header for the website.
export default function Header() {
    return (
        <div className="padding-responsive pt-5 pb-5 shadow-md shadow-shadow flex justify-between items-center">
            <Link href="/"><h1 className="font-bold">EYB - End Your Bias</h1></Link>
            <ThemeToggle></ThemeToggle>
        </div>
    );
}