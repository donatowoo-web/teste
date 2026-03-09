"use client";

import { useEffect, useState } from "react";
import styles from "./inicie.module.css";

const images = [
  "/Casas/Aspen/aspen1.jpg",
  "/Casas/Lisboa/1_-scaled.jpg",
  "/Casas/Miami/1-2-scaled.jpg",
  "/Casas/Oslo/1ma-1-scaled.jpg",
  "/Casas/Phoenix/phoenix1.jpg",
  "/Casas/Toronto/1-7-scaled.jpg",
  "/Casas/Berlim/1-1.jpg",
  "/Casas/Portland/pt_1.jpg",
  "/Casas/Vermont/ver1.jpg",
  "/Casas/Long Beach/lb1.jpg",
  "/Casas/Budapeste/budapestecapa-scaled.jpg",
  "/Casas/Madrid/1-14-scaled.jpg",
];

export default function BgSlideshow() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((c) => (c + 1) % images.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.slideshowWrap}>
      {images.map((src, i) => (
        <div
          key={src}
          className={`${styles.slideshowImg} ${i === current ? styles.slideshowImgActive : ""}`}
          style={{ backgroundImage: `url(${src})` }}
        />
      ))}
      <div className={styles.slideshowOverlay} />
    </div>
  );
}
