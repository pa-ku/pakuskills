# Medir el desglose del LCP en JavaScript

Las subpartes se pueden calcular combinando tres APIs: Largest Contentful Paint, Navigation Timing y Resource Timing. La forma más simple es la **build de atribución** de la librería `web-vitals` (https://github.com/GoogleChrome/web-vitals), que ya expone las cuatro subpartes.

```js
import { onLCP } from 'web-vitals/attribution';

onLCP(({ value, attribution }) => {
  const parts = {
    lcp: value,
    elemento: attribution.target,                 // selector del elemento LCP
    url: attribution.url,                         // URL del recurso (si hay)
    ttfb: attribution.timeToFirstByte,
    retrasoCarga: attribution.resourceLoadDelay,
    duracionCarga: attribution.resourceLoadDuration,
    retrasoRender: attribution.elementRenderDelay,
  };
  // Enviar a tu endpoint de analítica
  navigator.sendBeacon('/analytics', JSON.stringify(parts));
});
```

Interpretación: comparar cada valor contra el LCP total. Si `retrasoCarga` o `retrasoRender` pesan mucho más que ~10 %, ahí está la oportunidad principal (ver pasos 1 y 2 en SKILL.md).

Alternativas sin código: panel Rendimiento de DevTools (Insights y vista de métricas en vivo, con LCP local y de campo superpuestos), Lighthouse (diagnóstico "Elemento Largest Contentful Paint") y los datos de subpartes que ya expone CrUX.
