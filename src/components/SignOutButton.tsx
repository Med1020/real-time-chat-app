"use client";

import { ButtonHTMLAttributes, FC, useState } from "react";
import Button from "./UI/Button";
import toast from "react-hot-toast";
import { Loader2, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const SignOutButton: FC<SignOutButtonProps> = ({ ...props }) => {
  const [isSigningOut, setSigningOut] = useState(false);
  return (
    <Button
      {...props}
      intent="ghost"
      onClick={async () => {
        setSigningOut(true);
        try {
          await signOut();
        } catch (error) {
          toast.error("There was a problem siging out");
        } finally {
          setSigningOut(false);
        }
      }}
    >
      {isSigningOut ? (
        <Loader2 className="animate-spin h-4 w-4" />
      ) : (
        <LogOut className="w-4 h-4" />
      )}
    </Button>
  );
};
export default SignOutButton;
