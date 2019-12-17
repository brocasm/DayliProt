const {Button, TextView, contentView, Canvas, Device, Composite, drawer, CollectionView, TextInput} = require('tabris');
var interface = require("./interface");
var it = interface.it;

var config = require("./config");
var conf = config.conf;


var cell_selected;
var meal_selected;

var d = new Date();
const day ="d_"+ d.getFullYear()+d.getMonth()+d.getDay();

var a_days = {};
let t_days = conf.get_config("days");
try {
  a_days = JSON.parse(t_days);
  for (var index in a_days[day].meals) {
    if (a_days[day].meals[index].selected) {
      a_days[day].meals[index].selected = false;
    }
  }
} catch (e) {
  console.log("pass catch init days" + `day:${day}`);
  a_days = {};
  a_days[day] = {"prot": 0, "water": 0, "meals": new Array()};
  resetMeals();
} finally {

}

console.log(a_days[day]);
console.log("end");


console.log("meals from config");
console.log(a_days[day].meals.length);
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
  a_days[day].meals = new Array();
  a_days[day].meals[0] = {
  		  "label": "Petit Déj",
        "img": "src/img/breakfast_64.png",
  		  "prot": 0,
  		  "water": 0,
        "selected": false,
        "entries":new Array()
  		};
  a_days[day].meals[1] = {
  		  "label": "Encas 1",
        "img": "src/img/break_1_64.png",
  		  "prot": 0,
  		  "water": 0,
        "selected": false,
        "entries":new Array()
  		};
  a_days[day].meals[2] = {
  		  "label": "Midi",
        "img": "src/img/diner_64.png",
  		  "prot": 0,
  		  "water": 0,
        "selected": false,
        "entries":new Array()
  		};
  a_days[day].meals[3] = {
  		  "label": "Encas 2",
        "img": "src/img/break_2_64.png",
  		  "prot": 0,
  		  "water": 0,
        "selected": false,
        "entries":new Array()
  		};
  a_days[day].meals[4] = {
  		  "label": "Soir",
        "img": "src/img/evening_64.png",
  		  "prot": 0,
  		  "water": 0,
        "selected": false,
        "entries":new Array()
  		};
      if(generate){
        for (var i = 0; i < a_days[day].meals.length; i++) {
          var max = getRandomInt(15);
          for (var x = 0; x < max; x++) {
            var tmp_prot = getRandomInt(50);
            var tmp_water = getRandomInt(3);
            a_days[day].meals[i].entries[x] = {"prot":tmp_prot,"water":tmp_water,"name": a_days[day].meals[i].label+" " + x};
            a_days[day].meals[i].water +=  tmp_water;
            a_days[day].meals[i].prot +=  tmp_prot;
          }
        }
      }

      conf.save_config("days",a_days,true);
}





it.fn_onCellTap  = function(target,ev){
  console.log("clique on : " + target.id);



  if(cell_selected != null){
    resetCell(cell_selected);
    a_days[day].meals[meal_selected].selected = false;
  }
  meal_selected = parseInt(target.id.replace("cell_", ""));
  a_days[day].meals[meal_selected].selected = true;
  makeSelected(target);
  cell_selected = target;
}
it.fn_onSaveTap = function (){
  addToMeal(meal_selected,it.inp_water.text,it.inp_prot.text);
  it.resetForm();
}
it.fn_onDetailRemove = function(index){
  a_days[day].meals[meal_selected].entries.splice(index,1);
  calc_oneMeal(meal_selected);
  save_meals();
}
it.fn_onMealReset = function(index){
  console.log(`meal to reset: ${index}`);
  a_days[day].meals[index].entries.splice(0,a_days[day].meals[index].entries.length);
  calc_oneMeal(index);
  save_meals();
}
it.meals = a_days[day].meals;
it.draw_interface(a_days[day].meals);
calcTotal();
it.maj_progress(water,prot);


new Button({
  centerX: true, bottom: 200,height: 60,
    text: 'Test'
  }).onSelect(() => {
    conf.save_config("days",null);
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

  a_days[day].meals[index].water += parseFloat(water);
  a_days[day].meals[index].prot += parseFloat(prot);
  let entry = {"prot":prot,"water":water,"name":it.inp_label.text};
  a_days[day].meals[index].entries[a_days[day].meals[index].entries.length] = entry;
  it.update_right(a_days[day].meals[index].entries);
  save_meals();
}
function save_meals(){
  it.refreshListing();
  calcTotal();
  it.maj_progress(water,prot);
  conf.save_config("days",a_days,true);
}
function resetCell(cell){
  it.bt_save.enabled = false;
  let meal = a_days[day].meals[meal_selected];
	it.refreshListing();

}
function makeSelected(cell){
  it.bt_save.enabled = true;
  console.log(a_days[day].meals[meal_selected]);
  let meal = a_days[day].meals[meal_selected];
  it.update_right(meal.entries);
  it.refreshListing();
}
function calc_oneMeal(index){
  var tmp_water = 0;
  var tmp_prot = 0;
  for (var x in a_days[day].meals[index].entries) {
    tmp_water += parseFloat(a_days[day].meals[index].entries[x].water);
    tmp_prot += parseFloat(a_days[day].meals[index].entries[x].prot);
  }
  a_days[day].meals[index].water = tmp_water;
  a_days[day].meals[index].prot = tmp_prot;
}
function calcTotal(){
  water = 0;
  prot = 0;
  for (var index in a_days[day].meals) {
    var t_water = parseFloat(a_days[day].meals[index].water);
    if(t_water >0 ){
        water += t_water;
        console.log(a_days[day].meals[index]);
    }

    var t_prot = parseFloat(a_days[day].meals[index].prot);
    if(t_prot  >0 ){
        prot += t_prot;
    }


  }
  //water = Math.round(water);
  //prot = Math.round(prot);

  console.log(`curent Water ${water} prot ${prot}`);
}
