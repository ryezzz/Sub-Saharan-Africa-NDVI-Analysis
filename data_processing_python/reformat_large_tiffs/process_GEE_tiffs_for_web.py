#Processes High Resolution satellite images compiled with Google Earth Engine
#Will rescale any tiff to 2% size
from skimage.transform import rescale
from skimage import io
import numpy as np
import os
from os import walk

# image_paths_list = []
image_names_list = []

# Set root directory to current working directory
rootDir = os.getcwd()+"/data"

for dirName, subdirList, fileList in os.walk(rootDir):
    for fname in fileList:
        if fname.endswith('.tif') and "Overall" in fname:
            print(fname + " is processing...")
#           Define image path
            imgPath= os.path.join(rootDir, dirName, fname)
#           Read image
            single_image = io.imread(imgPath)
#           rescale image
            rescaled_single_image = rescale(single_image, 0.02)
#           save image                        
            io.imsave('output/' + fname.replace('.tif', '.png'), rescaled_single_image)
#           Add path to list for text export                        
#           image_paths_list.append(imgPath)
#           Add names to list for text export                        
            image_names_list.append(fname.replace('.tif', '.png'))
            print(fname+' saved')

np.savetxt('data/image_names_list.txt', image_names_list, delimiter=",", fmt="%a") 
print(image_names_list)

