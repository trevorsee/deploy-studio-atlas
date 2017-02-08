import string
import os
import time
import _pickle as pickle
import json
import requests
import nltk
import urltools
import numpy as np
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.manifold import TSNE
from sklearn.preprocessing import normalize
from sklearn.decomposition import TruncatedSVD


r = requests.get('https://sheetlabs.com/DV/studiolist', auth=('tcarr@mica.edu', 't_9e773033c7352d4e31ca378e0dc8cae7'))
main = r.json()

token_dict = {}
for i, studio in enumerate(main):
     if studio['name'] not in token_dict:
        # time.sleep(1)  # helps to avoid hangups. Ctrl-C in case you get stuck on one
         print("getting text for studio %d/%d : %s"%(i, len(main), studio['name']))
         try:
             text = studio['description']
             token_dict[studio['name']] = text
         except:
             print(" ==> error processing "+studio['name'])



def tokenize(text):
    text = text.lower() # lower case
    for e in set(string.punctuation+'\n'+'\t'): # remove punctuation and line breaks/tabs
        text = text.replace(e, ' ')
    for i in range(0,10):	# remove double spaces
        text = text.replace('  ', ' ')
    text = text.translate(string.punctuation)  # punctuation
    tokens = nltk.word_tokenize(text)
    text = [w for w in tokens if not w in stopwords.words('english')] # stopwords
    stems = []
    for item in tokens: # stem
        stems.append(PorterStemmer().stem(item))
    return stems

# calculate tfidf (might take a while)
print("calculating tf-idf")
tfidf = TfidfVectorizer(analyzer='word', stop_words='english')
tfs = tfidf.fit_transform(token_dict.values())
print("reducing tf-idf to 500 dim")
tfs_reduced = TruncatedSVD(n_components=500, random_state=0).fit_transform(tfs)
print("done")

featurenames = tfidf.get_feature_names()
dense = tfs.todense()
studio = dense[0].tolist()[0]
phrase_scores = [pair for pair in zip(range(0, len(studio)), studio) if pair[1] > 0]
sorted_phrase_scores = sorted(phrase_scores, key=lambda t: t[1] * -1)

tags_dict = {}
tags_total = []
for i, item in enumerate(token_dict.items()):
    studio = dense[i].tolist()[0]
    phrase_scores = [pair for pair in zip(range(0, len(studio)), studio) if pair[1] > 0]
    sorted_phrase_scores = sorted(phrase_scores, key=lambda t: t[1] * -1)
    tags = []
#    print('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
#    print(item[0])
#    print('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    for phrase, score in [(featurenames[word_id], score) for (word_id, score) in sorted_phrase_scores][:10]:
       #print('{0: <10} {1}'.format(phrase, score))
       tags.append(phrase)
       if phrase not in tags_total:
           tags_total.append(phrase)
    tags_dict[list(token_dict.keys())[i]] = tags


#print(tags_dict)
print("term 2000 = \"%s\""%tfidf.get_feature_names()[200])

model = TSNE(n_components=2, perplexity=3, verbose=2, learning_rate=100).fit_transform(tfs.todense())
#model = TSNE(n_components=2, perplexity=3, verbose=2, learning_rate=100).fit_transform(tfs_reduced)

# save to json file
x_axis=model[:,0]
y_axis=model[:,1]
x_norm = (x_axis-np.min(x_axis)) / (np.max(x_axis) - np.min(x_axis))
y_norm = (y_axis-np.min(y_axis)) / (np.max(y_axis) - np.min(y_axis))
print(len(main))

data = []
meta = []
for i, studio in enumerate(main):
    temp = {}
    name = studio['name']
    size = studio['size']
    url = studio['url']
    location = studio['location']
    fname = urltools.parse(url).domain + ".png"
    x = x_norm[i]
    y = y_norm[i]
    tags = tags_dict[name]

    temp['name'] = name
    temp['location'] = location
    temp['size'] = size
    temp['url'] = url
    temp['fname'] = fname
    temp['x'] = x
    temp['y'] = y
    temp['tags'] = tags

    data.append(temp)

for i, tag in enumerate(tags_total):
    tempmeta = {}
    tempmeta['id'] = i
    tempmeta['value'] = tag

    meta.append(tempmeta)
#meta = {}
#print('####### meta #######')
#print(len(main))

#data = {"x":x_norm.tolist(), "y":y_norm.tolist(), "names":list(token_dict.keys())}
with open('data_studios_new.json', 'w') as outfile:
    json.dump(data, outfile)

with open('data_meta.json', 'w') as outfile:
    json.dump(meta, outfile)
