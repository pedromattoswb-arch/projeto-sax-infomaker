import React from "react";
import { Folder, ChevronRight } from "lucide-react";
import type { DriveFolder } from "@/hooks/useDriveFiles";

interface FolderCardProps {
  folder: DriveFolder;
  onOpen: (folder: DriveFolder) => void;
}

const FolderCard = React.memo(({ folder, onOpen }: FolderCardProps) => (
  <button
    onClick={() => onOpen(folder)}
    className="group flex items-center gap-3 p-4 md:p-5 bg-card border border-border rounded-2xl hover:shadow-lg hover:border-primary/40 active:scale-[0.98] transition-all duration-200 text-left w-full min-h-[64px]"
  >
    <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
      <Folder className="w-6 h-6 text-primary" />
    </div>
    <span className="font-body font-bold text-base text-foreground break-words flex-1">
      {folder.name}
    </span>
    <ChevronRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-primary shrink-0 transition-colors" />
  </button>
));

FolderCard.displayName = "FolderCard";
export default FolderCard;
