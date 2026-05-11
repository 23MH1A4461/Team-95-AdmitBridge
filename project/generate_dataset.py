import csv
import random
import time

# Real universities with their location, average tuition fee in USD (yearly), and admission difficulty tier
# Tier 1 = Highly Competitive, Tier 2 = Moderate, Tier 3 = Safe/Accessible
universities = [
    # US Universities
    {"university_name": "Massachusetts Institute of Technology", "country": "US", "state": "MA", "area": "Cambridge", "fee": 55000, "tier": 1},
    {"university_name": "Stanford University", "country": "US", "state": "CA", "area": "Stanford", "fee": 57000, "tier": 1},
    {"university_name": "Carnegie Mellon University", "country": "US", "state": "PA", "area": "Pittsburgh", "fee": 52000, "tier": 1},
    {"university_name": "Georgia Institute of Technology", "country": "US", "state": "GA", "area": "Atlanta", "fee": 33000, "tier": 1},
    {"university_name": "University of Southern California", "country": "US", "state": "CA", "area": "Los Angeles", "fee": 60000, "tier": 2},
    {"university_name": "Northeastern University", "country": "US", "state": "MA", "area": "Boston", "fee": 50000, "tier": 2},
    {"university_name": "Arizona State University", "country": "US", "state": "AZ", "area": "Tempe", "fee": 32000, "tier": 3},
    {"university_name": "University of Texas at Dallas", "country": "US", "state": "TX", "area": "Richardson", "fee": 38000, "tier": 3},
    {"university_name": "Rutgers University", "country": "US", "state": "NJ", "area": "New Brunswick", "fee": 35000, "tier": 2},
    {"university_name": "University of Illinois Chicago", "country": "US", "state": "IL", "area": "Chicago", "fee": 31000, "tier": 3},
    {"university_name": "San Jose State University", "country": "US", "state": "CA", "area": "San Jose", "fee": 20000, "tier": 3},
    {"university_name": "University of Texas at Arlington", "country": "US", "state": "TX", "area": "Arlington", "fee": 26000, "tier": 3},
    
    # UK Universities
    {"university_name": "University of Oxford", "country": "UK", "state": "England", "area": "Oxford", "fee": 45000, "tier": 1},
    {"university_name": "Imperial College London", "country": "UK", "state": "England", "area": "London", "fee": 42000, "tier": 1},
    {"university_name": "University College London", "country": "UK", "state": "England", "area": "London", "fee": 38000, "tier": 1},
    {"university_name": "University of Manchester", "country": "UK", "state": "England", "area": "Manchester", "fee": 32000, "tier": 2},
    {"university_name": "University of Edinburgh", "country": "UK", "state": "Scotland", "area": "Edinburgh", "fee": 35000, "tier": 2},
    {"university_name": "King's College London", "country": "UK", "state": "England", "area": "London", "fee": 34000, "tier": 2},
    {"university_name": "Queen Mary University of London", "country": "UK", "state": "England", "area": "London", "fee": 28000, "tier": 3},
    {"university_name": "Coventry University", "country": "UK", "state": "England", "area": "Coventry", "fee": 20000, "tier": 3},
    {"university_name": "University of Greenwich", "country": "UK", "state": "England", "area": "London", "fee": 19000, "tier": 3},
    {"university_name": "Nottingham Trent University", "country": "UK", "state": "England", "area": "Nottingham", "fee": 21000, "tier": 3},
    {"university_name": "University of Hertfordshire", "country": "UK", "state": "England", "area": "Hatfield", "fee": 18000, "tier": 3},

    # Germany Universities
    {"university_name": "Technical University of Munich (TUM)", "country": "Germany", "state": "Bavaria", "area": "Munich", "fee": 3000, "tier": 1},
    {"university_name": "RWTH Aachen University", "country": "Germany", "state": "North Rhine-Westphalia", "area": "Aachen", "fee": 500, "tier": 1},
    {"university_name": "Technical University of Berlin", "country": "Germany", "state": "Berlin", "area": "Berlin", "fee": 500, "tier": 2},
    {"university_name": "University of Stuttgart", "country": "Germany", "state": "Baden-Wuerttemberg", "area": "Stuttgart", "fee": 3500, "tier": 2},
    {"university_name": "TU Dresden", "country": "Germany", "state": "Saxony", "area": "Dresden", "fee": 500, "tier": 2},
    {"university_name": "FAU Erlangen-Nuremberg", "country": "Germany", "state": "Bavaria", "area": "Erlangen", "fee": 500, "tier": 3},
    {"university_name": "TU Darmstadt", "country": "Germany", "state": "Hesse", "area": "Darmstadt", "fee": 500, "tier": 2},
    {"university_name": "University of Freiburg", "country": "Germany", "state": "Baden-Wuerttemberg", "area": "Freiburg", "fee": 3500, "tier": 2},
    {"university_name": "SRH Hochschule Berlin", "country": "Germany", "state": "Berlin", "area": "Berlin", "fee": 12000, "tier": 3},
    {"university_name": "IU International University of Applied Sciences", "country": "Germany", "state": "Thuringia", "area": "Erfurt", "fee": 15000, "tier": 3},
]

