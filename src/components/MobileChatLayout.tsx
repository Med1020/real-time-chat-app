"use client";

import { FC } from "react";
import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import Button, { buttonVariants } from "./UI/Button";
import { Icons } from "./Icons";

interface MobileChatLAyoutProps {}

const MobileChatLayout: FC<MobileChatLAyoutProps> = ({}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bg-zinc-50 border-b border-zinc-200 top-0 inset-x-0 py-2 px-4">
      <div className="w-full flex justify-between items-center">
        <Link href="/dashboard" className={buttonVariants({ intent: "ghost" })}>
          <Icons.Logo className="h-6 w-auto text-indigo-600"></Icons.Logo>
        </Link>
        <Button onClick={() => setOpen(true)} className="gap-4">
          Menu
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
        />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pl-10">
              <DialogPanel
                transition
                className="pointer-events-auto relative w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
              >
                <TransitionChild>
                  <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 duration-500 ease-in-out data-[closed]:opacity-0 sm:-ml-10 sm:pr-4">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                    >
                      <span className="absolute -inset-2.5" />
                      <span className="sr-only">Close panel</span>
                      <X aria-hidden="true" className="h-6 w-6" />
                    </button>
                  </div>
                </TransitionChild>
                <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                  <div className="px-4 sm:px-6">
                    <DialogTitle className="text-base font-semibold leading-6 text-gray-900">
                      Panel title
                    </DialogTitle>
                  </div>
                  <div className="relative mt-6 flex-1 px-4 sm:px-6">
                    {/* Your content */}
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
export default MobileChatLayout;
