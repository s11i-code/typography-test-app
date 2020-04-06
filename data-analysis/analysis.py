import json
import os
import sys
import time
import uuid
import math
from datetime import datetime
from decimal import Decimal
import numpy as np
import pandas as pd
import re
from dynamodb_json import json_util as dynamo_json
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn import preprocessing
import statsmodels.api as sm
import pprint

get_site_path = lambda filename: "%s/%s" % (sitedata_dir, filename)
is_demo_site = lambda siteID: re.search('amplifyapp.com/demo', siteID)
site_matches = lambda site1, site2: site1['siteID'] ==  site2['siteID'] and site1['resolution'] == site2['resolution']

def read_file(name):
   with open(name) as file:
      return file.read()

def load_json(file):
   with open(file) as json_file:
      return json.load(json_file)

def is_in_viewport(true_viewport, captured_res, top, bottom, height, width, left, right):
   #scaling is needed because users saw an screengrab of the true site
   # which was captured bigger than their true viewport
   height_scaling = captured_res['width'] / true_viewport['width']
   scaled_height = true_viewport['height'] * height_scaling
   mid = top + height / 2
   return (top >= 0 and left >= 0 and mid <=  scaled_height)

def get_rank(elem_id, selected_elements):
   try:
      return str(selected_elements.index(elem_id) + 1)
   except ValueError:
      return 'not selected'

def was_ranked_nth(nth, elem_id, selected_element_ids):
   # e.g. if return 1 if element was ranked 1st, else 0
   return 1 if selected_element_ids[nth - 1] == elem_id else 0

def get_center_point(top, left, width, height, bottom, right):
   return { 'x': left + width/ 2, 'y': top + height/2 }

def get_distance(elem1, elem2):
   pos1 = get_center_point(**elem1['rect'])
   pos2 = get_center_point(**elem2['rect'])
   return math.hypot(pos1['x'] - pos2['x'], pos1['y'] - pos2['y'])

def parse_features(elem):
   features =  {
      "text_lightness": float(elem['colorData']['backgroundColor']['hsl']['color'][2]),
      "bg_lightness": float(elem['colorData']['textColor']['hsl']['color'][2]),
      "contrast_ratio": float(elem['colorData']['contrastRatio']),
      "left": float(elem['rect']['left']),
      "top": float(elem['rect']['top']),
      "font_size": float(elem['style']['fontSize']),
      "font_weight": float(elem['style']['fontWeight']),
      "opacity": float(elem['style']['opacity']),
   }
   return features

def get_distance_to_prev_element(elem, rank, selected_elements):
   # deduct 2 instead of 1 because rank starts from 1 and lists are 0-indexed
   prev_elem = selected_elements[rank - 2]
   return get_distance(elem, prev_elem)

def parse_data(evaluated_sites, target_rank):
   X, y = [], []
   for evaluated_site in evaluated_sites:
      #filter out demo page data
      if is_demo_site(evaluated_site['siteID']):
         continue
      selected_element_ids = evaluated_site['selectedElementIDs']
      resolution = evaluated_site['resolution']
      scraped_data = list(filter(lambda scraped: site_matches(evaluated_site, scraped), scraped_sites))[0]
      visible_elements = [elem for elem in scraped_data['elements'] if is_in_viewport(evaluated_site['viewport'], resolution, **elem['rect'])]
      y =  y + [was_ranked_nth(target_rank, elem['id'], selected_element_ids) for elem in visible_elements]

      if(target_rank > 1):
         # This is the part of the model the measures the effect of reading pattern
         selected_elements = [elem for elem in scraped_data['elements'] if elem['id'] in selected_element_ids]
         X = X + [{"distance_to_prev_elem": get_distance_to_prev_element(elem, target_rank, selected_elements)} for elem in visible_elements]
      else:
         X =  X + [parse_features(elem) for elem in visible_elements]

   return {'X': X, 'y': y}

def scale_features(features):
   columns = features.columns
   scaler = preprocessing.StandardScaler()
   scaled = scaler.fit_transform(features)
   return pd.DataFrame(scaled, columns = columns)

def get_error_rate(expected, predicted):
   assert len(expected) == len(predicted)
   correct_count = np.sum(np.array(expected) == np.array(expected))
   return correct_count / len(expected)

def train_model(X, y):
   #X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.33)
   logit_model = sm.Logit(y, X)
   fit = logit_model.fit()
   #predicted = fit.predict(X_test)
   #error_rate = get_error_rate(y_test, predicted)

   #print('Error rate: ', error_rate)
   print(fit.summary())
   return {'fit': fit}

evaluated_sites = dynamo_json.loads(read_file("replies.json"))["Items"]
print('number of evaluates sites :', len(evaluated_sites))
sitedata_dir = "flat-site-data"
sitedata_files = os.listdir(sitedata_dir)
scraped_sites = [load_json(get_site_path(file)) for file in sitedata_files]

data = parse_data(evaluated_sites, 3)
X = pd.DataFrame(data['X'])
y = pd.Series(data['y'])

scaled_X = scale_features(X)

#train_model(scaled_X[['distance_to_prev_selected']], y)

model = train_model(scaled_X, y)

#TESTING METAMORPHIC RELATION


TESTED_WIDTHS =  [400, 500, 700, 800, 1000, 1500, 1700, 2000]

def predict_elements(site):
   X = pd.DataFrame([parse_features(elem) for elem in site['elements']])
   predictions = model['fit'].predict(scale_features(X))
   return {elem['text']: {'prediction': predictions[index], 'tagName': elem['tagName']} for index, elem in enumerate(site['elements'])}

# TODO REFACTOR
results = pd.DataFrame(pd.DataFrame(columns=['siteID', 'width',  'value']))
prev_predictions = {}

for width in TESTED_WIDTHS:
   sites = [site for site in scraped_sites if site['resolution']['width'] == width]

   for site in sites:
      predictions = predict_elements(site)

      if is_demo_site(site['siteID']):
         continue

      if(prev_predictions.get(site['siteID'])):
         for text in predictions:
            current = predictions.get(text)
            previous = prev_predictions.get(site['siteID']).get(text)
            if(current and previous and current['tagName'] == previous['tagName']):
               value =  abs(current['prediction'] - previous['prediction'])
               results = results.append({'siteID': site['siteID'], 'value': value, 'width': width}, ignore_index= True)

      # set new prediction for the next width
      prev_predictions[site['siteID']] = predictions

#pp = pprint.PrettyPrinter(depth=6)
#pp.pprint(results)

print(results.groupby('siteID').mean().sort_values('value'))

print(results.groupby(['siteID', 'width']).mean().sort_values(['siteID', 'value']))
