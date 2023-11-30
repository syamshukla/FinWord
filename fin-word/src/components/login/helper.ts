import { auth, googleProvider } from "@/lib/firebase";
import { addUserToFirestore } from "@/lib/firebase/useController";
import {
  browserSessionPersistence,
  setPersistence,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const handleSignIn = (router: AppRouterInstance) => {
  setPersistence(auth, browserSessionPersistence)
    .then(() => {
      signInWithRedirect(auth, googleProvider);
      return getRedirectResult(auth);
    })
    .then((result) => {
      const user = result?.user;
      if (user) {
        addUserToFirestore(user);
        router.push("/play");
      }
    })
    .catch((error) => {
      throw new Error(error.message);
    });
};