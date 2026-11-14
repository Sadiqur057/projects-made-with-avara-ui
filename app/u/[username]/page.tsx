import { Suspense } from "react";
import { ProfileView } from "@/components/forum/profile-view";

export const metadata = {
  title: "Member profile",
};

async function Profile({ params }: { params: PageProps<"/u/[username]">["params"] }) {
  const { username } = await params;
  return <ProfileView username={decodeURIComponent(username)} />;
}

export default function ProfilePage(props: PageProps<"/u/[username]">) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8" aria-busy="true">
          <div className="h-48 animate-pulse rounded-3xl bg-muted" />
        </div>
      }
    >
      <Profile params={props.params} />
    </Suspense>
  );
}
