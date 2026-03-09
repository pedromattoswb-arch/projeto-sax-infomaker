export type Genre = "Pop" | "MPB" | "Rock" | "Gospel" | "Jazz" | "Bossa Nova" | "Sertanejo" | "Clássico";

export interface Song {
  id: string;
  title: string;
  artist: string;
  genre: Genre;
  pdfUrl: string;
  audioUrl: string;
}
