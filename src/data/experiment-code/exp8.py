# Data Science - 22DS102006
# Experiment 8: Web Scraping using Beautiful Soup and Analysis of Product Reviews

# %%
# --------------------------------------------------
# Experiment 1: Web Scraping Using Beautiful Soup
# --------------------------------------------------
from bs4 import BeautifulSoup
import pandas as pd

# Read the permitted, locally saved HTML file
with open("reviews.html", "r", encoding="utf-8") as file:
    html_content = file.read()

soup = BeautifulSoup(html_content, "html.parser")

# Update these selectors to match the source HTML
review_blocks = soup.select(".review")
records = []

for block in review_blocks:
    review_element = block.select_one(".review-text")
    rating_element = block.select_one(".rating")
    title_element = block.select_one(".review-title")

    review_text = (
        review_element.get_text(" ", strip=True)
        if review_element else ""
    )
    rating_text = (
        rating_element.get_text(" ", strip=True)
        if rating_element else ""
    )
    title = (
        title_element.get_text(" ", strip=True)
        if title_element else ""
    )

    if review_text:
        records.append({
            "title": title,
            "review": review_text,
            "rating": rating_text
        })

df = pd.DataFrame(records)
df.to_csv("product_reviews.csv", index=False, encoding="utf-8-sig")

print(df.head())
print("Total reviews extracted:", len(df))
print("Saved to product_reviews.csv")

# %%
# --------------------------------------------------
# Experiment 2: EDA and WordCloud Generation
# --------------------------------------------------
import matplotlib.pyplot as plt
from wordcloud import WordCloud
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

# Load extracted reviews
df = pd.read_csv("product_reviews.csv")
df["review"] = df["review"].fillna("").astype(str)

# Initialize sentiment analyzer
analyzer = SentimentIntensityAnalyzer()

def classify_sentiment(text):
    score = analyzer.polarity_scores(text)["compound"]
    if score >= 0.05:
        return "Positive"
    elif score <= -0.05:
        return "Negative"
    return "Neutral"

df["sentiment"] = df["review"].apply(classify_sentiment)

def generate_wordcloud(text, title, filename):
    if not text.strip():
        print(f"No text available for: {title}")
        return

    cloud = WordCloud(
        width=1200,
        height=600,
        background_color="white",
        max_words=150,
        collocations=False
    ).generate(text)

    plt.figure(figsize=(12, 6))
    plt.imshow(cloud, interpolation="bilinear")
    plt.axis("off")
    plt.title(title)
    plt.tight_layout()
    plt.savefig(filename, dpi=300, bbox_inches="tight")
    plt.show()

# All reviews
all_text = " ".join(df["review"])
generate_wordcloud(
    all_text, "WordCloud - All Reviews", "wordcloud_all.png"
)

# Positive reviews
positive_text = " ".join(
    df.loc[df["sentiment"] == "Positive", "review"]
)
generate_wordcloud(
    positive_text, "WordCloud - Positive Reviews", "wordcloud_positive.png"
)

# Negative reviews
negative_text = " ".join(
    df.loc[df["sentiment"] == "Negative", "review"]
)
generate_wordcloud(
    negative_text, "WordCloud - Negative Reviews", "wordcloud_negative.png"
)

df.to_csv("product_reviews_analyzed.csv", index=False)
print(df["sentiment"].value_counts())
print("WordCloud images saved successfully.")

# %%
# --------------------------------------------------
# Experiment 3: Stopwords, Numerics, Word Count,
# Character Count and Average Word Length
# --------------------------------------------------
import re
import nltk
import seaborn as sns
from nltk.corpus import stopwords
from collections import Counter

nltk.download("stopwords", quiet=True)

df = pd.read_csv("product_reviews.csv")
df["review"] = df["review"].fillna("").astype(str)

stop_words = set(stopwords.words("english"))

def analyze_review(text):
    tokens = re.findall(r"\b[\w']+\b", text.lower())
    words = re.findall(r"\b[A-Za-z]+\b", text)
    numeric_tokens = re.findall(r"\b\d+(?:\.\d+)?\b", text)
    stopword_tokens = [
        token for token in tokens if token in stop_words
    ]

    return pd.Series({
        "word_count": len(tokens),
        "character_count": len(text),
        "numeric_count": len(numeric_tokens),
        "stopword_count": len(stopword_tokens),
        "average_word_length": (
            sum(len(word) for word in words) / len(words)
            if words else 0
        )
    })

statistics = df["review"].apply(analyze_review)
df = pd.concat([df, statistics], axis=1)

# Save calculated statistics
df.to_csv("review_statistics.csv", index=False)

# Plot distributions
columns = [
    ("stopword_count", "Stopword Count"),
    ("numeric_count", "Numeric Token Count"),
    ("word_count", "Word Count"),
    ("character_count", "Character Count"),
    ("average_word_length", "Average Word Length")
]

