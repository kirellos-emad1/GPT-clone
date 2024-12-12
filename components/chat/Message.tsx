"use client";
import { useAuth } from "@/context/AuthContext";
import "highlight.js/styles/github-dark-dimmed.css";
import { Clipboard, Edit2Icon, RefreshCw } from "lucide-react";
import { useRef, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Message as MessageT } from "@prisma/client";
import { useAtom, useSetAtom } from "jotai";
import { messageIDAtom, addMessageAtom, inputAtom, regenerateHandlerAtom } from "@/atoms/chat";
import { Button } from "../ui/button";

const Message = ({ message }: { message: MessageT }) => {
    console.log(message)
    const isAssistant = message.role === "assistant";
    const isUser = message.role === "user";
    const setMessages = useSetAtom(messageIDAtom);
    const { user } = useAuth();
    const [isHandling, addMessageHandler] = useAtom(addMessageAtom);
    const [inputValue, setInputValue] = useAtom(inputAtom);
    const [editMode, setEditMode] = useState(false);
    const [isRegenerateSeen, regenerateHandler] = useAtom(regenerateHandlerAtom);

    const codeRef = useRef<HTMLElement>(null);
    const handleEdit = async () => {
        setMessages(message.id)
        await addMessageHandler("edit", message.id);
        setEditMode(false)
        setMessages('')
    };

    return (
        <div
            className={
                !isAssistant
                    ? "dark:bg-neutral-950/60 bg-neutral-100/50"
                    : "dark:bg-neutral-900 bg-neutral-200/40 last:pb-64 last:sm:pb-44"
            }
        >
            {/* Container */}
            <div
                className={
                    !isAssistant
                        ? "flex flex-row-reverse  justify-center gap-4 w-full max-w-3xl  px-4 py-10 mx-auto sm:px-8 text-right"
                        : "flex  justify-center  w-full max-w-3xl gap-4 px-4 py-10 mx-auto sm:px-8"
                }
            >
                {/* Avatar */}
                <Avatar className="w-8 h-8 ring-1 ring-offset-2  dark:bg-white ring-neutral-100 rounded-xl">
                    <AvatarImage
                        src={!isAssistant ? user?.avatar_url ?? "/user-avatar.png" : "/gpt.png"}
                    />
                    <AvatarFallback>{!isAssistant ? "YOU" : "AI"}</AvatarFallback>
                </Avatar>

                {/* Message */}
                <div className="w-[calc(100%-50px)]">
                    {editMode ? (
                        <div className="flex flex-col gap-2">
                            <textarea
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="w-full p-2 border rounded-md dark:bg-neutral-800 bg-neutral-50"
                            />
                            <Button onClick={handleEdit} variant={'default'} size="sm">
                                Save
                            </Button>
                        </div>
                    ) : !isAssistant || message.content !== "" ? (
                        <ReactMarkdown
                            className="break-words markdown"
                            components={{
                                code: ({ inline, className, children }: any) => {
                                    const language = className?.split("-")[1];
                                    if (inline)
                                        return (
                                            <span className="px-2 py-1 text-sm rounded-md dark:bg-neutral-800 bg-neutral-50">
                                                {children}
                                            </span>
                                        );
                                    return (
                                        <div className="w-full my-5 overflow-hidden rounded-md">
                                            {/* Code Title */}
                                            <div className="dark:bg-[#0d111780] bg-neutral-50 py-2 px-3 text-xs flex items-center justify-between">
                                                <div>{language ?? "javascript"}</div>
                                                {/* Copy code to the clipboard */}
                                                <CopyToClipboard text={codeRef?.current?.innerText as string}>
                                                    <button className="flex items-center gap-1">
                                                        <Clipboard size="14" />
                                                        Copy Code
                                                    </button>
                                                </CopyToClipboard>
                                            </div>
                                            {/* Code Block */}
                                            <code
                                                ref={codeRef}
                                                className={
                                                    (className ?? "hljs language-javascript") +
                                                    " !whitespace-pre"
                                                }
                                            >
                                                {children}
                                            </code>
                                        </div>
                                    );
                                },
                            }}
                            rehypePlugins={[rehypeHighlight]}
                            remarkPlugins={[remarkGfm]}
                        >
                            {message.content ?? ""}
                        </ReactMarkdown>
                    ) : (
                        <div className="flex items-center gap-2 px-3 py-1 text-sm rounded-md max-w-fit dark:bg-neutral-950/50 bg-neutral-200">
                            <div className="w-2 h-2 bg-indigo-900 rounded-full animate-pulse" />
                            <span>Thinking</span>
                        </div>
                    )}
                </div>

                {/* Edit Button */}
                {isUser && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditMode(!editMode)}
                    >
                        <Edit2Icon size={14} />
                    </Button>
                )}
            </div>
                {!isHandling && isRegenerateSeen && (
                    <div className="items-center justify-center hidden py-2 sm:flex">
                        <Button
                            variant="ghost"
                            className="flex items-center gap-2"
                            onClick={regenerateHandler}
                        >
                            <span>Regenerate Response</span> <RefreshCw size="14" />
                        </Button>
                    </div>
                )}
        </div>
    );
};

export default Message;
