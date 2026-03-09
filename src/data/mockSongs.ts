import type { Song } from "@/types/acervo";

export const mockSongs: Song[] = [
  { id: "1", title: "Careless Whisper", artist: "George Michael", genre: "Pop", pdfUrl: "", audioUrl: "/playbacks/careless-whisper.mp3" },
  { id: "2", title: "Your Latest Trick", artist: "Dire Straits", genre: "Rock", pdfUrl: "", audioUrl: "/playbacks/your-latest-trick.mp3" },
  { id: "3", title: "Dancing Queen", artist: "ABBA", genre: "Pop", pdfUrl: "", audioUrl: "/playbacks/dancing-queen.mp3" },
  { id: "4", title: "Sozinho", artist: "Caetano Veloso", genre: "MPB", pdfUrl: "", audioUrl: "/playbacks/sozinho.mp3" },
  { id: "5", title: "Estranha Loucura", artist: "Barão Vermelho", genre: "MPB", pdfUrl: "", audioUrl: "/playbacks/estranha-loucura.mp3" },
  { id: "6", title: "Boate Azul", artist: "Bruno & Marrone", genre: "Sertanejo", pdfUrl: "", audioUrl: "/playbacks/boate-azul.mp3" },
  { id: "7", title: "Alegria Está No Coração", artist: "Kleber Lucas", genre: "Gospel", pdfUrl: "", audioUrl: "/playbacks/alegria-esta-no-coracao.mp3" },
  { id: "8", title: "Espírito, Espírito", artist: "Preto no Branco", genre: "Gospel", pdfUrl: "", audioUrl: "/playbacks/espirito-espirito.mp3" },
  { id: "9", title: "Tudo É Possível", artist: "Davi Sacer", genre: "Gospel", pdfUrl: "", audioUrl: "/playbacks/tudo-e-possivel.mp3" },
  { id: "10", title: "Amigo de Deus", artist: "Trazendo a Arca", genre: "Gospel", pdfUrl: "", audioUrl: "/playbacks/amigo-de-deus.mp3" },
  { id: "11", title: "Endless Love", artist: "Lionel Richie", genre: "Pop", pdfUrl: "", audioUrl: "/playbacks/endless-love.mp3" },
  { id: "12", title: "Tan Enamorados", artist: "Fernando Villalona", genre: "Pop", pdfUrl: "", audioUrl: "/playbacks/tan-enamorados.mp3" },
  { id: "13", title: "Prince Ali", artist: "Aladdin OST", genre: "Pop", pdfUrl: "", audioUrl: "/playbacks/prince-ali.mp3" },
  { id: "14", title: "Jingle Bells", artist: "Tradicional", genre: "Clássico", pdfUrl: "", audioUrl: "/playbacks/jingle-bells.mp3" },
  { id: "15", title: "Alguém Me Disse", artist: "Alcione", genre: "MPB", pdfUrl: "", audioUrl: "/playbacks/alguem-me-disse.mp3" },
  // More mock entries without audio
  { id: "16", title: "Take Five", artist: "Dave Brubeck", genre: "Jazz", pdfUrl: "", audioUrl: "" },
  { id: "17", title: "Garota de Ipanema", artist: "Tom Jobim", genre: "Bossa Nova", pdfUrl: "", audioUrl: "" },
  { id: "18", title: "Desafinado", artist: "Tom Jobim", genre: "Bossa Nova", pdfUrl: "", audioUrl: "" },
  { id: "19", title: "Baker Street", artist: "Gerry Rafferty", genre: "Rock", pdfUrl: "", audioUrl: "" },
  { id: "20", title: "Just The Two of Us", artist: "Grover Washington Jr.", genre: "Jazz", pdfUrl: "", audioUrl: "" },
  { id: "21", title: "Evidências", artist: "Chitãozinho & Xororó", genre: "Sertanejo", pdfUrl: "", audioUrl: "" },
  { id: "22", title: "Ainda Lembro", artist: "Marisa Monte", genre: "MPB", pdfUrl: "", audioUrl: "" },
  { id: "23", title: "Autumn Leaves", artist: "Jazz Standard", genre: "Jazz", pdfUrl: "", audioUrl: "" },
  { id: "24", title: "Wave", artist: "Tom Jobim", genre: "Bossa Nova", pdfUrl: "", audioUrl: "" },
];

export const ALL_GENRES = [
  "Pop", "MPB", "Rock", "Gospel", "Jazz", "Bossa Nova", "Sertanejo", "Clássico",
] as const;
