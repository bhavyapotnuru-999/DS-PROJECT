# Data Science - 22DS102006
# Experiment 5: Data Visualization with Matplotlib and Seaborn
# Dataset: Iris dataset loaded from an online URL

import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Load online dataset
url = "https://raw.githubusercontent.com/mwaskom/seaborn-data/master/iris.csv"
df = pd.read_csv(url)

# Display first five records
print("First Five Records:")
print(df.head())

# Display dataset information
print("\nDataset Information:")
print(df.info())

# Display statistical summary
print("\nStatistical Summary:")
print(df.describe())

# %%
# --------------------------------------------------
# 1. Matplotlib - Line Plot
# --------------------------------------------------
plt.figure(figsize=(8, 5))
plt.plot(df.index, df["sepal_length"], label="Sepal Length")
plt.plot(df.index, df["petal_length"], label="Petal Length")
plt.xlabel("Sample Index")
plt.ylabel("Length")
plt.title("Sepal Length and Petal Length")
plt.legend()
plt.grid()
plt.show()

# %%
# --------------------------------------------------
# 2. Seaborn - Scatter Plot
# --------------------------------------------------
plt.figure(figsize=(8, 5))
sns.scatterplot(
    data=df,
    x="sepal_length",
    y="petal_length",
    hue="species"
)
plt.title("Sepal Length vs Petal Length")
plt.xlabel("Sepal Length")
plt.ylabel("Petal Length")
plt.show()

# %%
# --------------------------------------------------
# 3. Seaborn - Histogram
# --------------------------------------------------
plt.figure(figsize=(8, 5))
sns.histplot(
    data=df,
    x="sepal_length",
    hue="species",
    kde=True
)
plt.title("Distribution of Sepal Length")
plt.xlabel("Sepal Length")
plt.ylabel("Frequency")
plt.show()

# %%
# --------------------------------------------------
# 4. Seaborn - Box Plot
# --------------------------------------------------
plt.figure(figsize=(8, 5))
sns.boxplot(
    data=df,
    x="species",
    y="petal_length"
)
plt.title("Petal Length by Species")
plt.xlabel("Species")
plt.ylabel("Petal Length")
plt.show()

# %%
# --------------------------------------------------
# 5. Seaborn - Pair Plot
# --------------------------------------------------
sns.pairplot(
    df,
    hue="species"
)
plt.show()

# %%
# --------------------------------------------------
# Line Plot with title, axis labels, ticks, tick labels,
# annotations on subplots, saved to a file
# --------------------------------------------------
months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
sales = [120, 150, 180, 160, 220, 250]
expenses = [80, 100, 120, 110, 140, 160]

fig, ax = plt.subplots(2, 1, figsize=(10, 8))

# Subplot 1: Sales
ax[0].plot(
    months,
    sales,
    marker="o",
    linewidth=2,
    label="Sales"
)
ax[0].set_title("Monthly Sales")
ax[0].set_xlabel("Month")
ax[0].set_ylabel("Sales")
ax[0].set_xticks(range(len(months)))
ax[0].set_xticklabels(months)
ax[0].annotate(
    "Highest Sales",
    xy=(5, 250),
    xytext=(3.5, 270),
    arrowprops=dict(arrowstyle="->")
)
ax[0].legend()
ax[0].grid(True)

# Subplot 2: Expenses
ax[1].plot(
    months,
    expenses,
    marker="s",
    linewidth=2,
    label="Expenses"
)
ax[1].set_title("Monthly Expenses")
ax[1].set_xlabel("Month")
ax[1].set_ylabel("Expenses")
ax[1].set_xticks(range(len(months)))
ax[1].set_xticklabels(months)
ax[1].annotate(
    "Highest Expense",
    xy=(5, 160),
    xytext=(3.5, 180),
    arrowprops=dict(arrowstyle="->")
)
ax[1].legend()
ax[1].grid(True)

fig.suptitle("Monthly Sales and Expenses Analysis", fontsize=16)
plt.tight_layout()
plt.savefig("monthly_sales_expenses.png", dpi=300, bbox_inches="tight")
plt.show()

