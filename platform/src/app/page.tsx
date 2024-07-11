'use client'

import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl mb-4">Welcome to Our Platform</h1>
      {!session ? (
        <button
          onClick={() => signIn("google")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Sign in with Google
        </button>
      ) : (
        <div>
          <p>Signed in as {session.user?.email}</p>
          <button
            onClick={() => signOut()}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}