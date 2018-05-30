import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn import preprocessing
from os import getcwd
# Adapted from https://www.datacamp.com/community/tutorials/time-series-analysis-tutorial

file = getcwd()+"/data/"+"worldbankNDVIRegression.csv"
df = pd.DataFrame.from_csv(file)

df.info()

df = df.dropna()

df.columns = ['year', 'gdp', 'productivity', 'ndvi']

# I had to switch to Numeric from float

df.year = pd.to_numeric(df.year, errors='raise', downcast='integer')

df.year = pd.to_datetime(df.year, format="%Y")

dfNew = df.drop(['year'], axis=1)

# Create x, where x the 'scores' column's values as floats
x = dfNew.values.astype(float)

# Create a minimum and maximum processor object
min_max_scaler = preprocessing.MinMaxScaler()

# Create an object to transform the data to fit minmax processor
x_scaled = min_max_scaler.fit_transform(x)

# Run the normalizer on the dataframe
df_normalized = pd.DataFrame(x_scaled)

df_normalized

df_normalized.year = df.year
df_normalized.year

df_normalized.set_index(df_normalized.year, inplace=True)
df_normalized.columns = ['Agri_value_added', 'gdp', 'ndvi']

df_normalized.head()

color = ['LightBlue', 'DarkOrange', 'DarkGreen']

df_normalized.plot(figsize=(20,10), linewidth=5, fontsize=20, color = color)
plt.xlabel('Year', fontsize=20);


df_normalized.corr()

import statsmodels.api as sm

df = df_normalized
df['const']=1
# print (df['gdp'])
model1=sm.OLS(endog=df['gdp'],exog=df['ndvi'])
results1=model1.fit()
print(results1.summary())

df = df_normalized
df['const']=1
model1=sm.OLS(endog=df['Agri_value_added'],exog=df['ndvi'])
results1=model1.fit()
print(results1.summary())

