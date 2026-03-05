# 🧠 Dota 2 Behavioral Analytics - UI

Capa de visualización interactiva para el sistema de análisis conductual y fatiga cognitiva en sesiones prolongadas de e-sports (Dota 2).

Este proyecto forma parte de una arquitectura desacoplada y consume datos directamente de nuestra API REST.

## 🏗️ Arquitectura del Ecosistema
* 🖥️ **Frontend (Este repositorio):** Desarrollado con React, Vite, Tailwind CSS v4 y Recharts para la renderización de KPIs y tendencias en tiempo real.
* ⚙️ **Backend / Data Pipeline:** El motor de extracción (ETL) y la API construida con FastAPI y PostgreSQL se encuentran en el repositorio principal: **[👉 Ver Backend Repository](https://github.com/Dracaryscode/dota2-meta-analyzer.git)**.

## 🚀 Tecnologías Core
* **React + Vite:** Motor de UI de alta velocidad.
* **Tailwind CSS:** Sistema de diseño y estilizado.
* **Recharts:** Visualización de datos interactivos enfocados en UX.
* **Axios:** Cliente HTTP para conexión con la API REST.

## 📦 Instalación Local
```bash
npm install
npm run dev