# %%
# --------------------------------------------------
# Bar Plots using Series and DataFrame index
# Grouped bars (side by side) and stacked bars
# --------------------------------------------------
bar_data = {
    "Python": [85, 90, 78, 88],
    "Java": [75, 82, 80, 85],
    "C++": [80, 76, 85, 90]
}
bar_df = pd.DataFrame(
    bar_data,
    index=["Student1", "Student2", "Student3", "Student4"]
)

print("DataFrame:")
print(bar_df)

# Grouped bar plot
bar_df.plot(kind="bar", figsize=(8, 5))
plt.title("Student Marks in Different Programming Languages")
plt.xlabel("Students")
plt.ylabel("Marks")
plt.xticks(rotation=0)
plt.legend(title="Subjects")
plt.tight_layout()
plt.show()

# Stacked bar plot
bar_df.plot(kind="bar", stacked=True, figsize=(8, 5))
plt.title("Stacked Bar Plot of Student Marks")
plt.xlabel("Students")
plt.ylabel("Total Marks")
plt.xticks(rotation=0)
plt.legend(title="Subjects")
plt.tight_layout()
plt.show()

# %%
# --------------------------------------------------
# Histogram and Density Plot
# --------------------------------------------------
marks = pd.DataFrame({
    "Marks": [
        45, 50, 52, 55, 58, 60, 62, 65, 68, 70,
        72, 75, 78, 80, 82, 85, 88, 90, 92, 95
    ]
})

print("Observed Data:")
print(marks)

# Histogram
plt.figure(figsize=(8, 5))
sns.histplot(marks["Marks"], bins=6, kde=False)
plt.title("Histogram of Marks")
plt.xlabel("Marks")
plt.ylabel("Frequency")
plt.tight_layout()
plt.show()

# Density Plot
plt.figure(figsize=(8, 5))
sns.kdeplot(marks["Marks"], fill=True)
plt.title("Density Plot of Marks")
plt.xlabel("Marks")
plt.ylabel("Density")
plt.tight_layout()
plt.show()

# Histogram with density curve
plt.figure(figsize=(8, 5))
sns.histplot(marks["Marks"], bins=6, kde=True)
plt.title("Histogram with Density Curve")
plt.xlabel("Marks")
plt.ylabel("Frequency / Density")
plt.tight_layout()
plt.show()

# %%
# --------------------------------------------------
# Scatter Plot: relationship between two 1-D series
# --------------------------------------------------
study_hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
student_marks = [45, 50, 55, 60, 65, 70, 72, 80, 85, 90]

scatter_df = pd.DataFrame({
    "Study_Hours": study_hours,
    "Marks": student_marks
})

print("Data:")
print(scatter_df)

plt.figure(figsize=(8, 5))
plt.scatter(scatter_df["Study_Hours"], scatter_df["Marks"])
plt.title("Relationship Between Study Hours and Marks")
plt.xlabel("Study Hours")
plt.ylabel("Marks")
plt.grid(True)
plt.tight_layout()
plt.show()

correlation = scatter_df["Study_Hours"].corr(scatter_df["Marks"])
print("\nCorrelation Coefficient:", round(correlation, 2))

# %%
# --------------------------------------------------
# Box Plot: data with many categorical variables
# --------------------------------------------------
box_data = {
    "Department": [
        "CSE", "CSE", "CSE", "CSE", "CSE",
        "ECE", "ECE", "ECE", "ECE", "ECE",
        "EEE", "EEE", "EEE", "EEE", "EEE"
    ],
    "Marks": [
        78, 85, 90, 72, 88,
        65, 70, 82, 75, 80,
        60, 68, 72, 76, 85
    ]
}
box_df = pd.DataFrame(box_data)

print("Data:")
print(box_df)

plt.figure(figsize=(8, 5))
sns.boxplot(
    x="Department",
    y="Marks",
    data=box_df
)
plt.title("Marks Distribution by Department")
plt.xlabel("Department")
plt.ylabel("Marks")
plt.grid(axis="y", linestyle="--", alpha=0.5)
plt.tight_layout()
plt.show()
