## 2. Image Averaging from tiles processed through Google Earth Engine
One of my ideas for a visualization was to compare averaged images over time. I created [this program](https://github.com/ryezzz/Sub-Saharan-Africa-NDVI-Analysis/blob/master/data_processing_python/process_for_visual_average_in_nested_file_structure/process_images_for_year_average.ipynb) that loops through GEE's nested file structure and creates a single image average per year from thousands of tiles.

Here is the result for 1993 and 1994:

| <img width="253" alt="screen shot 2018-05-30 at 10 41 49 am" src="https://user-images.githubusercontent.com/15457713/40728447-1e4aea2a-63f8-11e8-9538-5438ab012691.png">  | <img width="253" alt="screen shot 2018-05-30 at 10 41 37 am" src="https://user-images.githubusercontent.com/15457713/40728450-2103afe0-63f8-11e8-92d3-d605ab06a406.png">  |
|---|---|

I found that the differences were too subtle for an informative visualization
