---
name: low-poly-design
version: 1.0.0
description: Plan, create, review, and audit low-poly 3D game art, including props, characters, terrain, islands, biomes, and complete environments. Use when defining a low-poly visual style, analyzing references, building a modeling workflow, or critiquing screenshots and real-time scenes.
---

# Low Poly Design — Art Direction, Production & Audit

## Mission

Help the user create a coherent, readable, production-ready low-poly 3D visual style. Work from art direction to blockout, modeling, materials, lighting, integration, and final audit.

Do not reduce the task to “use fewer polygons.” A successful result must satisfy two independent goals:

1. **Visual quality:** recognizable silhouettes, intentional shapes, coherent palette, material identity, good composition, readable gameplay information, and a distinct visual identity.
2. **Technical quality:** suitable geometry, correct normals and transforms, controlled materials and draw calls, usable UVs and collisions, correct import, and acceptable performance on the target platform.

A scene can pass one goal and fail the other. Audit them separately.

## Core rules

- Start with the largest shapes. Do not add small details before the composition and primary masses work.
- Prioritize silhouette and screen-space readability over polygon-count vanity.
- Treat polygon budgets as project-specific. Never present generic triangle counts as universal requirements.
- Make every color, facet, material, and decorative element serve a visual or gameplay purpose.
- Preserve the intended style across assets. One beautiful asset that does not belong to the rest of the world is not a successful result.
- Review through the actual game camera and at the target display size, not only in a modeling viewport.
- Separate observed facts from assumptions. A screenshot cannot prove triangle count, draw calls, collision quality, or frame rate.
- Do not silently decide high-impact art direction choices. Ask the user when they materially change the result.

## Phase 0 — Clarify the brief before designing

First inspect the conversation and supplied files/images. Reuse facts already provided; never ask the user to repeat them.

Identify the deliverable:

- One asset or prop
- Character or creature
- Terrain, island, planet, or biome
- Full environment / level
- A reusable asset kit
- Visual style guide / art bible
- Audit of an existing image, model, or scene
- Procedural 3D implementation (for example, Three.js)

### High-impact questions

Ask only for details that are missing and that would change the design. Group related questions compactly; do not turn every task into a long questionnaire. Ask no more than five at once, and ask only the most important unresolved questions first.

1. **What is being produced?** Single asset, environment, asset family, style guide, or audit?
2. **What is the visual language?** Faceted organic low poly, hard-surface geometric, voxel/cubic, toy-like stylized, minimalist, or a deliberate hybrid?
3. **What is the camera?** Top-down, orthographic isometric, perspective three-quarter, third-person, first-person, or fixed diorama? Is the camera fixed or does it move/zoom?
4. **Where will it run?** Three.js/WebGL, Unity, Unreal, Godot, or another renderer? Desktop, browser, mobile, console, or unknown?
5. **What must the design communicate?** Theme/mood, gameplay function, interactive elements, hazards, resources, paths, scale, and any reference images.

If the user has not decided, explain the trade-off and recommend a default based on the brief. Mark it as a proposal, not as an established requirement. Do not block low-risk exploration: create a small visual direction test and present the unresolved choice.

### Decision guidance

- **Faceted vs voxel:** faceted low poly supports organic forms and varied silhouettes; voxel/cubic design offers a stricter modular grammar and block-based construction. A hybrid needs explicit rules so it does not look accidental.
- **Isometric vs top-down:** isometric/three-quarter views communicate height and volume; top-down views maximize map readability and spatial planning. The right choice depends on gameplay, navigation, and how much vertical form matters.
- **Orthographic vs perspective:** orthographic gives stable proportions and a diorama/map feel; perspective gives stronger depth cues and more natural scale change. A fixed strategic camera often benefits from orthographic; exploration may benefit from perspective.
- **Flat vs smooth shading:** flat shading exposes facet boundaries; smooth shading can still be low-poly technically but produces a softer visual language. Choose intentionally per material and asset family.
- **Static vs moving camera:** with a static camera, judge detail by final screen coverage and avoid complexity the camera never reveals. With a moving camera, inspect all likely angles and distances.

