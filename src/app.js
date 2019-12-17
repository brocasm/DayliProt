const {Button, TextView, contentView, Canvas, Device, Composite, drawer, CollectionView, TextInput} = require('tabris');
var interface = require("./interface");
var it = interface.it;

var config = require("./config");
var conf = config.conf;


var cell_selected;
var meal_selected;



var meals = new Array();
try {
  let t_meals = conf.get_config("meals");
  t_meals = JSON.parse(t_meals);
  if(t_meals.length > 0){
    console.log(`pass 1 ${t_meals}`);
    meals = t_meals;
    for (var index in meals) {
      if (meals[index].selected) {
        meals[index].selected = false;
      }
    }
  }else{
    meals = new Array();
    resetMeals();
    console.log("pass 2");
  }

} catch (e) {
  meals = new Array();
  resetMeals();
    console.log("pass 3");
}
console.log("meals from config");
console.log(meals.length);
var water = 0.0;
var prot = 0.0;



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

function resetMeals(generate = false){
  meals = new Array();
  meals[0] = {
  		  "label": "Petit Déj",
        "img": "src/img/breakfast_64.png",
  		  "prot": 0,
  		  "water": 0,
        "selected": false,
        "entries":new Array()
  		};
  meals[1] = {
  		  "label": "Encas 1",
        "img": "src/img/break_1_64.png",
  		  "prot": 0,
  		  "water": 0,
        "selected": false,
        "entries":new Array()
  		};
  meals[2] = {
  		  "label": "Midi",
        "img": "src/img/diner_64.png",
  		  "prot": 0,
  		  "water": 0,
        "selected": false,
        "entries":new Array()
  		};
  meals[3] = {
  		  "label": "Encas 2",
        "img": "src/img/break_2_64.png",
  		  "prot": 0,
  		  "water": 0,
        "selected": false,
        "entries":new Array()
  		};
  meals[4] = {
  		  "label": "Soir",
        "img": "src/img/evening_64.png",
  		  "prot": 0,
  		  "water": 0,
        "selected": false,
        "entries":new Array()
  		};
      if(generate){
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
it.fn_onMealReset = function(index){
  console.log(`meal to reset: ${index}`);
  meals[index].entries.splice(0,meals[index].entries.length);
  calc_oneMeal(index);
  save_meals();
}
it.meals = meals;
it.draw_interface(meals);
calcTotal();
it.maj_progress(water,prot);


new Button({
  centerX: true, bottom: 200,height: 60,
    text: 'Test'
  }).onSelect(() => {
    conf.save_config("meals",null);
  }).appendTo(it.comp_bottom);

function addToMeal(index,water,prot){
  var ret = true;
  if(water > 0){
    ret = false;
  }else{
    water = 0;
  }
  if(prot > 0){
    ret = false;
  }else{
    prot = 0;
  }
  if(ret){
    return null;
  }

  meals[index].water += parseFloat(water);
  meals[index].prot += parseFloat(prot);
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
    tmp_water += parseFloat(meals[index].entries[x].water);
    tmp_prot += parseFloat(meals[index].entries[x].prot);
  }
  meals[index].water = tmp_water;
  meals[index].prot = tmp_prot;
}
function calcTotal(){
  water = 0;
  prot = 0;
  for (var index in meals) {
    var t_water = parseFloat(meals[index].water);
    if(t_water >0 ){
        water += t_water;
        console.log(meals[index]);
    }

    var t_prot = parseFloat(meals[index].prot);
    if(t_prot  >0 ){
        prot += t_prot;
    }


  }
  //water = Math.round(water);
  //prot = Math.round(prot);

  console.log(`curent Water ${water} prot ${prot}`);
}
