# 🚀 Guía Completa de Despliegue y Uso - Sentiment API

Este documento detalla paso a paso cómo compilar, ejecutar y probar todo el ecosistema del proyecto: **Microservicio Python (IA)**, **Backend Java (Spring Boot)** y **Frontend**.

---

## 🏗️ 1. Arquitectura del Sistema

El sistema funciona con 3 capas conectadas:
1.  **Python (Puerto 5000):** Motor de Inteligencia Artificial. Recibe texto y devuelve sentimiento + probabilidad.
2.  **Java Spring Boot (Puerto 8080):** Orquestador. Recibe peticiones del usuario, valida, guarda en base de datos H2 y consulta a Python.
3.  **Frontend (HTML/JS):** Interfaz visual para el usuario final.

---

## 🐍 2. Microservicio Python (IA)

Este servicio debe iniciarse **primero**.

### Requisitos
- Python 3.9 o superior.
- Pip (Gestor de paquetes).

### Pasos
1.  **Navega a la carpeta del servicio:**
    ```bash
    cd ds
    ```

2.  **Instala las dependencias:**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Ejecuta el servidor (IMPORTANTE: Puerto 5000):**
    Para que Java pueda comunicarse con Python, debemos forzar el puerto 5000.
    ```bash
    uvicorn app:app --reload --port 5000
    ```
    
    *Verificación:* Abre `http://localhost:5000/docs` en tu navegador. Deberías ver la documentación automática de FastAPI.

---

## ☕ 3. Backend Java (Spring Boot)

Este es el servidor principal que conecta todo.

### Requisitos
- Java JDK 17 o superior.
- Maven (incluido en el proyecto como `mvnw`).

### Pasos
1.  **Navega a la raíz del proyecto Java:**
    (Si estabas en `ds`, sube un nivel)
    ```bash
    cd ..
    ```

2.  **Compilar y construir el proyecto:**
    En Windows:
    ```powershell
    .\mvnw.cmd clean install
    ```
    En Linux/Mac:
    ```bash
    ./mvnw clean install
    ```
    *Esto descargará librerías, ejecutará migraciones de base de datos (Flyway) y generará el archivo `.jar`.*

3.  **Ejecutar la aplicación:**
    ```powershell
    .\mvnw.cmd spring-boot:run
    ```
    
    *Verificación:* El servidor iniciará en el puerto 8080. Verás logs indicando que Tomcat inició en puerto 8080.

### Nota sobre Base de Datos
Por defecto, la aplicación usa **H2 (Base de datos en memoria)**. 
- No necesitas instalar Postgres ni MySQL para pruebas.
- Los datos se reinician cada vez que apagas el servidor.
- Consola H2 disponible en: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:sentiment_db`, User: `sa`, Pass: vacío).

---

## 🌐 4. Frontend (Web)

La interfaz de usuario es estática (HTML/CSS/JS puros).

### Pasos
1.  Ve a la carpeta `sentiment-frontend`.
2.  Abre el archivo `index.html` en tu navegador favorito (Chrome, Edge, Firefox).
3.  ¡Listo! La web se conectará automáticamente a `http://localhost:8080` (el backend Java).

---

## 📬 5. Guía de Uso con Postman (API Testing)

Si quieres probar el Backend Java directamente sin usar la web, importa estos ejemplos en Postman.

**Base URL:** `http://localhost:8080`

### A. Analizar Sentimiento individual
Analiza un texto y guarda el registro en la base de datos.
- **Método:** `POST`
- **URL:** `/sentiment`
- **Body (JSON):**
    ```json
    {
      "text": "El servicio fue increíblemente rápido y amable, volveré pronto.",
      "language": "es",
      "threshold": 0.7
    }
    ```
- **Respuesta Esperada (200 OK):**
    ```json
    {
        "prediction": "Positivo",
        "probability": 0.985
    }
    ```

### B. Obtener Estadísticas
Recupera el resumen de sentimientos procesados.
- **Método:** `GET`
- **URL:** `/stats`
- **Parámetros (Query Params opcionales):**
    - `limit`: Cantidad de últimos registros a analizar (ej. `500`).
- **Respuesta Esperada (200 OK):**
    ```json
    {
        "total_analyzed": 15,
        "positive_pct": 60.0,
        "negative_pct": 33.3,
        "neutral_pct": 6.7
    }
    ```

### C. Procesamiento Masivo (Batch)
Sube un archivo CSV para analizar múltiples textos a la vez.
- **Método:** `POST`
- **URL:** `/batch`
- **Body (form-data):**
    - Key: `file` (Tipo: File) -> Selecciona tu archivo `.csv`
    - *Nota: El CSV debe tener el texto en la primera columna.*
- **Respuesta Esperada (200 OK):**
    ```json
    [
        {
            "texto": "Me gusta el producto",
            "prevision": "Positivo",
            "probabilidad": 0.92,
            "top_features": ["gusta", "producto"]
        },
        ...
    ]
    ```

---

## ⚠️ Solución de Problemas Comunes

1.  **Error "Connection refused" en Java:**
    - Significa que Java no encuentra a Python.
    - **Solución:** Asegúrate de que `uvicorn` siga corriendo en el puerto 5000 en otra terminal.

2.  **Error CORS en el Frontend:**
    - Si el navegador bloquea las peticiones.
    - **Solución:** El backend Java ya tiene configurado `@CrossOrigin("*")`, pero asegúrate de acceder al frontend como archivo local o `localhost`, no desde una IP extraña.

3.  **Python da error "Module not found":**
    - **Solución:** Revisa haber ejecutado `pip install -r requirements.txt` dentro de la carpeta `ds/`.
