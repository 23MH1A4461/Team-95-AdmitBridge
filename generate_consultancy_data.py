import pandas as pd
import numpy as np
import random
import os

# Indian states and some major districts
states_districts = {
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Tirupati"],
    "Arunachal Pradesh": ["Itanagar", "Tawang", "Ziro", "Pasighat", "Bomdila"],
    "Assam": ["Guwahati", "Dibrugarh", "Silchar", "Jorhat", "Tezpur"],
    "Bihar": ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Darbhanga"],
    "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg"],
    "Goa": ["North Goa", "South Goa", "Panaji", "Vasco da Gama", "Margao"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar", "Jamnagar"],
    "Haryana": ["Gurugram", "Faridabad", "Panipat", "Ambala", "Rohtak", "Hisar"],
    "Himachal Pradesh": ["Shimla", "Manali", "Dharamshala", "Mandi", "Solan"],
    "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar"],
    "Karnataka": ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi", "Belagavi"],
    "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam"],
    "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad"],
    "Manipur": ["Imphal", "Churachandpur", "Thoubal", "Bishnupur", "Ukhrul"],
    "Meghalaya": ["Shillong", "Tura", "Jowai", "Nongpoh", "Williamnagar"],
    "Mizoram": ["Aizawl", "Lunglei", "Champhai", "Serchhip", "Kolasib"],
    "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha"],
    "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur"],
    "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Chandigarh"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer"],
    "Sikkim": ["Gangtok", "Namchi", "Gyalshing", "Mangan", "Singtam"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Vellore"],
    "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam"],
    "Tripura": ["Agartala", "Dharmanagar", "Udaipur", "Kailashahar", "Ambassa"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Noida", "Prayagraj"],
    "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rishikesh"],
    "West Bengal": ["Kolkata", "Howrah", "Darjeeling", "Siliguri", "Asansol", "Durgapur"],
    "Delhi": ["New Delhi", "Dwarka", "Rohini", "Connaught Place", "Saket", "Vasant Kunj"],
    "Jammu and Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Kathua"]
}

# Prefixes and suffixes to generate consultancy names
prefixes = ["Global", "Future", "Overseas", "Horizon", "Elite", "Premier", "Apex", "Pinnacle", "Summit", "Vision", "Edu", "Study", "Path", "Gateway", "Pioneer"]
suffixes = ["Consultants", "Advisors", "Education", "Pathways", "Ventures", "Solutions", "Services", "Guidance", "Experts", "Group", "Mentors"]

def generate_name():
    return f"{random.choice(prefixes)} {random.choice(suffixes)}"

def generate_dataset():
    data = []
    
    # Generate at least 40 records for each state
    for state, districts in states_districts.items():
        # Random number of consultancies between 40 and 150
        num_consultancies = random.randint(40, 150)
        
        for _ in range(num_consultancies):
            name = generate_name()
            # Add a random number/string sometimes to make names unique if they collide, though rare
            if random.random() > 0.8:
                name += f" {random.choice(['India', 'International', 'Global', 'Network'])}"
                
            area = random.choice(districts)
            
            # Application statistics
            students_applied = random.randint(50, 5000)
            
            # Success rate between 60% and 95%
            success_rate = random.uniform(0.60, 0.95)
            successful_applications = int(students_applied * success_rate)
            
            # Consultancy fee between 10000 and 75000 INR (excluding application fee)
            consultancy_fee = random.randint(10, 75) * 1000
            
            # 5% commission from the consultancy fee
            commission_fee = int(consultancy_fee * 0.05)
            
            # Total fee
            total_fee = consultancy_fee + commission_fee
            
            # Rating and Reviews
            rating = round(random.uniform(3.0, 5.0), 1)
            reviews = random.randint(10, 5000)
            
            # Target country percentages
            # We need them to sum to 100
            countries = ['US', 'UK', 'Germany']
            primary = random.choice(countries)
            
            if primary == 'US':
                us_pct = random.randint(45, 80)
                rem = 100 - us_pct
                uk_pct = random.randint(5, rem - 5)
                germany_pct = rem - uk_pct
            elif primary == 'UK':
                uk_pct = random.randint(45, 80)
                rem = 100 - uk_pct
                us_pct = random.randint(5, rem - 5)
                germany_pct = rem - us_pct
            else: # Germany
                germany_pct = random.randint(45, 80)
                rem = 100 - germany_pct
                us_pct = random.randint(5, rem - 5)
                uk_pct = rem - us_pct
                
            data.append({
                'consultancy_name': name,
                'state': state,
                'area_district': area,
                'students_applied': students_applied,
                'successful_applications': successful_applications,
                'consultancy_fee_inr': consultancy_fee,
                'commission_fee_inr': commission_fee,
                'total_fee_inr': total_fee,
                'rating': rating,
                'reviews': reviews,
                'primary_country': primary,
                'us_applications_pct': us_pct,
                'uk_applications_pct': uk_pct,
                'germany_applications_pct': germany_pct
            })
            
    df = pd.DataFrame(data)
    
    # Shuffle the dataset
    df = df.sample(frac=1).reset_index(drop=True)
    
    output_path = 'consultancies_dataset_final.csv'
    df.to_csv(output_path, index=False)
    print(f"Generated dataset with {len(df)} consultancies.")
    print(f"Saved to {output_path}")
    
    # Verify constraints
    state_counts = df['state'].value_counts()
    print("\nConsultancies per state (min 40 required):")
    print(state_counts.min())
    if state_counts.min() < 40:
        print("WARNING: Some states have fewer than 40 consultancies!")
    else:
        print("SUCCESS: All states have at least 40 consultancies.")
        
    return df

if __name__ == "__main__":
    generate_dataset()
