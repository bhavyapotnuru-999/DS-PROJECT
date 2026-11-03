# Data Science - 22DS102006
# Experiment 10: Case Study - Text Emotion Detection with Emoji Prediction

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report

# 1. Sample labeled dataset
data = {
    "text": [
        "I am very happy today",
        "This is a wonderful day",
        "I feel cheerful and excited",
        "I am sad and lonely",
        "I feel very disappointed",
        "I miss my family so much",
        "I am angry with you",
        "This makes me furious",
        "I hate this situation",
        "I am scared of the dark",
        "I am afraid of losing",
        "I feel nervous and frightened",
        "I love you so much",
        "You mean everything to me",
        "I adore spending time with you",
        "Wow this is unbelievable",
        "I did not expect this surprise",
        "What an amazing unexpected gift"
    ],
    "emotion": [
        "happy", "happy", "happy",
        "sadness", "sadness", "sadness",
        "anger", "anger", "anger",
        "fear", "fear", "fear",
        "love", "love", "love",
        "surprise", "surprise", "surprise"
    ]
}

df = pd.DataFrame(data)

# 2. Split the dataset
X_train, X_test, y_train, y_test = train_test_split(
    df["text"],
    df["emotion"],
    test_size=0.33,
    random_state=42,
    stratify=df["emotion"]
)

# 3. Build the machine learning pipeline
model = Pipeline([
    ("tfidf", TfidfVectorizer(ngram_range=(1, 2))),
    ("classifier", LogisticRegression(max_iter=1000))
])

# %%
# 4. Train the model
model.fit(X_train, y_train)

# 5. Evaluate the model
predictions = model.predict(X_test)

print("Test Accuracy:",
      round(accuracy_score(y_test, predictions) * 100, 2), "%")

print("\nClassification Report:")
print(classification_report(
    y_test, predictions, zero_division=0
))

# %%
# 6. Map emotions to emojis
emoji_map = {
    "happy": "😊",
    "sadness": "😢",
    "anger": "😠",
    "fear": "😨",
    "love": "❤",
    "surprise": "😲"
}

# 7. Predict emotion for new text
def detect_emotion(text):
    emotion = model.predict([text])[0]
    emoji = emoji_map[emotion]
    print("Input Text:", text)
    print("Detected Emotion:", emotion)
    print("Relevant Emoji:", emoji)

# 8. Test the application
detect_emotion("I am happy to see you")
detect_emotion("I feel lonely today")
detect_emotion("I love my family")
