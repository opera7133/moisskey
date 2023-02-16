import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import { Fragment } from "react";
import { MdArrowDropDown } from "react-icons/md";
import { twMerge } from "tailwind-merge";

export default function SummaryUserDropDown({ summaryId, deleteSummary }: any) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button>
          <MdArrowDropDown size={20} />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute origin-top-left w-40 break-keep bg-white divide-y divide-gray-100 rounded-md shadow-lg">
          <div className="py-1 flex flex-col text-sm">
            <Menu.Item>
              {({ active }) => (
                <Link
                  href={`/create?summaryId=${summaryId}`}
                  className={twMerge(
                    "text-left px-2 py-1",
                    active && "bg-lime-500 text-white"
                  )}
                >
                  まとめを編集する
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={deleteSummary}
                  className={twMerge(
                    "text-left px-2 py-1",
                    active && "bg-lime-500 text-white"
                  )}
                >
                  削除する
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
