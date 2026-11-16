---
name: lcp-optimization
description: Diagnosticar y optimizar el Largest Contentful Paint (LCP) de una página web siguiendo la metodología de web.dev (Philip Walton y Barry Pollard) de las 4 subpartes - TTFB, retraso en la carga del recurso, duración de la carga del recurso y retraso en la renderización del elemento. Usar siempre que el usuario mencione LCP, Core Web Vitals, Métricas web esenciales, "la página carga lenta", "el hero/imagen principal tarda en aparecer", PageSpeed Insights, Lighthouse, TTFB, fetchpriority, preload de imágenes, lazy loading de la imagen principal, o pida revisar el rendimiento de carga de un HTML, un sitio o una cascada de red, aunque no diga explícitamente "LCP".
---

# Optimización de LCP

El LCP mide cuánto tarda en renderizarse la imagen o bloque de texto más grande dentro del viewport. Objetivo: **≤ 2.5 s en al menos el 75 % de las visitas** (bueno ≤ 2.5 s, necesita mejora hasta 4.0 s, deficiente > 4.0 s).

Fuente: web.dev, "Optimiza el procesamiento de imagen con contenido más grande" (https://web.dev/articles/optimize-lcp).

## Idea central

Casi nunca un arreglo aislado mejora el LCP. Hay que verlo como una cadena de cuatro subpartes que suman exactamente el tiempo total, sin huecos ni superposición. Optimizar una sola puede simplemente **mover** el tiempo a otra (ej.: comprimir la imagen acorta la descarga, pero si el elemento está oculto hasta que cargue JS, el tiempo pasa a "retraso de renderización" y el LCP no cambia). Por eso se optimizan todas, en orden.

| Subparte | Qué es | % ideal del LCP |
|---|---|---|
| TTFB | Inicio de navegación → primer byte del HTML | ~40 % |
| Retraso en la carga del recurso | TTFB → el navegador empieza a pedir el recurso LCP | < 10 % |
| Duración de la carga del recurso | Tiempo de descarga del recurso LCP | ~40 % |
| Retraso en la renderización del elemento | Fin de descarga → elemento pintado | < 10 % |

Son lineamientos relativos, no números absolutos ni reglas duras. Si el LCP ya está consistentemente bajo 2.5 s, las proporciones no importan. Regla mental: casi todo el tiempo debería ir a cargar el HTML y el recurso LCP; cualquier otro tiempo antes del LCP es oportunidad de mejora.

## Flujo de trabajo

### 1. Confirmar que hay problema y de qué tamaño
- Priorizar **datos de campo** (usuarios reales: CrUX, herramienta RUM) sobre datos de laboratorio (Lighthouse, pruebas locales). Si discrepan, CrUX es más fiel a la experiencia real.
- En PageSpeed Insights mirar primero "Descubre la experiencia de tus usuarios reales"; comparar URL vs. origen y móvil vs. escritorio para saber si el problema es de una página, de todo el sitio o de un tipo de dispositivo. Si no hay datos de URL, PSI muestra los del origen: verificar que los datos correspondan a la página analizada.
- Las páginas de entrada (home) suelen cargar "en frío" sin caché y ser las más lentas.
- Usar FCP y TTFB como diagnóstico: gran brecha TTFB→FCP sugiere recursos que bloquean el render o mucho renderizado en cliente; gran brecha FCP→LCP sugiere que el recurso LCP no está disponible de inmediato (lo maneja JS) o que hay trabajo previo en el hilo principal.

### 2. Identificar el elemento y el recurso LCP
Con PageSpeed Insights, DevTools (panel Rendimiento) o WebPageTest, encontrar el elemento LCP y su URL (si es texto con fuente del sistema, no hay recurso: carga y duración valen 0). Ubicarlo en la cascada de red junto al documento HTML. Esas dos solicitudes son las que importan al principio.

### 3. Medir el desglose en las cuatro subpartes
DevTools y Lighthouse ya lo muestran. Para RUM propio, ver `references/medicion-js.md`. Identificar qué subparte está desproporcionada.

### 4. Optimizar en este orden (mayor impacto probable primero)

**Paso 1: eliminar el retraso en la carga del recurso.** Meta: el recurso LCP empieza a cargar a la vez que el primer recurso de la página.
- Descubrimiento: el recurso debe ser visible para el preload scanner en el HTML inicial. Bien: `<img src|srcset>` en el HTML; imagen de fondo CSS o fuente web con `<link rel="preload">` en el HTML o header `Link`. Mal: `<img>` inyectado por JS, lazy-loaders que esconden `src` en `data-src`/`data-srcset`, imagen de fondo solo en CSS.
- Si solo se referencia desde CSS/JS externo, precargarla con prioridad alta:
  ```html
  <link rel="preload" fetchpriority="high" as="image" href="/hero.webp" type="image/webp">
  ```
- Prioridad: **nunca** `loading="lazy"` en la imagen LCP. Usar `fetchpriority="high"` en la imagen probable de LCP, pero en una o dos imágenes como máximo (si no, deja de servir). Bajar con `fetchpriority="low"` imágenes que están en el HTML pero no se ven (slides de carrusel no visibles). Verificar siempre la prioridad real en DevTools.
- Mismo origen: si el recurso vive en otro origen, el navegador debe conectarse antes de pedirlo. Preferir alojar los críticos en el mismo origen que el HTML para reutilizar la conexión.

**Paso 2: eliminar el retraso en la renderización del elemento.** Meta: pintar el elemento apenas termine de cargar su recurso. Causas típicas:
- Hojas de estilo bloqueantes más lentas que el recurso LCP → reducirlas (quitar CSS sin usar, diferir CSS no crítico, comprimir y minificar) o insertarlas inline solo si son pequeñas (el inline no se cachea).
- Scripts síncronos en `<head>` (sin `async`/`defer`) → casi nunca hacen falta; si el JS debe correr temprano, ponerlo inline y muy pequeño.
- Elemento LCP aún no insertado en el DOM porque espera JS → usar renderizado en servidor (SSR) o, mejor si la arquitectura lo permite, prerender/SSG. SSR cuesta TTFB pero suele valer la pena porque ese tiempo sí es controlable.
- Elemento oculto por otro código (ej.: librería de A/B testing decidiendo experimento).
- Hilo principal bloqueado por tareas largas (JS grande que parsear/ejecutar) → dividir tareas largas. Los navegadores renderizan imágenes en el hilo principal, así que cualquier bloqueo retrasa el pintado.

**Paso 3: reducir la duración de la carga del recurso.** Cuatro palancas:
- Reducir tamaño: dimensiones correctas (responsive), formatos modernos (WebP/AVIF), compresión; para fuentes, subsetting/reducir tamaño.
- Reducir distancia: CDN (las CDN de imágenes además optimizan tamaño, pero un dominio de terceros agrega costo de conexión; idealmente enrutar por el propio origen).
- Reducir contención de red: no abusar de `fetchpriority="high"` ni cargar demasiados recursos a la vez.
- Eliminar la red: caché eficiente (`Cache-Control` largo) para visitas repetidas; si el LCP es texto con web font, usar `font-display` distinto de `auto`/`block` para que el texto se vea durante la carga; data URL solo para recursos muy chicos (no se cachea y puede costar decodificación).
- Ojo: según la investigación de web.dev, este paso rara vez es el cuello de botella real. Mirar datos reales antes de gastar esfuerzo acá.

**Paso 4: reducir el TTFB.** Es el que menos control suele dar, pero condiciona todo lo demás.
- Minimizar redirecciones (anuncios, links acortados).
- Evitar que parámetros de URL únicos (analítica) rompan la caché de la CDN y fuercen ir al origen.
- Más guía en https://web.dev/articles/optimize-ttfb.

### 5. Verificar
Re-medir con laboratorio y campo. Confirmar que el tiempo ahorrado en una subparte no se haya desplazado a otra. Los datos de campo tardan en reflejar cambios (CrUX es una ventana móvil).

## Cómo responder al usuario

- Si pasa HTML, una cascada de red, un reporte de Lighthouse/PSI o métricas: identificar elemento LCP probable, estimar qué subparte falla y devolver una lista priorizada de cambios concretos con el código corregido.
- Si no hay datos, decir qué medir primero antes de proponer optimizaciones a ciegas.
- Revisar de entrada los antipatrones de bajo costo: `loading="lazy"` en el hero, imagen LCP inyectada por JS o en `data-src`, falta de `fetchpriority`, scripts síncronos en `<head>`, CSS enorme bloqueante, hero como `background-image` sin preload, recurso en otro origen.
- Explicar el porqué de cada cambio en términos de subparte, para que el usuario entienda qué tiempo está atacando.

## Checklist rápido

- [ ] ¿Hay datos de campo? ¿Coinciden con laboratorio?
- [ ] ¿Se identificó el elemento y recurso LCP?
- [ ] ¿La imagen LCP está en el HTML inicial (no JS, no solo CSS)?
- [ ] ¿Sin `loading="lazy"` y con `fetchpriority="high"` (solo 1-2 imágenes)?
- [ ] ¿El recurso LCP arranca junto al primer recurso de la cascada?
- [ ] ¿Sin CSS/JS bloqueante más lento que el recurso LCP?
- [ ] ¿Imagen en tamaño y formato óptimos, mismo origen o CDN, con caché larga?
- [ ] ¿TTFB sin redirecciones ni cache-busting innecesario?
