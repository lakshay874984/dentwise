import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      <SignUpButton mode="modal">sign up</SignUpButton>
      </div>
  );
}
