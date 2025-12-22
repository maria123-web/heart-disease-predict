from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

# Load model dan scaler
model = joblib.load("model_rf.joblib")
scaler = joblib.load("scaler.joblib")

# Threshold default model
THRESHOLD = 0.5  

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "API Prediksi Jantung Aktif!"})

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json

        required_fields = [
            "age","sex","cp","trestbps","chol","fbs","restecg",
            "thalach","exang","oldpeak","slope","ca","thal"
        ]

        # Validasi input aman
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Field '{field}' tidak ditemukan!"}), 400

        # Data ke numpy array
        features = np.array([[
            float(data["age"]),
            float(data["sex"]),
            float(data["cp"]),
            float(data["trestbps"]),
            float(data["chol"]),
            float(data["fbs"]),
            float(data["restecg"]),
            float(data["thalach"]),
            float(data["exang"]),
            float(data["oldpeak"]),
            float(data["slope"]),
            float(data["ca"]),
            float(data["thal"])
        ]])

        # Scaling
        features_scaled = scaler.transform(features)

        # Probability
        if hasattr(model, "predict_proba"):
            prob = float(model.predict_proba(features_scaled)[0][1])
        else:
            pred = int(model.predict(features_scaled)[0])
            prob = float(pred)

        # Result berdasarkan threshold
        result = 1 if prob >= THRESHOLD else 0

        return jsonify({
            "result": result,
            "probability": round(prob, 4),
            "threshold": THRESHOLD
        })

    except Exception as e:
        return jsonify({
            "error": "Terjadi kesalahan: " + str(e)
        }), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7860)
 