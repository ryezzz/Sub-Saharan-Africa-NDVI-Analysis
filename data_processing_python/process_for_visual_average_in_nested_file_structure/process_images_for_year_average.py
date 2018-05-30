
# This averages images by year based on their folder placement
import numpy as np
import skimage
import os
from os import walk
from IPython.display import Image
import re
from PIL import Image

rootDir = os.getcwd()+"/data/"

# Create a list of all file paths
for dirName, subdirList, fileList in os.walk(rootDir):
    if dirName.endswith('Overall'):
        rootDir2=dirName
        image_paths_list = []

        for dirName2, subdirList2, fileList2 in os.walk(rootDir2):
            for fname2 in fileList2:
                if fname2.endswith('.jpg'):
                    imgPath= os.path.join(rootDir2, dirName2, fname2)
                    image_paths_list.append(imgPath)
                            
        imlist= image_paths_list

        # Assuming all images are the same size, get dimensions of first image
        w,h=Image.open(imlist[0]).size
        N=len(imlist)

        # Create a numpy array of floats to store the average
        arr=np.zeros((h,w,3),np.float)

        # Build up average pixel intensities, casting each image as an array of floats
        for im in imlist:
            imarr=np.array(Image.open(im),dtype=np.float)
            arr=arr+imarr/N

        # Round values in array and cast as 8-bit integer
        arr=np.array(np.round(arr),dtype=np.uint8)

        # Generate, save and preview final image
        out=Image.fromarray(arr,mode="RGB")
        print(imlist[0])

        # Saving image with year as title using re to remove everything but year
        result = re.search('data/(.*)_zoom11', imlist[0])
        fileNameNew = result.group(1)
        out.save("output/"+fileNameNew+".png")
        out.show()