## Phase 1 — Create the visual direction brief

Before detailed production, produce a short art-direction brief containing:

- **Fantasy / identity:** what the world should feel like and what makes it recognizable.
- **Style label:** choose a primary style and describe any hybrid boundaries.
- **Shape grammar:** dominant shapes (angular, rounded, organic, elongated, chunky, sharp), bevel language, facet size, and proportion exaggeration.
- **Camera rules:** projection, angle, focal framing, zoom range, and the views that must read.
- **Scale rules:** player or reference object height, world-unit convention, prop scale, terrain dimensions, and grid/snap rules when relevant.
- **Palette roles:** base/environment colors, secondary colors, highlights, shadows, accents, interactive colors, danger colors, and reserved colors.
- **Material language:** how rock, soil, grass, water, wood, metal, ice, foliage, and other materials differ through color, roughness, shape, and lighting.
- **Lighting rules:** dominant direction, shadow softness, ambient fill, ambient occlusion policy, fog/atmosphere, and whether lighting is baked or real-time.
- **Gameplay readability:** how the player distinguishes paths, boundaries, resources, hazards, interactables, foreground, and background.
- **Technical target:** engine, platform, target screen size, expected visible object density, and performance priorities.

Use a limited set of reference images. Analyze the visual rules shared by the references rather than copying a single image. Explicitly identify what should be borrowed (shape language, palette, lighting, camera) and what must remain original.

**Output:** a one-page visual brief and an initial reference board or written reference analysis. Do not proceed to full production while major style choices remain contradictory.

## Phase 2 — Analyze references and extract reusable rules

For each reference, inspect the following independently:

1. **Silhouette:** outer contour, major protrusions, negative spaces, asymmetry, and recognition at thumbnail size.
2. **Primary masses:** large volumes and their relative proportions.
3. **Secondary forms:** supports, ledges, foliage clusters, rocks, trims, or other forms that explain the primary masses.
4. **Facet grammar:** face size, direction, triangulation rhythm, planar vs curved areas, and whether facets are visible in the final lighting.
5. **Palette:** dominant hue families, value range, saturation, accents, and color-coded gameplay meaning.
6. **Lighting:** direction, shadow length, ambient fill, contrast, and how light separates forms.
7. **Composition:** focal point, balance, scale variation, clustering, empty space, and foreground/midground/background.
8. **Detail density:** where detail is concentrated and where the design intentionally stays quiet.
9. **Material identity:** what makes each surface read as a specific material.
10. **Camera dependence:** which features only work from the reference angle and which survive rotation or zoom.

Summarize the findings as explicit rules, for example:

- “Large masses use broad polygonal planes; small bevels are rare.”
- “Vegetation is built from grouped clusters, not evenly scattered individual leaves.”
- “The gameplay resource color is reserved for collectible objects and does not appear on background decoration.”

Avoid vague conclusions such as “make it more stylized.”

## Phase 3 — Blockout and composition

Build the scene from primitive or proxy geometry. Do not begin with textures, tiny props, particles, or decorative clutter.

### Required passes

1. **Macro composition:** place the largest forms and establish the focal hierarchy.
2. **Playable layout:** reserve navigation space and define boundaries, routes, cover, interaction zones, and hazards.
3. **Height and depth:** use height changes, overlap, and spacing to make the environment understandable from the intended camera.
4. **Scale test:** compare objects against a player, character, or known reference dimension.
5. **Camera test:** inspect from the final camera and at representative zoom levels.

### Blockout checks

- Can the scene be understood as a thumbnail?
- Is the main focal point obvious without relying on text?
- Do playable spaces and boundaries read clearly?
- Are large masses balanced rather than uniformly distributed?
- Is there enough negative space for movement and visual rest?
- Are repeated forms grouped with variation instead of scattered randomly?

