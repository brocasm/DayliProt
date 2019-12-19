const {Button, TextView, contentView, Canvas, Device, drawer, Composite, CollectionView, TextInput} = require('tabris');
class cl_app {
  constructor() {
    this.cell_selected = null;
    this.meal_selected = null;

    this.max_prot = 0;
    this.max_water = 0;


    this.version = "??";



  }
  read_store_data(){
    this.a_days = {};
    let t_days = this.conf.get_config("days");
    try {
      this.a_days = JSON.parse(t_days);
      console.log("pass get conf ");

    } catch (e) {
      console.log("pass catch init days" + `day:${this.day}`);
      this.a_days = {};
    }
  }
  init(){
    this.read_store_data();
    this.clearOldData();

    var d = new Date();
    this.day = this.generate_date_ID(d);
    if(!this.a_days.hasOwnProperty(this.day)){
      console.log(`Generate new Date ${this.day}`);
      this.a_days[this.day] = {"prot": 0, "water": 0, "meals": new Array()};
      this.resetMeals();
      console.log(this.a_days);
    }else{
        this.resetSelectedMeal();
    }


  }
  clearOldData(){
    let count = objectLength(this.a_days)
    console.log(`Nombre d'élément dans a_days = ${count}/${this.settings.nb_historique}`);
    if(count > this.settings.nb_historique){
      let n_to_delete = count - this.settings.nb_historique;
      console.log(`Suppression d'élément ancien ${n_to_delete}`);
      for (var i = 0; i < n_to_delete; i++) {
        delete this.a_days[this.getFirstKey(this.a_days)];
      }

      count = objectLength(this.a_days)
      console.log(`Nombre d'élément dans a_days après suppression = ${count}`);
      console.log(this.a_days);
      this.conf.save_config("days",this.a_days,true);
    }

  }
  getFirstKey(object){
    let ret = null;
    for (var key in object) {
      ret = key;
      break
    }
    return ret;
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

  resetMeals(day = null){
    if(day == null){
      day = this.day;
    }
    this.a_days[day].meals = new Array();
    this.a_days[day].meals[0] = {
    		  "label": "Petit Déj",
          "img": 0,
    		  "prot": 0,
    		  "water": 0,
          "selected": false,
          "entries":new Array()
    		};
    this.a_days[day].meals[1] = {
    		  "label": "Encas 1",
          "img": 1,
    		  "prot": 0,
    		  "water": 0,
          "selected": false,
          "entries":new Array()
    		};
    this.a_days[day].meals[2] = {
    		  "label": "Midi",
          "img": 2,
    		  "prot": 0,
    		  "water": 0,
          "selected": false,
          "entries":new Array()
    		};
    this.a_days[day].meals[3] = {
    		  "label": "Encas 2",
          "img": 3,
    		  "prot": 0,
    		  "water": 0,
          "selected": false,
          "entries":new Array()
    		};
    this.a_days[day].meals[4] = {
    		  "label": "Soir",
          "img": 4,
    		  "prot": 0,
    		  "water": 0,
          "selected": false,
          "entries":new Array()
    		};


        this.conf.save_config("days",this.a_days,true);
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
    let entry = {"prot":prot,"water":water,"name":this.it.inp_label.text};
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
  calcTotal(day = null){
    if(day == null){
      day = this.day;
    }
    this.a_days[day].water = 0;
    this.a_days[day].prot = 0;
    for (var index in this.a_days[day].meals) {
      var t_water = parseFloat(this.a_days[day].meals[index].water);
      if(t_water >0 ){
          this.a_days[day].water += t_water;
      }

      var t_prot = parseFloat(this.a_days[day].meals[index].prot);
      if(t_prot  >0 ){
          this.a_days[day].prot += t_prot;
      }


    }

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



let app = new cl_app();
exports.app = app;

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
function objectLength( object ) {
    var length = 0;
    for( var key in object ) {
        if( object.hasOwnProperty(key) ) {
            ++length;
        }
    }
    return length;
}
function randomize_data(){
  var d = new Date();
  let max_days = getRandomInt(15);
  for (var x = 0; x <= max_days ; x++) {
    var tmp_d = d;
    var day = this.generate_date_ID(tmp_d.setDate(d.getDate()-x));
    app.resetMeals(day);
    for (var i = 0; i < app.a_days[day].meals.length; i++) {
      var max = getRandomInt(15);
      for (var x = 0; x < max; x++) {
        var tmp_prot = getRandomInt(50);
        var tmp_water = getRandomInt(3);
        app.a_days[day].meals[i].entries[x] = {"prot":tmp_prot,"water":tmp_water,"name": app.a_days[day].meals[i].label+" " + x};
        app.a_days[day].meals[i].water +=  tmp_water;
        app.a_days[day].meals[i].prot +=  tmp_prot;
      }
    }
  }
}
