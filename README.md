# 🎓 MBU DS Lab Portal — Data Science Laboratory System

A clean, modern, professional, and professor-friendly **Data Science Laboratory Portal** built for Mohan Babu University (MBU), School of Computing.

This portal enables Data Science students to execute, document, track, and upload verified PDF/image execution reports for laboratory experiments, with persistent client-side database storage and faculty review capabilities.

---

## 📌 Student & Academic Credentials

| Detail | Information |
| :--- | :--- |
| **Student Name** | Bhavya Potnuru |
| **Roll Number** | `24102A030098` |
| **Section** | Section 2 |
| **Program & Branch** | B.Tech – Data Science |
| **Academic Year** | 3rd Year |
| **University** | Mohan Babu University (MBU), Tirupati |
| **Faculty In-Charge** | Bosubabu Sir (Assistant Professor) |
| **GitHub Profile** | [https://github.com/bhavyapotnuru-999](https://github.com/bhavyapotnuru-999) |
| **LinkedIn Profile** | [https://www.linkedin.com/in/bhavya-potnuru/](https://www.linkedin.com/in/bhavya-potnuru/) |

---

## 🔬 Syllabus Experiments (10 Experiments)

The portal structures and tracks exactly 10 university syllabus experiments:

1. **Experiment 1:** NumPy Array Manipulation and Vectorized Operations
   * *Tools:* Python, NumPy, Jupyter Notebook
   * *Aim:* N-dimensional array architectures, slicing, broadcasting, and performance benchmarking.
2. **Experiment 2:** Data Wrangling, Cleaning, and Aggregation using Pandas
   * *Tools:* Python, Pandas, CSV / OpenPyXL
   * *Aim:* Handling null values, group-by multi-index aggregations, and schema transformations.
3. **Experiment 3:** Exploratory Data Analysis & Statistical Visualizations with Matplotlib
   * *Tools:* Python, Matplotlib, Seaborn
   * *Aim:* Univariate and bivariate distributions, boxplots, correlation heatmaps, and outlier detection.
4. **Experiment 4:** Feature Engineering, Encoding, and Normalization
   * *Tools:* Python, Scikit-learn (`sklearn.preprocessing`), Pandas
   * *Aim:* StandardScaler, MinMaxScaler, One-Hot Encoding, and categorical standardization.
5. **Experiment 5:** Supervised Learning: Linear and Polynomial Regression
   * *Tools:* Python, Scikit-learn (`LinearRegression`), `sklearn.metrics`
   * *Aim:* Ordinary least squares regression, polynomial curve fitting, and $R^2$ / MSE scoring.
6. **Experiment 6:** Classification using Logistic Regression and Decision Trees
   * *Tools:* Python, Scikit-learn (`DecisionTreeClassifier`), Graphviz
   * *Aim:* Supervised discrete classification, decision boundary visualization, and tree pruning.
7. **Experiment 7:** Model Evaluation: ROC-AUC, Confusion Matrix & K-Fold Cross-Validation
   * *Tools:* Python, Scikit-learn (`model_selection`, `metrics`), Matplotlib
   * *Aim:* Diagnostic assessment across threshold cutoffs, stratified 5-fold cross-validation, and sensitivity analysis.
8. **Experiment 8:** Unsupervised Learning: K-Means Clustering & Elbow Method
   * *Tools:* Python, Scikit-learn (`KMeans`), Yellowbrick / Matplotlib
   * *Aim:* Partitioning multi-dimensional spaces, WCSS inertia curves, and silhouette coefficient analysis.
9. **Experiment 9:** Dimensionality Reduction using Principal Component Analysis (PCA)
   * *Tools:* Python, Scikit-learn (`PCA`), NumPy
   * *Aim:* Eigenvector decomposition, variance ratio scree plots, and feature space reduction.
10. **Experiment 10:** End-to-End ML Pipeline and Model Serialization
    * *Tools:* Python, Scikit-learn (`Pipeline`, `ColumnTransformer`), Joblib
    * *Aim:* Reproducible machine learning workflows and production model artifact serialization.

---

## ✨ Key Capabilities & Features

* **University Branding & Header:**
  * Top navigation with `MBU Logo | DS Lab Portal`.
  * Preserved aspect-ratio university emblem with mobile-responsive menu.
  * Direct tab routing: **Home**, **Lab Executions**, **Tools**, and **Profile**.
* **PDF & File Upload Workflow:**
  * Dedicated **Upload PDF / Output** button for each experiment.
  * Supports PDF documents, PNG, JPG/JPEG up to 25MB.
  * File validation, size checks, and instant preview generation.
* **Document & Image Previews:**
  * Inline cards displaying filename, file size, upload timestamp, and format badge.
  * Full-screen preview modal with PDF viewer, download button, and external tab viewer.
  * One-click **Replace Output** workflow that replaces existing database records without duplicates.
* **Persistent Database Storage (IndexedDB):**
  * Persistent client-side database using HTML5 IndexedDB (`MBU_DS_Lab_Portal_DB`).
  * All profile changes, experiment statuses, and uploaded binary files survive page reloads, browser restarts, and logout/login cycles.
* **Dynamic Lab Progress:**
  * Real-time counter: `Completed: X / 10 Experiments` with visual progress bar.
  * Automatically recalculates whenever outputs are uploaded or statuses change.
* **Editable Student Profile:**
  * Inline and modal profile editor for academic credentials, contact links, and interactive technical skills tag manager.
  * Profile photo upload and database persistence.
* **Experiment Tools Catalog:**
  * Dedicated reference page displaying libraries, languages, and environments used with professor-friendly explanations.

---

## 🛠️ Tech Stack & Architecture

* **Frontend:** React 19, TypeScript, Tailwind CSS v4
* **Build Tool:** Vite
* **UI Icons:** Lucide React
* **Persistence Layer:** HTML5 IndexedDB Object Stores (`profiles`, `experiments`, `outputs`, `tools`)
* **Styling:** Tailwind CSS with responsive layout

---

## 📁 Project Structure

```text
├── index.html                  # HTML entry point with MBU metadata
├── metadata.json               # AI Studio applet configuration
├── package.json                # Project dependencies & scripts
├── public/
│   └── mbu-logo.svg            # Mohan Babu University emblem
├── src/
│   ├── main.tsx                # React DOM root mounting
│   ├── App.tsx                 # Root application controller & session bar
│   ├── index.css               # Tailwind CSS entry point
│   ├── types/
│   │   └── index.ts            # TypeScript definitions (Profile, Experiment, Output, Tool)
│   ├── services/
│   │   └── db.ts               # IndexedDB database service layer & persistence
│   ├── data/
│   │   └── defaultData.ts      # Syllabus experiments, tools catalog, default profile
│   ├── components/
│   │   ├── Header.tsx          # University header with navigation & status badge
│   │   ├── Footer.tsx          # Fair use attribution footer
│   │   ├── MBULogo.tsx         # University emblem component with aspect ratio protection
│   │   ├── ExperimentCard.tsx  # Experiment card with status selector and file preview
│   │   ├── FileUploadModal.tsx # PDF / image upload & replace modal
│   │   ├── PDFViewerModal.tsx  # Document previewer with download & external view
│   │   ├── EditProfileModal.tsx# Student credentials & skills tag editor
│   │   └── Toast.tsx           # Feedback notification system
│   └── pages/
│       ├── HomePage.tsx        # Academic welcome page & feature overview
│       ├── LabExecutionsPage.tsx# 10 Experiments view with filters & search
│       ├── ToolsPage.tsx       # Structured tool catalog page
│       └── ProfilePage.tsx     # Student profile & dynamic progress indicator
└── tsconfig.json               # TypeScript configuration
```

---

## 🚀 Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/bhavyapotnuru-999/ds-lab-portal.git
cd ds-lab-portal
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```
Open `http://localhost:3000` in your web browser.

### 4. Build for production
```bash
npm run build
```

---

## ⚖️ Attribution & Fair Use

**By [https://www.mbu.asia](https://www.mbu.asia), Fair use**

*Mohan Babu University — School of Computing, Department of Data Science.*  
*Academic laboratory tracking portal created for student experiment documentation.*

