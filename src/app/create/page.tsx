"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreateInvitationRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/templates");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-xs text-stone-400">
      Redirecting to template catalog...
    </div>
  );
}
