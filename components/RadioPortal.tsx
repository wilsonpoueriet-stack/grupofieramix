"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Station } from "@/data/stations";

export default function RadioPortal({ stations }: { stations: Station[] }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [selectedId, setSelectedId] = useState(stations[0]?.id ?? "");
  const [playing, setPlaying] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const selected = useMemo(
    () => stations.find((station) => station.id === selectedId) ?? stations[0],
    [selectedId, stations]
  );

  useEffect(() => {
    try { setFavorites(JSON.parse(localStorage.getItem("fieramix-favorites") || "[]")); }
    catch { setFavorites([]); }
  }, []);

  async function selectStation(station: Station, autoplay = true) {
    setSelectedId(station.id);
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = station.stream;
    audio.load();
    if (autoplay) {
      try { await audio.play(); setPlaying(true); }
      catch { setPlaying(false); }
    }
  }

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio || !selected) return;
    if (!audio.src) return selectStation(selected, true);
    if (audio.paused) {
      try { await audio.play(); setPlaying(true); }
      catch { setPlaying(false); }
    } else {
      audio.pause();
      setPlaying(false);
    }
  }

  function nextStation(direction: number) {
    const current = stations.findIndex((station) => station.id === selected.id);
    selectStation(stations[(current + direction + stations.length) % stations.length], true);
  }

  function toggleFavorite(id: string) {
    const next = favorites.includes(id) ? favorites.filter((item) => item !== id) : [...favorites, id];
    setFavorites(next);
    localStorage.setItem("fieramix-favorites", JSON.stringify(next));
  }

  return (
    <>
      <header className="siteHeader">
        <a className="brand" href="#inicio">
          <img src="/logos/grupo.png" alt="Logo de GRUPO FIERAMIX.COM" />
          <div><strong>GRUPO FIERAMIX.COM</strong><span>La red latina que mueve el mundo</span></div>
        </a>
        <button className="menuButton" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        <nav className={menuOpen ? "open" : ""}>
          <a href="#emisoras">EMISORAS</a><a href="#noticias">NOTICIAS</a>
          <a href="#programacion">PROGRAMACIÓN</a><a href="#club">CLUB DE OYENTES</a>
          <a className="navLive" href="#emisoras">● EN VIVO</a>
        </nav>
      </header>

      <main id="inicio">
        <section className="hero">
          <div className="heroCopy">
            <span className="heroBrand">GRUPO FIERAMIX.COM</span>
            <span className="eyebrow">LA RED LATINA QUE MUEVE EL MUNDO</span>
            <h1>LA MEJOR MÚSICA LATINA<br /><em>DE TODOS LOS TIEMPOS</em></h1>
            <p>Disfruta de nueve emisoras especializadas con la mejor selección de merengue, bachata, salsa, baladas, reguetón, rancheras, música internacional y música cristiana. Transmitimos en vivo las 24 horas para acompañarte dondequiera que estés.</p>
            <div className="heroActions">
              <button onClick={togglePlayback}>{playing ? "PAUSAR TRANSMISIÓN" : "ESCUCHAR EN VIVO"}</button>
              <a href="#emisoras">VER TODAS LAS EMISORAS</a>
            </div>
            <div className="heroStats">
              <div><strong>9</strong><span>Emisoras</span></div>
              <div><strong>24/7</strong><span>En vivo</span></div>
              <div><strong>1</strong><span>Gran familia</span></div>
            </div>
          </div>

          {selected && <article className="nowPlaying">
            <div className="onAir"><i /> TRANSMITIENDO</div>
            <img src={selected.logo} alt={`Logo de ${selected.name}`} />
            <span className="stationGenre">{selected.genre}</span>
            <h2>{selected.name}</h2><p>{selected.slogan}</p>
            <div className="heroPlayerControls">
              <button onClick={() => nextStation(-1)}>⏮</button>
              <button className="roundPlay" onClick={togglePlayback}>{playing ? "❚❚" : "▶"}</button>
              <button onClick={() => nextStation(1)}>⏭</button>
            </div>
          </article>}
        </section>

        <section id="emisoras" className="section">
          <div className="sectionHeading">
            <div><span className="eyebrow">NUESTRAS EMISORAS</span><h2>NUESTRAS EMISORAS</h2></div>
            <p>LA MEJOR MÚSICA LATINA, EN VIVO LAS 24 HORAS.</p>
          </div>
          <div className="stationGrid">
            {stations.map((station) => {
              const active = selected?.id === station.id;
              const favorite = favorites.includes(station.id);
              return <article className={`stationCard ${active ? "active" : ""}`} key={station.id}>
                <div className="stationTop"><span>{station.genre}</span><button className={`favoriteButton ${favorite ? "favorite" : ""}`} onClick={() => toggleFavorite(station.id)}>{favorite ? "♥" : "♡"}</button></div>
                <img src={station.logo} alt={`Logo de ${station.name}`} />
                <h3>{station.name}</h3><p>{station.slogan}</p>
                <button className="listenButton" onClick={() => selectStation(station)}>{active && playing ? "● Escuchando ahora" : "▶ Escuchar en vivo"}</button>
              </article>;
            })}
          </div>
        </section>


        <section className="featuredStation">
          <div className="featuredVisual">
            <span className="featuredBadge">EMISORA DESTACADA</span>
            <img src={selected.logo} alt={`Logo de ${selected.name}`} />
          </div>
          <div className="featuredContent">
            <span className="eyebrow">EMISORA DESTACADA</span>
            <h2>{selected.name}</h2>
            <h3>{selected.slogan}</h3>
            <p>Disfruta esta señal en vivo y descubre la identidad musical de GRUPO FIERAMIX.COM.</p>
            <button onClick={togglePlayback}>{playing ? "PAUSAR TRANSMISIÓN" : "ESCUCHAR AHORA"}</button>
          </div>
        </section>

        <section id="noticias" className="featureSection">
          <div><span className="eyebrow">FIERAMIX NOTICIAS</span><h2>FIERAMIX NOTICIAS</h2><p>LA ACTUALIDAD NACIONAL E INTERNACIONAL AL INSTANTE.</p></div>
          <div className="newsMock">
            <article className="mainNews"><span>DESTACADA</span><h3>GRUPO FIERAMIX.COM</h3><p>LA RED LATINA QUE MUEVE EL MUNDO.</p></article>
            <article><span>COMUNIDAD</span><h3>Club de Oyentes</h3></article>
            <article><span>PROGRAMACIÓN</span><h3>Contenido para todos</h3></article>
          </div>
        </section>

        <section id="programacion" className="section">
          <div className="sectionHeading"><div><span className="eyebrow">PROGRAMACIÓN</span><h2>PROGRAMACIÓN</h2></div></div>
          <div className="comingGrid">
            <article><span>08:00 AM</span><h3>La Oración de las 8</h3><p>Fe, reflexión y oración.</p></article>
            <article><span>EN DESARROLLO</span><h3>FIERAMIX Noticias</h3><p>Actualidad nacional e internacional.</p></article>
            <article><span>PRÓXIMAMENTE</span><h3>Podcasts Fieramix</h3><p>Contenido para escuchar cuando quieras.</p></article>
          </div>
        </section>

        <section id="club" className="clubSection">
          <div><span className="eyebrow">CLUB DE OYENTES</span><h2>CLUB DE OYENTES</h2><p>Participa en promociones y mantente conectado con nuestras emisoras.</p></div>
          <a href="https://chat.whatsapp.com/JJfXFBwAG3O8DIKs9ufvJt" target="_blank">Entrar a la comunidad</a>
        </section>
      </main>

      <footer>
        <div className="footerBrand"><img src="/logos/grupo.png" alt="" /><div><strong>GRUPO FIERAMIX.COM</strong><p>La red latina que mueve el mundo</p></div></div>
        <div className="footerLinks"><a href="https://www.facebook.com/FieraMIXRD" target="_blank">Facebook</a><a href="https://www.instagram.com/fieramix" target="_blank">Instagram</a><a href="https://www.youtube.com/@fieramixtv5937" target="_blank">YouTube</a><a href="https://wa.me/18098419586" target="_blank">WhatsApp</a></div>
        <small>© 2026 GRUPO FIERAMIX.COM</small>
      </footer>

      {selected && <aside className="stickyPlayer">
        <div className="stickyStation"><img src={selected.logo} alt="" /><div><strong>{selected.name}</strong><span>{selected.slogan}</span></div></div>
        <div className="stickyControls"><button onClick={() => nextStation(-1)}>⏮</button><button className="stickyMain" onClick={togglePlayback}>{playing ? "❚❚" : "▶"}</button><button onClick={() => nextStation(1)}>⏭</button></div>
        <div className="stickyStatus"><i /> {playing ? "EN VIVO" : "LISTO"}</div>
      </aside>}

      <audio ref={audioRef} preload="none" onPause={() => setPlaying(false)} onPlay={() => setPlaying(true)} />
    </>
  );
}
