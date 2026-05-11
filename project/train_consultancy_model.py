import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
import joblib
import os

def main():
    print("Loading consultancy dataset...")
    file_path = 'consultancies_dataset_final.csv'
    if not os.path.exists(file_path):
        print(f"Error: {file_path} not found.")
        return
        
    df = pd.read_csv(file_path)
    
    # Calculate target variables
    df['success_rate_pct'] = (df['successful_applications'] / df['students_applied'] * 100).round(1)
    
    # Features: state, area_district, total_fee_inr, primary_country
    
    X = df[['state', 'area_district', 'total_fee_inr', 'primary_country']]
    y_success = df['success_rate_pct']
    y_rating = df['rating']
    
    categorical_cols = ['state', 'area_district', 'primary_country']
    numeric_cols = ['total_fee_inr']
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_cols),
            ('num', StandardScaler(), numeric_cols)
        ],
        remainder='passthrough'
    )
    
    # Train model for success rate
    print("Training model for success rate...")
    pipeline_success = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', RandomForestRegressor(n_estimators=50, random_state=42))
    ])
    pipeline_success.fit(X, y_success)
    
    # Train model for rating
    print("Training model for rating...")
    pipeline_rating = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', RandomForestRegressor(n_estimators=50, random_state=42))
    ])
    pipeline_rating.fit(X, y_rating)
    
    print("Saving consultancy models...")
    joblib.dump(pipeline_success, 'consultancy_model_success.pkl')
    joblib.dump(pipeline_rating, 'consultancy_model_rating.pkl')
    
    print("Done! Consultancy artifacts saved.")

if __name__ == '__main__':
    main()
