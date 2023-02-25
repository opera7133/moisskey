import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useAtom } from "jotai";
import { urlsDialogAtom } from "@/lib/atoms";
export default function UrlsDialog({ getNotes }: any) {
  const [data, setData] = useAtom(urlsDialogAtom);
  const updateData = (val: string) => {
    if (val) {
      setData([true, val.split("\n")]);
    } else {
      setData([true, [val]]);
    }
  };
  const getData = async () => {
    await getNotes("urls");
    setData([false, []]);
  };
  return (
    <Transition appear show={data[0]} as={Fragment}>
      <Dialog as="div" open={data[0]} onClose={() => setData([false, []])}>
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
              <Dialog.Panel className="relative w-full max-w-md min-h-[26vh] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div>
                  <label
                    className="border-l-4 pl-2 border-black font-bold"
                    htmlFor="urls"
                  >
                    ノートのURLを指定して一括読み込み
                  </label>
                  <textarea
                    className="my-2 w-full block rounded py-1 px-2 text-sm focus:border-lime-500 focus:ring-lime-500"
                    name="urls"
                    id="urls"
                    rows={5}
                    placeholder="ノートのURLを指定して読み込むことができます。（複数可）"
                    value={data[1].join("\n")}
                    onChange={(e) => updateData(e.target.value)}
                  ></textarea>
                </div>
                <div className="absolute right-5 bottom-5 flex items-center gap-3">
                  <button
                    onClick={() => setData([false, []])}
                    className="bg-gray-200 duration-100 hover:bg-gray-300 px-4 py-2 rounded"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={async () => getData()}
                    className="bg-lime-500 duration-100 hover:bg-lime-600 text-white px-4 py-2 rounded"
                  >
                    読み込み
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
