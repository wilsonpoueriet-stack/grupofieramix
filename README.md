# GRUPO FIERAMIX.COM — Enterprise

Proyecto inicial en Next.js para publicar en GitHub y Netlify.

## Publicación rápida

1. Descomprime este ZIP.
2. Entra al repositorio `wilsonpoueriet-stack/grupofieramix`.
3. Elimina la carpeta antigua `portal_fieramix_v2_completo`.
4. Sube **el contenido de esta carpeta**, de modo que `package.json` quede en la raíz.
5. Confirma los cambios.
6. Netlify detectará Next.js y ejecutará `npm run build`.

## Configuración de Netlify

- Build command: `npm run build`
- Publish directory: dejar que Netlify la detecte
- Node: 22

## Desarrollo local

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`.

## Supabase

1. Crea un proyecto en Supabase.
2. Ejecuta `supabase/schema.sql` en SQL Editor.
3. Copia `.env.example` como `.env.local`.
4. Agrega:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

La primera entrega ya muestra las nueve emisoras con:
- Logo
- Nombre
- Eslogan debajo del nombre
- Género
- Botón de reproducción
- Favoritos locales

## Próximos módulos

- Panel administrativo con autenticación.
- Noticias conectadas a Supabase.
- Programación dinámica.
- Podcasts.
- Dedicatorias y Club de Oyentes.
- Analíticas.


## Actualización V2
- Nueva portada profesional.
- Reproductor fijo inferior.
- Navegación móvil.
- Noticias, programación y Club de Oyentes.


## VERSIÓN 3
- Encabezado oficial de GRUPO FIERAMIX.COM.
- Frase principal: LA MEJOR MÚSICA LATINA DE TODOS LOS TIEMPOS.
- Todos los encabezados principales en mayúsculas.
- Nueva sección EMISORA DESTACADA.
- FIERAMIX NOTICIAS reforzado con identidad de marca.
- Navegación y botones actualizados.
