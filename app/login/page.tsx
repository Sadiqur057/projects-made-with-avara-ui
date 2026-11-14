"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import LoginForm, {
  type LoginFormValues,
} from "@/components/custom/blocks/LoginForm";
import { nameFromEmail, signIn } from "@/lib/session";

export default function LoginPage() {
  const router = useRouter();

  // Mock sign-in: the form has already validated the email and password.
  const handleSubmit = async (values: LoginFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    signIn({ email: values.email, name: nameFromEmail(values.email) });
    router.push("/dashboard");
  };

  // Mock social sign-in: signs in as a demo user.
  const handleSocial = (provider: "github" | "google") => {
    signIn({ email: `demo@${provider}.com`, name: "Demo User" });
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <LoginForm
        variant="split"
        color="primary"
        brandName="Notewise"
        title="Welcome back. Your meetings are waiting."
        subtitle="Pick up where you left off: summaries, action items and the AI assistant are one click away."
        signupHref="/register"
        forgotPasswordHref="#"
        onSubmit={handleSubmit}
        onSocialSignIn={handleSocial}
      />
      <Link
        href="/"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-md focus:bg-background focus:px-3 focus:py-2"
      >
        Back to home
      </Link>
    </div>
  );
}
