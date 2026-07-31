"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Station } from "@/data/stations";

type Props = { stations: Station[] };

export default function RadioPortal({ stations }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [selectedId, setSelectedId] = useState(stations[0]?.id ?? "");
  const [playing, setPlaying] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  const selected = useMemo(
    () => stations.find((station) => station.id === selectedId) ?? stations[0],
    [selectedId, stations]
  );

  useEffect(() => {
    try {
      setFavorites(JSON.parse(localStorage.getItem("fieramix-favorites") || "[]"));
    } catch {
      setFavorites([]);
    }
  }, []);

  async function selectStation(station: Station, autoplay = true) {
    setSelectedId(station.id);
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = station.stream;
    audio.load();
    if (autoplay) {
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    }
  }

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio || !selected) return;

    if (!audio.src) {
      await selectStation(selected, true);
      return;
    }

    if (audio.paused) {
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    } else {
      audio.pause();
      setPlaying(false);
    }
  }

  function toggleFavorite(id: string) {
    const next = favorites.includes(id)
      ? favorites.filter((item) => item !== id)
      : [...favorites, id];
    setFavorites(next);
    localStorage.setItem("fieramix-favorites", JSON.stringify(next));
  }

  return (
    <>
      <header className="siteHeader">
        <a className="brand" href="#inicio" aria-label="GRUPO FIERAMIX.COM">
          <img src="/logos/grupo.png" alt="Logo de GRUPO FIERAMIX.COM" />
          <div>
            <strong>GRUPO FIERAMIX.COM</strong>
            <span>La red latina que mueve el mundo</span>
          </div>
        </a>
        <nav>
          <a href="#emisoras">Emisoras</a>
          <a href="#noticias">Noticias</a>
          <a href="#programacion">Programación</a>
          <a href="#contacto">Contacto</a>
        </nav>
      </header>

      <main id="inicio">
        <section className="hero">
          <div className="heroCopy">
            <span className="eyebrow">NUEVA PLATAFORMA DIGITAL</span>
            <h1>Nueve emisoras. Una sola red.</h1>
            <p>
              Merengue, bachata, salsa, baladas, reggaetón, rancheras,
              música internacional y música cristiana, las 24 horas.
            </p>
            <div className="heroActions">
              <button onClick={togglePlayback}>
                {playing ? "Pausar transmisión" : "Escuchar en vivo"}
              </button>
              <a href="#emisoras">Ver emisoras</a>
            </div>
          </div>

          {selected && (
            <article className="nowPlaying">
              <span className="liveBadge">● EN VIVO</span>
              <img src={selected.logo} alt={`Logo de ${selected.name}`} />
              <h2>{selected.name}</h2>
              <p>{selected.slogan}</p>
              <small>{selected.genre}</small>
              <button className="roundPlay" onClick={togglePlayback}>
                {playing ? "❚❚" : "▶"}
              </button>
            </article>
          )}
        </section>

        <section id="emisoras" className="section">
          <div className="sectionHeading">
            <div>
              <span className="eyebrow">SEÑALES EN VIVO</span>
              <h2>Nuestras emisoras</h2>
            </div>
            <p>Selecciona una emisora para comenzar a escuchar.</p>
          </div>

          <div className="stationGrid">
            {stations.map((station) => {
              const active = selected?.id === station.id;
              const favorite = favorites.includes(station.id);
              return (
                <article className={`stationCard ${active ? "active" : ""}`} key={station.id}>
                  <button
                    className={`favoriteButton ${favorite ? "favorite" : ""}`}
                    onClick={() => toggleFavorite(station.id)}
                    aria-label="Guardar emisora favorita"
                  >
                    {favorite ? "♥" : "♡"}
                  </button>
                  <img src={station.logo} alt={`Logo de ${station.name}`} />
                  <h3>{station.name}</h3>
                  <p>{station.slogan}</p>
                  <span>{station.genre}</span>
                  <button className="listenButton" onClick={() => selectStation(station)}>
                    {active && playing ? "Escuchando ahora" : "Escuchar en vivo"}
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        <section id="noticias" className="featureSection">
          <div>
            <span className="eyebrow">FIERAMIX NOTICIAS</span>
            <h2>Información que conecta con nuestra comunidad</h2>
            <p>
              Este módulo quedará conectado al panel administrativo y a Supabase
              para publicar noticias sin editar el código.
            </p>
          </div>
          <div className="featureCards">
            <article><strong>Noticias</strong><span>Publicación y categorías</span></article>
            <article><strong>Programación</strong><span>Horarios por emisora</span></article>
            <article><strong>Podcasts</strong><span>Programas bajo demanda</span></article>
          </div>
        </section>

        <section id="programacion" className="section">
          <div className="sectionHeading">
            <div>
              <span className="eyebrow">PRÓXIMAMENTE</span>
              <h2>Programación y contenidos</h2>
            </div>
          </div>
          <div className="comingGrid">
            <article><span>01</span><h3>FIERAMIX Noticias</h3><p>Boletines y actualidad.</p></article>
            <article><span>02</span><h3>La Oración de las 8</h3><p>Fe, reflexión y oración.</p></article>
            <article><span>03</span><h3>Podcasts Fieramix</h3><p>Contenido para escuchar cuando quieras.</p></article>
          </div>
        </section>
      </main>

      <footer id="contacto">
        <div>
          <img src="/logos/grupo.png" alt="" />
          <p>GRUPO FIERAMIX.COM<br />La red latina que mueve el mundo</p>
        </div>
        <div className="footerLinks">
          <a href="https://www.facebook.com/FieraMIXRD" target="_blank">Facebook</a>
          <a href="https://www.instagram.com/fieramix" target="_blank">Instagram</a>
          <a href="https://www.youtube.com/@fieramixtv5937" target="_blank">YouTube</a>
          <a href="https://wa.me/18098419586" target="_blank">WhatsApp</a>
        </div>
      </footer>

      <audio
        ref={audioRef}
        preload="none"
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
      />
    </>
  );
}
