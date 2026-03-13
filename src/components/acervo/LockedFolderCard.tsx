import React from "react";
import { Folder, Lock, Crown } from "lucide-react";
import type { DriveFolder } from "@/hooks/useDriveFiles";

interface LockedFolderCardProps {
  folder: DriveFolder;
  upgradeUrl: string;
}

const LockedFolderCard = React.memo(({ folder, upgradeUrl }: LockedFolderCardProps) => (
  <div role="listitem" className="relative">
    <div className="group flex items-center gap-3 p-3 md:p-5 bg-card/60 border border-border/50 rounded-2xl opacity-70 w-full min-h-[60px] select-none">
      <div className="shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl bg-muted flex items-center justify-center">
        <Folder className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground" />
      </div>
      <span className="font-body font-bold text-sm md:text-base text-muted-foreground break-words leading-snug flex-1">
        {folder.name}
      </span>
      <Lock className="w-4 h-4 text-muted-foreground/60 shrink-0" />
    </div>
    {/* Overlay */}
    <div className="absolute inset-0 rounded-2xl bg-background/40 backdrop-blur-[1px] flex items-center justify-center">
      <a
        href={upgradeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-body font-bold text-xs shadow-lg transition-colors min-h-[40px]"
      >
        <Crown className="w-4 h-4" />
        Disponível no Plano Completo
      </a>
    </div>
  </div>
));

LockedFolderCard.displayName = "LockedFolderCard";
export default LockedFolderCard;
