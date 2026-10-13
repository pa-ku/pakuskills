---
name: nielsen-usabilidad
description: Evaluar, diseñar o corregir la usabilidad de una web, app o interfaz usando las 10 heurísticas de usabilidad de Jakob Nielsen (visibilidad del estado, lenguaje del mundo real, control del usuario, consistencia, prevención de errores, reconocer antes que recordar, flexibilidad, minimalismo, manejo de errores, ayuda). Usar siempre que el usuario pida revisar UX, usabilidad, "que sea user friendly", auditar una pantalla, formulario, flujo de compra, menú, página de error 404 o mensajes de error, mejorar la experiencia de usuario, diseño centrado en el usuario (DCU), reducir rebote, o pida opinión sobre una interfaz (código HTML/CSS/React, captura o descripción), aunque no mencione a Nielsen ni "heurísticas".
---

# Usabilidad web: 10 heurísticas de Jakob Nielsen

Las heurísticas son reglas generales (no guías específicas) formuladas por Jakob Nielsen en 1995 para diseñar productos centrados en el usuario: que se usen de forma eficaz, intuitiva y sin frustración. Mejor usabilidad suele traducirse en más tráfico recurrente y menor tasa de rebote.

Fuente base: Semrush, "Principios de usabilidad web de Jakob Nielsen" (https://es.semrush.com/blog/usabilidad-web-principios-jakob-nielsen/) y NN/g (https://www.nngroup.com/articles/ten-usability-heuristics/).

## Cuándo y cómo usarla

Dos modos de uso:

1. **Auditar** algo existente (código, captura, descripción de flujo): recorrer las 10 heurísticas, reportar solo las que se violan o se cumplen de forma destacable, con evidencia concreta del material revisado y un arreglo accionable.
2. **Diseñar/construir** algo nuevo: usar las heurísticas como checklist previo a escribir la UI, y aplicarlas en el código (estados de carga, confirmaciones, mensajes de error, etc.) sin que el usuario tenga que pedirlas una por una.

Si el material es insuficiente para juzgar una heurística (ej.: no se ve el flujo de error), decirlo en vez de inventar un problema.

## Las 10 heurísticas

### 1. Visibilidad del estado del sistema
El usuario siempre debe saber qué está pasando, con respuesta rápida. Problema típico: envía un formulario y no sabe si funcionó.
- Buscar: barras o indicadores de carga/descarga, breadcrumbs, indicador de fase en procesos de compra, página/mensaje de confirmación tras enviar (con enlaces a contenido útil para retener), aviso de "te enviamos un mail, hacé clic en el enlace".
- Señales de violación: botón que no reacciona al clic, acciones asíncronas sin spinner ni feedback, usuario sin saber en qué paso del checkout está.

### 2. Relación entre el sistema y el mundo real
La interfaz habla el idioma del usuario, con palabras, íconos e información en orden lógico y familiar.
- Buscar: textos sin jerga técnica, íconos reconocibles (papelera = borrar), orden natural de la información.
- Señales de violación: etiquetas internas o técnicas, íconos ambiguos que permiten equivocarse.

### 3. Control y libertad del usuario
El usuario se equivoca; debe poder salir o corregir sin frustrarse.
- Buscar: quitar un producto del carrito, deshacer, cancelar, editar perfil, volver atrás.
- Señales de violación: acciones irreversibles sin salida, flujos sin "cancelar" o "volver".

### 4. Consistencia y estándares
Seguir convenciones establecidas y no reinventar lo que el usuario ya aprendió.
- Buscar: ícono de hamburguesa para el menú móvil, verde para aceptar y rojo para cancelar, menú de navegación siempre en el mismo lugar entre páginas.
- Señales de violación: íconos "originales" para funciones estándar, colores semánticos invertidos, navegación que cambia de lugar según la página.

### 5. Prevención de errores
Mejor prevenir que curar; y si el error ocurre, dar todas las opciones para corregirlo.
- Buscar: autocompletado en buscadores, doble campo para confirmar email o contraseña, validación de formularios en tiempo real.
- Señales de violación: errores que solo se informan al final del formulario, entradas libres donde bastaría una lista.

### 6. Reconocer antes que recordar
No obligar a memorizar. Mostrar opciones, previsualizaciones y contexto.
- Buscar: previsualización de fuentes en un selector (en vez de solo el nombre), opciones visibles, historial/sugerencias.
- Señales de violación: el usuario debe recordar un código, un paso anterior o una ruta de menú.

### 7. Flexibilidad y eficiencia de uso
Sirve a novatos y expertos: flexibilidad para cualquiera, eficiencia para quien sabe más.
- Ejemplo: el buscador de Google funciona escribiendo lo que querés, pero los operadores avanzados acortan el camino a los expertos sin ser obligatorios.
- Buscar: atajos de teclado, filtros avanzados opcionales, acciones frecuentes accesibles rápido.
- Señales de violación: un único camino lento para todos, o complejidad avanzada obligatoria para principiantes.

### 8. Diseño estético y minimalista
Nada de información innecesaria: distrae y molesta. Principio KISS (Keep It Simple, Stupid). Los usuarios buscan sitios limpios que carguen rápido.
- Buscar: elementos que no aportan al objetivo de la pantalla, competencia visual entre llamados a la acción, sobrecarga de texto o adornos.
- Regla: si no hace falta, se saca.

### 9. Ayudar a reconocer, diagnosticar y corregir errores
Los errores se expresan en lenguaje comprensible, no en códigos, e indican cómo salir.
- Ejemplo: en lugar de "Error 404", un mensaje amable ("Lo siento, página no encontrada") con una salida: páginas relacionadas o buscador interno para que el usuario no abandone el sitio.
- Señales de violación: códigos crudos, mensajes genéricos ("Algo salió mal"), errores sin siguiente paso.

### 10. Ayuda y documentación
Lo ideal es que no haga falta, pero debe existir, ser fácil de encontrar, con pasos claros y breve.
- Ejemplos: FAQs, ícono "?" junto a opciones confusas, minitours al abrir una app.

## Formato de entrega para una auditoría

Para cada hallazgo:
- **Heurística** (número y nombre)
- **Qué se observa** (evidencia concreta: línea de código, texto, elemento)
- **Por qué es un problema** para el usuario
- **Arreglo propuesto** (con código o texto de ejemplo cuando aplique)

Cerrar con las 3 mejoras de mayor impacto, ordenadas. Es válido sumar una severidad (alta/media/baja) según cuánto bloquea al usuario, pero eso es criterio propio, no parte del artículo base.

## Ejemplo breve

Entrada: formulario de contacto con botón "Enviar" que no cambia al hacer clic, valida solo al final y muestra "Error 500" si falla.

Salida esperada (resumida):
- H1: sin feedback al enviar → deshabilitar el botón, mostrar "Enviando…" y luego pantalla de confirmación.
- H5: validar campos en tiempo real y pedir confirmación del email.
- H9: reemplazar "Error 500" por "No pudimos enviar tu mensaje. Probá de nuevo o escribinos a …".

## Límites

Las heurísticas son reglas generales para detectar problemas, no reemplazan un test con usuarios reales. Si el usuario necesita validar decisiones importantes, sugerir complementar con test de usabilidad.
