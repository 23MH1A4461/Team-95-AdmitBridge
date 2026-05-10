from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import json
import os

app = Flask(__name__, static_folder='static', static_url_path='')
CORS(app)

model_path = 'model.pkl'
db_path = 'universities_db.csv'
options_path = 'options.json'
consultancies_path = 'consultancies_dataset_final.csv'

model = None
universities_db = None
consultancies_db = None
consultancy_model_success = None
consultancy_model_rating = None
options = {}

if os.path.exists(model_path) and os.path.exists(db_path) and os.path.exists(options_path):
    print("Loading model and university database...")
    model = joblib.load(model_path)
    universities_db = pd.read_csv(db_path)
    with open(options_path, 'r') as f:
        options = json.load(f)
    if os.path.exists(consultancies_path):
        print("Loading consultancies dataset...")
        consultancies_db = pd.read_csv(consultancies_path)
        
        try:
            print("Loading consultancy ML models...")
            consultancy_model_success = joblib.load('consultancy_model_success.pkl')
            consultancy_model_rating = joblib.load('consultancy_model_rating.pkl')
        except FileNotFoundError:
            print("WARNING: Consultancy ML models not found.")
            consultancy_model_success = None
            consultancy_model_rating = None
else:
    print("WARNING: artifacts not found. Train the model first.")

@app.route('/')
def serve_frontend():
    return app.send_static_file('index.html')

@app.route('/api/options', methods=['GET'])
def get_options():
    # If the app was started before artifacts were ready, try loading them again
    global options, model, universities_db, consultancies_db, consultancy_model_success, consultancy_model_rating
    if not options and os.path.exists(options_path):
        model = joblib.load(model_path)
        universities_db = pd.read_csv(db_path)
        with open(options_path, 'r') as f:
            options = json.load(f)
        if os.path.exists(consultancies_path):
            consultancies_db = pd.read_csv(consultancies_path)
            try:
                consultancy_model_success = joblib.load('consultancy_model_success.pkl')
                consultancy_model_rating = joblib.load('consultancy_model_rating.pkl')
            except FileNotFoundError:
                pass
    return jsonify(options)

@app.route('/api/recommend', methods=['POST'])
def recommend():
    if model is None or universities_db is None:
        return jsonify({"error": "Model not loaded. Please train the model first."}), 500

    data = request.json
    
    cgpa = float(data.get('cgpa', 0))
    budget = float(data.get('budget', 0))
    exam_type = data.get('exam_type', '').lower()
    exam_score = float(data.get('exam_score', 0))
    back_logs = float(data.get('back_logs', 0))
    country = data.get('country', '')
    branch = data.get('branch', '')
    intake = data.get('intake', '') # can be empty string for any
    
    gre_score = exam_score if exam_type == 'gre' else 0
    ielts_score = exam_score if exam_type == 'ielts' else 0
    toefl_score = exam_score if exam_type == 'toefl' else 0
    duolingo_score = exam_score if exam_type == 'duolingo' else 0
    
    eligible_unis = universities_db.copy()
    if budget > 0:
        eligible_unis = eligible_unis[eligible_unis['tution_fee_in_usd'] <= budget]
    if country:
        eligible_unis = eligible_unis[eligible_unis['country'] == country]
    if branch:
        eligible_unis = eligible_unis[eligible_unis['branch'] == branch]
    if intake:
        eligible_unis = eligible_unis[eligible_unis['intake'] == intake]
        
    if len(eligible_unis) == 0:
        return jsonify({"recommendations": []})
        
    X_input = pd.DataFrame({
        'applicant_cgpa': [cgpa] * len(eligible_unis),
        'gre_score': [gre_score] * len(eligible_unis),
        'ielts_score': [ielts_score] * len(eligible_unis),
        'toefl_score': [toefl_score] * len(eligible_unis),
        'duolingo_score': [duolingo_score] * len(eligible_unis),
        'back_logs': [back_logs] * len(eligible_unis),
        'tution_fee_in_usd': eligible_unis['tution_fee_in_usd'].values,
        'historical_acceptance_rate': eligible_unis['historical_acceptance_rate'].values,
        'country': eligible_unis['country'].values,
        'intake': eligible_unis['intake'].values,
        'branch': eligible_unis['branch'].values
    })
    
    probabilities = model.predict_proba(X_input)[:, 1]
    
    eligible_unis['acceptance_probability'] = probabilities
    
    top_unis = eligible_unis.sort_values(by='acceptance_probability', ascending=False)
    
    # Optimize serialization
    top_unis['tution_fee_in_usd'] = top_unis['tution_fee_in_usd'].astype(int)
    top_unis['acceptance_probability'] = top_unis['acceptance_probability'].astype(float)
    
    results = top_unis[['university_name', 'country', 'state', 'branch', 'intake', 'tution_fee_in_usd', 'acceptance_probability']].to_dict('records')
        
    return jsonify({"recommendations": results})

@app.route('/api/consultancies', methods=['POST'])
def recommend_consultancies():
    if consultancies_db is None:
        return jsonify({"error": "Consultancies data not loaded."}), 500
        
    data = request.json
    budget = float(data.get('budget', 0))
    state = data.get('state', '')
    area = data.get('area', '')
    country = data.get('country', '')
    
    eligible = consultancies_db.copy()
    
    if budget > 0:
        eligible = eligible[eligible['total_fee_inr'] <= budget]
    if state:
        eligible = eligible[eligible['state'] == state]
    if area:
        eligible = eligible[eligible['area_district'].str.contains(area, case=False, na=False)]
    if country:
        eligible = eligible[eligible['primary_country'] == country]
        
    if len(eligible) == 0:
        return jsonify({"recommendations": []})
        
    # Predict success rate and rating using models if available
    if consultancy_model_success is not None and consultancy_model_rating is not None:
        X_predict = eligible[['state', 'area_district', 'total_fee_inr', 'primary_country']]
        eligible['predicted_success_rate'] = consultancy_model_success.predict(X_predict).round(1)
        eligible['predicted_rating'] = consultancy_model_rating.predict(X_predict).round(1)
        
        # Override actuals with predictions for display to fulfill user request
        eligible['success_rate_pct'] = eligible['predicted_success_rate']
        eligible['rating'] = eligible['predicted_rating']
    else:
        # Fallback to calculated/actual if models missing
        eligible['success_rate_pct'] = (eligible['successful_applications'] / eligible['students_applied'] * 100).round(1)
    
    # Sort by predicted rating and success rate
    top_consultancies = eligible.sort_values(by=['rating', 'success_rate_pct'], ascending=[False, False])
    
    results = top_consultancies[['consultancy_name', 'state', 'area_district', 'total_fee_inr', 'rating', 'reviews', 'success_rate_pct']].head(12).to_dict('records')
    
    return jsonify({"recommendations": results})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
