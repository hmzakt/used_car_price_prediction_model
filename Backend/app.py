from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

# Load the trained model
model = joblib.load('car_price_predictor.pkl')

# Initialize Flask app
app = Flask(__name__)
CORS(app)


expected_features = ['model_year', 'milage', 'accident', 'clean_title', 'engine_size',
       'fuel_type_Diesel', 'fuel_type_E85 Flex Fuel', 'fuel_type_Gasoline',
       'fuel_type_Hybrid', 'fuel_type_Plug-In Hybrid',
       'transmission_Automatic', 'transmission_CVT', 'transmission_Manual',
       'brand_Alfa', 'brand_Aston', 'brand_Audi', 'brand_BMW', 'brand_Bentley',
       'brand_Bugatti', 'brand_Buick', 'brand_Cadillac', 'brand_Chevrolet',
       'brand_Chrysler', 'brand_Dodge', 'brand_FIAT', 'brand_Ferrari',
       'brand_Ford', 'brand_GMC', 'brand_Genesis', 'brand_Honda',
       'brand_Hummer', 'brand_Hyundai', 'brand_INFINITI', 'brand_Jaguar',
       'brand_Jeep', 'brand_Karma', 'brand_Kia', 'brand_Lamborghini',
       'brand_Land', 'brand_Lexus', 'brand_Lincoln', 'brand_Lotus',
       'brand_MINI', 'brand_Maserati', 'brand_Maybach', 'brand_Mazda',
       'brand_McLaren', 'brand_Mercedes-Benz', 'brand_Mercury',
       'brand_Mitsubishi', 'brand_Nissan', 'brand_Plymouth', 'brand_Pontiac',
       'brand_Porsche', 'brand_RAM', 'brand_Rolls-Royce', 'brand_Saab',
       'brand_Saturn', 'brand_Scion', 'brand_Subaru', 'brand_Suzuki',
       'brand_Toyota', 'brand_Volkswagen', 'brand_Volvo', 'brand_smart',
       'model_encoded']

@app.route('/predict', methods=['POST'])
def predict():
    input_data = request.get_json()
    
    input_list = [input_data.get(col, 0) for col in expected_features]

    prediction = model.predict([input_list])[0]
    return jsonify({'predicted_price': prediction})

if __name__ == '__main__':
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)

