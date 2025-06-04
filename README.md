# Financial Products App

Aplicación web desarrollada en Angular standalone para la gestión de productos financieros.

---

## 🧰 Tecnologías utilizadas

- **Angular 19 Standalone**
- **TypeScript**
- **Reactive Forms**
- **RxJS**
- **SCSS modularizado**
- **Standalone components architecture**
- **Proxy de desarrollo para backend REST**

---

## 🚀 Estructura de proyecto

El proyecto está organizado siguiendo una arquitectura modular, limpia y escalable:

```
src/
 ├── app/
 │    ├── core/              # Servicios, modelos y lógica de negocio
 │    ├── features/
 │    │     └── products/    # Feature principal de productos financieros
 │    ├── shared/            # Componentes reutilizables (ConfirmModalComponent)
 │    └── app.routes.ts      # Definición centralizada de rutas
 ├── styles/                 # Estilos globales (variables, buttons, forms, etc)
 └── proxy.conf.json         # Proxy de desarrollo para redirigir peticiones API
```

---

## 🖥️ Funcionalidades implementadas

- ✅ Listado de productos financieros
- ✅ Filtro de búsqueda con debounce (Reactive FormControl)
- ✅ Paginación manual con selector de pageSize
- ✅ Creación de nuevos productos (formulario con validaciones avanzadas)
- ✅ Edición de productos (modo update con validación dinámica de fechas)
- ✅ Eliminación de productos con confirmación (ConfirmModal standalone reusable)
- ✅ Arquitectura standalone limpia y escalable
- ✅ Proxy para evitar CORS durante desarrollo

---

## ⚙️ Configuración de desarrollo

### Instalación de dependencias

```bash
npm install
```

### Servidor de desarrollo

El proyecto utiliza proxy para redirigir llamadas a la API de backend. El archivo `proxy.conf.json` ya está preconfigurado.

```bash
npm start
```

Esto ejecutará:

```bash
ng serve --proxy-config proxy.conf.json
```

El frontend quedará disponible en:  
`http://localhost:4200/`

---

## 🌐 Configuración del proxy (API Backend)

El proxy permite redirigir las llamadas `/bp/*` al backend sin problemas de CORS.

```json
{
  "/bp": {
    "target": "http://localhost:3002",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```

---

## 🧪 Testing

Por ahora el proyecto no contiene tests unitarios.  
La arquitectura actual está preparada para integrar testing de:

- Unit tests (Karma + Jasmine)
- End-to-End (Playwright o Cypress)

---

## 🧹 Buenas prácticas aplicadas

- Angular Standalone puro (sin NgModules)
- Separation of concerns (SOC)
- DRY (Don't Repeat Yourself)
- Componentes compartidos reutilizables
- Proxy para entorno de desarrollo
- Arquitectura escalable por features
- Formulario reactivo con validaciones custom

---

## 📌 Consideraciones futuras (extensiones posibles)

- Agregar lazy loading de features
- Implementar guards de rutas
- Implementar servicios centralizados de notificaciones
- Mejorar UI con una librería de componentes (Material, PrimeNG, Tailwind)
- Internacionalización i18n

---

## 👨‍💻 Autor

Este proyecto fue desarrollado como parte de un ejercicio técnico para evaluación de habilidades en Angular standalone architecture.