fig, axes = plt.subplots(3, 2, figsize=(14, 15))
axes = axes.flatten()

for i, (column, title) in enumerate(columns):
    sns.histplot(
        data=df, x=column, kde=True,
        ax=axes[i], bins=20
    )
    axes[i].set_title(title)
    axes[i].set_xlabel(title)
    axes[i].set_ylabel("Number of Reviews")

axes[-1].axis("off")
plt.tight_layout()
plt.savefig("review_statistics_distributions.png", dpi=300)
plt.show()

# Most common stopwords
all_tokens = re.findall(
    r"\b[\w']+\b",
    " ".join(df["review"]).lower()
)

stopword_frequency = Counter(
    token for token in all_tokens if token in stop_words
)

print("Top 10 stopwords:")
print(stopword_frequency.most_common(10))

print("\nDescriptive statistics:")
print(df[[
    "stopword_count",
    "numeric_count",
    "word_count",
    "character_count",
    "average_word_length"
]].describe())

# %%
# --------------------------------------------------
# Experiment 4: Sentiment Analysis Using NLTK and VADER
# --------------------------------------------------
from nltk.sentiment.vader import SentimentIntensityAnalyzer as NLTKVADER
from vaderSentiment.vaderSentiment import (
    SentimentIntensityAnalyzer as StandaloneVADER
)

# Download VADER lexicon for NLTK
nltk.download("vader_lexicon", quiet=True)

df = pd.read_csv("product_reviews.csv")
df["review"] = df["review"].fillna("").astype(str)

# Initialize both implementations
nltk_analyzer = NLTKVADER()
vader_analyzer = StandaloneVADER()

def classify(score):
    if score >= 0.05:
        return "Positive"
    elif score <= -0.05:
        return "Negative"
    return "Neutral"

# NLTK VADER scores
nltk_scores = df["review"].apply(nltk_analyzer.polarity_scores)
df["nltk_positive"] = nltk_scores.apply(lambda x: x["pos"])
df["nltk_negative"] = nltk_scores.apply(lambda x: x["neg"])
df["nltk_neutral"] = nltk_scores.apply(lambda x: x["neu"])
df["nltk_compound"] = nltk_scores.apply(lambda x: x["compound"])

# Standalone VADER scores
vader_scores = df["review"].apply(vader_analyzer.polarity_scores)
df["vader_positive"] = vader_scores.apply(lambda x: x["pos"])
df["vader_negative"] = vader_scores.apply(lambda x: x["neg"])
df["vader_neutral"] = vader_scores.apply(lambda x: x["neu"])
df["vader_compound"] = vader_scores.apply(lambda x: x["compound"])

df["nltk_sentiment"] = df["nltk_compound"].apply(classify)
df["vader_sentiment"] = df["vader_compound"].apply(classify)

# Display sample results
print(df[[
    "review",
    "nltk_compound",
    "nltk_sentiment",
    "vader_compound",
    "vader_sentiment"
]].head(10).to_string(index=False))

# Count sentiment categories
print("\nNLTK sentiment distribution:")
print(df["nltk_sentiment"].value_counts())

print("\nStandalone VADER sentiment distribution:")
print(df["vader_sentiment"].value_counts())

# Save output
df.to_csv("sentiment_analysis_results.csv", index=False)
print("\nResults saved to sentiment_analysis_results.csv")

# %%
# --------------------------------------------------
# Experiment 5: Scatter Intensity Plot of Sentiments
# --------------------------------------------------
df = pd.read_csv("sentiment_analysis_results.csv")

# Ensure valid compound scores
df["vader_compound"] = pd.to_numeric(
    df["vader_compound"], errors="coerce"
)
df = df.dropna(subset=["vader_compound"]).reset_index(drop=True)

# Assign review indices
df["review_index"] = range(1, len(df) + 1)

# Set consistent sentiment colors
palette = {
    "Positive": "green",
    "Negative": "red",
    "Neutral": "gray"
}

plt.figure(figsize=(14, 7))
sns.scatterplot(
    data=df,
    x="review_index",
    y="vader_compound",
    hue="vader_sentiment",
    palette=palette,
    s=70,
    alpha=0.8
)

# Sentiment classification thresholds
plt.axhline(
    y=0.05, color="green", linestyle="--",
    label="Positive threshold"
)
plt.axhline(
    y=-0.05, color="red", linestyle="--",
    label="Negative threshold"
)
plt.axhline(
    y=0, color="black", linestyle=":",
    label="Neutral reference"
)

plt.ylim(-1.05, 1.05)
plt.xlabel("Review Index")
plt.ylabel("VADER Compound Sentiment Score")
plt.title("Sentiment Intensity of Product Reviews")
plt.legend(loc="best")
plt.grid(alpha=0.25)
plt.tight_layout()
plt.savefig("sentiment_intensity_scatter.png", dpi=300)
plt.show()
print("Scatter intensity plot saved successfully.")
