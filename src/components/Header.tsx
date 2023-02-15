import Link from "next/link";
import { BiSearchAlt2 } from "react-icons/bi";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import UserMenu from "./UserMenu";
import { Dialog, Transition } from "@headlessui/react";

export default function Header({ user, loading }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [origin, setOrigin] = useState("");

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
        <div className="relative">
          <input
            type="text"
            className="rounded h-8 px-2 text-sm w-64 focus:border-lime-500 focus:ring-lime-500"
            placeholder="キーワード・ユーザー名を入力"
          />
          <BiSearchAlt2
            size={20}
            color="gray"
            className="absolute top-1.5 right-2"
          />
        </div>
        {loading ? null : (
          <>
            {user ? (
              <UserMenu user={user} />
            ) : (
              <>
                <button onClick={() => setIsOpen(true)} className="text-sm">
                  ログイン / 会員登録
                </button>
                <Transition appear show={isOpen} as={Fragment}>
                  <Dialog
                    as="div"
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
                            <p>
                              Moisskeyにログインして、まとめを作成しましょう。
                            </p>
                            <div className="flex flex-row my-4">
                              <span className="bg-gray-100 py-2 px-3 rounded-l">
                                https://
                              </span>
                              <input
                                id="origin"
                                value={origin}
                                onChange={(e) => setOrigin(e.target.value)}
                                type="text"
                                placeholder="misskey.io"
                                className="focus:border-lime-500 focus:ring-lime-500 rounded-r"
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
          </>
        )}
      </div>
    </header>
  );
}
