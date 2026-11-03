# Data Science - 22DS102006
# Experiment 1: Working with Different Data Formats using pandas

import pandas as pd

# %%
# a. Reading and Writing CSV Data
# The PDF reads this file from
# https://people.sc.fsu.edu/~jburkardt/data/csv/hw_200.csv
# The same dataset is bundled with the portal so it also runs in the browser.
url = 'hw_200.csv'
df = pd.read_csv(url)

print(df.head())

# Write CSV to file
df.to_csv("output.csv", index=False)

# %%
# b. Reading and Writing JSON Data
# Convert DataFrame to JSON and back
json_data = df.to_json()
df_json = pd.read_json(json_data)

print(df_json.head())

# %%
# c. Reading and Writing Excel Files
# Save and load Excel files
df.to_excel("output.xlsx", index=False)
df_excel = pd.read_excel("output.xlsx")

print(df_excel.head())
