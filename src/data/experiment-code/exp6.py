# Data Science - 22DS102006
# Experiment 6: Time Series Analysis

import pandas as pd

# %%
# --------------------------------------------------
# a. Create a time series using datetime objects in pandas
# --------------------------------------------------
dates = pd.to_datetime([
    '2026-01-01',
    '2026-01-02',
    '2026-01-03',
    '2026-01-04',
    '2026-01-05'
])

temperature = [28, 30, 29, 31, 32]

time_series = pd.Series(
    temperature,
    index=dates
)

print("Time Series:")
print(time_series)

# %%
# --------------------------------------------------
# b. Generate a DatetimeIndex with pandas.date_range
# --------------------------------------------------
date_index = pd.date_range(
    start='2026-01-01',
    periods=7,
    freq='D'
)

print("Generated DatetimeIndex:")
print(date_index)

# %%
# --------------------------------------------------
# c. Time zone handling and combining time series
# --------------------------------------------------
# 1. Generate date range by setting a time zone
india_dates = pd.date_range(
    start='2026-01-01 09:00',
    periods=3,
    freq='h',
    tz='Asia/Kolkata'
)
print("1. Date Range with Asia/Kolkata Time Zone:")
print(india_dates)

# 2. Create a timezone-naive DatetimeIndex
dates = pd.date_range(
    start='2026-01-01 09:00',
    periods=3,
    freq='h'
)
print("\n2. Timezone-naive Date Range:")
print(dates)

# 3. Localize the timezone
localized_dates = dates.tz_localize('Asia/Kolkata')
print("\n3. After Localizing to Asia/Kolkata:")
print(localized_dates)

# 4. Convert to another timezone using tz_convert()
new_york_dates = localized_dates.tz_convert('America/New_York')
print("\n4. Converted to America/New_York:")
print(new_york_dates)

# 5. Create another time series in a different timezone
india_series = pd.Series([100, 200, 300], index=localized_dates)
new_york_series = pd.Series([400, 500, 600], index=new_york_dates)

print("\n5. India Time Series:")
print(india_series)
print("\nNew York Time Series:")
print(new_york_series)

# 6. Combine two different timezone series
combined_series = pd.concat([
    india_series,
    new_york_series
])
print("\n6. Combined Time Series:")
print(combined_series)

# %%
# --------------------------------------------------
# d. Period arithmetic with pandas.Period and period_range
# --------------------------------------------------
p = pd.Period('2026-01', freq='M')

print("Original Period:")
print(p)

print("\nAfter adding 2:")
print(p + 2)

print("\nAfter adding 5:")
print(p + 5)

print("\nAfter subtracting 1:")
print(p - 1)

print("\nAfter subtracting 3:")
print(p - 3)

periods = pd.period_range(
    start='2026-01',
    periods=6,
    freq='M'
)

print("\nRange of Periods:")
print(periods)

# %%
# --------------------------------------------------
# e. Convert Periods and PeriodIndex with asfreq
# --------------------------------------------------
p = pd.Period('2026-01', freq='M')

print("Original Period:")
print(p)

daily_start = p.asfreq('D', how='start')
print("\nMonthly Period converted to Daily (Start):")
print(daily_start)

daily_end = p.asfreq('D', how='end')
print("\nMonthly Period converted to Daily (End):")
print(daily_end)

period_index = pd.period_range(
    start='2026-01',
    periods=3,
    freq='M'
)

print("\nOriginal PeriodIndex:")
print(period_index)

daily_period_index = period_index.asfreq('D', how='start')
print("\nPeriodIndex converted to Daily Frequency:")
print(daily_period_index)

daily_period_index_end = period_index.asfreq('D', how='end')
print("\nPeriodIndex converted to Daily Frequency (End):")
print(daily_period_index_end)

# %%
# --------------------------------------------------
# f. Convert timestamp-indexed Series and DataFrame to periods
# --------------------------------------------------
dates = pd.to_datetime([
    '2026-01-10',
    '2026-02-15',
    '2026-03-20',
    '2026-04-25'
])

sales = pd.Series(
    [1000, 1500, 1800, 2200],
    index=dates
)

print("Original Series:")
print(sales)

period_series = sales.to_period('M')
print("\nSeries converted to Monthly Periods:")
print(period_series)

df = pd.DataFrame(
    {
        'Sales': [1000, 1500, 1800, 2200],
        'Profit': [200, 300, 400, 500]
    },
    index=dates
)

print("\nOriginal DataFrame:")
print(df)

period_df = df.to_period('M')
print("\nDataFrame converted to Monthly Periods:")
print(period_df)

# %%
# --------------------------------------------------
# g. Resampling, downsampling and upsampling
# --------------------------------------------------
dates = pd.date_range(
    start='2026-01-01 00:00',
    periods=12,
    freq='h'
)

values = [10, 12, 15, 14, 18, 20, 22, 21, 25, 28, 30, 32]

time_series = pd.Series(values, index=dates)

print("Original Hourly Time Series:")
print(time_series)

# Resampling - calculate 3-hourly mean
resampled = time_series.resample('3h').mean()
print("\nResampled Time Series - 3 Hour Mean:")
print(resampled)

# Downsampling - hourly to 4-hourly
downsampled = time_series.resample('4h').sum()
print("\nDownsampled Time Series - 4 Hour Sum:")
print(downsampled)

# Upsampling - hourly to 30-minute intervals
upsampled = time_series.resample('30min').asfreq()
print("\nUpsampled Time Series - 30 Minute:")
print(upsampled)

# Upsampling with forward fill
upsampled_ffill = time_series.resample('30min').ffill()
print("\nUpsampled Time Series using Forward Fill:")
print(upsampled_ffill)
