import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useAtom } from "jotai";
import { activesAtom, dialogAtom } from "@/lib/atoms";
export default function MDialog() {
  const [data, setData] = useAtom(dialogAtom);
  const [actives, setActives] = useAtom(activesAtom);
  const [imgdata, setImgData] = useState({
    title: "",
    alt: "",
    quote: "",
  });
  function updateData(nid?: string | null) {
    setActives(
      actives.map((at) => {
        if (at.type === "image" && at.id === nid) {
          return { ...at, ...imgdata };
        }
        return at;
      })
    );
    setData(null);
  }
  return (
    <Transition appear show={data !== null} as={Fragment}>
      <Dialog as="div" open={data !== null} onClose={() => setData(null)}>
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
              <Dialog.Panel className="relative w-full max-w-md min-h-[42vh] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {data !== null && data.type === "image" && (
                  <div>
                    <div>
                      <label
                        className="border-l-4 pl-2 border-black font-bold"
                        htmlFor="title"
                      >
                        画像タイトル
                      </label>
                      <input
                        className="my-2 w-full block rounded py-1 px-2 text-sm focus:border-lime-500 focus:ring-lime-500"
                        type="text"
                        name="title"
                        id="title"
                        value={imgdata.title}
                        onChange={(e) =>
                          setImgData({ ...imgdata, title: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label
                        className="border-l-4 pl-2 border-black font-bold"
                        htmlFor="alt"
                      >
                        画像の紹介コメント
                      </label>
                      <textarea
                        className="my-2 w-full block rounded py-1 px-2 text-sm focus:border-lime-500 focus:ring-lime-500"
                        name="alt"
                        id="alt"
                        rows={3}
                        value={imgdata.alt}
                        onChange={(e) =>
                          setImgData({ ...imgdata, alt: e.target.value })
                        }
                      ></textarea>
                    </div>
                    <div>
                      <label
                        className="border-l-4 pl-2 border-black font-bold"
                        htmlFor="quote"
                      >
                        画像の引用元URL
                      </label>
                      <input
                        className="my-2 w-full block rounded py-1 px-2 text-sm focus:border-lime-500 focus:ring-lime-500"
                        type="text"
                        name="quote"
                        id="quote"
                        value={imgdata.quote}
                        onChange={(e) =>
                          setImgData({ ...imgdata, quote: e.target.value })
                        }
                      />
                      <p className="text-red-600 text-sm">
                        著作権や他人の権利を尊重して、無断転載にお気をつけください。
                      </p>
                    </div>
                  </div>
                )}
                <div className="absolute right-5 bottom-5 flex items-center gap-3">
                  <button
                    onClick={() => setData(null)}
                    className="bg-gray-200 duration-100 hover:bg-gray-300 px-4 py-2 rounded"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={() => updateData(data?.id)}
                    className="bg-lime-500 duration-100 hover:bg-lime-600 text-white px-4 py-2 rounded"
                  >
                    保存
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
