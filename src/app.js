const {Button, TextView, contentView, Canvas, Device, Composite, drawer, CollectionView, TextInput} = require('tabris');
var interface = require("./interface");
var it = interface.it;

var config = require("./config");
var conf = config.conf;





var cell_selected;
var meal_selected;



var meals = new Array();
try {
  meals = JSON.parse(conf.get_config("meals"));
  for (var index in meals) {
    if (meals[index].selected) {
      meals[index].selected = false;
    }
  }
} catch (e) {

}
console.log("meals from config");
console.log(meals.length);
var water = 0;
var prot = 0;



/*let meals = [
  ['Petit Déj', 'Staudacher'],
  ['Encas Matin', 'Bull'],
  ['Repas Midi', 'Krause'],
  ['Encas AM', 'Böhme López'],
  ['Repas Soir', 'Knauer']
].map(([label, color]) => ({label, color}));
*/

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function resetMeals(){
  meals = new Array();
  meals[0] = {
  		  "label": "Petit Déj",
  		  "color": "#eeff00aa",
        "img": "src/img/breakfast_64.png",
  		  "prot": 0,
  		  "water": 0,
        "selected": false,
        "entries":new Array()
  		};
  meals[1] = {
  		  "label": "Encas 1",
  		  "color": "#a2ff00aa",
        "img": "src/img/break_1_64.png",
  		  "prot": 0,
  		  "water": 0,
        "selected": false,
        "entries":new Array()
  		};
  meals[2] = {
  		  "label": "Midi",
  		  "color": "#00ffe1aa",
        "img": "src/img/diner_64.png",
  		  "prot": 0,
  		  "water": 0,
        "selected": false,
        "entries":new Array()
  		};
  meals[3] = {
  		  "label": "Encas 2",
  		  "color": "#e600ffaa",
        "img": "src/img/break_2_64.png",
  		  "prot": 0,
  		  "water": 0,
        "selected": false,
        "entries":new Array()
  		};
  meals[4] = {
  		  "label": "Soir",
  		  "color": "#969296aa",
        "img": "src/img/evening_64.png",
  		  "prot": 0,
  		  "water": 0,
        "selected": false,
        "entries":new Array()
  		};

      for (var i = 0; i < meals.length; i++) {
        var max = getRandomInt(15);
        for (var x = 0; x < max; x++) {
          var tmp_prot = getRandomInt(50);
          var tmp_water = getRandomInt(3);
          meals[i].entries[x] = {"prot":tmp_prot,"water":tmp_water,"name": meals[i].label+" " + x};
          meals[i].water +=  tmp_water;
          meals[i].prot +=  tmp_prot;
        }
      }
      conf.save_config("meals",meals,true);
}





it.fn_onCellTap  = function(target,ev){
  console.log("clique on : " + target.id);



  if(cell_selected != null){
    resetCell(cell_selected);
    meals[meal_selected].selected = false;
  }
  meal_selected = parseInt(target.id.replace("cell_", ""));
  meals[meal_selected].selected = true;
  makeSelected(target);
  cell_selected = target;
}
it.fn_onSaveTap = function (){
  addToMeal(meal_selected,it.inp_water.text,it.inp_prot.text);
  it.resetForm();
}
it.fn_onDetailRemove = function(index){
  meals[meal_selected].entries.splice(index,1);
  calc_oneMeal(meal_selected);
  save_meals();
}

it.draw_interface(meals);
calcTotal();
it.maj_progress(water,prot);


new Button({
  centerX: true, top: 100,height: 60,
    text: 'Test'
  }).onSelect(() => {
    drawer.open();
    resetMeals();
    it.refreshListing();
  }).appendTo(it.comp_bottom);

function addToMeal(index,water,prot){
  var ret = true;
  if(water > 0){
    ret = false;
  }
  if(prot > 0){
    ret = false;
  }
  if(ret){
    return null;
  }

  meals[index].water += parseInt(water);
  meals[index].prot += parseInt(prot);
  let entry = {"prot":prot,"water":water,"name":it.inp_label.text};
  meals[index].entries[meals[index].entries.length] = entry;
  it.update_right(meals[index].entries);
  save_meals();
}
function save_meals(){
  it.refreshListing();
  calcTotal();
  it.maj_progress(water,prot);
  conf.save_config("meals",meals,true);
}
function resetCell(cell){
  it.bt_save.enabled = false;
  let meal = meals[meal_selected];
	it.refreshListing();

}
function makeSelected(cell){
  it.bt_save.enabled = true;
  console.log(meals[meal_selected]);
  let meal = meals[meal_selected];
  it.update_right(meal.entries);
  it.refreshListing();
}
function calc_oneMeal(index){
  var tmp_water = 0;
  var tmp_prot = 0;
  for (var x in meals[index].entries) {
    tmp_water += parseInt(meals[index].entries[x].water);
    tmp_prot += parseInt(meals[index].entries[x].prot);
  }
  meals[index].water = tmp_water;
  meals[index].prot = tmp_prot;
}
function calcTotal(){
  water = 0;
  prot = 0;
  for (var index in meals) {
    water += parseInt(meals[index].water);
    prot += parseInt(meals[index].prot);
  }
  console.log(`Water ${water} prot ${prot}`);
}
