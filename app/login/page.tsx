"use client";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <main className="min-h-screen grid place-items-center">
      <button
        className="px-4 py-2 rounded-lg border"
        onClick={() => signIn("google")}
      >
        Google-ээр нэвтрэх
      </button>
    </main>
  );
}
