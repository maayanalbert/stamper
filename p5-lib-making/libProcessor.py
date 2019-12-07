import os
import json



def getArr():

    
    module_dir = os.path.dirname(__file__)  
    file_path = os.path.join(module_dir, "rawLib.txt")


    libFile = open(file_path,"r")
    rawContents = libFile.read()

    arr = rawContents.split("\n")

    return arr

def main():

    with open('processedLib.json', 'w') as fp:
        json.dump(getArr(), fp)


if __name__ == "__main__":
    main()
