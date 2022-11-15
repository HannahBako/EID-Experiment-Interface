from flask import render_template, request
from app import app
from app.loadexamples import Examples
from collections import defaultdict
import json
import random



global examples 
examples = Examples()

global conditions
conditions = defaultdict(int)

global usermaps
usermaps = defaultdict(str)

@app.route("/")
@app.route("/index")
def hello():
    return render_template("index.html", title="home")

@app.route("/task")
def task():
    # randomize participant among four conditions. generate a random identifier for their logs

    # availconditions = ['1a', '1b', '2a', '2b']
    availconditions = ['1a', '1b', '2a']
    condition =''
    assigned = False
    print(conditions)
    while not assigned:
        condition = random.choice(availconditions)
        if conditions[condition] < 1: #TODO: replace with 8 after pilot is complete
            conditions[condition]+=1
            assigned = True
    id = int(random.randint(1000,9999))
    usermaps[id] = condition
    dd = {"id": id, "condition": condition}
    with open('usermaps.txt', 'a') as f:
        f.write(json.dumps(dd))
        f.write("\n")
    with open("app/logs/"+str(id)+".txt", "w") as f:
        d = [dd,]
        f.write(json.dumps(d))
    return render_template("task.html", data = {"condition":condition, "id":id})

@app.route("/mainexperiment/<int:id>/<condition>/")
def main(id, condition):
    return render_template("main.html", data = {"condition":condition, "id":id})

@app.route("/demo/<int:id>/<condition>/")
def demo(id, condition):
    return render_template("demo.html", data = {"condition":condition, "id":id})

@app.route('/submit')
def submit():
    return render_template("end.html")

@app.route('/tags', methods=["GET"])
def tags():
    if request.method == "GET":
        tags = dict.fromkeys(examples.getAllTags())
        return json.dumps(tags)
    return json.dumps({'success':False}), 400, {'ContentType':'application/json'} 
@app.route('/examples', methods=["GET", "POST"])
def getExamples():
    if request.method == "POST":
        data = request.json
        if data['tags'] == 'all':
            images = examples.getAllImages()
            return json.dumps([i.__dict__ for i in images])
        images = examples.getImages(data['tags'])
        return json.dumps([i.__dict__ for i in images])
    return json.dumps({'success':False}), 400, {'ContentType':'application/json'}

@app.route('/log', methods=['POST', 'GET'])
def log():
    if request.method == "POST":
        data = request.json
        file =""
        # print(data['log'])
        with open("app/logs/"+str(data['id'])+".txt", "r") as f:
            file = json.loads(f.read())
            file.append(data['log'])
        with open("app/logs/"+str(data['id'])+".txt", "w") as f:
            f.write(json.dumps(file))
        return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 
    return json.dumps({'success':False}), 400, {'ContentType':'application/json'} 