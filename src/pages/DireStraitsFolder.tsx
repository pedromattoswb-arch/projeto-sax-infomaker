import { useEffect, useState, useRef, useCallback, useMemo } from "react";

import useNoIndex from "@/hooks/useNoIndex";
import {
  Folder,
  ChevronRight,
  ArrowLeft,
  Download,
  AlertCircle,
  Menu,
  FileText,
  Music,
  Gift,
  Crown,
  Play,
  Eye,
} from "lucide-react";
import { Link } from "react-router-dom";
import logoClubeSax from "@/assets/logo-clube-do-sax.png";
import MobileNav from "@/components/acervo/MobileNav";
import { Skeleton } from "@/components/ui/skeleton";

// Import Dire Straits assets
import privateInvestigationsAsset from "@/assets/dire-straits/private-invastigations.pdf.asset.json";
import twistingAsset from "@/assets/dire-straits/twisting-by-the-pool.pdf.asset.json";
import roadrunningAsset from "@/assets/dire-straits/all-the-roadrunning.pdf.asset.json";
import telegraphAsset from "@/assets/dire-straits/telegraph-road-v-2.pdf.asset.json";
import tunnelAsset from "@/assets/dire-straits/tunnel-of-love-v-2.pdf.asset.json";
import walkOnLifeAsset from "@/assets/dire-straits/walk-on-life.pdf.asset.json";
import onEveryStreetAsset from "@/assets/dire-straits/on-every-street.pdf.asset.json";
import romeoJulietAsset from "@/assets/dire-straits/romeo---juliet-v-2.pdf.asset.json";
import brothersInArmsAsset from "@/assets/dire-straits/brothers-in-arms-v-4.pdf.asset.json";
import sultansOfSwingAsset from "@/assets/dire-straits/sultans-of-swing-v-5.pdf.asset.json";
import walkOfLifeV2Asset from "@/assets/dire-straits/walk-of-life-v-2.pdf.asset.json";
import yourLatestTrickV2Asset from "@/assets/dire-straits/your-latest-trick-v-2.pdf.asset.json";
import onEveryStreet2Asset from "@/assets/dire-straits/on-every-street-2.pdf.asset.json";
import soFarAwayAsset from "@/assets/dire-straits/so-far-away.pdf.asset.json";

const DIRE_STRAITS_FILES = [
  { id: "ds-1", name: "Dire Straits - Private Investigations.pdf", type: "pdf" as const, downloadUrl: privateInvestigationsAsset.url, viewUrl: privateInvestigationsAsset.url },
  { id: "ds-2", name: "Dire Straits - Twisting By The Pool.pdf", type: "pdf" as const, downloadUrl: twistingAsset.url, viewUrl: twistingAsset.url },
  { id: "ds-3", name: "Dire Straits - All The Roadrunning.pdf", type: "pdf" as const, downloadUrl: roadrunningAsset.url, viewUrl: roadrunningAsset.url },
  { id: "ds-4", name: "Dire Straits - Telegraph Road.pdf", type: "pdf" as const, downloadUrl: telegraphAsset.url, viewUrl: telegraphAsset.url },
  { id: "ds-5", name: "Dire Straits - Tunnel of Love.pdf", type: "pdf" as const, downloadUrl: tunnelAsset.url, viewUrl: tunnelAsset.url },
  { id: "ds-6", name: "Dire Straits - Walk on Life.pdf", type: "pdf" as const, downloadUrl: walkOnLifeAsset.url, viewUrl: walkOnLifeAsset.url },
  { id: "ds-7", name: "Dire Straits - On Every Street.pdf", type: "pdf" as const, downloadUrl: onEveryStreetAsset.url, viewUrl: onEveryStreetAsset.url },
  { id: "ds-8", name: "Dire Straits - Romeo and Juliet.pdf", type: "pdf" as const, downloadUrl: romeoJulietAsset.url, viewUrl: romeoJulietAsset.url },
  { id: "ds-9", name: "Dire Straits - Brothers in Arms.pdf", type: "pdf" as const, downloadUrl: brothersInArmsAsset.url, viewUrl: brothersInArmsAsset.url },
  { id: "ds-10", name: "Dire Straits - Sultans of Swing.pdf", type: "pdf" as const, downloadUrl: sultansOfSwingAsset.url, viewUrl: sultansOfSwingAsset.url },
  { id: "ds-11", name: "Dire Straits - Walk of Life (v2).pdf", type: "pdf" as const, downloadUrl: walkOfLifeV2Asset.url, viewUrl: walkOfLifeV2Asset.url },
  { id: "ds-12", name: "Dire Straits - Your Latest Trick (v2).pdf", type: "pdf" as const, downloadUrl: yourLatestTrickV2Asset.url, viewUrl: yourLatestTrickV2Asset.url },
  { id: "ds-13", name: "Dire Straits - On Every Street (v2).pdf", type: "pdf" as const, downloadUrl: onEveryStreet2Asset.url, viewUrl: onEveryStreet2Asset.url },
  { id: "ds-14", name: "Dire Straits - So Far Away.pdf", type: "pdf" as const, downloadUrl: soFarAwayAsset.url, viewUrl: soFarAwayAsset.url },
];

const UPGRADE_URL = "https://pay.wiapy.com/jyPuib6Uivrl";

const DireStraitsFolder = () => {
  useNoIndex();
  const [viewingPdf, setViewingPdf] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-card border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/">
            <img src={logoClubeSax} alt="Clube do Sax" className="h-12 md:h-14 w-auto" />
          </Link>
          <Link to="/acervo" className="text-sm font-bold text-primary flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Voltar ao Acervo
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Folder className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-black font-heading">Dire Straits - Especial</h1>
            <p className="text-muted-foreground text-sm">Coleção exclusiva de partituras</p>
          </div>
        </div>

        <div className="grid gap-3">
          {DIRE_STRAITS_FILES.map((file) => (
            <div
              key={file.id}
              className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-2xl border-l-4 border-l-destructive bg-card border border-border shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="shrink-0 w-11 h-11 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-destructive" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-foreground truncate">{file.name}</p>
                  <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-destructive/10 text-destructive">
                    Partitura
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setViewingPdf(file.viewUrl)}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-white font-bold text-sm transition-colors"
                >
                  <Eye className="w-4 h-4" /> Visualizar
                </button>
                <a
                  href={file.downloadUrl}
                  download={file.name}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-border text-muted-foreground hover:bg-muted font-bold text-sm transition-colors"
                >
                  <Download className="w-4 h-4" /> Baixar
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>

      {viewingPdf && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex flex-col">
          <div className="p-4 flex justify-end">
            <button
              onClick={() => setViewingPdf(null)}
              className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <AlertCircle className="w-6 h-6 rotate-45" />
            </button>
          </div>
          <iframe src={viewingPdf} className="flex-1 w-full border-0" title="PDF Viewer" />
        </div>
      )}
      
      
    </div>
  );
};

export default DireStraitsFolder;
