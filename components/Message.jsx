import { assets } from "@/assets/assets";
import Image from "next/image";
import React, { useEffect } from "react";
import Markdown from "react-markdown";
import Prism from "prismjs";
import toast from "react-hot-toast";

const Message = ({ role, content, onQuickAction }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [content]);

  const copyMessage = () => {
    try {
      navigator.clipboard.writeText(content);
      toast.success("Message copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-3xl text-sm">
      <div className={`flex flex-col w-full mb-8 ${role === "user" && "items-end"}`}>
        <div
          className={`group relative flex max-w-2xl py-3 rounded-xl ${
            role === "user" ? "bg-[#414158] px-5" : "gap-3"
          }`}
        >
          {/* Hover actions */}
          <div
            className={`opacity-0 group-hover:opacity-100 absolute ${
              role === "user" ? "-left-16 top-2.5" : "left-9 -bottom-6"
            } transition-all`}
          >
            <div className="flex items-center gap-2 opacity-70">
              {role === "user" ? (
                <>
                  <Image
                    onClick={copyMessage}
                    src={assets.copy_icon}
                    alt="Copy"
                    className="w-4 cursor-pointer"
                    width={16}
                    height={16}
                  />
                  <Image
                    src={assets.pencil_icon}
                    alt="Edit"
                    className="w-4.5 cursor-pointer"
                    width={18}
                    height={18}
                  />
                </>
              ) : (
                <>
                  <Image
                    onClick={copyMessage}
                    src={assets.copy_icon}
                    alt="Copy"
                    className="w-4.5 cursor-pointer"
                    width={18}
                    height={18}
                  />
                  <Image
                    src={assets.regenerate_icon}
                    alt="Regenerate"
                    className="w-4 cursor-pointer"
                    width={16}
                    height={16}
                  />
                  <Image
                    src={assets.like_icon}
                    alt="Like"
                    className="w-4 cursor-pointer"
                    width={16}
                    height={16}
                  />
                  <Image
                    src={assets.dislike_icon}
                    alt="Dislike"
                    className="w-4 cursor-pointer"
                    width={16}
                    height={16}
                  />
                </>
              )}
            </div>
          </div>

          {/* Message bubble */}
          {role === "user" ? (
            <span className="text-white/90">{content}</span>
          ) : (
            <>
              <Image
                src={assets.logo_icon}
                alt="Assistant"
                className="h-9 w-9 p-1 border border-white/15 rounded-full"
                width={36}
                height={36}
              />
              <div className="space-y-4 w-full overflow-x-hidden">
                <Markdown>{content}</Markdown>

                {/* Quick actions row (assistant only) */}
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    className="btn"
                    onClick={() => onQuickAction?.("summarize")}
                    title="Summarize this response"
                  >
                    Summarize
                  </button>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => onQuickAction?.("rewrite")}
                    title="Rewrite this response"
                  >
                    Rewrite
                  </button>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => onQuickAction?.("bullets")}
                    title="Extract bullet points"
                  >
                    Bullets
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
