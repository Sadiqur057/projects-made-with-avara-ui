"use client";

import { useRouter } from "next/navigation";
import RegisterForm, {
  type RegisterFormValues,
} from "@/components/custom/blocks/RegisterForm";
import { signIn } from "@/lib/session";

export default function RegisterPage() {
  const router = useRouter();

  // Mock sign-up: the form has already validated every field.
  const handleSubmit = async (values: RegisterFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    signIn({
      email: values.email,
      name: `${values.firstName} ${values.lastName}`.trim(),
    });
    router.push("/dashboard");
  };

  // Mock social sign-up: signs in as a demo user.
  const handleSocial = (provider: "github" | "google" | "apple") => {
    signIn({ email: `demo@${provider}.com`, name: "Demo User" });
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <RegisterForm
        variant="split"
        color="primary"
        brandName="Notewise"
        title="Never take meeting notes again."
        subtitle="Create your workspace in a minute. Notewise handles transcripts, summaries and follow-ups from the first call."
        loginHref="/login"
        termsHref="#"
        privacyHref="#"
        onSubmit={handleSubmit}
        onSocialSignUp={handleSocial}
      />
    </div>
  );
}
