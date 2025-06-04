# FinancialProductsApp

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.5.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

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