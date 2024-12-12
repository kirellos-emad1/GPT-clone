import { ChatWithMessageCountAndSettings } from "@/types/collections";
import { titleCase } from "@/utils/helpers";
import { MessageCircle, MessageSquare } from "lucide-react";
import { TrashIcon } from "lucide-react";
import { DateTime } from "luxon";
import Link from "next/link";
import { Button } from "../ui/button";
import { deleteChat } from "@/app/actions/delete-chat";
import { useRouter } from "next/navigation";





const Chat = ({ chat }: { chat: ChatWithMessageCountAndSettings }) => {
  const router = useRouter()
  return (
    <div>

      <Link
        title={chat.title as string}
        href={`/chat/${chat.id}`}
      >
        <div className="flex items-center justify-between w-full  px-3 py-2 transition-colors duration-100 ease-in-out rounded-md bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-800">
          <MessageSquare className="shrink-0" size="16" />
          <div className="text-sm leading-loose line-clamp-1">{chat.title}</div>
          {chat.id && (

            <Button
              variant='ghost'
              size='sm'
              title="Delete chat"
              onClick={async () => {
                await deleteChat(chat.id)
                router.push('/')
              }
              }
            >
              <TrashIcon className="shrink-0" size="16" />

            </Button>
          )}
        </div>
        {/* Meta */}
        <div className="flex items-center mt-1 dark:text-neutral-600 text-neutral-400">
          <div className="text-xs">
            {titleCase(
              DateTime.fromISO(chat.created_at as unknown as string).toRelativeCalendar()!
            )}
          </div>
          <div className="w-1 h-1 mx-2 rounded-full dark:bg-neutral-700 bg-neutral-500" />
          <div className="flex items-center gap-1 text-xs">
            {chat.messages?.[0]?.count} <MessageCircle size="14" />
          </div>
        </div>
      </Link>

    </div>
  );
};

export default Chat;