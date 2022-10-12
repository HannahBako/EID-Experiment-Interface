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
    availconditions = ['1a', '1b', '2a', '2b']
    condition =''
    assigned = False
    while not assigned:
        condition = random.choice(availconditions)
        if conditions[condition] < 4:
            conditions[condition]+=1
            assigned = True
    id = int(random.randint(1000,9999))
    usermaps[id] = condition
    with open('usermaps.txt', 'w') as f:
        f.write(json.dumps({"id": id, "condition": condition}))
    return render_template("task.html", data = {"condition":condition, "id":id})

@app.route("/mainexperiment/<int:id>/<condition>/")
def main(id, condition):
    return render_template("main.html", data = {"condition":condition, "id":id})


@app.route('/submit')
def submit():
    return render_template("end.html")

@app.route('/examples', methods=["GET", "POST"])
def getExamples():
    if request.method == "POST":
        data = request.json
        if data['tags'] == 'all':
            images = examples.getAllImages()
            return json.dumps([i.__dict__ for i in images])
        images = examples.getImages(data['tags'])
        return json.dumps([i.__dict__ for i in images])
    return 400

@app.route('/log', methods=['POST', 'GET'])
def log():
    if request.method == "POST":
        data = request.json
        with open("app/logs/"+str(data['id'])+".txt", "w") as f:
            f.write(json.dumps(data['log']))
        return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 
    return json.dumps({'success':False}), 400, {'ContentType':'application/json'} 