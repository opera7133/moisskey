import { userAtom } from "@/lib/atoms";
import { ImageType, NoteType, TextType, URLType } from "@/types/note";
import { Dialog, Transition } from "@headlessui/react";
import { useAtom } from "jotai";
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function DeleteSelfNote({
  summaryId,
  summaryData,
  openDelete,
  setOpenDelete,
}: {
  summaryId: string;
  summaryData: (NoteType | TextType | ImageType | URLType | null)[];
  openDelete: false | "report" | "delete";
  setOpenDelete: any;
}) {
  const [user] = useAtom(userAtom);
  const [selfNotes, setSelfNotes] = useState<NoteType[]>([]);
  const [chk, setChk] = useState<Array<any>>([]);
  function closeModal() {
    setChk([]);
    setOpenDelete(false);
  }
  useEffect(() => {
    const sda = summaryData
      .map((sd: NoteType | TextType | ImageType | URLType | null) => {
        if (
          sd &&
          sd.type === "note" &&
          (`${sd.user.username}@${sd.user.host}` === user?.username ||
            `${sd.renote?.user.username}@${sd.renote?.user.host}` ===
              user?.username)
        ) {
          return sd;
        }
      })
      .filter(Boolean);
    // @ts-ignore
    setSelfNotes(sda);
    setChk(new Array(sda.length).fill(false));
  }, [user]);

  async function deleteNotes() {
    if (chk.some((c) => c)) {
      const ok = confirm("これらのノートを削除します。よろしいですか？");
      if (ok) {
        const res = await (
          await fetch("/api/summary/deleteNotes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              summaryId: summaryId,
              data: chk.filter(Boolean),
            }),
          })
        ).json();
        if (res.status === "success") {
          toast.success("ノートを削除しました");
          setOpenDelete(false);
        } else {
          toast.error(res.error);
        }
      }
    }
  }

  function setChecks(state: boolean, index: string | number) {
    if (state) {
      setChk(
        chk.map((c, i) => (i === Number(index) ? selfNotes[Number(index)] : c))
      );
    } else {
      setChk(chk.map((c, i) => (i === Number(index) ? false : c)));
    }
  }

  return (
    <Transition appear show={openDelete === "delete"} as={Fragment}>
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
                  自分のノートを削除する
                </Dialog.Title>
                <div className="mt-2">
                  <table className="list-none text-sm overflow-y-scroll block max-h-96">
                    <tbody>
                      {selfNotes.map(
                        (sd, i) =>
                          sd && (
                            <tr key={sd.id}>
                              <td className="p-1">
                                <label className="flex items-start">
                                  <input
                                    className="mr-1 text-lime-500 focus:ring-lime-500"
                                    onChange={(e) =>
                                      setChecks(
                                        e.target.checked,
                                        e.target.value
                                      )
                                    }
                                    checked={chk[i]}
                                    type="checkbox"
                                    name="report"
                                    value={i.toString()}
                                  />
                                  <div className="flex items-start gap-1">
                                    <img
                                      src={sd.user.avatarUrl}
                                      className="w-10 rounded"
                                    />
                                    <p className="w-full break-all whitespace-pre-wrap">
                                      {sd.text}
                                    </p>
                                  </div>
                                </label>
                              </td>
                            </tr>
                          )
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={async () => await deleteNotes()}
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
