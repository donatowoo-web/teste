"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { useState } from "react";
import type SwiperType from "swiper";

export default function GaleriaCasa({
  imagens,
  nomeProjeto,
}: {
  imagens: string[];
  nomeProjeto: string;
}) {
  const [thumbs, setThumbs] = useState<SwiperType | null>(null);

  return (
    <div>
      {/* Slider principal */}
      <Swiper
        modules={[Navigation, Thumbs]}
        navigation
        thumbs={{ swiper: thumbs }}
        style={{ borderRadius: 22, overflow: "hidden" }}
      >
        {imagens.map((src, idx) => (
          <SwiperSlide key={src}>
            <div style={{ position: "relative", width: "100%", height: "70vh", minHeight: 420 }}>
              <Image
                src={src}
                alt={`${nomeProjeto} - imagem ${idx + 1}`}
                fill
                priority={idx === 0}
                style={{ objectFit: "cover" }}
                sizes="100vw"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnails */}
      <div style={{ marginTop: 12 }}>
        <Swiper
          modules={[Thumbs]}
          onSwiper={setThumbs}
          slidesPerView={6}
          spaceBetween={10}
          watchSlidesProgress
          breakpoints={{
            0: { slidesPerView: 3 },
            640: { slidesPerView: 5 },
            1024: { slidesPerView: 7 },
          }}
        >
          {imagens.map((src, idx) => (
            <SwiperSlide key={src + "thumb"}>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: 80,
                  borderRadius: 14,
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.18)",
                  cursor: "pointer",
                }}
              >
                <Image
                  src={src}
                  alt={`${nomeProjeto} - miniatura ${idx + 1}`}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="200px"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
