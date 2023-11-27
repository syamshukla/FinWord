import LoginButton from "@/components/login/Login";
import Image from "next/image";

export default function Login() {
  return (
    <main className="flex h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-10">
        <LoginButton />
      </div>
    </main>
  );
}
