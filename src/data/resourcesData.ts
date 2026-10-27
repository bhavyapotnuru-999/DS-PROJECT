import { LearningResource } from '../types';

export const INITIAL_RESOURCES: LearningResource[] = [
  {
    id: 'res-1',
    title: 'NumPy Vectorization & Array Operations Cheat Sheet',
    description: 'Comprehensive quick reference for array indexing, broadcasting rules, matrix dot products, axis aggregations, and memory layout strides.',
    category: 'Cheat Sheet',
    subject: 'Numerical Computing',
    file_type: 'application/pdf',
    file_size: 420000,
    tags: ['NumPy', 'Python', 'Array Math', 'Vectorization'],
    uploaded_by: 'Bosubabu Sir (Faculty Guide)',
    uploaded_at: '2026-09-15T10:00:00.000Z',
    download_count: 248,
    file_data: 'data:text/plain;charset=utf-8,NumPy%20Cheat%20Sheet%3A%0A-%20np.zeros((R%2CC))%0A-%20arr.reshape(-1%2C1)%0A-%20Broadcasting%3A%20trailing%20dims%20must%20match%20or%20be%201%0A-%20Boolean%20mask%3A%20arr%5Barr%20%3E%200%5D',
  },
  {
    id: 'res-2',
    title: 'Pandas Data Wrangling & DataFrame Transformation Guide',
    description: 'Practical syntax cheat sheet covering loc/iloc selection, group-by aggregations, merge/join paradigms, datetime parsing, and categorical memory optimization.',
    category: 'Cheat Sheet',
    subject: 'Data Manipulation',
    file_type: 'application/pdf',
    file_size: 512000,
    tags: ['Pandas', 'DataFrames', 'Data Cleaning', 'Aggregation'],
    uploaded_by: 'Bhavya Potnuru',
    uploaded_at: '2026-09-20T14:30:00.000Z',
    download_count: 312,
    file_data: 'data:text/plain;charset=utf-8,Pandas%20DataFrame%20Reference%3A%0A-%20df.groupby(%27col%27).agg(%5B%27mean%27%2C%20%27std%27%5D)%0A-%20df.fillna(df.median())%0A-%20pd.get_dummies(df)',
  },
  {
    id: 'res-3',
    title: 'Scikit-Learn Machine Learning Algorithm Cheat Sheet',
    description: 'Interactive reference guide to choosing between Regressors, Classifiers, Clusterers, Dimensionality Reduction techniques, and Cross-Validation splits.',
    category: 'Cheat Sheet',
    subject: 'Machine Learning',
    file_type: 'application/pdf',
    file_size: 680000,
    tags: ['Scikit-Learn', 'Classification', 'Regression', 'Metrics'],
    uploaded_by: 'Department of Data Science',
    uploaded_at: '2026-09-25T09:15:00.000Z',
    download_count: 420,
    file_data: 'data:text/plain;charset=utf-8,Scikit-Learn%20Estimator%20Reference%3A%0A-%20LinearRegression%0A-%20DecisionTreeClassifier(max_depth%3D4)%0A-%20KMeans(n_clusters%3D3)%0A-%20PCA(n_components%3D0.95)',
  },
  {
    id: 'res-4',
    title: 'Fisher’s Iris Multi-Class Benchmark Dataset (CSV)',
    description: 'Clean tabular 150-sample dataset containing sepal length, sepal width, petal length, petal width, and species classification labels.',
    category: 'Dataset',
    subject: 'Exploratory Data Analysis & Classification',
    file_type: 'text/csv',
    file_size: 4550,
    tags: ['CSV', 'Benchmark', 'Classification', 'EDA'],
    uploaded_by: 'Bosubabu Sir',
    uploaded_at: '2026-09-10T08:00:00.000Z',
    download_count: 580,
    file_data: `data:text/csv;charset=utf-8,sepal_length,sepal_width,petal_length,petal_width,species
5.1,3.5,1.4,0.2,setosa
4.9,3.0,1.4,0.2,setosa
4.7,3.2,1.3,0.2,setosa
7.0,3.2,4.7,1.4,versicolor
6.4,3.2,4.5,1.5,versicolor
6.9,3.1,4.9,1.5,versicolor
6.3,3.3,6.0,2.5,virginica
5.8,2.7,5.1,1.9,virginica
7.1,3.0,5.9,2.1,virginica`,
  },
  {
    id: 'res-5',
    title: 'California Housing Valuation Benchmark Dataset (CSV)',
    description: 'Tabular regression dataset containing median house values, median income, housing median age, total rooms, population, and ocean proximity metrics.',
    category: 'Dataset',
    subject: 'Supervised Regression',
    file_type: 'text/csv',
    file_size: 14200,
    tags: ['CSV', 'Regression', 'Real Estate', 'Predictive Modeling'],
    uploaded_by: 'Mohan Babu University Lab Repository',
    uploaded_at: '2026-09-18T11:20:00.000Z',
    download_count: 395,
    file_data: `data:text/csv;charset=utf-8,MedInc,HouseAge,AveRooms,AveBedrms,Population,AveOccup,MedHouseVal
8.3252,41.0,6.9841,1.0238,322.0,2.5555,4.526
8.3014,21.0,6.2381,0.9718,2401.0,2.1098,3.585
7.2574,52.0,5.8173,1.0730,496.0,2.8022,3.521
5.6431,52.0,5.8173,1.0730,558.0,2.5479,3.413
3.8462,52.0,6.2818,1.0810,565.0,2.1814,3.422`,
  },
  {
    id: 'res-6',
    title: 'Customer Churn & Behavioral Telemetry Dataset (CSV)',
    description: 'Realistic telecom customer dataset including tenure, monthly charges, contract type, paperless billing, customer service calls, and churn status.',
    category: 'Dataset',
    subject: 'Classification & Model Evaluation',
    file_type: 'text/csv',
    file_size: 9800,
    tags: ['CSV', 'Churn', 'ROC-AUC', 'Imbalanced Data'],
    uploaded_by: 'Bhavya Potnuru',
    uploaded_at: '2026-09-28T16:45:00.000Z',
    download_count: 275,
    file_data: `data:text/csv;charset=utf-8,customerID,tenure,MonthlyCharges,TotalCharges,Contract,Churn
7590-VHVEG,1,29.85,29.85,Month-to-month,No
5575-GNVDE,34,56.95,1889.5,One year,No
3668-QPYBK,2,53.85,108.15,Month-to-month,Yes
7795-CFOCW,45,42.30,1840.75,One year,No
9237-HQITU,2,70.70,151.65,Month-to-month,Yes`,
  },
  {
    id: 'res-7',
    title: 'Official Scikit-Learn Machine Learning Documentation',
    description: 'Direct link to the official comprehensive API reference, algorithmic tutorials, and mathematical foundations for Scikit-Learn.',
    category: 'Documentation',
    subject: 'Machine Learning Frameworks',
    external_url: 'https://scikit-learn.org/stable/',
    tags: ['Official Docs', 'Scikit-learn', 'API', 'Reference'],
    uploaded_by: 'Department of Data Science',
    uploaded_at: '2026-09-01T10:00:00.000Z',
    download_count: 730,
  },
  {
    id: 'res-8',
    title: 'Pandas Official API Documentation & Cookbooks',
    description: 'Comprehensive documentation detailing Indexing, MultiIndex, Reshaping, Categoricals, and performance optimization guides.',
    category: 'Documentation',
    subject: 'Data Analysis',
    external_url: 'https://pandas.pydata.org/docs/',
    tags: ['Official Docs', 'Pandas', 'Python', 'DataFrame API'],
    uploaded_by: 'Department of Data Science',
    uploaded_at: '2026-09-01T10:00:00.000Z',
    download_count: 640,
  },
  {
    id: 'res-9',
    title: 'Lecture Video: Dimensionality Reduction & PCA Explained',
    description: 'Deep dive into covariance matrices, Singular Value Decomposition (SVD), principal axes calculation, and scree plot interpretation.',
    category: 'Video Tutorial',
    subject: 'Unsupervised Machine Learning',
    external_url: 'https://www.youtube.com/watch?v=FgakZw6K1QQ',
    tags: ['Video', 'PCA', 'Linear Algebra', 'Dimensionality Reduction'],
    uploaded_by: 'Bosubabu Sir',
    uploaded_at: '2026-10-02T11:00:00.000Z',
    download_count: 195,
  },
  {
    id: 'res-10',
    title: 'Data Science Lab Manual & Syllabus Guidelines 2026',
    description: 'Complete Mohan Babu University curriculum handbook detailing experimental aims, prerequisites, scoring criteria, and documentation rules.',
    category: 'Lecture Notes',
    subject: 'Curriculum & Lab Policy',
    file_type: 'application/pdf',
    file_size: 890000,
    tags: ['Syllabus', 'Lab Manual', 'Curriculum', 'MBU'],
    uploaded_by: 'Bosubabu Sir',
    uploaded_at: '2026-09-05T09:00:00.000Z',
    download_count: 850,
    file_data: 'data:text/plain;charset=utf-8,MOHAN%20BABU%20UNIVERSITY%20-%20DATA%20SCIENCE%20LAB%20MANUAL%202026%0ACourse%20Code%3A%20DS-3101%0AFaculty%3A%20Bosubabu%20Sir%0AAll%2010%20experiments%20require%20verified%20PDF%20execution%20reports.',
  },
];
