# Analysis and image processing experiments
This series of programs are experiments with analysis and satellite image processing. Each program is self-contained by folder. This is a summary of contents:

## 1. Raw Processing from USGS
Before I realized how time and GPU consuming Landsat data processing was for a full country analysis, I [created a program](https://github.com/ryezzz/Sub-Saharan-Africa-NDVI-Analysis/blob/master/data_processing_python/1_USGS_bulk_downloader_raw_processing/raw_sat_processing.ipynb) to analyze data downloaded through the [USGS bulk downloading tool](https://github.com/USGS-EROS/espa-bulk-downloader).

| <img width="300" alt="screen shot 2018-05-30 at 10 44 16 am" src="https://user-images.githubusercontent.com/15457713/40727830-c43c06c8-63f6-11e8-9323-4cbd1535048e.png">  | <img width="300" alt="screen shot 2018-05-30 at 10 44 29 am" src="https://user-images.githubusercontent.com/15457713/40728015-30b7d1d8-63f7-11e8-8dea-0d97772e8b3a.png">  |
|---|---|

## 2. Image Averaging from tiles processed through Google Earth Engine
One of my ideas for a visualization was to compare averaged images over time. I created [this program](https://github.com/ryezzz/Sub-Saharan-Africa-NDVI-Analysis/blob/master/data_processing_python/process_for_visual_average_in_nested_file_structure/process_images_for_year_average.ipynb) that loops through GEE's nested file structure and creates a single image average per year from thousands of tiles.

Here is the result for 1993 and 1994:

| <img width="253" alt="screen shot 2018-05-30 at 10 41 49 am" src="https://user-images.githubusercontent.com/15457713/40728447-1e4aea2a-63f8-11e8-9538-5438ab012691.png">  | <img width="253" alt="screen shot 2018-05-30 at 10 41 37 am" src="https://user-images.githubusercontent.com/15457713/40728450-2103afe0-63f8-11e8-92d3-d605ab06a406.png">  |
|---|---|

I found that the differences were too subtle for an informative visualization

## 3. Correlation analysis with GEE data and Worldbank Data

I ran this [basic correlation analysis](https://github.com/ryezzz/Sub-Saharan-Africa-NDVI-Analysis/blob/master/data_processing_python/GDP_productivity_NDVI_correlation_regression/simple_NDVI_regression_correlation.ipynb) which ended up having really interesting results: High correlation between NDVI and GDP as well as NDVI and Productivity, while GDP and Productivity had low correlation. When running a regressing analysis, however, everything has statistically significant relationships, implying that all variables are interrelated despite low correlation.
<img width="853" alt="screen shot 2018-05-30 at 10 41 03 am" src="https://user-images.githubusercontent.com/15457713/40729096-a52119c4-63f9-11e8-882a-cd7ea58d8caa.png">
<img width="490" alt="screen shot 2018-05-30 at 10 41 11 am" src="https://user-images.githubusercontent.com/15457713/40729105-aa5513b4-63f9-11e8-8690-9245643a9182.png">

## 4. Formatting large tiffs from GEE for front end program
[This simple program](https://github.com/ryezzz/Sub-Saharan-Africa-NDVI-Analysis/blob/master/data_processing_python/reformat_large_tiffs/process_GEE_tiffs_for_web.ipynb) resizes and reformats images and creates a file list from a nested file structure.

<img width="236" alt="screen shot 2018-05-30 at 11 10 09 am" src="https://user-images.githubusercontent.com/15457713/40729307-15208f02-63fa-11e8-9c2c-9b5061c2a5f5.png">
