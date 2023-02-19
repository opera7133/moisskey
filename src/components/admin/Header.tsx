import Link from "next/link";
import { BiSearchAlt2 } from "react-icons/bi";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useAtom } from "jotai";
import { userAtom } from "@/lib/atoms";
import { useRouter } from "next/router";
import UserMenu from "./UserMenu";

export default function Header() {
  const [user] = useAtom(userAtom);
  return (
    <header className="shadow px-4 flex items-center justify-between py-3">
      <Link href="/">
        <h2 className="text-xl font-semibold">
          <Image
            src="/img/moisskey.svg"
            alt="Moisskey"
            width={185}
            height={33}
          />
        </h2>
      </Link>
      <div className="flex items-center gap-3">
        {user && <UserMenu user={user} />}
      </div>
    </header>
  );
}
