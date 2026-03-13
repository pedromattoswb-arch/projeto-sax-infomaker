import React, { useState } from "react";
import { Folder, Lock, Crown, ExternalLink } from "lucide-react";
import type { DriveFolder } from "@/hooks/useDriveFiles";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface LockedFolderCardProps {
  folder: DriveFolder;
  upgradeUrl: string;
  icon?: React.ReactNode;
}

const LockedFolderCard = React.memo(({ folder, upgradeUrl, icon }: LockedFolderCardProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div role="listitem">
        <button
          onClick={() => setOpen(true)}
          className="group flex items-center gap-3 p-3 md:p-5 bg-card border border-border/40 rounded-2xl hover:border-muted-foreground/30 transition-all text-left w-full min-h-[60px] opacity-75 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={`${folder.name} — bloqueado, disponível no Plano Completo`}
        >
          <div className="shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl bg-muted/60 flex items-center justify-center relative">
            {icon || <Folder className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground" />}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-card border border-border flex items-center justify-center">
              <Lock className="w-3 h-3 text-muted-foreground" />
            </div>
          </div>
          <span className="font-body font-bold text-sm md:text-base text-muted-foreground break-words leading-snug flex-1">
            {folder.name}
          </span>
          <Lock className="w-4 h-4 text-muted-foreground/40 shrink-0" />
        </button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-2">
              <Lock className="w-7 h-7 text-muted-foreground" />
            </div>
            <DialogTitle className="text-center font-body">
              Conteúdo Exclusivo
            </DialogTitle>
            <DialogDescription className="text-center font-body">
              <strong className="text-foreground">{folder.name}</strong> está disponível apenas no{" "}
              <strong className="text-foreground">Plano Completo</strong>. Faça o upgrade para desbloquear todo o acervo, bônus e materiais exclusivos.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 mt-2">
            <Button asChild className="w-full gap-2">
              <a href={upgradeUrl} target="_blank" rel="noopener noreferrer">
                <Crown className="w-4 h-4" />
                Fazer Upgrade
                <ExternalLink className="w-3.5 h-3.5 ml-auto opacity-60" />
              </a>
            </Button>
            <Button variant="ghost" onClick={() => setOpen(false)} className="w-full text-muted-foreground">
              Voltar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
});

LockedFolderCard.displayName = "LockedFolderCard";
export default LockedFolderCard;
