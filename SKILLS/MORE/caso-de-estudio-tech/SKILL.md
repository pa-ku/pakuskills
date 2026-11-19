---
name: "caso-de-estudio-tech"
description: Guía para escribir casos de estudio de sitios web, apps y proyectos tecnológicos (portfolio, informes de práctica, análisis de un producto, migración o incidente, casos didácticos). Usar siempre que el usuario pida armar, escribir, estructurar, mejorar o revisar un caso de estudio, "case study", caso de éxito, "contar cómo hice un proyecto", documentar un proyecto para el portfolio, un informe de un desarrollo o un análisis de un sitio o sistema, aunque no diga "caso de estudio" explícitamente (por ejemplo "quiero mostrar este proyecto en mi portfolio", "necesito explicar cómo resolvimos X en el cole", "analizá por qué esta web anda lenta"). También usar para criticar un caso de estudio ya escrito. No usar para README técnicos ni documentación de API.
---

# Caso de estudio para web y proyectos tecnológicos

Un caso de estudio analiza una situación concreta (un proyecto, un sitio, una decisión, un incidente) y la conecta con ideas generales para sacar aprendizajes y recomendaciones. Esta skill sintetiza guías de Monash, USC, Sheffield Hallam, GRIN, la Universidad de Barcelona (Giné, Parcerisa y Piqué) y Ejemplos.co, adaptadas a trabajo web y tecnológico.

La diferencia con un README o una lista de funcionalidades es el **análisis**: por qué se decidió así, qué se descartó, qué pasó después y qué se aprendió. Sin tensión (un problema real) y sin análisis, es un folleto.

## Modos de caso

Detectar cuál es antes de escribir; cambia la estructura y el tono.

| Modo | Cuándo | Foco |
|---|---|---|
| **A. Proyecto propio** | Portfolio, informe de práctica, propuesta a cliente: "construí X" | Problema → decisiones → resultado |
| **B. Análisis de un caso ajeno** | Estudiar un sitio, producto, migración o incidente: "por qué X funciona o falla" | Método, evidencia, explicaciones alternativas |
| **C. Caso didáctico** | Para enseñar o evaluar: se narra la situación y se deja para analizar | Narración fiel + preguntas de análisis |

Por su intención, también se distinguen en **descriptivo** (cómo es y por qué ocurre), **problema–solución** (se evalúan alternativas y se recomienda) e **interpretativo** (se vincula con un marco o teoría). Un caso puede mezclar; elegir uno dominante.

## Flujo de trabajo

1. **Aclarar lo mínimo.** Necesitás saber el modo, la audiencia/destino y qué material real hay. Preguntar solo lo que falte, en un solo mensaje breve. Si el usuario ya describió el proyecto, no preguntar: construir y declarar los supuestos en una línea.
2. **Reunir material** con la checklist de abajo.
3. **Elegir el ángulo**: la idea central del caso, en una frase.
4. **Armar la estructura** (base abajo; plantillas completas en `references/plantillas.md`).
5. **Redactar** con las reglas de escritura.
6. **Revisar** con la checklist final y entregar con una línea sobre qué se asumió.

Si hay una consigna, rúbrica o límite de palabras (trabajo de facultad, práctica profesional), la consigna manda sobre esta guía.

## Checklist de material

- **Contexto**: quién es el cliente u organización, cuándo, duración, tamaño del equipo y **el rol de quien escribe** (qué hizo él, qué hizo el resto).
- **Problema**: qué dolía y a quién, con evidencia (quejas, datos, observación).
- **Usuarios**: quiénes son y en qué condiciones usan el sistema (dispositivos, conectividad, nivel técnico).
- **Objetivos y restricciones**: tiempo, presupuesto, infraestructura, hardware, normativa, personas disponibles.
- **Stack y arquitectura**, con las razones de elección.
- **Decisiones clave y alternativas descartadas.**
- **Proceso**: hitos en orden cronológico, obstáculos y cómo se resolvieron.
- **Resultados**: métricas reales o feedback concreto, con fecha y forma de medición.
- **Qué cambiarías** y qué quedó pendiente.
- **Material visual**: capturas, diagramas, enlaces, repositorio.

