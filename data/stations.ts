export type Station = {
  id: string;
  name: string;
  slogan: string;
  genre: string;
  logo: string;
  stream: string;
};

export const stations: Station[] = [
  {
    "id": "fieramix",
    "name": "FIERAMIX",
    "slogan": "La Brava",
    "genre": "Música variada",
    "logo": "/logos/brava.png",
    "stream": "https://c11.radioboss.fm:18269/stream"
  },
  {
    "id": "solo-bachata",
    "name": "SOLO BACHATA",
    "slogan": "La Radio que Te Mueve",
    "genre": "Bachata",
    "logo": "/logos/bachata.png",
    "stream": "https://c15.radioboss.fm:18221/stream"
  },
  {
    "id": "solo-merengue",
    "name": "SOLO MERENGUE",
    "slogan": "La Radio que Te Mueve",
    "genre": "Merengue",
    "logo": "/logos/merengue.png",
    "stream": "https://c15.radioboss.fm:18223/stream"
  },
  {
    "id": "solo-salsa",
    "name": "SOLO SALSA",
    "slogan": "La Radio que Te Mueve",
    "genre": "Salsa",
    "logo": "/logos/salsa.png",
    "stream": "https://c15.radioboss.fm:18230/stream"
  },
  {
    "id": "solo-baladas",
    "name": "SOLO BALADAS",
    "slogan": "La Radio que Mueve Tus Sentidos",
    "genre": "Baladas",
    "logo": "/logos/baladas.png",
    "stream": "https://c15.radioboss.fm:18222/stream"
  },
  {
    "id": "solo-reggaeton",
    "name": "SOLO REGGAETON",
    "slogan": "La Radio que Te Mueve",
    "genre": "Reggaetón",
    "logo": "/logos/reggaeton.png",
    "stream": "https://c13.radioboss.fm:18182/stream"
  },
  {
    "id": "solo-rancheras",
    "name": "SOLO RANCHERAS",
    "slogan": "La Mexicana de República Dominicana",
    "genre": "Rancheras",
    "logo": "/logos/rancheras.png",
    "stream": "https://c11.radioboss.fm:18212/stream"
  },
  {
    "id": "solo-internacional",
    "name": "SOLO MÚSICA INTERNACIONAL",
    "slogan": "La Americana de República Dominicana",
    "genre": "Música internacional",
    "logo": "/logos/americana.png",
    "stream": "https://c13.radioboss.fm:18188/stream"
  },
  {
    "id": "solo-cristiana",
    "name": "SOLO MÚSICA CRISTIANA",
    "slogan": "La Radio que Eleva y Purifica Tu Espíritu",
    "genre": "Música cristiana",
    "logo": "/logos/cristiana.png",
    "stream": "https://c11.radioboss.fm:18211/stream"
  }
];
