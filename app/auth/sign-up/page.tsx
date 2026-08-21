import { AuthView } from "@neondatabase/auth-ui";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-md py-8">
        <AuthView path="sign-up" />
      </div>
    </main>
  );
}