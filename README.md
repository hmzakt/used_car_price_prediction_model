# Used Car Price Prediction

This project is a complete data science pipeline that predicts the price of used cars based on various input features. It includes everything from data preprocessing and model training to deploying the model using a backend API and interacting with it through a React frontend.

---

## Features

- Cleaned and preprocessed real-world used car data
- Handled missing values, outliers, and high-cardinality categorical features
- Applied One-Hot Encoding and frequency encoding
- Trained a **Random Forest Regressor** for high accuracy
- Exported the trained model using `joblib`
- Built a Flask backend for API serving
- Developed a React frontend to input car details and display predicted price
- Deployed the full-stack application

---

## Machine Learning

- **Algorithm Used**: Random Forest Regressor
- **Performance**:
  - MAE: ~6397
  - RMSE: ~9006
  - R² Score: ~0.81

---

## Tech Stack

| Layer        | Technology               |
| ------------ | ------------------------ |
| Frontend     | React                    |
| Backend      | Flask                    |
| Model        | scikit-learn, pandas     |
| API Testing  | Postman                  |

---

##  How to Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/used-car-price-predictor.git
cd used-car-price-predictor
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python app.py
cd frontend
npm install
npm start
```
  
### API usage (Sample JSON) :   
{  
  "model_year": 2020,  
  "milage": 45000,  
  "accident": 0,  
  "clean_title": 1,  
  "engine_size": 2.5,  
  "fuel_type_Gasoline": 1,  
  "transmission_Automatic": 1,  
  "brand_Audi": 1,  
  "model_encoded": 123  
}  

Response :     
{  
  "predicted_price": 28824.12  
}  

