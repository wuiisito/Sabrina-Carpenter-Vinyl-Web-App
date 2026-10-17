# 💋 Sabrina Carpenter · Vinyl Player & Instrumental Archive

Una aplicación web progresiva (PWA) dedicada a **Sabrina Carpenter**, diseñada con estética retro-glam de los años 60/70 (*Short n' Sweet*, *Emails I Can't Send*, etc.) que incluye un tocadiscos de vinilo interactivo con aguja animada, modo mini ventana de escritorio y el archivo completo de 82 canciones instrumentales y enlaces a YouTube.

---

## ✨ Características Principales

1. **Tocadiscos con Vinilo Giratorio:**
   * Disco de vinilo con surcos fonográficos y reflejos de luz dinámicos.
   * Brazo de aguja (*tonearm*) que desciende al reproducir y se retira al pausar.
   * Selector de velocidad: **33 RPM** vs **45 RPM** que altera la velocidad física del vinilo.
   * Barra visualizadora de ondas de sonido ecualizadas en vivo.
   * Controles completos: Reproducir/Pausar, Anterior, Siguiente, Aleatorio, Repetir y Volumen.

2. **Mini App de Escritorio / Ventana Flotante:**
   * **Modo Ventana Flotante:** Botón dedicado para abrir una ventana compacta independiente (`mini.html`) en tu escritorio.
   * **PWA Instalable:** Compatible con Chrome, Edge y Brave. Haz clic en **"✨ Instalar App"** para anclarla como aplicación nativa en tu barra de tareas o escritorio sin barra del navegador.
   * Barra flotante inferior siempre disponible mientras exploras álbumes.

3. **Páginas Dedicadas para los 8 Álbumes:**
   * Portadas personalizadas con diseño de slipcase de vinilo 3D.
   * Fondo temático según la época de cada disco.
   * Lista de pistas con botón de reproducción directa y enlace oficial a YouTube.
   * Álbumes incluidos:
     * *Short n' Sweet (2024)*
     * *Emails I Can't Send Fwd (2022-2023)*
     * *fruitcake (Holiday EP 2023)*
     * *Singular: Act II (2019)*
     * *Singular: Act I (2018)*
     * *Evolution (2016)*
     * *Eyes Wide Open (2015)*
     * *Singles & Features*

4. **Bóveda de Enlaces Oficiales de YouTube (82 canciones):**
   * Buscador en tiempo real por título.
   * Filtros por álbum.
   * Tarjetas con acceso directo a YouTube y opción de reproducir la versión instrumental.

---

## 🚀 Cómo Ejecutar en Local

Para probar la app localmente con todas las funciones de audio y PWA:

### Opción 1: Con Python (Recomendado)
```bash
cd d:\Proyectos\dualplay\sabrina_web
python -m http.server 8080
```
Luego abre en tu navegador: [http://localhost:8080](http://localhost:8080)

### Opción 2: Con Node / NPX
```bash
cd d:\Proyectos\dualplay\sabrina_web
npx serve .
```

---

## 🌐 Cómo Subir a GitHub Pages

La app está diseñada con rutas relativas (`./`) listas para GitHub Pages:

1. **Crea un repositorio en GitHub:** (por ejemplo, `sabrina-vinyl-player`).
2. **Sube los archivos de la carpeta `sabrina_web`:**
   ```bash
   cd d:\Proyectos\dualplay\sabrina_web
   git init
   git add .
   git commit -m "feat: Sabrina Carpenter Vinyl Web App"
   git branch -M main
   git remote add origin https://github.com/<tu-usuario>/sabrina-vinyl-player.git
   git push -u origin main
   ```
3. **Activar GitHub Pages en GitHub:**
   * Ve a **Settings** > **Pages** en tu repositorio de GitHub.
   * En **Build and deployment** > **Source**, selecciona **GitHub Actions** (ya viene configurado con `.github/workflows/deploy.yml`) o selecciona la rama **main** / root.
   * ¡Tu página estará disponible en `https://<tu-usuario>.github.io/sabrina-vinyl-player/`!
