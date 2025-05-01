import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import React from "react";
import { useLocation } from "react-router-dom";

export default function ErrorPage({ error }) {
  const location = useLocation();
  const { data: user } = useUser();
  const message =
    error ?? location.state?.error ?? "We couldn't find that page.";

  // Determine where "home" is based on user role
  const homeLink = user?.role === "admin" ? "/admin" : "/app/companies";

  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4">
      <h1 className="text-2xl font-bold text-red-600">Oops!</h1>
      <p className="text-gray-600 max-w-md text-center">{message}</p>
      <Button asChild>
        <a href={homeLink}>Go Home</a>
      </Button>
    </div>
  );
}