branches = [
    "Computer Science", "Information Technology", "Mechanical Engineering", 
    "Electrical Engineering", "Civil Engineering", "Electronics and Communication",
    "Artificial Intelligence", "Data Science", "Software Engineering"
]
intakes = ["Fall", "Spring", "Summer"]

def generate_student(uni):
    # Most students have CGPA between 6.5 and 9.5
    cgpa = round(random.uniform(6.0, 9.9), 2)
    
    # GRE logic
    base_gre = 290 + (cgpa - 6) * 10
    gre_prob = int(random.gauss(base_gre, 8))
    gre_score = min(340, max(260, gre_prob))
    gre = gre_score if (uni['country'] == 'US' or random.random() > 0.6) else "NA"
    
    # English proficiency
    ielts = round(random.uniform(5.5, 8.5) * 2) / 2
    toefl = int(random.uniform(70, 118))
    duolingo = int(random.uniform(90, 145))
    
    has_ielts = random.random() > 0.3
    has_toefl = not has_ielts and random.random() > 0.5
    has_duo = not has_ielts and not has_toefl
    
    # Extracurriculars
    work_exp = max(0, int(random.gauss(1.5, 2)))
    research = max(0, int(random.gauss(0, 1.2))) 
    internships = max(0, int(random.gauss(1.5, 1)))
    backlogs = max(0, int(random.gauss(0, 1.5)))
    certificates = max(0, int(random.gauss(3, 2)))
    
    # Admission Logic Engine
    score = 0
    score += (cgpa - 7.5) * 2.5
    if gre != "NA":
        score += (gre - 305) / 8
    score += (ielts - 6.5) * 1.5
    score -= backlogs * 1.2
    score += research * 1.5
    score += work_exp * 0.8
    score += internships * 0.5
    
    if uni['tier'] == 1:
        threshold = 5.0
    elif uni['tier'] == 2:
        threshold = 1.0
    else:
        threshold = -2.5
    
    score += random.gauss(0, 2.5)
    
    if cgpa < 6.0 and uni['tier'] == 1:
        result = "Reject"
    elif backlogs >= 5 and uni['tier'] <= 2:
        result = "Reject"
    else:
        result = "Admit" if score > threshold else "Reject"
        
    fee_variation = int(random.gauss(0, 2000))
    final_fee = max(500, uni['fee'] + fee_variation)

    return {
        "university_name": uni["university_name"],
        "country": uni["country"],
        "state": uni["state"],
        "area": uni["area"],
        "tution_fee_in_usd": final_fee,
        "intake": random.choice(intakes),
        "stream": "B.Tech",
        "branch": random.choice(branches),
        "applicant_cgpa": cgpa,
        "gre_score": gre,
        "ielts_score": ielts if has_ielts else "NA",
        "toefl_score": toefl if has_toefl else "NA",
        "duolingo_score": duolingo if has_duo else "NA",
        "work_experience_years": work_exp,
        "research_papers": research,
        "internships": internships,
        "back_logs": backlogs,
        "certificates": certificates,
        "result": result
    }

def generate_dataset(counts_by_country, filename):
    headers = [
        "university_name", "country", "state", "area", "tution_fee_in_usd", 
        "intake", "stream", "branch", "applicant_cgpa", "gre_score", 
        "ielts_score", "toefl_score", "duolingo_score", "work_experience_years", 
        "research_papers", "internships", "back_logs", "certificates", "result"
    ]
    
    # Categorize universities by country for targeted generation
    us_unis = [u for u in universities if u['country'] == 'US']
    uk_unis = [u for u in universities if u['country'] == 'UK']
    ger_unis = [u for u in universities if u['country'] == 'Germany']
    
    start_time = time.time()
    total_written = 0
    
    with open(filename, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.DictWriter(file, fieldnames=headers)
        writer.writeheader()
        
        # Output buffering for speed
        batch = []
        batch_size = 50000
        
        def write_batch(b):
            writer.writerows(b)
            b.clear()

        # Generate US Data
        print(f"Generating {counts_by_country['US']} US records...")
        for _ in range(counts_by_country['US']):
            uni = random.choice(us_unis)
            batch.append(generate_student(uni))
            total_written += 1
            if len(batch) >= batch_size:
                write_batch(batch)
                
        # Generate UK Data
        print(f"Generating {counts_by_country['UK']} UK records...")
        for _ in range(counts_by_country['UK']):
            uni = random.choice(uk_unis)
            batch.append(generate_student(uni))
            total_written += 1
            if len(batch) >= batch_size:
                write_batch(batch)
                
        # Generate Germany Data
        print(f"Generating {counts_by_country['Germany']} Germany records...")
        for _ in range(counts_by_country['Germany']):
            uni = random.choice(ger_unis)
            batch.append(generate_student(uni))
            total_written += 1
            if len(batch) >= batch_size:
                write_batch(batch)
                
        # Flush remaining
        if batch:
            write_batch(batch)
            
    elapsed = time.time() - start_time
    print(f"Successfully generated {total_written} rows at {filename} in {elapsed:.2f} seconds.")

if __name__ == "__main__":
    distribution = {
        "US": 1000000,
        "UK": 1000000,
        "Germany": 500000
    }
    generate_dataset(distribution, "d:/project/university_admission_data_2_5M.csv")