**Nunca inventar** métricas, fechas, nombres ni citas de usuarios. Si falta un dato, redactar en cualitativo o dejar un marcador visible como `[DATO: tiempo de carga antes/después]` y avisarlo. Si el caso es ficticio o ilustrativo, rotularlo como hipotético y hacerlo verosímil: concreto, con restricciones reales y toda la información necesaria para analizarlo.

## Elegir el ángulo

Un caso fuerte tiene una idea central. Buscarla con estas preguntas: ¿el caso muestra un problema poco visible o poco estudiado? ¿desafía una suposición común ("hace falta un framework", "más features retienen más")? ¿lleva a una acción concreta? ¿abre una línea para seguir investigando?

Condensarla en una frase-tesis con forma de *cómo* o *por qué*:

> En un contexto con conectividad limitada, priorizar carga rápida sobre interactividad permitió que el sistema se usara a diario, aunque obligó a resignar [X].

El título del caso sale de esa frase. Evitar títulos de catálogo ("Sitio web de X"); preferir uno que prometa un aprendizaje ("Cómo hicimos que una intranet escolar funcione con internet lenta").

## Escribir para la audiencia

Preguntarse quién lo lee, para qué y qué hará después. Eso decide la profundidad técnica, el tono y qué va arriba.

| Audiencia | Priorizar |
|---|---|
| Reclutador o cliente potencial | Resultado, rol propio, impacto; se lee en 2 a 3 minutos |
| Docente o jurado | Método, justificación del marco, evidencia, fuentes, limitaciones |
| Equipo técnico | Arquitectura, trade-offs, decisiones documentadas |
| Usuarios no técnicos del contexto (docentes, directivos, comerciantes) | Problema y beneficio en su lenguaje, sin jerga |

Usar el vocabulario del sector para sonar auténtico, pero explicar cada término técnico la primera vez, con un ejemplo concreto. El lector del contexto tiene que poder reconocerse en la descripción del problema.

## Estructura base

Sirve para los modos A y B; el modo C usa la plantilla didáctica.

1. **Título y resumen** (3 a 5 líneas): problema, enfoque, resultado. Muchos lectores solo leen esto.
2. **Ficha del caso**: organización, rol, equipo, duración, stack, estado y enlace.
3. **Contexto y problema**: qué pasaba, por qué importaba, qué se sabía o se había intentado antes.
4. **Objetivos y restricciones**: qué éxito significaba, medido de alguna forma.
5. **Enfoque o método**: cómo se investigó y decidió, y qué marco de análisis se usó (con justificación).
6. **Proceso y decisiones**: cronología con hitos y decisiones clave con sus alternativas.
7. **Solución**: qué se construyó, con visuales.
8. **Resultados y análisis**: hallazgos con evidencia, y qué más podría explicarlos.
9. **Limitaciones y aprendizajes**: qué no se puede concluir y qué se haría distinto.
10. **Recomendaciones o próximos pasos**: acciones concretas con resultado esperado.
11. **Apéndices y enlaces.**

Proporciones útiles: la introducción ronda el 10% del texto. Un caso de portfolio rinde bien entre 600 y 1200 palabras con buenos visuales; uno académico lo define la consigna.

## Reglas de escritura

- **Introducción que responde cuatro preguntas**: qué o quién se estudia, por qué importa, qué se sabía antes (alternativas, estado del arte), qué aporta este caso.
- **Decisiones como mini-registro**: Contexto → Opciones consideradas → Decisión → Por qué → Consecuencia. Mostrar los trade-offs es lo que separa un caso de un anuncio.
- **Párrafos de análisis en tres movimientos**: el punto, la evidencia y qué significa (formato Tema–Evidencia–Discusión).
- **Evidencia verificable**: capturas, diagramas, fragmentos de código cortos, métricas con fuente y fecha. Un antes/después solo vale si se midió igual en ambos momentos.
- **Hechos antes que adjetivos.** "Pasó de 6 a 2 segundos en 3G (Lighthouse, mayo)" y no "mucho más rápido".
- **Cronología clara**, con señalizadores entre ideas (además, sin embargo, por ejemplo, en síntesis).
- **Recomendaciones accionables**: acción, resultado esperado, justificación, riesgo y plazo (corto o largo).
- **Conclusión que sintetiza**, no repite: vuelve al problema inicial, dice qué se aprendió y qué queda abierto.
- **Voz**: primera persona en proyectos propios; neutral en análisis ajenos. Idioma y tono naturales para quien lee, sin traducciones literales.

