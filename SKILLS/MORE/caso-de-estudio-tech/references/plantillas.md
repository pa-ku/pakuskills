# Plantillas para casos de estudio tech

Contenido: A. Proyecto propio · B. Análisis de un caso ajeno · C. Caso didáctico · D. Mini-registro de decisión · E. Ejemplos de tesis · F. Preguntas de análisis · G. Fuentes.

Las guías entre corchetes son indicaciones para quien escribe: reemplazarlas por contenido real, nunca dejarlas en el texto final. Los marcadores `[DATO: …]` se dejan solo si falta información que el usuario debe aportar.

---

## A. Proyecto propio (portfolio, práctica, propuesta)

```
# [Título que promete un aprendizaje]

**Resumen:** [Problema en una frase. Qué se hizo. Resultado principal.]

| Ficha | |
|---|---|
| Organización / cliente | |
| Mi rol | |
| Equipo | |
| Duración | |
| Stack | |
| Estado y enlace | |

## El problema
[Qué pasaba, a quién le dolía y cómo se sabía. Evidencia: quejas, datos, observación.
Qué se había intentado antes y por qué no alcanzaba.]

## Objetivos y restricciones
[Qué significaba éxito, medido de alguna forma. Restricciones reales: tiempo,
presupuesto, hardware, conectividad, personas, normativa.]

## Enfoque
[Cómo se investigó y se decidió. Marco usado (si aplica) y por qué.]

## Proceso y decisiones
[Cronología con hitos. Dos a cuatro decisiones clave en formato mini-registro (D).]

## La solución
[Qué se construyó. Capturas, diagrama de arquitectura, flujo de usuario.
Mostrar lo que importa para el problema, no todas las pantallas.]

## Resultados
[Métricas con fecha y forma de medición, o feedback concreto y de quién.
Qué podría explicar los resultados además de la solución.]

## Aprendizajes y limitaciones
[Qué funcionó, qué no, qué se haría distinto. Qué no se puede concluir.]

## Próximos pasos
[Acciones concretas y resultado esperado.]
```

Notas de uso:
- Para portfolio, subir el **resumen y los resultados** y dejar el detalle técnico en secciones expandibles o más abajo.
- Si el caso es en equipo, separar con claridad qué hizo quien escribe.
- Cada sección debería poder leerse sola.

---

## B. Análisis de un caso ajeno (informe o trabajo académico)

Basada en el esquema de informe de ocho secciones (Monash), la estructura de caso de investigación (USC) y la de ensayo analítico (Sheffield Hallam).

```
# [Título: el caso + la pregunta que se investiga]

## Resumen ejecutivo
[Caso, pregunta, método, hallazgo principal, recomendación. Se escribe al final.]

## Introducción
[1. Qué o quién se estudia y cómo se vincula con el problema.
 2. Por qué importa y por qué un caso es la forma adecuada de abordarlo.
 3. Qué se sabía antes: estudios, prácticas o casos previos y qué les faltó.
 4. Qué aporta este caso. Cerrar con la hoja de ruta del informe.]

## Contexto del caso
[Descripción de hechos: organización, producto o sistema, cifras de partida. Solo descriptivo.]

## Marco y método
[Modelo o teoría aplicada, con fuentes, y por qué es relevante para este caso.
Cómo se eligió el caso (no puede parecer arbitrario) y cómo se recolectaron los datos:
observación, entrevistas, métricas, auditoría técnica, revisión de documentos.]

## Hallazgos y análisis
[Organizar por temas, no por orden de recolección. Cada párrafo: punto,
evidencia, discusión. Empezar por el hallazgo más importante o sorprendente.]

## Discusión
[Qué significan los hallazgos. Relación con casos o estudios similares.
Explicaciones alternativas. Limitaciones del caso y por qué no invalidan lo dicho.
Qué se puede extrapolar y qué no.]

## Conclusiones
[Síntesis, no repetición. Vuelve al problema inicial.]

## Recomendaciones
[Acción específica → resultado esperado → justificación con la evidencia →
responsables y plazos → riesgos y plan alternativo → corto y largo plazo.]

## Referencias
## Apéndices
[Capturas completas, datos crudos, guías de entrevista, informes de auditoría.]
```

Notas de uso:
- Si la consigna fija otro esquema, respetarlo y usar esto como guía de contenido.
- Si no hay revisión bibliográfica obligatoria, reemplazarla por "qué se sabía antes" dentro de la introducción.

---

## C. Caso didáctico