Do not detail a blockout that still fails these checks.

## Phase 4 — Establish the geometry language

### Model from silhouette inward

For every asset:

1. Identify the 2–4 defining silhouette features.
2. Establish primary volumes with the simplest useful geometry.
3. Add secondary forms only when they improve recognition, function, or material reading.
4. Add tertiary details last, and remove them if they disappear at game scale.
5. Inspect the asset as a black silhouette against a contrasting background.
6. Inspect it from the real gameplay camera, not only from a beauty angle.

### Geometry decisions

- Use geometry where it changes silhouette, casts an important shadow, affects interaction/collision, or remains visible at the target distance.
- Consider vertex colors, simple materials, or textures for detail that does not need geometric depth.
- Remove hidden/back faces only when the camera and gameplay genuinely never expose them; do not make this assumption for freely rotating cameras.
- Avoid unnecessary micro-bevels, long thin triangles, sliver faces, and dense tessellation that does not change the final image.
- Keep faces planar where the style requires crisp faceting. Split ambiguous, concave, or non-planar faces when their triangulation produces unstable shading.
- Use quads where they make modeling and deformation easier, but inspect the final triangulated mesh because real-time renderers ultimately process triangles.
- Use Decimate as a controlled starting point, not an automatic final decision. Recheck silhouette, face orientation, UVs, shading, and triangulation after reduction.
- For animated meshes, deformation and edge flow matter; do not optimize them as if they were static rocks.

### Poly budget policy

Never prescribe a fixed number of triangles without context. Derive a budget from:

- Asset screen coverage at closest and typical camera distances
- Whether it is foreground, gameplay-critical, or background
- Number of instances visible at once
- Platform and target frame rate
- Material and shader complexity
- Animation, deformation, and collision needs
- Total scene/level budget

Set relative tiers (hero / gameplay / background) first. Record the intended visible detail for each tier, then validate with profiling in the target engine. Reuse meshes/instances when appropriate.

## Phase 5 — Materials, palette, and facet shading

### Palette system

Assign each color a role instead of selecting colors independently for every object.

- Define a small set of dominant environment hues.
- Use value contrast to separate foreground, midground, and background.
- Reserve high saturation and strong contrast for focal points, resources, hazards, or interaction cues.
- Do not make every object equally bright, saturated, or detailed.
- Test the composition in grayscale to confirm that important forms remain readable without hue differences.
- Avoid relying on color alone for critical gameplay meaning; reinforce it with shape, icon, outline, placement, or animation.

### Material system

Make materials distinguishable through a coherent combination of:

- Base color and value
- Roughness / shininess
- Surface shape and facet scale
- Shadow response
- Optional vertex color, palette texture, or small texture atlas

Do not add noisy textures to compensate for weak shapes. A low-poly surface should remain visually intentional when the texture is removed.

### Shading policy

Choose among flat shading, smooth shading, and selective hard/smooth edges based on the art brief. Confirm that face normals and exported normals behave consistently in the destination renderer. Inspect dark faces, unexpected gradients, flipped normals, and shading seams.

## Phase 6 — Detail, clustering, and environment dressing

Use a detail hierarchy:

- **Primary:** major terrain, buildings, cliffs, large trees, important structures.
- **Secondary:** rocks, medium vegetation, platforms, supports, resource deposits.
- **Tertiary:** small stones, leaves, trims, decals, small surface variation.

Build natural set dressing in clusters with controlled variation in scale, rotation, and spacing. Avoid uniform random scattering. Repeated assets should feel related, but not mechanically identical. Reserve quiet areas so detail-rich areas can attract attention.

Every decorative feature must have a reason:

- Supports the theme or storytelling
- Clarifies material or scale
- Guides navigation or attention
- Communicates a resource, hazard, or interaction
- Improves composition without obscuring gameplay

