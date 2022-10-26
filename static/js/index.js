// use this file to populate content in the html.

chips_data = [{
    tag: 'Climate',
  }, {
    tag: 'Agric',
  }]

var user_details = {}

function setUserDetails(data){
  user_details = data
  console.log(user_details)
}
 
function log(userevent,data){
  fetch('/log',{
    method:'POST',
    headers: {
    'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "id": userdetails.id,
      'log':{
        "time": Date.now(),
        "event": userevent,
        "data": data
      }
    })
  }).catch((error) => {
    console.error("Error:", error)
  })
}
//populate the div for the examples cards with the examples
function createExampleCards(examples){
  var exampleCards = document.getElementById("examplecards")
  while(exampleCards.firstChild){
    exampleCards.removeChild(exampleCards.firstChild);
  }
  //generate the html for each imagecard and append to the examplecards
  i=0
  var div =div = document.createElement('div')
  div.className ="row"
  while (i < examples.length){
    shortDesc = examples[i].description.split(" ").slice(0,10).join(" ")
    var subdiv = document.createElement('div')
    subdiv.className = "col s12 m6 l3"
    subdiv.innerHTML += '<div class="card">'+
          '<div class="card-image waves-effect waves-block waves-light">'+
            '<img class="activator" src="/static/ExampleFiles/'+examples[i].filename+'" width=250 height=200>'+
          '</div>'+
          '<div class="card-content">'+
            '<span class="card-title activator grey-text text-darken-4"><i class="material-icons right">more_vert</i></span>'+
            '<p><a href="'+examples[i].source+'" target="_blank">Example source</a></p>'+
          '</div>'+
          '<div class="card-reveal">'+
            '<span class="card-title grey-text text-darken-4"><i class="material-icons right">close</i></span>'+
            '<p>'+examples[i].description+'</p>'+
          '</div>'+
        '</div>'
        // Old div card with read more/ read less descriptions
    // subdiv.innerHTML += '<div class="card">'+
    //       '<div class="card-image">'+
    //         '<img src="/static/ExampleFiles/'+examples[i].filename+'" width=250 height=200>'+
    //       '<span class="card-title"></span>'+
    //       '</div>'+
    //     '<div class="card-content">'+
    //         '<span id=desc'+i+' style="display: inline;">'+shortDesc+'<span id="dots">...</span><span id=readMoreBtn'+i+' style="color:orange;" onclick="readMore(this)">Read more</span></span>'+
    //         '<span id=more'+i+' style="display: none;">'+examples[i].description+'...</span><span id=readlessBtn'+i+' style="color:orange; display:none;" onclick="readMore(this)">Read less</span>'+
    //       '</div>'+
    //       '<div class="card-action">'+
    //         '<a href="'+examples[i].source+'" target="_blank">Example source</a>'+
    //       '</div>'+
    //     '</div>'
    div.appendChild(subdiv)
  
    //if fourth element in div then append to examplecards div and then reset.
    if (div.childElementCount == 4 || i==examples.length-1){
      exampleCards.appendChild(div)
      div = document.createElement('div')
      div.className ="row"
    }
    i++;
  }
}

function clearEndContent(){
  document.getElementById("wiz").style.display = "block"
  document.getElementById("thanks").style.display = "none"
}

function readMore(element){
  id = element.id.slice(-1)
  paragraph = document.getElementById("desc"+id)
  text = document.getElementById("more"+id)
  readless = document.getElementById("readlessBtn"+id)
  if (paragraph.style.display != "none"){
    paragraph.style.display = "none"
    text.style.display="inline"
    readless.style.display="inline"
  }else{
    text.style.display="none"
    readless.style.display="none"
    paragraph.style.display = "inline"
  }
}

function initiateChips(data){
  //fetch tags for autocomplete
  var tags = [];
    fetch('/tags')
    .then((response) => response.json())
    .then((d) => {
      tags = d
       // set inital placeholder values for chips
      $('.chips-initial').chips({
        data: data,
        autocompleteOptions:{
          data: d,
          limit: Infinity,
          minLength: 1
        },
        onChipDelete: (e,d) =>{
          chip =d.childNodes[0].textContent
          var selectedtags = Array()
          $("input:checkbox[type=checkbox]:checked").each(function(){
            selectedtags.push($(this).val());
            //uncheck item
            if ($(this).val() == chip){
              $(this).prop("checked", false);
            }
            
          });
          var chipsData = M.Chips.getInstance($('.chips')).chipsData;
          chipsData.forEach(e =>{
            selectedtags.push(e.tag)
          })
          selectedtags = selectedtags.filter(function(value, index, arr){
            return value != chip;
          })
          
          //set chips
          chips = Array();
            i=0 
            while (i < selectedtags.length){
              chips.push(
                {
                  tag:selectedtags[i]
                }
              )
              i++
            }
          fetchExamples(selectedtags)
        },
        onChipAdd: (e,d) =>{
          var selectedtags = Array()
          var chipsData = M.Chips.getInstance($('.chips')).chipsData;
          chipsData.forEach(e =>{
            selectedtags.push(e.tag)
          })
          fetchExamples(selectedtags)
        }
      });
    })
    .catch((error) => {
      console.error("Error:", error)
    })
}
function fetchExamples(selectedtags){
  log("fetching example set", selectedtags)
   //get images that match tags form backend
   fetch('/examples', {
    method:'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'tags': selectedtags
    })
  })
  .then((response) => response.json())
  .then((data) => {
    createExampleCards(data)
  })
  .catch((error) => {
    console.error("Error:", error)
  })
}

function formSubmission(){
  var selectedtags
  var form = document.querySelector("form")
  form.addEventListener('change', () =>{
    selectedtags = Array();
    $("input:checkbox[type=checkbox]:checked").each(function(){
      selectedtags.push($(this).val());
    });
    var chipsData = M.Chips.getInstance($('.chips')).chipsData;
    chipsData.forEach(e =>{ 
      if (!selectedtags.includes(e.tag)){
        selectedtags.push(e.tag)
      } 
    })
    //set chips
    chips = Array();
      i=0 
      while (i < selectedtags.length){
        chips.push(
          {
            tag:selectedtags[i]
          }
        )
        i++
      }
    initiateChips(chips)
    fetchExamples(selectedtags)
  })
}

function initializeModal(){
  $(document).ready(function(){
    $('.modal').modal();
  });
       
}
function init (){
 
    // $(document).ready(function(){
    //   $('.collapsible').collapsible();
    // });

    document.addEventListener('DOMContentLoaded', function () {
      var elems = document.querySelector('.collapsible');
      var instances = M.Collapsible.init(elems);
      instances.open();

      //load all the tags and initialize chips
    });

  //initialize modal
  initializeModal()

  //create placeholder chips
  formSubmission()
  
  //add all examples
  fetchExamples('all')
  initiateChips([])
}

init()

//  TODO: 
// 1) add a timer for participants in the timing condition. The example set navigation and screen will be disabled for the first 5 minutes. After which the example button will be made available for them.
  // questions: should the experimenter interrupt and then explain the next step of instructions? should they be made aware of the example (and interface) at all or until this point of the experiment
