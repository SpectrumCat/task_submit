from flask import Flask
from flask import request
from flask import make_response
from flask_cors import CORS
from flask import send_from_directory

import json, os, time

app = Flask(__name__)
CORS(app)

if not os.path.exists("files"):
    os.mkdir("files")

@app.route('/flask', methods=['POST'])
def upload():
    ufile = request.files["file"]
    udate = request.form["date"]
    uid = request.form["id"]
    print(request.form["date"])
    path = "files/"+udate+"/"
    filename = uid+"."+ufile.filename.split('.')[-1]
    file_path = path + filename
    ufile.save(file_path)
    with open("files/"+udate+"/list.json") as f:
        info = json.load(f)
    print(info)
    for i in range(len(info["content"])):
        print("found")
        if str(info["content"][i]["id"]) == uid:
            info["content"][i]["files"] = filename
            info["content"][i]["finish_time"] = make_time()
            info["content"][i]["finished"] = True
            with open("files/"+udate+"/list.json", "w+") as f:
                json.dump(info, f)
            break
    return "OK"

def make_time():
    return time.strftime("%Y%m%d%H%M", time.localtime())

@app.route('/list', methods=['GET'])
def list():
    date = request.args["date"]
    return make_response(read_list(date))

def read_list(date):
    if not os.path.exists("files/"+date):
        return {}
    with open("files/"+date+"/list.json") as f:
        data = json.load(f)
        return data

@app.route('/create', methods=['POST'])
def create_page():
    date = request.form["date"]
    info = json.loads(request.form["info"])
    print(info["content"]);
    for index in range(len(info["content"])):
        info["content"][index]["finished"] = False
        info["content"][index]["add_time"] = make_time()
        info["content"][index]["finish_time"] = ''
    print(info)
    make_page(date, info)
    return "OK"

def make_page(date, info):
    with open("template/detail_page.txt") as f:
        template = f.readline().rstrip()
    page = template%date
    with open("../pages/"+date+".html", "w+") as f:
        f.write(page) 
    if not os.path.exists("files/"+date):
        os.mkdir("files/"+date)
    with open("files/"+date+"/list.json","w+") as f:
        json.dump(info, f)

@app.route("/download", methods=['GET'])
def download_file():
    date = request.args["date"]
    filename = request.args["name"]
    directory = "files/"+date  # 假设在当前目录
    return send_from_directory(directory, filename, as_attachment=True)


@app.route("/datelist", methods=['GET'])
def datelist():
    all_list = os.listdir("../pages")
    all_list.sort()
    return make_response({"all":all_list})