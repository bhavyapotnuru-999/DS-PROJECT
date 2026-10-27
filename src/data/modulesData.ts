import { TextbookModule } from '../types';

export const INITIAL_MODULES: TextbookModule[] = [
  {
    id: 'mod-1',
    module_number: 1,
    title: 'Foundations of NumPy & Vector Computation',
    subtitle: 'N-Dimensional Array Mechanics, Memory Layouts & Vectorized Pipelines',
    author: 'Mohan Babu University • Department of Data Science',
    edition: 'Academic Edition 2026',
    cover_gradient: 'from-blue-900 via-indigo-950 to-slate-900',
    cover_accent: '#38bdf8',
    description: 'Master core multidimensional array structures, contiguous memory blocks, broadcasting mechanics, boolean masking, and vectorized matrix linear algebra.',
    estimated_read_time: '45 mins',
    linked_experiment_number: 1,
    progress_percent: 100,
    is_completed: true,
    uploaded_file_name: 'MBU_DS_Module1_NumPy_Notes.pdf',
    uploaded_file_type: 'application/pdf',
    uploaded_file_size: 245760,
    uploaded_at: '2026-10-15T10:30:00.000Z',
    chapters: [
      {
        id: 'mod-1-ch-1',
        chapter_number: 1,
        title: 'Understanding ndarray Architecture & Memory Strides',
        subheadings: ['Contiguous Buffer Layout', 'Data Types & Memory Optimization', 'Strides & Pointer Offsets'],
        reading_time_mins: 15,
        definition: {
          term: 'NumPy ndarray',
          explanation: 'A homogeneous, multidimensional container of items of the same type and size, stored contiguously in memory with metadata defining its shape and strides.',
        },
        content_markdown: `In data science and high-performance computing, standard Python lists introduce severe overhead due to pointer indirection, dynamic typing, and fragmented heap memory.

NumPy overcomes this by storing array elements in contiguous raw memory blocks called buffers. Each array is accompanied by an array descriptor specifying:
1. **Data Pointer**: Memory address of the first item in the buffer.
2. **dtype**: Fixed-size representation (e.g. \`float64\`, \`int32\`).
3. **Shape**: Tuple defining dimensions (e.g. \`(1000, 20)\`).
4. **Strides**: Step sizes in bytes required to advance to the next element across each axis.`,
        code_snippets: [
          {
            title: 'Inspecting Memory Strides and Creation',
            language: 'python',
            code: `import numpy as np

# Creating 2D array of 64-bit floating point numbers
arr = np.array([[10.5, 20.2, 30.8],
                [40.1, 50.9, 60.3]], dtype=np.float64)

print("Array Shape:", arr.shape)
print("Data Type:", arr.dtype)
print("Item Size in Bytes:", arr.itemsize)
print("Strides (Bytes to advance row, col):", arr.strides)`,
            output: `Array Shape: (2, 3)
Data Type: float64
Item Size in Bytes: 8
Strides (Bytes to advance row, col): (24, 8)`,
          },
        ],
        diagram_svg: `<svg viewBox="0 0 600 160" width="100%" height="160" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="160" fill="#0f172a" rx="8"/>
  <text x="20" y="30" fill="#38bdf8" font-size="13" font-family="monospace" font-weight="bold">Memory Layout: C-Contiguous Buffer (Row-Major)</text>
  <g transform="translate(20, 50)">
    <rect x="0" y="0" width="85" height="50" fill="#1e293b" stroke="#38bdf8" stroke-width="2" rx="4"/>
    <text x="42" y="25" fill="#f8fafc" font-size="12" text-anchor="middle" font-family="monospace">[0, 0]: 10.5</text>
    <text x="42" y="42" fill="#94a3b8" font-size="9" text-anchor="middle">Offset: 0B</text>
    
    <rect x="95" y="0" width="85" height="50" fill="#1e293b" stroke="#38bdf8" stroke-width="2" rx="4"/>
    <text x="137" y="25" fill="#f8fafc" font-size="12" text-anchor="middle" font-family="monospace">[0, 1]: 20.2</text>
    <text x="137" y="42" fill="#94a3b8" font-size="9" text-anchor="middle">Offset: 8B</text>
    
    <rect x="190" y="0" width="85" height="50" fill="#1e293b" stroke="#38bdf8" stroke-width="2" rx="4"/>
    <text x="232" y="25" fill="#f8fafc" font-size="12" text-anchor="middle" font-family="monospace">[0, 2]: 30.8</text>
    <text x="232" y="42" fill="#94a3b8" font-size="9" text-anchor="middle">Offset: 16B</text>
    
    <rect x="285" y="0" width="85" height="50" fill="#1e293b" stroke="#10b981" stroke-width="2" rx="4"/>
    <text x="327" y="25" fill="#f8fafc" font-size="12" text-anchor="middle" font-family="monospace">[1, 0]: 40.1</text>
    <text x="327" y="42" fill="#10b981" font-size="9" text-anchor="middle">Offset: 24B</text>

    <rect x="380" y="0" width="85" height="50" fill="#1e293b" stroke="#10b981" stroke-width="2" rx="4"/>
    <text x="422" y="25" fill="#f8fafc" font-size="12" text-anchor="middle" font-family="monospace">[1, 1]: 50.9</text>
    <text x="422" y="42" fill="#10b981" font-size="9" text-anchor="middle">Offset: 32B</text>

    <rect x="475" y="0" width="85" height="50" fill="#1e293b" stroke="#10b981" stroke-width="2" rx="4"/>
    <text x="517" y="25" fill="#f8fafc" font-size="12" text-anchor="middle" font-family="monospace">[1, 2]: 60.3</text>
    <text x="517" y="42" fill="#10b981" font-size="9" text-anchor="middle">Offset: 40B</text>
  </g>
  <text x="20" y="130" fill="#94a3b8" font-size="11">Row Stride: 24 Bytes | Column Stride: 8 Bytes | Fast cache retrieval</text>
</svg>`,
        summary_bullets: [
          'NumPy arrays achieve extreme speed by storing contiguous memory buffers without Python pointer overhead.',
          'Array views share the same underlying memory buffer without duplicating data.',
          'Strides dictate how many bytes the pointer advances to jump rows or columns.',
        ],
        practice_questions: [
          {
            id: 'q-1-1',
            question: 'What is the memory stride along axis 0 for an array of shape (50, 10) with dtype float64 in C-order?',
            answer: '80 bytes',
            explanation: 'Each float64 item occupies 8 bytes. With 10 columns per row, advancing one row requires 10 * 8 = 80 bytes.',
          },
          {
            id: 'q-1-2',
            question: 'Does slicing an array (arr[1:5, :]) copy data or create a view?',
            answer: 'It creates a view.',
            explanation: 'Basic slicing in NumPy creates a view sharing the same data buffer, adjusting only shape and strides.',
          },
        ],
      },
      {
        id: 'mod-1-ch-2',
        chapter_number: 2,
        title: 'Broadcasting Rules & Vectorized Speedup',
        subheadings: ['The Two Broadcasting Commandments', 'Performance Benchmarking vs Loops', 'Boolean Indexing & Masking'],
        reading_time_mins: 15,
        definition: {
          term: 'Vectorization & Broadcasting',
          explanation: 'Broadcasting describes how NumPy treats arrays with different shapes during arithmetic operations without creating unnecessary copies of data.',
        },
        content_markdown: `Vectorization replaces explicit Python for-loops with compiled C-level SIMD (Single Instruction Multiple Data) machine operations.

**The Two Broadcasting Rules**:
1. If two arrays have a different number of dimensions, prepend 1s to the shape of the smaller array.
2. Two dimensions are compatible when:
   - They are equal, OR
   - One of them is 1.`,
        code_snippets: [
          {
            title: 'Broadcasting Example and Speedup Comparison',
            language: 'python',
            code: `import numpy as np
import time

# Matrix (10000, 3) + Bias Vector (3,)
matrix = np.random.randn(10000, 3)
bias = np.array([10.0, 20.0, 30.0])

# Vectorized broadcasting (Runs at compiled C-speed)
t0 = time.perf_counter()
res_vectorized = matrix + bias
t_vec = time.perf_counter() - t0

print(f"Vectorized shape: {res_vectorized.shape}")
print(f"Execution time: {t_vec * 1000:.3f} ms")`,
            output: `Vectorized shape: (10000, 3)
Execution time: 0.124 ms`,
          },
        ],
        summary_bullets: [
          'Broadcasting eliminates memory allocation overhead for virtual axis repetitions.',
          'Always prefer vectorized expressions over Python iteration loops for array computation.',
          'Boolean indexing allows zero-copy logical element filtering.',
        ],
        practice_questions: [
          {
            id: 'q-1-3',
            question: 'Can an array of shape (4, 1, 8) be broadcast with an array of shape (2, 8)?',
            answer: 'Yes, yielding shape (4, 2, 8).',
            explanation: 'Prepend 1 to the second shape -> (1, 2, 8). Comparing with (4, 1, 8): dim 0 (4, 1 -> 4), dim 1 (1, 2 -> 2), dim 2 (8, 8 -> 8). Both dimensions are compatible.',
          },
        ],
      },
    ],
  },
  {
    id: 'mod-2',
    module_number: 2,
    title: 'Data Wrangling & Analysis with Pandas',
    subtitle: 'High-Performance Series, DataFrames, Null Handling & GroupBy Engines',
    author: 'Mohan Babu University • Department of Data Science',
    edition: 'Academic Edition 2026',
    cover_gradient: 'from-emerald-900 via-teal-950 to-slate-900',
    cover_accent: '#34d399',
    description: 'Master tabular dataset processing, relational merges, multi-index aggregation, missing value strategies, and memory-efficient data transformations.',
    estimated_read_time: '50 mins',
    linked_experiment_number: 2,
    progress_percent: 100,
    is_completed: true,
    uploaded_file_name: 'MBU_DS_Module2_Pandas_Notes.pdf',
    uploaded_file_type: 'application/pdf',
    uploaded_file_size: 184320,
    uploaded_at: '2026-10-18T14:15:00.000Z',
    chapters: [
      {
        id: 'mod-2-ch-1',
        chapter_number: 1,
        title: 'Core Structures: Series, DataFrames & Memory Management',
        subheadings: ['Underlying Columnar Blocks', 'Index Alignment Principles', 'Categorical Dtypes for 80% RAM Reduction'],
        reading_time_mins: 15,
        definition: {
          term: 'Pandas DataFrame',
          explanation: 'A two-dimensional, size-mutable, tabular data structure with labelled axes (rows and columns) backed by columnar BlockManager architecture.',
        },
        content_markdown: `A Pandas DataFrame is organized as a collection of columns, each having a designated homogeneous dtype. This columnar organization makes mathematical operations and column filtering cache-friendly.

When processing large observational datasets, using standard \`object\` strings consumes immense RAM. Converting repeated string columns to \`category\` dtypes compresses strings into integer lookup codes.`,
        code_snippets: [
          {
            title: 'Memory Optimization with Categoricals',
            language: 'python',
            code: `import pandas as pd

df = pd.DataFrame({
    'Student_ID': ['24102A030098', '24102A030099', '24102A030100'] * 1000,
    'Branch': ['B.Tech DS', 'B.Tech AI', 'B.Tech CS'] * 1000,
    'Score': [94.5, 88.0, 91.2] * 1000
})

print("RAM with object string:", df.memory_usage(deep=True).sum(), "bytes")
df['Branch'] = df['Branch'].astype('category')
print("RAM after categorical:", df.memory_usage(deep=True).sum(), "bytes")`,
            output: `RAM with object string: 240128 bytes
RAM after categorical: 51240 bytes (78.6% RAM saved)`,
          },
        ],
        summary_bullets: [
          'Columnar block storage delivers optimal vectorized performance across features.',
          'Categorical data types drastically reduce memory footprint on repetitive string data.',
          'Automatic index alignment prevents silent row-mismatch corruption during calculations.',
        ],
        practice_questions: [
          {
            id: 'q-2-1',
            question: 'What is the primary difference between df.loc and df.iloc?',
            answer: 'loc uses labels/names, while iloc uses integer 0-based index positions.',
            explanation: 'loc is label-based indexing including the endpoint; iloc is pure integer position-based excluding the stop index.',
          },
        ],
      },
      {
        id: 'mod-2-ch-2',
        chapter_number: 2,
        title: 'Split-Apply-Combine Engine & Imputation Strategies',
        subheadings: ['Multi-Index Aggregations', 'Detecting & Imputing Missing Values', 'Transform vs Aggregate'],
        reading_time_mins: 15,
        definition: {
          term: 'Split-Apply-Combine',
          explanation: 'The analytical paradigm where data is partitioned into groups based on keys, a function is applied to each chunk independently, and results are recombined into a summary structure.',
        },
        content_markdown: `Real-world data is inherently messy. Handling missing data (\`NaN\`) requires deliberate strategy:
- **MCAR (Missing Completely at Random)**: Can often drop rows or use median/mean imputation.
- **MAR (Missing at Random)**: Use conditional group median imputation.
- **MNAR (Missing Not at Random)**: Preserve missingness indicator feature.`,
        code_snippets: [
          {
            title: 'Advanced GroupBy Aggregation & Missing Imputation',
            language: 'python',
            code: `import pandas as pd

# Group-by aggregation with multiple statistics
summary = df.groupby('Branch')['Score'].agg(['mean', 'median', 'std', 'count'])
print(summary)`,
            output: `           mean  median       std  count
Branch                                  
B.Tech AI  88.0    88.0  0.000000   1000
B.Tech CS  91.2    91.2  0.000000   1000
B.Tech DS  94.5    94.5  0.000000   1000`,
          },
        ],
        summary_bullets: [
          'Group-by split-apply-combine pipelines enable multidimensional slice summarization.',
          'Transform returns arrays aligned with the original DataFrame index, ideal for normalization.',
          'Missing data must be verified before modeling to prevent downstream pipeline errors.',
        ],
        practice_questions: [
          {
            id: 'q-2-2',
            question: 'When should median imputation be preferred over mean imputation?',
            answer: 'When the feature distribution is skewed or contains outliers.',
            explanation: 'The mean is sensitive to extreme values, whereas the median is robust against skew and outliers.',
          },
        ],
      },
    ],
  },
  {
    id: 'mod-3',
    module_number: 3,
    title: 'Statistical Visualizations & Exploratory Data Analysis',
    subtitle: 'Publication-Quality Graphics with Matplotlib & Seaborn',
    author: 'Mohan Babu University • Department of Data Science',
    edition: 'Academic Edition 2026',
    cover_gradient: 'from-amber-900 via-orange-950 to-slate-900',
    cover_accent: '#fb923c',
    description: 'Learn the Grammar of Graphics, Matplotlib Object-Oriented APIs, multivariate correlations, boxplot IQR outlier diagnosis, and publication-ready formatting.',
    estimated_read_time: '40 mins',
    linked_experiment_number: 3,
    progress_percent: 100,
    is_completed: true,
    uploaded_file_name: 'MBU_DS_Module3_Data_Visualization.pdf',
    uploaded_file_type: 'application/pdf',
    uploaded_file_size: 312000,
    uploaded_at: '2026-10-21T11:00:00.000Z',
    chapters: [
      {
        id: 'mod-3-ch-1',
        chapter_number: 1,
        title: 'The Matplotlib Object-Oriented Figure/Axes Paradigm',
        subheadings: ['Figure vs Axes Architecture', 'Bivariate & Multivariate Plotting', 'Customizing Scientific Styling'],
        reading_time_mins: 20,
        definition: {
          term: 'Axes Object',
          explanation: 'The region of the image with the data space where plotting takes place, containing axis tick marks, labels, and plot elements.',
        },
        content_markdown: `In professional scientific software, avoid the state-machine \`plt.plot()\` syntax. Instead, instantiate explicit Figure and Axes objects: \`fig, ax = plt.subplots()\`.

This approach gives total programmatic control over subplots, secondary twin axes, legends, and DPI export settings.`,
        code_snippets: [
          {
            title: 'Scientific Figure with Subplots and Confidence Bands',
            language: 'python',
            code: `import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4), dpi=150)

# Distribution plot
sns.histplot(np.random.normal(75, 10, 500), kde=True, ax=ax1, color='#0284c7')
ax1.set_title("Student Score Distribution (N=500)", fontsize=11, fontweight='bold')
ax1.set_xlabel("Exam Score")

# Correlation Heatmap
sns.heatmap(np.corrcoef(np.random.randn(4, 50)), annot=True, cmap='Blues', ax=ax2)
ax2.set_title("Pearson Correlation Matrix", fontsize=11, fontweight='bold')

plt.tight_layout()`,
            output: `Figures generated successfully with high-resolution layout.`,
          },
        ],
        summary_bullets: [
          'Always use the Object-Oriented API (fig, ax) for reproducible multi-panel figures.',
          'Seaborn provides high-level statistical summaries with integrated confidence intervals.',
          'Correlation heatmaps provide rapid visual screening of collinear feature pairs.',
        ],
        practice_questions: [
          {
            id: 'q-3-1',
            question: 'What IQR multiplier is traditionally used in Tukey boxplots to demarcate outliers?',
            answer: '1.5 times the Interquartile Range (IQR = Q3 - Q1).',
            explanation: 'Points falling below Q1 - 1.5*IQR or above Q3 + 1.5*IQR are flagged as potential outliers.',
          },
        ],
      },
    ],
  },
  {
    id: 'mod-4',
    module_number: 4,
    title: 'Feature Engineering, Encoding & Scaling',
    subtitle: 'Standardization, Normalization, Categorical One-Hot & Target Encoding',
    author: 'Mohan Babu University • Department of Data Science',
    edition: 'Academic Edition 2026',
    cover_gradient: 'from-purple-900 via-indigo-950 to-slate-900',
    cover_accent: '#c084fc',
    description: 'Transform raw observations into mathematically sound feature spaces using StandardScaler, MinMaxScaler, RobustScaler, and categorical encoders without data leakage.',
    estimated_read_time: '45 mins',
    linked_experiment_number: 4,
    progress_percent: 100,
    is_completed: true,
    chapters: [
      {
        id: 'mod-4-ch-1',
        chapter_number: 1,
        title: 'Scaling Paradigms & Mitigating Data Leakage',
        subheadings: ['StandardScaler vs MinMaxScaler', 'Handling Outliers with RobustScaler', 'Strict Train-Test Isolation'],
        reading_time_mins: 15,
        definition: {
          term: 'Data Leakage',
          explanation: 'When information from outside the training dataset (such as mean or standard deviation of the test set) is inadvertently used to transform or train the model.',
        },
        content_markdown: `Distance-based algorithms (KNN, SVM, K-Means) and gradient descent optimizers fail when feature scales differ by orders of magnitude.

**Critical Rule of Feature Engineering**:
Always fit scalers exclusively on the training split (\`scaler.fit_transform(X_train)\`), then use those frozen training parameters to transform test data (\`scaler.transform(X_test)\`). Never call \`fit()\` on test data!`,
        code_snippets: [
          {
            title: 'Scikit-Learn Standardization Pipeline',
            language: 'python',
            code: `from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import numpy as np

X = np.random.uniform(10, 500, size=(1000, 3))
y = np.random.randint(0, 2, size=1000)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

scaler = StandardScaler()
# Fit strictly on train!
X_train_scaled = scaler.fit_transform(X_train)
# Transform test using train parameters!
X_test_scaled = scaler.transform(X_test)

print("Train Mean:", np.round(X_train_scaled.mean(axis=0), 3))
print("Train Std:", np.round(X_train_scaled.std(axis=0), 3))`,
            output: `Train Mean: [0. 0. 0.]
Train Std: [1. 1. 1.]`,
          },
        ],
        summary_bullets: [
          'StandardScaler scales to zero mean and unit variance ($z = \\frac{x - \\mu}{\\sigma}$).',
          'MinMaxScaler bounds data between [0, 1], useful for image pixels and neural activations.',
          'Never fit transformation parameters on test or evaluation sets.',
        ],
        practice_questions: [
          {
            id: 'q-4-1',
            question: 'Why does K-Means clustering require feature standardization?',
            answer: 'Because K-Means uses Euclidean distance, features with larger magnitudes dominate cluster assignment.',
            explanation: 'Without standardization, a feature with values in thousands would completely overwhelm features with values between 0 and 1.',
          },
        ],
      },
    ],
  },
  {
    id: 'mod-5',
    module_number: 5,
    title: 'Supervised Learning — Regression Modeling',
    subtitle: 'OLS Linear Regression, Polynomial Expansion & Regularization (Lasso/Ridge)',
    author: 'Mohan Babu University • Department of Data Science',
    edition: 'Academic Edition 2026',
    cover_gradient: 'from-blue-950 via-cyan-950 to-slate-900',
    cover_accent: '#22d3ee',
    description: 'Formulate predictive regression hyperplanes, minimize residual sum of squares, apply L1/L2 shrinkage penalties, and validate using MSE, RMSE, and R-squared.',
    estimated_read_time: '45 mins',
    linked_experiment_number: 5,
    progress_percent: 100,
    is_completed: true,
    chapters: [
      {
        id: 'mod-5-ch-1',
        chapter_number: 1,
        title: 'Ordinary Least Squares & Evaluation Diagnostics',
        subheadings: ['Normal Equation vs Gradient Descent', 'Residual Analysis & Homoscedasticity', 'MSE, RMSE, MAE, R² Metrics'],
        reading_time_mins: 20,
        definition: {
          term: 'R² (Coefficient of Determination)',
          explanation: 'The proportion of the variation in the dependent variable that is predictable from the independent variables: $R^2 = 1 - \\frac{SS_{res}}{SS_{tot}}$.',
        },
        content_markdown: `Linear regression models the relationship between target continuous variable $y$ and predictor vector $X$ as:
$$y = \\beta_0 + \\beta_1 x_1 + ... + \\beta_p x_p + \\epsilon$$

OLS analytically minimizes the Residual Sum of Squares (RSS):
$$\\hat{\\beta} = (X^T X)^{-1} X^T y$$`,
        code_snippets: [
          {
            title: 'Linear Regression and Performance Metrics',
            language: 'python',
            code: `from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
import numpy as np

X = np.array([[1], [2], [3], [4], [5], [6]])
y = np.array([2.2, 3.9, 6.1, 8.2, 9.9, 12.1])

model = LinearRegression()
model.fit(X, y)
preds = model.predict(X)

print(f"Slope (beta_1): {model.coef_[0]:.3f}")
print(f"Intercept (beta_0): {model.intercept_:.3f}")
print(f"R² Score: {r2_score(y, preds):.4f}")
print(f"RMSE: {np.sqrt(mean_squared_error(y, preds)):.4f}")`,
            output: `Slope (beta_1): 1.986
Intercept (beta_0): 0.173
R² Score: 0.9982
RMSE: 0.1472`,
          },
        ],
        summary_bullets: [
          'OLS identifies the unique hyperplane minimizing the sum of squared vertical residuals.',
          'RMSE penalizes large errors more heavily than MAE due to squaring.',
          'Lasso (L1) enables automated feature selection by shrinking coefficients to zero.',
        ],
        practice_questions: [
          {
            id: 'q-5-1',
            question: 'Can R² be negative?',
            answer: 'Yes, if the model predicts worse than the horizontal mean line of the data.',
            explanation: 'When testing on an unseen test set, if predictions have a larger sum of squared errors than simply predicting the mean, R² becomes negative.',
          },
        ],
      },
    ],
  },
];
