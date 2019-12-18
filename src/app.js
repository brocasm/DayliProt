const {Button, TextView, contentView, Canvas, Device, drawer, Composite, CollectionView, TextInput} = require('tabris');
var t_interface = require("./interface");
var it = t_interface.it;

var config = require("./config");
var conf = config.conf;


class cl_app {
  constructor() {
    this.cell_selected = null;
    this.meal_selected = null;

    this.max_prot = 0;
    this.max_water = 0;






  }
  init(){
    this.a_days = {};
    var d = new Date();
    this.day = this.generate_date_ID(d);
    let t_days = this.conf.get_config("days");
    try {
      this.a_days = JSON.parse(t_days);
      console.log("pass get conf " + `day:${this.day}`);
      this.resetSelectedMeal();
    } catch (e) {
      console.log("pass catch init days" + `day:${this.day}`);
      this.a_days = {};
      this.a_days[this.day] = {"prot": 0, "water": 0, "meals": new Array()};
      this.resetMeals();
    } finally {

    }

    console.log(this.a_days[this.day]);
    console.log("end");
  }
  resetSelectedMeal(){
    for (var index in this.a_days[this.day].meals) {
      if (this.a_days[this.day].meals[index].selected) {
        this.a_days[this.day].meals[index].selected = false;
      }
    }
  }
  generate_date_ID(date){
    return "d_"+ date.getFullYear()+date.getMonth()+date.getDate();
  }
  changeDate(date){
    this.day = this.generate_date_ID(date);
    let str_date = this.it.format_date(date);
    console.log(`Nouvelle date choisi: ${this.day}`);

    if(this.a_days[this.day] == null){
      this.a_days[this.day] = {"prot": 0, "water": 0, "meals": new Array()};
      this.resetMeals();
      console.log(`New date not found: reset ${this.day}`);
    }
    this.it.pages["p_calc"].title = `Calc: ${str_date}`;
    this.resetSelectedMeal();
    this.it.refreshListing();
    this.calcTotal();
    this.it.maj_progress(this.a_days[this.day].water,this.a_days[this.day].prot);
    this.it.update_right({});

  }
  resetMeals(generate = false){
    this.a_days[this.day].meals = new Array();
    this.a_days[this.day].meals[0] = {
    		  "label": "Petit Déj",
          "img": "src/img/breakfast_64.png",
    		  "prot": 0,
    		  "water": 0,
          "selected": false,
          "entries":new Array()
    		};
    this.a_days[this.day].meals[1] = {
    		  "label": "Encas 1",
          "img": "src/img/break_1_64.png",
    		  "prot": 0,
    		  "water": 0,
          "selected": false,
          "entries":new Array()
    		};
    this.a_days[this.day].meals[2] = {
    		  "label": "Midi",
          "img": "src/img/diner_64.png",
    		  "prot": 0,
    		  "water": 0,
          "selected": false,
          "entries":new Array()
    		};
    this.a_days[this.day].meals[3] = {
    		  "label": "Encas 2",
          "img": "src/img/break_2_64.png",
    		  "prot": 0,
    		  "water": 0,
          "selected": false,
          "entries":new Array()
    		};
    this.a_days[this.day].meals[4] = {
    		  "label": "Soir",
          "img": "src/img/evening_64.png",
    		  "prot": 0,
    		  "water": 0,
          "selected": false,
          "entries":new Array()
    		};
        if(generate){
          for (var i = 0; i < this.a_days[this.day].meals.length; i++) {
            var max = getRandomInt(15);
            for (var x = 0; x < max; x++) {
              var tmp_prot = getRandomInt(50);
              var tmp_water = getRandomInt(3);
              this.a_days[this.day].meals[i].entries[x] = {"prot":tmp_prot,"water":tmp_water,"name": this.a_days[this.day].meals[i].label+" " + x};
              this.a_days[this.day].meals[i].water +=  tmp_water;
              this.a_days[this.day].meals[i].prot +=  tmp_prot;
            }
          }
        }

        conf.save_config("days",this.a_days,true);
  }
  addToMeal(index,water,prot){
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

    this.a_days[this.day].meals[index].water += parseFloat(water);
    this.a_days[this.day].meals[index].prot += parseFloat(prot);
    let entry = {"prot":prot,"water":water,"name":it.inp_label.text};
    this.a_days[this.day].meals[index].entries[this.a_days[this.day].meals[index].entries.length] = entry;
    this.it.update_right(this.a_days[this.day].meals[index].entries);
    this.save_meals();
  }
  save_meals(){
    this.it.refreshListing();
    this.calcTotal();
    this.it.maj_progress(this.a_days[this.day].water,this.a_days[this.day].prot);
    this.conf.save_config("days",this.a_days,true);
  }
  calcTotal(){
    this.a_days[this.day].water = 0;
    this.a_days[this.day].prot = 0;
    for (var index in this.a_days[this.day].meals) {
      var t_water = parseFloat(this.a_days[this.day].meals[index].water);
      if(t_water >0 ){
          this.a_days[this.day].water += t_water;
          console.log(this.a_days[this.day].meals[index]);
      }

      var t_prot = parseFloat(this.a_days[this.day].meals[index].prot);
      if(t_prot  >0 ){
          this.a_days[this.day].prot += t_prot;
      }


    }
    //water = Math.round(water);
    //prot = Math.round(prot);

    console.log(`curent Water ${this.a_days[this.day].water} prot ${this.a_days[this.day].prot}`);
  }
  calc_oneMeal(index){
    var tmp_water = 0;
    var tmp_prot = 0;
    for (var x in this.a_days[this.day].meals[index].entries) {
      tmp_water += parseFloat(this.a_days[this.day].meals[index].entries[x].water);
      tmp_prot += parseFloat(this.a_days[this.day].meals[index].entries[x].prot);
    }
    this.a_days[this.day].meals[index].water = tmp_water;
    this.a_days[this.day].meals[index].prot = tmp_prot;
  }
}
var app = new cl_app();

app.it = it;
app.conf = conf;
app.init();

it.init(app);
drawer.set({enabled: true});
it.draw_drawer(drawer);


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






it.fn_onCellTap  = function(target,ev){
  console.log("clique on : " + target.id);



  if(app.cell_selected != null){
    resetCell(app.cell_selected);
    app.a_days[app.day].meals[app.meal_selected].selected = false;
  }
  app.meal_selected = parseInt(target.id.replace("cell_", ""));
  app.a_days[app.day].meals[app.meal_selected].selected = true;
  makeSelected(target);
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
app.calcTotal();
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
      conf.save_config("days",null);
    }).appendTo(it.comp_bottom);



function resetCell(cell){
  it.bt_save.enabled = false;
  let meal = app.a_days[app.day].meals[app.meal_selected];
	it.refreshListing();

}
function makeSelected(cell){
  it.bt_save.enabled = true;
  console.log(app.a_days[app.day].meals[app.meal_selected]);
  let meal = app.a_days[app.day].meals[app.meal_selected];
  it.update_right(meal.entries);
  it.refreshListing();
}
