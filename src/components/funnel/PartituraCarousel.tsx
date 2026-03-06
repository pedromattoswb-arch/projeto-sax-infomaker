import p1 from "@/assets/partituras-exemplo/partitura-1.png";
import p2 from "@/assets/partituras-exemplo/partitura-2.png";
import p3 from "@/assets/partituras-exemplo/partitura-3.png";
import p4 from "@/assets/partituras-exemplo/partitura-4.png";
import p5 from "@/assets/partituras-exemplo/partitura-5.png";
import p6 from "@/assets/partituras-exemplo/partitura-6.png";
import p7 from "@/assets/partituras-exemplo/partitura-7.png";
import p8 from "@/assets/partituras-exemplo/partitura-8.png";
import p9 from "@/assets/partituras-exemplo/partitura-9.png";

const partituras = [p1, p2, p3, p4, p5, p6, p7, p8, p9];
const doubled = [...partituras, ...partituras];

const PartituraCarousel = () => {
  return (
    <section className="py-10 md:py-14 px-0 bg-[hsl(240,20%,10%)] overflow-hidden">
      <div className="max-w-3xl mx-auto text-center px-4 mb-6 md:mb-8">
        <h2 className="text-[22px] md:text-3xl font-bold font-heading mb-2 text-white">
          Veja Alguns Exemplos do Acervo
        </h2>
        <p className="text-white/60 text-sm md:text-base font-body">
          +2.000 partituras profissionais para sax alto e tenor — e o acervo cresce todo mês
        </p>
      </div>

      <div className="relative group">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-r from-[hsl(240,20%,10%)] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-l from-[hsl(240,20%,10%)] to-transparent z-10 pointer-events-none" />

        <div className="flex animate-partitura-scroll group-hover:[animation-play-state:paused]">
          {doubled.map((src, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[200px] md:w-[260px] mx-2 md:mx-3"
            >
              <img
                src={src}
                alt={`Exemplo de partitura ${(i % partituras.length) + 1}`}
                className="w-full h-auto rounded-lg md:rounded-xl border border-white/10 shadow-lg shadow-black/30"
                loading="lazy"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartituraCarousel;
