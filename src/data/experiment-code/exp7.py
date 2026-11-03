# Data Science - 22DS102006
# Experiment 7: Data Aggregation

import pandas as pd

# %%
# --------------------------------------------------
# a. GroupBy with a single key and multiple keys
# --------------------------------------------------
data = {
    'Name': ['Ravi', 'Sita', 'Arun', 'Priya', 'Kiran', 'Anil', 'Lakshmi', 'Rahul'],
    'Department': ['CSE', 'CSE', 'ECE', 'ECE', 'CSE', 'ECE', 'CSE', 'ECE'],
    'Year': [2, 2, 3, 3, 2, 3, 3, 2],
    'Marks': [85, 90, 78, 88, 75, 82, 95, 70]
}

df = pd.DataFrame(data)

print("Original DataFrame:")
print(df)

# 1. Group by a single key
print("\n1. Group by Department:")
group1 = df.groupby('Department')

for name, group in group1:
    print("\nDepartment:", name)
    print(group)

print("\nAverage Marks by Department:")
print(df.groupby('Department')['Marks'].mean())

# 2. Group by multiple keys
print("\n2. Group by Department and Year:")
group2 = df.groupby(['Department', 'Year'])

for name, group in group2:
    print("\nGroup:", name)
    print(group)

print("\nAverage Marks by Department and Year:")
print(df.groupby(['Department', 'Year'])['Marks'].mean())

# %%
# --------------------------------------------------
# b. Summary statistics using aggregate()
# --------------------------------------------------
data = {
    'Department': ['CSE', 'CSE', 'CSE', 'ECE', 'ECE', 'ECE',
                   'EEE', 'EEE', 'EEE'],
    'Marks': [80, 75, 85, 70, 65, 75, 90, 85, 95],
    'Attendance': [90, 85, 95, 80, 75, 85, 95, 90, 100]
}

df = pd.DataFrame(data)

print("Original DataFrame:")
print(df)

result = df.groupby('Department').aggregate({
    'Marks': ['sum', 'mean', 'std'],
    'Attendance': ['sum', 'mean', 'std']
})

print("\nSummary Statistics:")
print(result)

# %%
# --------------------------------------------------
# c. GroupBy and EDA on an online dataset (Iris)
# --------------------------------------------------
url = "https://raw.githubusercontent.com/mwaskom/seaborn-data/master/iris.csv"
df = pd.read_csv(url)

print("First 5 Records:")
print(df.head())

print("\nDataset Information:")
print(df.info())

print("\nStatistical Summary:")
print(df.describe())

# 1. GroupBy using a single column
print("\n1. GroupBy using a Single Column:")
group_single = df.groupby('species')['sepal_length'].agg(
    ['count', 'sum', 'mean', 'std', 'min', 'max']
)
print(group_single)

# 2. GroupBy using multiple columns
print("\n2. GroupBy using Multiple Columns:")
group_multiple = df.groupby(
    ['species', 'sepal_width']
)['sepal_length'].mean()
print(group_multiple.head(15))

# 3. Summary statistics for each species
print("\n3. Summary Statistics:")
summary = df.groupby('species').agg({
    'sepal_length': ['mean', 'std', 'min', 'max'],
    'sepal_width': ['mean', 'std', 'min', 'max'],
    'petal_length': ['mean', 'std', 'min', 'max'],
    'petal_width': ['mean', 'std', 'min', 'max']
})
print(summary)

# 4. Exploratory Data Analysis
print("\n4. Number of Records in Each Species:")
print(df['species'].value_counts())

print("\nAverage Petal Length by Species:")
print(df.groupby('species')['petal_length'].mean())

print("\nAverage Petal Width by Species:")
print(df.groupby('species')['petal_width'].mean())

print("\nMaximum Sepal Length by Species:")
print(df.groupby('species')['sepal_length'].max())
