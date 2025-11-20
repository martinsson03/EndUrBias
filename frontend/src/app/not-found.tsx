"use client"

// In case of 404.
export default function NotFound() {
    return (
        <div className="flex flex-col justify-center items-center grow">
            <h1>404</h1>
            <p>Didn't find what you were looking for!</p>
        </div>
    );
}