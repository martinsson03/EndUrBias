"use client"

// The login page. Doesn't contain any secret, hence client component.
export default function LoginPage() {
    return (
      <div className="w-full max-w-md p-8 bg-white shadow rounded">
        <h1 className="text-2xl font-bold mb-4">Sign In</h1>
        <form>
          <input type="text" placeholder="Email" className="mb-2 w-full p-2 border" />
          <input type="password" placeholder="Password" className="mb-2 w-full p-2 border" />
          <button type="submit" className="w-full p-2 bg-blue-500 text-white">Sign In</button>
        </form>
      </div>
    );
}