import Image from "next/image";

import { cn } from "@/lib/utils";

type LogoProps = {
  // Use "inverse" on a dark or primary-colored background.
  inverse?: boolean;
  // Hide the words when space is tight. The tile stays.
  showWordmark?: boolean;
  // Keep "Maple Ledger" but drop the small line under it (the admin header on a phone).
  compact?: boolean;
  className?: string;
};

// The tile is an SVG file. The words are live text, so they stay sharp and can wrap.
export function Logo({
  inverse = false,
  showWordmark = true,
  compact = false,
  className,
}: LogoProps) {
  return (
    <span className={cn("inline-flex shrink-0 items-center gap-3 whitespace-nowrap", className)}>
      <Image
        src={inverse ? "/brand/ml-monogram-inverse.svg" : "/brand/ml-monogram.svg"}
        alt=""
        width={40}
        height={40}
        priority
        className="size-10 shrink-0"
      />
      {showWordmark ? (
        <span
          className={cn(
            "flex min-w-0 flex-col leading-tight",
            // The admin header on a phone is tight: show only the tile there (the link has its own aria-label).
            compact && "max-[419px]:hidden",
          )}
        >
          <span
            className={cn(
              "text-lg font-bold",
              inverse ? "text-primary-foreground" : "text-primary-ink",
            )}
          >
            Maple Ledger
          </span>{" "}
          <span
            className={cn(
              "text-xs font-bold tracking-wide uppercase max-[349px]:hidden",
              compact && "hidden",
              inverse ? "text-primary-foreground" : "text-muted-foreground",
            )}
          >
            Bookkeeping &amp; Accounting
          </span>
        </span>
      ) : (
        <span className="sr-only">Maple Ledger Bookkeeping &amp; Accounting</span>
      )}
    </span>
  );
}
