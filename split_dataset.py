import csv
import time

input_file = "d:/project/university_admission_data_2_5M_real_unis.csv"

# Output files
files = {
    "US": open("d:/project/US_admission_data.csv", "w", newline='', encoding='utf-8'),
    "UK": open("d:/project/UK_admission_data.csv", "w", newline='', encoding='utf-8'),
    "Germany": open("d:/project/Germany_admission_data.csv", "w", newline='', encoding='utf-8')
}

writers = {}

start_time = time.time()
print("Starting to split the 2.5M row dataset by country...")

with open(input_file, "r", encoding='utf-8') as infile:
    reader = csv.DictReader(infile)
    headers = reader.fieldnames
    
    # Initialize writers
    for country, file_obj in files.items():
        writers[country] = csv.DictWriter(file_obj, fieldnames=headers)
        writers[country].writeheader()
        
    counts = {"US": 0, "UK": 0, "Germany": 0}
    
    # Read and split
    for row in reader:
        country = row["country"]
        if country in writers:
            writers[country].writerow(row)
            counts[country] += 1

# Close all files
for file_obj in files.values():
    file_obj.close()
    
elapsed = time.time() - start_time
print(f"Done in {elapsed:.2f} seconds.")
for country, count in counts.items():
    print(f"{country}: {count} rows saved to {country}_admission_data.csv")