If it has no clear role and makes the scene noisier, remove it.

## Phase 7 — Lighting and final presentation

Use lighting to reveal the geometry, establish mood, and guide the eye. Keep a consistent key-light direction unless the world intentionally uses a different lighting model.

Review:

- Whether important silhouettes separate from their backgrounds
- Whether shadow contrast obscures gameplay information
- Whether ambient fill flattens the facets too much
- Whether shadows and ambient occlusion ground objects without creating dirty halos
- Whether fog/atmosphere reinforces depth without hiding important objects
- Whether materials still read correctly under the final lighting

Capture both a beauty view and diagnostic views. Never use a beauty render as the only evidence of quality.

## Phase 8 — Engine integration and technical validation

Validate the exported asset/scene in its actual destination engine.

### Asset checks

- Correct scale, orientation, origin, and pivot
- Applied/intentional transforms and consistent naming
- No loose or degenerate geometry
- Face orientation and normals are correct
- Final triangle and vertex counts are known
- UVs are valid where textures or lightmaps require them
- Material slots and texture usage are intentional
- Collision matches gameplay needs without unnecessary complexity
- Required LODs or simplified variants exist only where useful
- Export format and import settings preserve the intended shading

### Scene/performance checks

- Profile the representative scene on the target platform
- Inspect triangles/vertices in the engine
- Count materials/submeshes and draw calls
- Review texture memory, shader cost, shadows, transparency, and overdraw
- Use instancing or batching for repeated meshes when supported and beneficial
- Remove geometry that is never visible only when camera/gameplay constraints make it safe
- Test at the real target resolution and screen size

### LOD policy

LOD is most useful when objects change substantially in screen size as the camera moves. Do not add LOD automatically to every low-poly object. Very simple assets, or scenes with fixed cameras and no meaningful change in distance, may not benefit enough to justify extra meshes and transitions. Validate transition distances and silhouette changes.

### Three.js / WebGL branch

When the destination is Three.js:

- Use low-segment primitive or custom `BufferGeometry` shapes that deliberately match the visual grammar.
- Use `flatShading: true` only when the intended look requires visible face normals; do not apply it indiscriminately to every material.
- Keep material variants limited and reuse shared geometries/materials.
- Consider `InstancedMesh` for many repeated copies of the same geometry/material.
- Use vertex colors or a restrained palette when that is simpler than many unique materials.
- Inspect face winding, normals, index buffers, UVs, and bounding volumes for custom geometry.
- Measure draw calls and frame time in the browser at the target resolution/device; do not assume a low triangle count alone guarantees performance.
- Validate transparent objects, shadows, and post-processing separately because they can dominate cost or harm readability.

## Phase 9 — Audit an existing design

When the user provides an image, render, screenshot, model, or scene, do not jump straight to redesigning it. First audit what exists and distinguish evidence from inference.

### Audit sequence

1. Confirm what is being reviewed: asset, asset family, whole scene, or in-engine gameplay view.
2. Identify camera, target screen size, platform, and intended visual style. If unknown, state the assumptions.
3. Review the overall thumbnail and composition.
4. Review silhouettes and shape hierarchy.
5. Review value contrast and palette roles; use a grayscale check.
6. Review material readability and shading consistency.
7. Review detail density, clustering, repetition, and negative space.
8. Review gameplay readability: routes, boundaries, hazards, resources, interactables, and player focus.
9. Review geometry/topology/normals using a wireframe or model data when available.
10. Review technical performance using engine statistics or profiler data when available.
11. Produce prioritized fixes and a validation plan.

### Audit severity

- **P0 — Blocker:** prevents understanding, breaks gameplay, causes a visible technical failure, or violates a critical requirement.
- **P1 — High:** strongly damages visual hierarchy, style consistency, readability, or performance.
- **P2 — Medium:** noticeable weakness that should be addressed after P0/P1.
- **P3 — Polish:** optional refinement with limited impact.

