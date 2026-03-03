import { Play } from "lucide-react";

const VideoTestimonials = () => {
  return (
    <section className="py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h3 className="text-xl font-bold text-center mb-6 font-heading">
          🎥 Depoimentos em Vídeo
        </h3>
        <p className="text-center text-muted-foreground font-body text-sm mb-8">
          Em breve, vídeos reais de saxofonistas que já usam o acervo
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="aspect-video bg-muted rounded-xl border border-border flex flex-col items-center justify-center gap-2"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Play className="w-5 h-5 text-primary ml-0.5" />
              </div>
              <span className="text-xs text-muted-foreground font-body">
                Em breve
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoTestimonials;
