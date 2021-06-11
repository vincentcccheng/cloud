
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


cluster = MongoClient('mongodb+srv://dbuser1:mmgoverseas@cluster0.r1zhb.mongodb.net/qcDB?retryWrites=true&w=majority', tls=True, tlsAllowInvalidCertificates=True)
db = cluster["qcDB"]
db['fs.chunks'].delete_many({});
db['fs.files'].delete_many({});
