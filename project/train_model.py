import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, r2_score, mean_absolute_error
import joblib
import json
import os

def main():
    print("Loading datasets...")
    files = ['US_admission_data.csv', 'UK_admission_data.csv', 'Germany_admission_data.csv']
    dfs = []
    for f in files:
        if os.path.exists(f):
            print(f"Loading {f}...")
            dfs.append(pd.read_csv(f))
        else:
            print(f"Warning: {f} not found.")
            
    if not dfs:
        print("Error: No data files found.")
        return
        
    df = pd.concat(dfs, ignore_index=True)
    
    print("Preprocessing data...")
    score_cols = ['gre_score', 'ielts_score', 'toefl_score', 'duolingo_score']
    for col in score_cols:
        df[col] = pd.to_numeric(df[col].replace('NA', 0), errors='coerce').fillna(0)
    
    numeric_cols = ['applicant_cgpa', 'work_experience_years', 'research_papers', 'internships', 'back_logs', 'certificates', 'tution_fee_in_usd']
    for col in numeric_cols:
        df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)
        
    df['result_binary'] = df['result'].apply(lambda x: 1 if x == 'Admit' else 0)
    
    print("Calculating university statistics...")
    # Grouping by university, country, state, branch, intake
    univ_stats = df.groupby(['university_name', 'country', 'state', 'branch', 'intake']).agg(
        historical_acceptance_rate=('result_binary', 'mean'),
        tution_fee_in_usd=('tution_fee_in_usd', 'mean')
    ).reset_index()
    
    df = df.merge(univ_stats[['university_name', 'country', 'state', 'branch', 'intake', 'historical_acceptance_rate']], 
                  on=['university_name', 'country', 'state', 'branch', 'intake'], 
                  how='left')
    
    features = [
        'applicant_cgpa', 'gre_score', 'ielts_score', 'toefl_score', 'duolingo_score',
        'back_logs', 'tution_fee_in_usd', 'historical_acceptance_rate',
        'country', 'intake', 'branch'
    ]
    
    X = df[features]
    y = df['result_binary']
    
    categorical_cols = ['country', 'intake', 'branch']
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_cols)
        ],
        remainder='passthrough'
    )
    
    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', RandomForestClassifier(n_estimators=30, max_depth=10, random_state=42, n_jobs=-1))
    ])
    
    print(f"Total records: {len(X)}. Sampling 300,000 records for training to avoid memory errors...")
    if len(X) > 300000:
        X_sample = X.sample(n=300000, random_state=42)
        y_sample = y.loc[X_sample.index]
    else:
        X_sample = X
        y_sample = y
        
    X_train, X_test, y_train, y_test = train_test_split(X_sample, y_sample, test_size=0.2, random_state=42)
        
    print(f"Training model on {len(X_train)} records...")
    pipeline.fit(X_train, y_train)
    
    print("Evaluating model...")
    y_pred = pipeline.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    
    metrics = {
        "accuracy": round(accuracy, 4),
        "r2_score": round(r2, 4),
        "mae": round(mae, 4),
        "dataset": "Kaggle Graduate Admissions & Synthesized Options",
        "train_size": len(X_train),
        "test_size": len(X_test)
    }
    
    print(f"Accuracy: {accuracy:.4f}, R2: {r2:.4f}, MAE: {mae:.4f}")
    with open('metrics.json', 'w') as f:
        json.dump(metrics, f, indent=4)
    
    print("Saving artifacts...")
    joblib.dump(pipeline, 'model.pkl')
    univ_stats.to_csv('universities_db.csv', index=False)
    
    # Save options for UI
    options = {
        'countries': sorted(univ_stats['country'].unique().tolist()),
        'branches': sorted(univ_stats['branch'].unique().tolist()),
        'intakes': sorted(univ_stats['intake'].unique().tolist())
    }
    with open('options.json', 'w') as f:
        json.dump(options, f)
    
    print("Done! Artifacts saved.")

if __name__ == '__main__':
    main()
