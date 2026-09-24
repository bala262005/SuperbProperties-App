
import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Slot, useSegments } from "expo-router";

export default function RootGroupLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();

  if (!isLoaded) {
    return null;
  }

  const isAuthScreen =
    segments[1] === "sign-in" ||
    segments[1] === "sign-up";

  if (!isSignedIn && !isAuthScreen) {
    return <Redirect href={"/(root)/sign-in" as any} />;
  }

  if (isSignedIn && isAuthScreen) {
    return <Redirect href={"/(root)/(tabs)" as any} />;
  }

  return <Slot />;
}

