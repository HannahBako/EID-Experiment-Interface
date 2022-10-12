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
    var subdiv = document.createElement('div')
    subdiv.className = "col s12 m6 l3"
    subdiv.innerHTML += '<div class="card">'+
          '<div class="card-image">'+
            '<img src="/static/ExampleFiles/'+examples[i].filename+'" width=250 height=200>'+
          '<span class="card-title"></span>'+
          '</div>'+
        // '<div class="card-content">'+
        //     '<p>Example description:'+examples[i].description+'</p>'+
        //   '</div>'+
          '<div class="card-action">'+
            '<a href="'+examples[i].source+'" target="_blank">Example source</a>'+
          '</div>'+
        '</div>'
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

function initiateChips(data){
  // set inital placeholder values for chips
  $('.chips-initial').chips({
    data: data,
    autocompleteOptions:{
      data: {
        'Agriculture': null,
        'Investments': null,
        'Continous': null
      },
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
      selectedtags = selectedtags.filter(function(value, index, arr){
        return value != chip;
      })
      console.log(selectedtags)
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
    }
  });
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
    console.log(selectedtags)
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
 
    $(document).ready(function(){
      $('.collapsible').collapsible();
    });

  //initialize modal
  initializeModal()

  //create placeholde chips
  formSubmission()
  
  //add all examples
  fetchExamples('all')
}

init()

//  TODO: 
// 1) add a timer for participants in the timing condition. The example set navigation and screen will be disabled for the first 5 minutes. After which the example button will be made available for them.
  // questions: should the experimenter interrupt and then explain the next step of instructions? should they be made aware of the example (and interface) at all or until this point of the experiment
