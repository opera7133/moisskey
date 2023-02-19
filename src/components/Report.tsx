import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function Report({
  summaryId,
  openReport,
  setOpenReport,
}: {
  summaryId: string;
  openReport: false | "report" | "delete";
  setOpenReport: any;
}) {
  const [chk, setChk] = useState(new Array(10).fill(false));
  function closeModal() {
    setChk(new Array(10).fill(false));
    setOpenReport(false);
  }

  async function sendReport() {
    if (chk.some((c) => c === true)) {
      const ok = confirm("この内容でまとめを報告します。よろしいですか？");
      if (ok) {
        const res = await (
          await fetch("/api/summary/report", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ summaryId: summaryId, reason: chk }),
          })
        ).json();
        if (res.status === "success") {
          toast.success("報告が完了しました");
        } else {
          toast.error(res.error);
        }
      }
    }
  }

  function setChecks(state: boolean, index: string | number) {
    setChk(chk.map((c, i) => (i === Number(index) ? state : c)));
  }

  return (
    <Transition appear show={openReport === "report"} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
              <Dialog.Panel className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium">
                  まとめを報告する
                </Dialog.Title>
                <div className="mt-2">
                  <table className="list-none text-sm">
                    <tbody>
                      <tr>
                        <td className="p-1">
                          <label>
                            <input
                              className="mr-1 text-lime-500 focus:ring-lime-500"
                              onChange={(e) =>
                                setChecks(e.target.checked, e.target.value)
                              }
                              checked={chk[0]}
                              type="checkbox"
                              name="report"
                              value="0"
                            />
                            ノートや情報を不適切な形で引用する行為
                          </label>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-1">
                          <label>
                            <input
                              className="mr-1 text-lime-500 focus:ring-lime-500"
                              onChange={(e) =>
                                setChecks(e.target.checked, e.target.value)
                              }
                              checked={chk[1]}
                              type="checkbox"
                              name="report"
                              value="1"
                            />
                            悪質な商品やサービスへの誘導・宣伝を目的とする行為
                          </label>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-1">
                          <label>
                            <input
                              className="mr-1 text-lime-500 focus:ring-lime-500"
                              onChange={(e) =>
                                setChecks(e.target.checked, e.target.value)
                              }
                              checked={chk[2]}
                              type="checkbox"
                              name="report"
                              value="2"
                            />
                            個人情報の掲載、収集を目的とする行為
                          </label>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-1">
                          <label>
                            <input
                              className="mr-1 text-lime-500 focus:ring-lime-500"
                              onChange={(e) =>
                                setChecks(e.target.checked, e.target.value)
                              }
                              checked={chk[3]}
                              type="checkbox"
                              name="report"
                              value="3"
                            />
                            閲覧に適さない画像の掲載
                          </label>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-1">
                          <label>
                            <input
                              className="mr-1 text-lime-500 focus:ring-lime-500"
                              onChange={(e) =>
                                setChecks(e.target.checked, e.target.value)
                              }
                              checked={chk[4]}
                              type="checkbox"
                              name="report"
                              value="4"
                            />
                            不当な差別や誹謗中傷をする行為
                          </label>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-1">
                          <label>
                            <input
                              className="mr-1 text-lime-500 focus:ring-lime-500"
                              onChange={(e) =>
                                setChecks(e.target.checked, e.target.value)
                              }
                              checked={chk[5]}
                              type="checkbox"
                              name="report"
                              value="5"
                            />
                            法令、公序良俗に反するおそれのある行為
                          </label>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-1">
                          <label>
                            <input
                              className="mr-1 text-lime-500 focus:ring-lime-500"
                              onChange={(e) =>
                                setChecks(e.target.checked, e.target.value)
                              }
                              checked={chk[6]}
                              type="checkbox"
                              name="report"
                              value="6"
                            />
                            第三者になりすます行為
                          </label>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-1">
                          <label>
                            <input
                              className="mr-1 text-lime-500 focus:ring-lime-500"
                              onChange={(e) =>
                                setChecks(e.target.checked, e.target.value)
                              }
                              checked={chk[7]}
                              type="checkbox"
                              name="report"
                              value="7"
                            />
                            タイトルと内容の不一致
                          </label>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-1">
                          <label>
                            <input
                              className="mr-1 text-lime-500 focus:ring-lime-500"
                              onChange={(e) =>
                                setChecks(e.target.checked, e.target.value)
                              }
                              checked={chk[8]}
                              type="checkbox"
                              name="report"
                              value="8"
                            />
                            虚偽又は誤解を招く情報や行為
                          </label>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-1">
                          <label>
                            <input
                              className="mr-1 text-lime-500 focus:ring-lime-500"
                              onChange={(e) =>
                                setChecks(e.target.checked, e.target.value)
                              }
                              checked={chk[9]}
                              type="checkbox"
                              name="report"
                              value="9"
                            />
                            コメント欄にて発生している問題
                          </label>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={async () => await sendReport()}
                      className="bg-lime-500 duration-100 hover:bg-lime-600 text-white px-4 py-2 rounded"
                    >
                      送信
                    </button>
                    <button
                      onClick={() => closeModal()}
                      className="bg-gray-200 duration-100 hover:bg-gray-300 px-4 py-2 rounded"
                    >
                      キャンセル
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
