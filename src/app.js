const {Button, TextView, contentView, Canvas, Device, drawer, Composite, CollectionView, TextInput} = require('tabris');

var t_app = require("./cl_app");
var app = t_app.app;

var t_interface = require("./interface");
var it = t_interface.it;

var config = require("./config");
var conf = config.conf;

var settings = require("./settings");
settings = settings.settings;

const s_version = "v0.4.1";

app.it = it;
app.conf = conf;
app.settings = settings;
app.settings .conf = conf;
app.settings.read_settings();

app.version = s_version;
app.init();

it.init(app);
drawer.set({enabled: true});



it.fn_onCellTap  = function(target,ev){
  console.log("clique on : " + target.id);



  if(app.cell_selected != null){
    it.resetCell(app.cell_selected);
    app.a_days[app.day].meals[app.meal_selected].selected = false;
  }
  app.meal_selected = parseInt(target.id.replace("cell_", ""));
  app.a_days[app.day].meals[app.meal_selected].selected = true;
  it.makeSelected(target);
  app.cell_selected = target;
}
it.fn_onSaveTap = function (){
  app.addToMeal(app.meal_selected,it.inp_water.text,it.inp_prot.text);
  it.resetForm();
}
it.fn_onDetailRemove = function(index){
  app.a_days[app.day].meals[app.meal_selected].entries.splice(index,1);
  app.calc_oneMeal(app.meal_selected);
  app.save_meals();
}
it.fn_onMealReset = function(index){
  console.log(`meal to reset: ${index}`);
  app.a_days[app.day].meals[index].entries.splice(0,app.a_days[app.day].meals[index].entries.length);
  app.calc_oneMeal(index);
  app.save_meals();
}
it.fn_onChangeDate = function (date){
  app.changeDate(date);
}
it.meals = app.a_days[app.day].meals;
it.draw_interface(app.a_days[app.day].meals);
settings.init(it);

app.calcTotal();
it.draw_drawer(drawer);
it.maj_progress(app.a_days[app.day].water,app.a_days[app.day].prot);




new Button({
  centerX: true, bottom: 200,height: 60,
    text: 'Test'
  }).onSelect(() => {
    app.it.col_drawer.refresh();
  }).appendTo(it.comp_bottom);
  new Button({
    left:"prev()", bottom: 200,height: 60,background: "red",
      text: 'Reset'
    }).onSelect(() => {
      randomize_data();
      console.log(app.a_days);
      conf.save_config("days",app.a_days,true);
    }).appendTo(it.comp_bottom);

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function randomize_data(){
  app.a_days = {};

  var d = new Date();
  let max_days = getRandomInt(15);
  console.log(`Gen max: ${max_days}`);
  for (var z = 0; z <= max_days ; z++) {
    var tmp_d = new Date();
    tmp_d.setDate(d.getDate()-z);
    console.log(`pass gen ${tmp_d}`);
    var day = app.generate_date_ID(tmp_d);
    app.a_days[day] = {"prot": 0, "water": 0, "meals": new Array()};
    app.resetMeals(day);
    for (var i = 0; i < app.a_days[day].meals.length; i++) {
      var max = getRandomInt(2);
      for (var x = 0; x < max; x++) {
        var tmp_prot = getRandomInt(50);
        var tmp_water = 0.5;
        app.a_days[day].meals[i].entries[x] = {"prot":tmp_prot,"water":tmp_water,"name": app.a_days[day].meals[i].label+" " + x};
        app.a_days[day].meals[i].water +=  tmp_water;
        app.a_days[day].meals[i].prot +=  tmp_prot;
      }
    }
    app.calcTotal(day);
  }
}
