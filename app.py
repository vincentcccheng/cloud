#from flask import Flask
from flask import jsonify
import pymongo
from pymongo import MongoClient
from pymongo.errors import OperationFailure


import os
import urllib.request
from flask import Flask, flash, request, redirect, render_template
from werkzeug.utils import secure_filename

import gridfs
from flask import send_file
import io
from bson.objectid import ObjectId ## required for creating an object 
import json


app = Flask(__name__, static_folder="mmgapp/build/static", template_folder="mmgapp/build")

app.secret_key = 'super secret key'
app.config['UPLOAD_FOLDER'] = '.'
app.config['MAX_CONTENT_LENGTH'] = 5 * 10240 * 1024

ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif','xlsx', 'doc', 'docx', 'ppt', 'pptx'])

def allowed_file(filename):
	return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
	

@app.route('/upload', methods=['POST'])
def upload_file():
        if request.method == 'POST':
                cluster = MongoClient('mongodb+srv://dbuser1:mmgoverseas@cluster0.r1zhb.mongodb.net/qcDB?retryWrites=true&w=majority', tls=True, tlsAllowInvalidCertificates=True)                
                db = cluster["qcDB"]
                # check if the post request has the files part
                if 'files[]' not in request.files:
                        flash('No file part')
                        return "no files", 406
                files = request.files.getlist('files[]')
                newfiles = []
                for file in files:                        
                        if file and allowed_file(file.filename):
                                mimetype = file.content_type
                                filename = secure_filename(file.filename)                                
                                fs = gridfs.GridFS(db)
                                id = fs.put(file, filename=filename)         
                                newfiles.append({ "_id" :str(id), "enable": True, "file_name":filename, 
                                "mime_type": mimetype })
                                print("file_name", filename)                               

                return jsonify(newfiles),200
        else:
                return "Upload Error", 406

@app.route('/download/<string:_id>', methods=['GET'])
def download_file(_id):
        cluster = MongoClient('mongodb+srv://dbuser1:mmgoverseas@cluster0.r1zhb.mongodb.net/qcDB?retryWrites=true&w=majority', tls=True, tlsAllowInvalidCertificates=True)
        db = cluster["qcDB"]
        fs = gridfs.GridFS(db)
        # _id of file example = "60b609a291e07bc60a594482"
        # below download_name and mimetype are dummy to fullfill the send_file requirements
        return send_file(io.BytesIO(fs.get(ObjectId(_id)).read()), download_name='bug2.jpg', mimetype='image/jpg')                                                                                  
                
        

@app.route('/api/getAllMC')
def getAllMC():

    try:        
        cluster = MongoClient('mongodb+srv://dbuser1:mmgoverseas@cluster0.r1zhb.mongodb.net/qcDB?retryWrites=true&w=majority', tls=True, tlsAllowInvalidCertificates=True) 
        #cluster = MongoClient('mongodb+srv://dbuser1:mmgoverseas@cluster0.r1zhb.mongodb.net/qcDB?retryWrites=true&w=majority') 
        db = cluster["qcDB"]
        col = db["mcTable"]
        #query = {  "_id" : { "$lt" :10 }}       
        #query = {  "su_no" : { "$eq" :"23875" }} 
        query = { "$and" : [  { "su_no" : { "$eq" :'23875' }},  {"mf_no" : { "$eq" :'39761' }}] }     

        mc_array = []     
        results = col.find(query)
        for result in results:
            result["_id"] = str(result["_id"])
            mc_array.append(result)
        return  jsonify(mc_array)
    
    except OperationFailure:
        print("Mongo Access Error")
        return 'Error'



@app.route('/api/getDefectTable')
def getDefectTable():

    try:
        print("Calling Defect Table")    
        cluster = MongoClient('mongodb+srv://dbuser1:mmgoverseas@cluster0.r1zhb.mongodb.net/qcDB?retryWrites=true&w=majority', tls=True, tlsAllowInvalidCertificates=True) 
        #cluster = MongoClient('mongodb+srv://dbuser1:mmgoverseas@cluster0.r1zhb.mongodb.net/qcDB?retryWrites=true&w=majority') 
        db = cluster["qcDB"]
        col = db["defectTable"]
        query = {  "_id" : { "$gt" :0 }}       
        defect_array = []     
        results = col.find(query)
        for result in results:
            defect_array.append(result)
        return  jsonify(defect_array)
    
    except OperationFailure:
        print("Mongo Access Error")
        return 'Error'    
     

@app.route('/api/getUploadTable', methods=['GET'])
def getUploadTable():
        cluster = MongoClient('mongodb+srv://dbuser1:mmgoverseas@cluster0.r1zhb.mongodb.net/qcDB?retryWrites=true&w=majority', tls=True, tlsAllowInvalidCertificates=True)         
        db = cluster["qcDB"]
        col = db["uploadTable"]
        query = {  "inspection_id" : { "$eq" :"123456-1-F" }}               
        results = col.find(query)
        result_array = []     
        for result in results:
            _obj_id = str(result["_id"])            
            _inspection_id = result["inspection_id"]            
            _file_name = result["file_name"]
            _mime_type = result["mime_type"]
            _enable = result["enable"]
            result_array.append(
            { "_id" : _obj_id,
              "inspection_id" : _inspection_id,            
              "file_name" : _file_name,
              "mime_type" : _mime_type,
              "enable" : _enable
            })
        print(result_array)    
        
        return  jsonify(result_array)
        

@app.route('/api/save', methods=['POST'])
def save_inspection():
    content = request.get_json() #python data 
    #content = request.data # json data 
    _id = content['_id']
    checkList = content['checkList']
    items = content['items']
    defects = content['defects']
    uploads = content['uploads']

    new_content = { "_id" : _id, "checkList" : checkList, "items" : items, "defects": defects, "uploads":uploads}
    cluster = MongoClient('mongodb+srv://dbuser1:mmgoverseas@cluster0.r1zhb.mongodb.net/qcDB?retryWrites=true&w=majority', tls=True, tlsAllowInvalidCertificates=True)
    db = cluster["qcDB"]
    col = db["inspectionResult"]

    query =  { "_id": _id}
    exists = col.find_one(query)

    if (exists):
        change =  { "$set":  { "checkList" : checkList, "items" : items, "defects":defects, "uploads" : uploads} }    # change     
        col.update_one(query, change)
        return "ok",200
    else:
        x = col.insert_one(new_content)
        print(x.inserted_id)
        return "ok",200
        

@app.route('/api/search',methods=['POST'])
def search_inspection():
        
    content = request.get_json() #python data 
    
    _id = content['_id']

    print(_id)
 
    cluster = MongoClient('mongodb+srv://dbuser1:mmgoverseas@cluster0.r1zhb.mongodb.net/qcDB?retryWrites=true&w=majority', tls=True, tlsAllowInvalidCertificates=True)
    db = cluster["qcDB"]
    col = db["inspectionResult"]

    query =  { "_id": _id}
    exists = col.find_one(query)

    if (exists):
       return  jsonify(exists), 200 
    else:
       return "Error", 404 


@app.route("/")
def index():
    return render_template('index') 
       
    
if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5000, debug=True)