## Marcos de análisis para proyectos tech

Elegir uno o dos según la pregunta, justificar por qué sirven para este caso y no decorar con siglas.

| Pregunta | Marcos posibles |
|---|---|
| ¿Cómo está parado el producto o proyecto? | SWOT, cinco fuerzas, PESTEL |
| ¿Cómo es la experiencia del usuario? | Heurísticas de Nielsen, recorrido del usuario, Jobs to be Done, test de usabilidad (tasa de éxito, tiempo en tarea, SUS) |
| ¿Es accesible? | WCAG 2.2 nivel AA, prueba con teclado y lector de pantalla |
| ¿Es rápido? | Core Web Vitals (LCP, INP, CLS), Lighthouse, peso de página, prueba en red lenta |
| ¿Está bien diseñada la arquitectura? | Diagramas C4, registro de decisiones (ADR), trade-offs de costo, complejidad y mantenimiento |
| ¿Es seguro? | Modelo de amenazas (por ejemplo STRIDE), revisión de superficie expuesta |
| ¿Cómo se descubrió y definió el problema? | Double Diamond |
| ¿Se adoptó y se sostuvo? | Embudo de conversión, retención, costo total de operación |

## Errores a evitar

- **Sobregeneralizar.** Un caso ilustra, no demuestra una ley. Decir "en este contexto" y respaldar cada conclusión con evidencia del propio caso.
- **Omitir limitaciones.** Declararlas y explicar cuáles importan.
- **Dejar huecos** en las implicancias evidentes de lo observado.
- **Buscar solo confirmación.** Incluir lo que salió mal y las explicaciones alternativas de los resultados.
- **Lista de features disfrazada de caso.** Si no hay problema ni decisiones, no hay caso.
- **Inflar o inventar resultados.**
- **Jerga sin explicar**, o saltos bruscos entre lo técnico y lo de negocio.
- **Culpar personas** en análisis de incidentes: describir causas del sistema y del proceso.
- **Pretender una única solución correcta** en un caso didáctico: puede haber varias defendibles.

## Formato de salida

Elegir según el destino:

- **Portfolio o web propia**: página HTML responsive, con resumen arriba, ficha en tabla, jerarquía clara y lugares para capturas y diagramas. Respetar el estilo o design system que el usuario ya tenga.
- **Informe académico, de práctica o para el cole**: documento con portada, índice si es largo y referencias.
- **Post, LinkedIn o README**: versión corta en el chat, con el hallazgo principal primero.
- **Caso didáctico**: documento con ficha resumen, narración y preguntas de análisis.

Si el destino no está claro, entregar el borrador en el chat y ofrecer en una línea pasarlo a página o documento.

## Checklist final

- [ ] ¿Hay una frase-tesis y el título la refleja?
- [ ] ¿Se entiende el problema y por qué importaba en menos de un minuto?
- [ ] ¿Está claro qué hizo exactamente quien escribe?
- [ ] ¿Cada decisión importante muestra alternativas y razones?
- [ ] ¿Los resultados tienen evidencia, fecha y forma de medición, o están marcados como pendientes?
- [ ] ¿Hay limitaciones, explicaciones alternativas y aprendizajes?
- [ ] ¿Los términos técnicos se explican al primer uso, para esta audiencia?
- [ ] ¿Las conclusiones se apoyan en el caso y no lo exceden?
- [ ] ¿Se revisaron nombres, cifras, fechas y enlaces?

## Después de entregar

Ofrecer en una línea los siguientes pasos útiles: versión corta para LinkedIn, versión para reclutadores, traducción al inglés, lista de capturas y diagramas a sumar, o conversión a página para el portfolio. Si quedaron marcadores `[DATO: …]`, listarlos para que el usuario los complete.

Para plantillas por modo, fichas, ejemplos de tesis y preguntas de análisis, leer `references/plantillas.md`.
