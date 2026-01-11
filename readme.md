# CustomerPulse - Sistema de Inteligencia de Opinión

![Version](https://img.shields.io/badge/version-1.0.0-blueviolet) ![Status](https://img.shields.io/badge/status-stable-success) ![Java](https://img.shields.io/badge/Java-17-orange) ![Python](https://img.shields.io/badge/Python-3.9-yellow)

Plataforma empresarial para análisis de sentimientos en tiempo real. Utiliza Inteligencia Artificial para clasificar opiniones de clientes, detectar riesgos y sugerir acciones inmediatas. Diseñado para equipos de Customer Experience (CX) y Marketing.

---

## 🏗️ Arquitectura

El sistema sigue una arquitectura modular moderna:

1.  **Frontend (Elite Dashboard)**: 
    *   Interfaz Web nativa (Vanilla JS/CSS3) con diseño "Corporate Midnight".
    *   Comunicación asíncrona con el backend para actualizaciones en tiempo real.
    *   Visualización de datos con Chart.js.

2.  **Backend (Orquestador Spring Boot)**:
    *   Expone API REST para el frontend.
    *   Maneja la persistencia de datos (Historial de análisis).
    *   Actúa como Gateway hacia el servicio de IA.

3.  **Microservicio AI (Python FastAPI)**:
    *   Motor de procesamiento de lenguaje natural (NLP).
    *   Endpoint `/analyze` que retorna polaridad, subjetividad y features.

---

## 🚀 Guía de Instalación Rápida

Sigue estos pasos para levantar todo el ecosistema en tu máquina local.

### Prerrequisitos
*   **Java JDK 17** o superior.
*   **Python 3.9** o superior.
*   **Maven** (Opcional, el proyecto incluye wrapper).

### Paso 1: Microservicio de Inteligencia Artificial
El cerebro del sistema debe iniciarse primero.

1.  Navega a la carpeta del servicio de data science:
    ```bash
    cd ds
    ```
2.  Instala las dependencias necesarias:
    ```bash
    pip install -r requirements.txt
    ```
3.  Inicia el servidor (correrá en puerto 5000):
    ```bash
    uvicorn app:app --reload --port 5000
    ```

### Paso 2: Backend & Plataforma Web
La plataforma principal integra la web y la API.

1.  Vuelve a la raíz del proyecto.
2.  Ejecuta la aplicación con Maven Wrapper:
    ```bash
    # Windows
    .\mvnw spring-boot:run
    
    # Mac/Linux
    ./mvnw spring-boot:run
    ```
    *(El servidor iniciará en el puerto 8080)*

### Paso 3: Acceso
Abre tu navegador favorito y visita:
👉 **[http://localhost:8080](http://localhost:8080)**

---

## � Manual de Uso

### 1. Simulador de Atención (Panel Izquierdo)
Ideal para probar casos individuales o entrenar agentes.
*   **Idiomas**: Selecciona la pestaña del idioma (ES/EN/PT) para ajustar el motor de análisis.
*   **Análisis**: Escribe un comentario y presiona "Analizar Impacto".
*   **Resultados**:
    *   **Clasificación**: Positivo, Negativo, Neutro.
    *   **Confianza**: % de certeza del modelo.
    *   **Action Suggester**: Recomendación automática (ej. "Escalar a Supervisor").

### 2. Procesamiento Masivo (Panel Derecho)
Para analizar grandes volúmenes de feedback (ej. exportaciones de Twitter o Encuestas).
*   Arrastra tu archivo `.csv` a la zona de carga.
*   **Requisito**: El archivo debe tener el texto a analizar en la primera columna.
*   **Exportar**: Al finalizar, aparecerá un botón "Descargar CSV" para obtener el reporte enriquecido con los scores.

### 3. Métricas y Tendencias
*   **KPIs Superiores**: Muestran el % actual de satisfacción basado en la base de datos seleccionada.
*   **Filtros**: Usa el selector "Base de Datos" (arriba derecha) para filtrar por:
    *   Últimos 50 (Muestreo rápido)
    *   Últimos 500 (Tendencia reciente)
    *   Personalizado (Define tu propio rango N)

---

## � Referencia de API

Si deseas integrar CustomerPulse con otros sistemas (CRM, ERP), utiliza estos endpoints:

| Verbo  | Endpoint    | Descripción           | Payload                             |
| :----- | :---------- | :-------------------- | :---------------------------------- |
| `POST` | `/settings` | Analizar texto simple | `{"text": "...", "language": "es"}` |
| `POST` | `/batch`    | Carga masiva CSV      | `multipart/form-data: file`         |
| `GET`  | `/stats`    | Estadísticas globales | `?limit={n}`                        |

---

## 🛠 Configuración Avanzada

El archivo `application.properties` permite configurar:
*   `ds.service.url`: URL del microservicio Python (default: localhost:5000).
*   Base de Datos: Por defecto usa **H2 (Memoria)**. Para persistencia real, descomenta la configuración de **PostgreSQL**.

---
*Hackathon Alura - Customer Intelligence Solution*
