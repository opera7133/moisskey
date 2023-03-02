import Link from "next/link";
import { BiSearchAlt2 } from "react-icons/bi";
import Image from "next/image";
import { Fragment, useState } from "react";
import UserMenu from "./UserMenu";
import { Dialog, Transition } from "@headlessui/react";
import { useAtom } from "jotai";
import { loadingAtom, userAtom } from "@/lib/atoms";
import { useRouter } from "next/router";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Header() {
  const [loading] = useAtom(loadingAtom);
  const [user] = useAtom(userAtom);
  const [isOpen, setIsOpen] = useState(false);
  const [origin, setOrigin] = useState("");
  const router = useRouter();

  const generate = async () => {
    const signin = await fetch("/api/auth/signin", {
      body: JSON.stringify({ origin: origin }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    const res = await signin.json();
    return res.redirect;
  };

  const handleKeyDown = (e: any) => {
    if (e.nativeEvent.isComposing || e.key !== "Enter" || !e.target.value)
      return;
    router.push(`/search?q=${e.target.value}`);
  };

  return (
    <header className="container flex items-center justify-between py-3">
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
        <div className="relative hidden md:block">
          <input
            type="text"
            className="rounded h-8 px-2 text-sm w-64 focus:border-lime-500 focus:ring-lime-500"
            placeholder="キーワードを入力"
            onKeyDown={handleKeyDown}
          />
          <BiSearchAlt2
            size={20}
            color="gray"
            className="absolute top-1.5 right-2"
          />
        </div>
        {loading ? (
          <Skeleton width={180} height={30} />
        ) : user ? (
          <UserMenu user={user} />
        ) : (
          <>
            <button onClick={() => setIsOpen(true)} className="text-sm">
              ログイン / 会員登録
            </button>
            <Transition appear show={isOpen} as={Fragment}>
              <Dialog
                as="div"
                className="relative z-10"
                open={isOpen}
                onClose={() => setIsOpen(false)}
              >
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>
                <div className="fixed inset-0 overflow-y-auto">
                  <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                    >
                      <Dialog.Panel className="flex flex-col gap-3 items-center relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-center align-middle shadow-xl transition-all">
                        <Image
                          src="/img/moisskey.svg"
                          alt="Moisskey"
                          width={224}
                          height={40}
                          className="my-4"
                        />
                        <p>Moisskeyにログインして、まとめを作成しましょう。</p>
                        <div className="flex flex-row my-4">
                          <span className="bg-gray-100 py-2 px-3 rounded-l">
                            https://
                          </span>
                          <input
                            id="origin"
                            value={origin}
                            onChange={(e) => setOrigin(e.target.value)}
                            type="text"
                            placeholder={
                              process.env.NEXT_PUBLIC_MIAUTH_DEFAULT_INSTANCE ||
                              "misskey.io"
                            }
                            className="w-48 md:w-auto focus:border-lime-500 focus:ring-lime-500 rounded-r"
                          />
                        </div>
                        <button
                          onClick={async () =>
                            (window.location.href = await generate())
                          }
                          className="bg-lime-500 duration-100 hover:bg-lime-600 text-white px-4 py-2 rounded"
                        >
                          Misskeyでログイン
                        </button>
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </div>
              </Dialog>
            </Transition>
          </>
        )}
      </div>
    </header>
  );
}
