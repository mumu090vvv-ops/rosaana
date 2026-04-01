# Rosana — sitio web

Página única para el negocio **Rosana** (sabores caseros). Abre `index.html` en el navegador o súbelo a [GitHub Pages](https://pages.github.com/).

## Personalizar

Edita **`js/config.js`**:

- `whatsappNumber`: número con código de país, solo dígitos (sin `+`).
- `defaultOrderMessage`: texto que aparecerá al inicio del mensaje en WhatsApp.
- `address` y `mapsQuery`: dirección en Colombia; si defines `mapsPlaceUrl`, el botón del mapa abre ese enlace (ficha de Google Maps).
- `hoursLines`: array de líneas de horario (p. ej. cerrado entre semana y apertura de tarde).
- `prices`: precios en COP (números sin puntos). Incluye `empanadaPack` (paquete de 7), `empanadasPerPack` (7), `empanadaIndividual` (sueltas). Al pulsar **Pedir** en el menú se pide cantidad y el mensaje de WhatsApp lleva el **total**.
- `phoneDisplay`, `instagram`, `facebook`, `instagramHandle`: contacto visible y enlaces.

Precios y platos: edita las tarjetas en **`index.html`**. Fotos en **`assets/`** (`.png`): platos del menú y `prep-*` para Nosotros. Puedes reemplazar manteniendo el nombre del archivo.

## Licencia de fotos

Las fotos de producto son propias del negocio. Los avatares de testimonios en la página cargan desde Unsplash por URL.
