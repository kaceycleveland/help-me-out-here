import { ReactNode, useState, useCallback } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { useForm } from "react-hook-form";
import { db, MessageEntry, ModelBody } from "../../../api";
import { useGetConversation } from "../../../api/hooks/useGetConversation";
import { formatDate } from "../../../utils/dateUtils";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { PromptOptionsSettingsModal } from "../PromptOptionsSettingsModal";
import { CreateConversationModal } from "../CreateConversationModal";

interface ConversationFormHeaderProps {
  conversationId?: number;
  messages?: MessageEntry[];
  modelSettings: ModelBody;
  setModelSettings: (body: ModelBody) => void;
  children?: ReactNode;
}

export const ConversationFormHeader = ({
  conversationId,
  messages,
  modelSettings,
  setModelSettings,
  children,
}: ConversationFormHeaderProps) => {
  const [editingTitle, setEditingTitle] = useState(false);
  const { data } = useGetConversation(conversationId);
  console.log(data);
  const { register, reset, handleSubmit, formState } = useForm({
    mode: "all",
    defaultValues: { title: data?.title },
  });

  const toggleEditingTitle = useCallback(() => {
    setEditingTitle(!editingTitle);
    reset();
  }, [editingTitle]);

  const handleTitleSubmit = useCallback(
    handleSubmit(async (body) => {
      if (body.title && conversationId) {
        console.log("updating", body.title);
        await db.updateConversation(conversationId, body.title);
        reset(body);
        setEditingTitle(false);
      }
    }),
    [reset, conversationId]
  );

  return (
    <div className="flex flex-col gap-1 font-semibold bg-slate-50 py-2 px-4 border my-2">
      <div className="flex justify-between items-center">
        {conversationId ? (
          <div className="text-xl flex gap-2 items-center">
            <div className="w-5" onClick={toggleEditingTitle}>
              <PencilSquareIcon />
            </div>
            <div className="h-9">
              {editingTitle ? (
                <form className="flex gap-2" onSubmit={handleTitleSubmit}>
                  <Input
                    className="w-80"
                    variant="sm"
                    disabled={formState.isSubmitting || formState.isLoading}
                    {...register("title")}
                  />
                  <Button
                    type="submit"
                    disabled={formState.isSubmitting || formState.isLoading}
                  >
                    Save
                  </Button>
                  <Button
                    onClick={toggleEditingTitle}
                    disabled={formState.isSubmitting || formState.isLoading}
                  >
                    Cancel
                  </Button>
                </form>
              ) : (
                data?.title
              )}
            </div>
          </div>
        ) : (
          messages && (
            <div className="flex gap-2">
              <CreateConversationModal
                messages={messages}
                modelBody={modelSettings}
              />
              {children}
            </div>
          )
        )}
        <PromptOptionsSettingsModal
          modelSettings={modelSettings}
          setModelSettings={setModelSettings}
        />
      </div>
      {data?.created && (
        <div className="text-sm">{formatDate(data?.created, "PP")}</div>
      )}
    </div>
  );
};
