# Data Science - 22DS102006
# Experiment 9: Case Study - Customer Personality Analysis

# %%
# --------------------------------------------------
# Example: Customer segmentation on the Mall Customers dataset
# --------------------------------------------------
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans

# Load dataset
url = "https://raw.githubusercontent.com/selva86/datasets/master/Mall_Customers.csv"
df = pd.read_csv(url)

# Select features for clustering
X = df[['Annual Income (k$)', 'Spending Score (1-100)']]

# Apply KMeans clustering
kmeans = KMeans(n_clusters=5, random_state=0)
df['Cluster'] = kmeans.fit_predict(X)

# Plot the clusters
sns.scatterplot(
    data=df,
    x='Annual Income (k$)',
    y='Spending Score (1-100)',
    hue='Cluster',
    palette='tab10'
)
plt.title("Customer Segments")
plt.xlabel("Annual Income (k$)")
plt.ylabel("Spending Score")
plt.show()

# %%
# --------------------------------------------------
# Full customer personality analysis
# --------------------------------------------------
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score

# 1. Load the dataset
df = pd.read_csv("marketing_campaign.csv", sep="\t")

# 2. Select customer features
features = [
    "Income",
    "MntWines",
    "MntFruits",
    "MntMeatProducts",
    "MntFishProducts",
    "MntSweetProducts",
    "MntGoldProds"
]

# 3. Clean the data
data = df[features].copy()
data = data.fillna(data.median())
data = data.clip(
    lower=data.quantile(0.01),
    upper=data.quantile(0.99),
    axis=1
)

# 4. Standardize features
scaler = StandardScaler()
X = scaler.fit_transform(data)

# 5. Find a suitable number of clusters
inertias = []
scores = []

for k in range(2, 8):
    model = KMeans(
        n_clusters=k,
        random_state=42,
        n_init=10
    )
    labels = model.fit_predict(X)
    inertias.append(model.inertia_)
    scores.append(silhouette_score(X, labels))

plt.plot(range(2, 8), inertias, marker="o")
plt.xlabel("Number of Clusters (K)")
plt.ylabel("Inertia")
plt.title("Elbow Method")
plt.show()

print("Silhouette scores:", dict(zip(range(2, 8), scores)))

# 6. Train the final clustering model
best_k = range(2, 8)[scores.index(max(scores))]
kmeans = KMeans(
    n_clusters=best_k,
    random_state=42,
    n_init=10
)
df["Customer_Segment"] = kmeans.fit_predict(X)

# 7. Analyze each customer segment
summary = df.groupby("Customer_Segment")[features].mean().round(2)

print("\nCustomer Segment Summary:")
print(summary)

# 8. Visualize the segments
sns.scatterplot(
    data=df,
    x="Income",
    y="MntWines",
    hue="Customer_Segment",
    palette="Set2"
)
plt.title("Customer Segments by Income and Wine Spending")
plt.show()

# 9. Save the results
df.to_csv("customer_segments.csv", index=False)
summary.to_csv("segment_summary.csv")