Pensado para enseñar o evaluar: se narra una situación auténtica y se deja el análisis a quien lo estudia. Condiciones de un buen caso: **autenticidad** (situación concreta y real o verosímil), **urgencia** (hay un problema que resolver), **orientación formativa** (enseña algo) y **totalidad** (incluye la información necesaria para analizarlo).

```
# [Título neutro: no revela la solución]

## Ficha resumen
- Escenario:
- Actores:
- Acciones y reacciones:
- Tiempo:
- Contexto:
- Palabras clave:

## Narración
**Contexto.** [Dónde, cuándo, quiénes, con qué recursos.]
**Presentación.** [Cómo aparece el problema.]
**Desarrollo.** [Hechos en orden, personas involucradas, decisiones tomadas, datos disponibles.]
**Desenlace.** [Qué pasó después. Puede quedar abierto.]

## Preguntas para el análisis
[Entre 4 y 8, específicas, de distinto nivel: identificar, explicar, decidir, evaluar.]

## Guía para quien enseña (opcional)
[Objetivos de aprendizaje, posibles soluciones defendibles, errores frecuentes, tiempo sugerido.]

## Glosario (opcional)
[Términos técnicos del caso.]
```

Notas de uso:
- Un caso rara vez tiene una única respuesta correcta; las preguntas deben abrir debate, no cerrar con una solución.
- Una pregunta demasiado general agota poco el caso: hacerla específica ("¿qué riesgos tenía migrar el viernes a la tarde?" y no "¿qué opinan?").
- Un caso breve (una página) sirve para analizar una decisión puntual; uno largo, para procesos completos.

---

## D. Mini-registro de decisión

Formato para cada decisión importante en las secciones de proceso:

```
**Decisión: [qué se decidió]**
- Contexto: [qué la volvía necesaria, qué restricciones había]
- Opciones: [A, B, C con una línea de pro y contra cada una]
- Elegida: [cuál]
- Por qué: [criterio decisivo, con evidencia]
- Consecuencias: [costos aceptados, deuda técnica, qué se reevaluaría y cuándo]
```

Ejemplo ilustrativo (no real):

```
**Decisión: renderizar en servidor las páginas públicas**
- Contexto: usuarios con celulares de gama baja y datos limitados.
- Opciones: (A) SPA completa, rápida de desarrollar pero con JS pesado; (B) HTML renderizado
  en servidor con interactividad mínima; (C) generación estática, simple pero con contenido que cambia a diario.
- Elegida: B.
- Por qué: reduce el JS enviado y el contenido cambia seguido.
- Consecuencias: más carga en el servidor y menos interactividad en el cliente; reevaluar si crece el tráfico.
```

---

## E. Ejemplos de tesis (ángulos)

Sirven de modelo de forma; no copiarlos si no coinciden con el caso real.

- "Para un sistema escolar con internet inestable, un diseño que funciona sin conexión mejoró la adopción más que cualquier nueva funcionalidad."
- "Migrar a un framework de moda no resolvió la lentitud del sitio: el problema eran las imágenes y los scripts de terceros."
- "Documentar las decisiones desde el primer día redujo el tiempo de incorporación de la segunda persona al equipo."
- "El formulario largo no espantó usuarios: lo hizo la falta de feedback cuando fallaba la validación."
- "El software libre se adoptó en el sector A y no en el B por razones de soporte y no de costo."

---

## F. Preguntas de análisis útiles

- ¿Qué problema se estaba resolviendo realmente y para quién?
- ¿Qué alternativas había y qué criterio decidió entre ellas?
- ¿Qué evidencia respalda el resultado y qué más podría explicarlo?
- ¿Qué se habría descubierto con otro método o con más tiempo?
- ¿Qué de este caso se puede trasladar a otro contexto y qué no?
- ¿Qué riesgos quedaron abiertos y quién los asume?
- ¿Qué se haría distinto sabiendo lo que se sabe ahora?

---

## G. Fuentes de esta guía

- Monash University, "Writing a case study" (audiencia, tipos descriptivo y problema-solución, informe de ocho secciones).
- USC Libraries, "Writing a Case Study" (criterios de selección del caso, introducción, método según tipo de caso, discusión, errores frecuentes).
- GRIN, "How to Write a Case Study in 5 Steps" (cinco pasos, tipos, marcos de análisis, checklist para empresas).
- Sheffield Hallam University, "Structuring your case study" (estructura de ensayo, metodología, párrafos TED y WEED, recomendaciones).
- Giné, Parcerisa y Piqué, "El estudio de casos como estrategia didáctica" (condiciones de Mucchielli, componentes del caso, ficha resumen).
- Ejemplos.co, "Estudio de caso" (características, tipos, fases del estudio).
