from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline
import joblib

def crear_modelo(nombre_archivo, datos_X, datos_y):
    # Crear pipeline
    model = make_pipeline(CountVectorizer(), LogisticRegression())
    model.fit(datos_X, datos_y)
    joblib.dump(model, nombre_archivo)
    print(f"Modelo creado: {nombre_archivo}")

# Español
X_es = ["me encanta", "es genial", "bueno", "malo", "horrible", "odio esto"]
y_es = ["Positivo", "Positivo", "Positivo", "Negativo", "Negativo", "Negativo"]
crear_modelo("model_es.joblib", X_es, y_es)

# Inglés
X_en = ["i love it", "great", "good", "bad", "terrible", "hate this"]
y_en = ["Positivo", "Positivo", "Positivo", "Negativo", "Negativo", "Negativo"]
crear_modelo("model_en.joblib", X_en, y_en)

# Portugués
X_pt = ["eu amo", "otimo", "bom", "ruim", "horrivel", "odeio isso"]
y_pt = ["Positivo", "Positivo", "Positivo", "Negativo", "Negativo", "Negativo"]
crear_modelo("model_pt.joblib", X_pt, y_pt)
