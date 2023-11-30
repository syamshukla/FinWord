import { auth, googleProvider } from "@/lib/firebase";
import { addUserToFirestore } from "@/lib/firebase/useController";
import {
  browserSessionPersistence,
  setPersistence,
  signInWithRedirect,
  getRedirectResult,
  signInWithPopup,
} from "firebase/auth";
import { AppRouterInstance } from "next/navigation";

// Function to handle Google sign-in
export const handleSignIn = async (router: AppRouterInstance) => {
  try {
    // Set browser session persistence
    await setPersistence(auth, browserSessionPersistence);

    try {
     const result =  await signInWithPopup(auth, googleProvider);
     const user = result?.user;
     if (user) {
      await addUserToFirestore(user);
      // router.push("/play");
    }
} catch (error) {
      console.error("Error signing in with Google", error);
}

    
  } catch (error) {
    console.error("Error during sign-in:", error);
    throw new Error(error.message);
  }
};