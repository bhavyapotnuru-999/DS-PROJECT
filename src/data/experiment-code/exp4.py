# Data Science - 22DS102006
# Experiment 4: Data Wrangling

import numpy as np
import pandas as pd

# %%
# a. Hierarchical Indexing
data = pd.Series(
    np.random.randn(6),
    index=[
        ['a', 'a', 'b', 'b', 'c', 'c'],
        [1, 2, 1, 2, 1, 2]
    ]
)

print(data)
print(data['b'])
print(data[:, 1])

# %%
# b. Stack and Unstack
df = data.unstack()
print(df)
print(df.stack())

# %%
# c. Merge and Combine
df1 = pd.DataFrame({'a': [1, np.nan, 3],
                    'b': [4, 5, 6]})

df2 = pd.DataFrame({'a': [7, 8, 9],
                    'b': [np.nan, 11, 12]})

merged = df1.combine_first(df2)
print(merged)
