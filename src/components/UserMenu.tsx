import Link from "next/link";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { BiMenu } from "react-icons/bi";
import { MdEdit } from "react-icons/md";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

export default function UserMenu({ user }: any) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const logout = async () => {
    const chk = confirm("ログアウトします。よろしいですか？");
    if (chk) {
      const signout = await fetch("/api/auth/signout");
      const res = await signout.json();
      if (res.status === "success") {
        router.reload();
      }
    }
  };
  const deleteUser = async () => {
    const chk = confirm("本当に退会します。よろしいですか？");
    if (chk) {
      const res = await (await fetch("/api/auth/delete")).json();
      if (res.status === "success") {
        toast.success("アカウントを削除しました");
        await logout();
      } else {
        toast.error("削除中にエラーが発生しました");
      }
    }
  };
  return (
    <>
      <Link href={`/id/${user.username}`}>
        <img
          src={user.avatar}
          alt="User Avatar"
          width={28}
          height={28}
          className="rounded-full"
          referrerPolicy="no-referrer"
        />
      </Link>
      <Link
        href="/create"
        className="rounded md:border border-lime-600 md:text-lime-600 px-1.5 md:px-4 py-1.5 text-sm duration-100 md:hover:bg-lime-600 md:hover:text-white"
      >
        <span className="hidden md:block">まとめる</span>
        <MdEdit className="block md:hidden" size={20} />
      </Link>
      <div className="relative z-50">
        <Menu as="div">
          <Menu.Button>
            <BiMenu size={30} className="mt-1.5" />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="bg-white absolute top-8 w-56 origin-top-right divide-y divide-gray-100 right-0 flex flex-col rounded shadow text-sm">
              <div className="p-1">
                <Menu.Item>
                  <Link href={`/id/${user.username}`} className="menu item">
                    マイページ
                  </Link>
                </Menu.Item>
                <Menu.Item>
                  <Link href="/create" className="menu item">
                    まとめを作成する
                  </Link>
                </Menu.Item>
              </div>
              <div className="p-1">
                <Menu.Item>
                  <button onClick={() => setIsOpen(true)} className="menu item">
                    退会する
                  </button>
                </Menu.Item>
              </div>
              <div className="p-1">
                <Menu.Item>
                  <button onClick={() => logout()} className="menu item">
                    ログアウト
                  </button>
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
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
                  <Dialog.Panel className="flex flex-col gap-3 items-start relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                    <p className="border-l-4 border-black pl-1 font-bold">
                      本当に退会しますか？
                    </p>
                    <p className="text-sm text-start">
                      退会するとMoisskeyのまとめ、お気に入り、コメント等のユーザ投稿データが削除されます。
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={async () => await deleteUser()}
                        className="bg-lime-500 duration-100 hover:bg-lime-600 text-white px-4 py-2 rounded"
                      >
                        退会する
                      </button>
                      <button
                        onClick={() => setIsOpen(false)}
                        className="bg-gray-200 duration-100 hover:bg-gray-300 px-4 py-2 rounded"
                      >
                        キャンセル
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </>
  );
}
