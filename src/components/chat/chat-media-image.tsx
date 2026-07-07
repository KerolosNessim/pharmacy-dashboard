"use client";

import { resolveMediaUrl } from "@/lib/media-url";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

type ChatMediaImageProps = {
  url: string;
  alt?: string;
};

export function ChatMediaImage({ url, alt = "Chat image" }: ChatMediaImageProps) {
  const resolvedUrl = resolveMediaUrl(url);
  const [failed, setFailed] = useState(false);

  if (!resolvedUrl || failed) {
    return (
      <div className="mb-1 flex h-32 w-48 items-center justify-center rounded bg-white/10 text-xs text-white/70">
        Image unavailable
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className="block text-left">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resolvedUrl}
            alt={alt}
            className="mb-1 max-h-48 w-auto max-w-full cursor-pointer rounded object-cover hover:opacity-90"
            onError={() => setFailed(true)}
          />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={resolvedUrl}
          alt={alt}
          className="h-auto max-h-[80vh] w-full rounded-lg object-contain"
          onError={() => setFailed(true)}
        />
      </DialogContent>
    </Dialog>
  );
}
