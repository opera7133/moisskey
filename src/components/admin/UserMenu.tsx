import Link from "next/link";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { BiMenu } from "react-icons/bi";
import { useRouter } from "next/router";

export default function UserMenu({ user }: any) {
  const router = useRouter();
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
  return (
    <>
      <Link href={`/id/${user.username}`}>
        <img
          src={user.avatar}
          alt="User Avatar"
          width={28}
          height={28}
          className="rounded-full"
        />
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
                <div className="hidden md:block">
                  <Menu.Item>
                    <Link href="/create" className="menu item">
                      まとめを作成する
                    </Link>
                  </Menu.Item>
                </div>
              </div>
              <div className="p-1">
                <Menu.Item>
                  <Link href="/" className="menu item">
                    プロフィール
                  </Link>
                </Menu.Item>
                <Menu.Item>
                  <button onClick={() => logout()} className="menu item">
                    ログアウト
                  </button>
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </>
  );
}
