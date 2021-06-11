## create user profile

import pymongo
from pymongo import MongoClient
from pymongo.errors import OperationFailure


import os
import urllib.request
from werkzeug.utils import secure_filename

import gridfs
from flask import send_file
import io
from bson.objectid import ObjectId ## required for creating an object
import uuid


cluster = MongoClient('mongodb+srv://dbuser1:mmgoverseas@cluster0.r1zhb.mongodb.net/qcDB?retryWrites=true&w=majority', tls=True, tlsAllowInvalidCertificates=True)
db = cluster["qcDB"]
col = db["userProfile"]

doc = { "_id" :  str(uuid.uuid4()),  "email":"vincent.cheng@macys.com", "name" : "Vincent Cheng", "su":"23875", "mf" :"38703", "co" : "CN"}

x = col.insert_one(doc)
print(x.inserted_id)