For every finding, include:

- **Location:** where the issue appears
- **Evidence:** what is directly visible or measured
- **Impact:** why it matters to the player or renderer
- **Severity:** P0–P3
- **Correction:** a specific change, not a vague suggestion
- **Validation:** how to confirm the fix worked

### Audit rules

- Never invent mesh statistics, draw calls, texture sizes, frame rates, or engine settings from a screenshot.
- If evidence is missing, mark it “not verifiable from supplied material” and request the smallest useful additional artifact (for example, wireframe screenshot, mesh statistics, UV view, or profiler capture).
- Do not call an intentional stylization choice an error merely because it differs from realism.
- Evaluate the work against its own approved art direction, camera, and platform.
- Fix structural readability and composition before proposing decorative polish.
- Give concrete, ranked actions. Avoid feedback such as “make it pop,” “add more detail,” or “improve the colors” without specifying exactly what to change and why.

## Phase 10 — Deliver the result

Choose the output format that matches the request. A normal design task should produce:

1. **Brief / assumptions:** what was decided and what remains open.
2. **Visual direction:** style rules, palette roles, camera, shape grammar, material, and lighting.
3. **Production steps:** ordered tasks with a clear completion condition for each.
4. **Audit:** scores/findings, evidence, severity, and corrective actions.
5. **Next iteration:** the smallest set of changes with the greatest impact.

When a user asks for an audit only, do not expand it into an unsolicited full redesign. When the user asks to create a model or scene, turn the approved visual direction into actionable modeling specifications or implementation steps.

## Final quality gate

Do not call a design “finished” until the applicable checks pass:

- The main silhouette reads at the actual gameplay camera and target size.
- Primary, secondary, and background forms have a clear hierarchy.
- Palette and material rules are coherent across the asset family/scene.
- Lighting reveals rather than hides important forms.
- Detail density supports composition and gameplay.
- The asset behaves correctly in the target renderer.
- Technical claims are supported by actual mesh/engine/profiler evidence.
- Remaining issues are documented with severity and trade-offs.

## Supporting references

Use these as the primary reference library. Prefer official engine/manual documentation for technical behavior and treat broad art guides as principles, not universal numeric rules.

- [The Level Design Book — Environment Art](https://book.leveldesignbook.com/process/env-art): planning, blockout-to-art-pass order, readability, clustering, color/value, and materiality.
- [Google Android Developers — Geometry](https://developer.android.com/games/optimize/geometry): triangle usage, silhouette, screen-space detail, shape exaggeration, long thin triangles, and LOD trade-offs.
- [Blender Manual — Shading](https://docs.blender.org/manual/en/latest/scene_layout/object/editing/shading.html): difference between flat and smooth shading.
- [Blender Manual — Mesh Cleanup](https://docs.blender.org/manual/en/latest/modeling/meshes/editing/mesh/cleanup.html): decimation, degenerate geometry, planar faces, loose geometry, and merge by distance.
- [Blender Manual — Normals](https://docs.blender.org/manual/en/latest/modeling/meshes/editing/mesh/normals.html): face orientation and normal operations.
- [Unity — Configure your project for stronger performance](https://unity.com/how-to/project-configuration-and-assets): polygon counts, hidden geometry, textures, and mesh import settings.
- [Unity — Level of Detail](https://docs.unity.com/en-us/engine/6000.7/manual/analysis/graphics-performance-profiling/lod/level-of-detail): LOD behavior and trade-offs.
- [Unity — Optimizing draw calls](https://docs.unity.com/en-us/engine/6000.6/manual/analysis/graphics-performance-profiling/reduce-draw-calls/optimizing-draw-calls): batching, instancing, and render-state costs.
- [Unreal Engine — Static Mesh Editor](https://dev.epicgames.com/documentation/en-us/unreal-engine/static-mesh-editor-ui-in-unreal-engine): inspecting triangles, vertices, UVs, bounds, and collision.
