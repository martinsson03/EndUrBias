import ThemeToggle from "./themeToggle";

// Header for the website.
export default function Header() {
    return (
        <div className="padding-responsive pt-5 pb-5 shadow-md shadow-shadow flex justify-between items-center">
            <h1 className="font-bold">EYB - End Your Bias</h1>
            <ThemeToggle></ThemeToggle>
        </div>
    );
};