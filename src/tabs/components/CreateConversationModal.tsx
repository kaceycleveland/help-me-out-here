import { useCallback, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { useForm } from "react-hook-form";
import { useCreateConversationMutation } from "../../api/hooks";
import { MessageEntry } from "../../api";

interface CreateConversationModalProps {
  messages: MessageEntry[];
  show?: boolean;
  onClose: () => void;
}

export const CreateConversationModal = ({
  messages,
  show,
  onClose,
}: CreateConversationModalProps) => {
  const { mutateAsync: createConversation, isLoading } =
    useCreateConversationMutation({
      onSuccess: onClose,
    });
  const { register, handleSubmit } = useForm({
    defaultValues: {
      title: "",
    },
  });
  const handleCreateConversation = useCallback(
    handleSubmit(({ title }) => {
      createConversation({ title, messages });
    }),
    [messages, createConversation]
  );

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-lg transition-all flex flex-col gap-4">
                <Dialog.Title className="text-xl font-bold">
                  Create a Conversation
                </Dialog.Title>
                <Dialog.Description className="flex flex-col gap-4">
                  <Input
                    className="flex-1"
                    {...register("title")}
                    placeholder="Title your conversation"
                    disabled={isLoading}
                  />
                  <div className="flex gap-2 justify-end">
                    <Button onClick={onClose} disabled={isLoading}>
                      Close
                    </Button>
                    <Button
                      onClick={handleCreateConversation}
                      disabled={isLoading}
                    >
                      Create
                    </Button>
                  </div>
                </Dialog.Description>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
