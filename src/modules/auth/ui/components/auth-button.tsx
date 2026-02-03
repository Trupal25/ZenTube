"use client";
import { Button } from "@/components/ui/button";
import { ClapperboardIcon, UserCircleIcon, UserIcon } from "lucide-react";
import { UserButton, SignInButton, SignedOut, SignedIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export const AuthButton = () => {
  const router = useRouter();

  return (
    <>
      <SignedIn>
        <UserButton>
          <UserButton.MenuItems>
            <UserButton.Action
              onClick={() => router.push("/users/current")}
              label="My Profile"
              labelIcon={<UserIcon className="size-4" />}
            />
            <UserButton.Action
              label="Studio"
              labelIcon={<ClapperboardIcon className="size-4" />}
              onClick={() => router.push("/studio")}
            />
            <UserButton.Action label="manageAccount" />
          </UserButton.MenuItems>
        </UserButton>
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <Button
            variant={"outline"}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500 border-blue-500/20 rounded-full shadow-none [&_svg]:size-5"
          >
            <UserCircleIcon />
            Sign in
          </Button>
        </SignInButton>
      </SignedOut>
    </>
  );
};
