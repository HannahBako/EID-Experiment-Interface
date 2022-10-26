from collections import defaultdict
from typing import List
import pandas as pd

class Image:
    def __init__(self, filename:str, description:str, source:str):
        self.filename = filename
        self.description = description
        self.source = source
    def getFilename(self) -> str:
        return self.filename
    def getDescription(self) -> str:
        return self.description
    def getSource(self) -> str:
        return self.source

class Examples:
    def __init__(self):
        self.tags = defaultdict(list)
        self.readTags()
    def readTags(self):
        self.df = pd.read_csv('app/examples_details.csv')
        # I need some structure that stores a list of all tags and the example filenames, descriptions and source link for each file in that tag
        for index, row in self.df.iterrows():
            image = Image(row["Filename"], row["Description"], row["sourceLink"])
            for tag in row["Tags"].split(","):
                self.tags[tag.strip().lower()].append(image)
        #just sanity checking.
        # for t in self.tags:
        #     print(t)

    def getImages(self, tag) -> list:
        examples = []
        for t in tag:
            for image in self.tags[t]:
                if image in examples:
                    continue
                examples.append(image)
        return examples
    def getAllImages(self) -> list:
        examples =[]
        for t in self.tags.keys():
            for image in self.tags[t]: 
                if image in examples:
                    continue
                examples.append(image)
        return examples
    def getAllTags(self) -> list:
        return self.tags.keys()
