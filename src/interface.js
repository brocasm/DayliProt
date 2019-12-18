const {Button,
   TextView,
   contentView,
   Canvas,
   Device,
   Composite,
   drawer,
   CollectionView,
   TextInput,
   ProgressBar,
   ActionSheet,
   ImageView,
   NavigationView,
   Page,
   Action,
   DateDialog} = require('tabris');

var config = require("./config");
var conf = config.conf;

var settings = require("./settings");
settings = settings.settings;

const inp_w = 55;
const col_left_width = tabris.device.screenWidth / 2;//50%
const left_cell_height = 70;
const right_cell_height = 45;
const col_height = 350;
const raw_input_height = 60;

const color_meal_selected = "#369ae5";
const box_color = "#2129fa";
const princ_color = "#2129fa";

class cl_interface {

  constructor(){



    this.comp_left = null;
    this.comp_righ = null;
    this.comp_bottom = null;

    this.col_list = null;
    this.col_details = null;

    this.inp_water = null;
    this.inp_prot = null;
    this.bt_save = null;


    this.fn_onCellTap = null;
    this.fn_onDetailTap = null;
    this.fn_onDetailRemove = null;
    this.fn_onMealReset = null;
    this.fn_onSaveTap = null;
    this.fn_onChangeDate = null;

    this.pages = new Array();
    this.conf = conf;

  }
  init(app){
    this.app = app;
  }
  addPage(key,param){
    this.pages[key] = new Page(param);
    return this.pages[key];
  }
  draw_interface(){
    this.nav = new NavigationView({layoutData: 'stretch',actionColor: "white", toolbarColor: princ_color})
    .appendTo(contentView);
    this.nav.drawerActionVisible = true;
    console.log(this.nav.toolbarHeight);
//Date picker
    let dial_date =
    new Action({
      title: 'Agenda',
      image: 'src/img/calendar.png'
    }).onSelect(() => {
      new DateDialog().onSelect(({date}) => {
        if(this.fn_onChangeDate != null){
          this.fn_onChangeDate(date);
        }
      }).open();
    }).appendTo(this.nav);


    new Action({
      title: 'Settings',
      image: 'src/img/settings.png'
    }).onSelect(() => {
      this.nav.append(this.pages["p_settings"]);
    }).appendTo(this.nav);


    settings.init(this);
    settings.read_settings(this);

    this.addPage("p_calc",{id: "p_calc",title: "Aujourd'hui",autoDispose: false});
    this.comp_input = new Composite({id: "comp_input", left: 0, top: 0,width: tabris.device.screenWidth, height: raw_input_height, background: '#D9D9D9'}).appendTo(this.pages["p_calc"]);
    this.comp_left = new Composite({left: 0, top: '#comp_input', width: col_left_width, height: col_height, background: 'linear-gradient(#D9D9D9, #FFFFFF)'}).appendTo(this.pages["p_calc"]);
  	this.comp_righ = new Composite({right: 0, top: '#comp_input', width: col_left_width, height: col_height,background: 'linear-gradient(#D9D9D9, #FFFFFF)'}).appendTo(this.pages["p_calc"]);
    this.comp_bottom = new Composite({left: 0, top: col_height + raw_input_height, width: tabris.device.screenWidth, height: tabris.device.screenHeight - col_height,background: 'linear-gradient(#FFFFFF,#D9D9D9)'}).appendTo(this.pages["p_calc"]);




    this.draw_right();
  	this.draw_left();
  	this.draw_input();
    this.draw_total();

    this.dial_detail = new ActionSheet({
      title: 'Que voulez-vous faire ?',
      actions: [{title: 'Edit'}, {title: 'Supprimer', style: 'destructive'},{title: "Annuler", style:'cancel'}]
    }).onSelect(({index}) => {
      switch (index) {
        case 0:
          this.inp_prot.text = this.entries[this.details_selected].prot;
          this.inp_water.text = this.entries[this.details_selected].water;
          this.inp_label.text = this.entries[this.details_selected].name;
          this.col_details.remove(this.details_selected)
            if(this.fn_onDetailRemove != null){
              this.fn_onDetailRemove(this.details_selected);
            }
          break;
          case 1:
            this.col_details.remove(this.details_selected)
              if(this.fn_onDetailRemove != null){
                this.fn_onDetailRemove(this.details_selected);
              }
            break;
        default:

      }
    });

    this.dial_meal = new ActionSheet({
      title: 'Que voulez-vous faire ?',
      actions: [{title: 'Vider', style: 'destructive'},{title: "Annuler", style:'cancel'}]
    }).onSelect(({index}) => {
      switch (index) {
        case 0:
        this.col_details.remove(0,this.col_details.itemCount);
          if(this.fn_onMealReset != null){
              this.fn_onMealReset(this.meal_selected);
            }

          break;
          case 1:

            break;
        default:

      }
    });



    this.nav.append(this.pages["p_calc"]);

  }
  update_right(entries){
    this.entries = entries;
    this.col_details.dispose();
    this.draw_right();
    if(this.entries.length > 0){
      this.col_details.load(this.entries.length);
    }
    this.col_details.refresh();
    this.fadeIn(this.col_details);


  }
  draw_right(){
    this.col_details = 	new CollectionView({
          left: 0, top: 0, right: 0, bottom: 0,
          cellHeight: right_cell_height,
          itemCount: 0,
          createCell: () => {
            let cell = new Composite();

            cell.onTap(({target,ev}) => {
              if(this.fn_onDetailTap != null){
                this.fn_onDetailTap(target,ev);
              }
             });
             cell.onLongPress.once(({target}) =>{
               if(this.fn_onDetailLPress != null){
                this.fn_onDetailLPress(target);
               }
               this.details_selected = target.myData;

               this.dial_detail.message = "élément choisi: " + this.entries[this.details_selected].name;
               this.dial_detail.open();
             });
            return cell;
          },
          updateCell: (cell, index) =>  {

          let entry = this.entries[index];

          cell.id = "detail_" + index;
          cell.myData = index;

          new Canvas({layoutData: 'stretch'})
        .onResize(({target: canvas, width, height}) => {
          const context = canvas.getContext('2d', width, height);
          context.moveTo(0, 0);

          const scaleFactor = tabris.device.scaleFactor;
          const ctx = canvas.getContext('2d', col_left_width , height);
          ctx.textBaseline = 'top';
          ctx.textAlign = 'center';

          ctx.fillStyle = box_color;
          let x = 55;
          let y = 5;
          let border = 2;
          ctx.fillRect(0, right_cell_height-border, col_left_width , border );
        //  ctx.fillStyle = 'white';
        //  ctx.fillRect(x+border, y+border, col_left_width-5-border*2, left_cell_height-5-border*2 );


        }).appendTo(cell);

          var txt_label = entry.name;
          var txt_qty = ""+entry.prot+" g/"+entry.water+" l";
            new TextView({
              id: "label",
              centerX: true,
              top:'6',
              font: '14px',
              text: txt_label,
              textColor: "black",
              markupEnabled: true
            }).appendTo(cell);
            new TextView({
              id: "label",
              centerX: true,
              top:'prev()',
              font: '12px',
              text: txt_qty,
              textColor: "black",
              markupEnabled: true
            }).appendTo(cell);

          }
        }).appendTo(this.comp_righ);
  }
  draw_left(){
    this.col_list = 	new CollectionView({
    		  left: 0, top: 0, right: 0, bottom: 0,
    		  cellHeight: left_cell_height,
    		  itemCount: this.app.a_days[this.app.day].meals.length,
    		  createCell: () => {
    			  let cell = new Composite();

            cell.onTap(({target,ev}) => {
              if(this.fn_onCellTap != null){
                this.fn_onCellTap(target,ev);
              }
             });
             cell.onLongPress.once(({target}) =>{
               if(this.fn_onMealLPress != null){
                this.fn_onMealLPress(target);
               }
               this.meal_selected = target.myData;
               this.dial_meal.message = "élément choisi: " + this.app.a_days[this.app.day].meals[this.app.meal_selected].label;
               this.dial_meal.open();
             });
    			  return cell;
    		  },
    		  updateCell: (cell, index) =>  {
    			let meal = this.app.a_days[this.app.day].meals[index];

          cell.id = "cell_ " + index;
          cell.myData = index;
    		    new Canvas({layoutData: 'stretch'})
    			.onResize(({target: canvas, width, height}) => {
    			  const context = canvas.getContext('2d', width, height);
    			  context.moveTo(0, 0);

    			  const scaleFactor = tabris.device.scaleFactor;
    			  const ctx = canvas.getContext('2d', col_left_width , height);
    			  ctx.textBaseline = 'top';
    			  ctx.textAlign = 'center';

    			  ctx.fillStyle = box_color;
    			  let x = 5;
    			  let y = 5;
    			  let border = 5;
    			  ctx.fillRect(x, y, col_left_width-5 , left_cell_height-5 );
    			  ctx.fillStyle = 'white';
    			  ctx.fillRect(x+border, y+border, col_left_width-5-border*2, left_cell_height-5-border*2 );


    			}).appendTo(cell);
          var txt_label = meal.label + " ("+meal.entries.length+")";
          var txt_qty = "" + meal.prot + " gr/" + meal.water + " l";
          var temp_color = "black";

          if(meal.selected === true){
            txt_label = "<b>" + txt_label + "</b>";
            txt_qty = "<b>" + txt_qty + "</b>";
            temp_color = color_meal_selected;
          }
            new ImageView({
              image: meal.img,
              width: 50,
              height: 50,
              top: 12,
              left: 12,
              id: "img"
            }).appendTo(cell);
    		    new TextView({
    				  id: "label",
    				  left: '#img 2',
    				  top:12,
    				  font: '16px',
    				  text: txt_label,
              textColor: temp_color,
              markupEnabled: true
    				}).appendTo(cell);
    			  new TextView({
    				  id: "prot_qty",
    				  right: 12,
    				  top: 'prev()',
    				  font: '14px',
              markupEnabled: true,
    				  text: txt_qty,
              textColor: temp_color
    				}).appendTo(cell);
    		  }
    		}).appendTo(this.comp_left);
  }
  draw_input(){
    this.inp_prot = new TextInput({
      left: 'prev() 5',
      width: inp_w,
      keyboard: 'decimal',
      message: 'Prot'
      }).onInput(({text}) => console.log(`Text changed to ${text}`))
        .appendTo(this.comp_input);
  	this.inp_water = new TextInput({
  		left: 'prev() 5',
  		width: inp_w,
      keyboard: 'decimal',
  		message: 'Eau'
  		}).onInput(({text}) => console.log(`Text changed to ${text}`))
  		  .appendTo(this.comp_input);

      this.inp_label = new TextInput({
        left: 'prev() 5',
        width: 150,
        message: 'Dénomination'
        }).onInput(({text}) => console.log(`Text changed to ${text}`))
          .appendTo(this.comp_input);
      this.bt_save = new Button({
  		left: 'prev() 5', top: 0,height: 60,width: 50,
  		  text: '+',
        enabled: false,
        background: princ_color,
        id: "bt_save"
  		}).onSelect(() => {
        if(this.fn_onSaveTap != null){
          this.fn_onSaveTap();
        }
  		}).appendTo(this.comp_input);



  }
  maj_progress(water= 0, prot= 0){
    this.prg_prot.selection = parseInt((prot/this.app.max_prot)*100);
    this.lbl_prot.text = prot + "g";

    this.prg_water.selection = parseInt((water/this.app.max_water)*100);
    this.lbl_water.text = water + "l";

  }
  draw_total(){
    let tmp_comp = new Composite({left: 0, top: 'prev()', width: tabris.device.screenWidth}).appendTo(this.comp_bottom);
    this.comp_tot = tmp_comp;

    this.app.max_prot = (settings.kg * settings.r_prot);
    this.app.max_water = (settings.kg * settings.r_water/1000);
    console.log(`Max prot: ${this.app.max_prot} / max water: ${this.app.max_water}`);
    new TextView({ left: 8, top: '#bt_save',text: 'Total Prot journalier'}).appendTo(tmp_comp);
    this.lbl_prot = new TextView({  top: '#bt_save',right: 16,text: 'Total Prot journalier'}).appendTo(tmp_comp);
    this.prg_prot = new ProgressBar({
      top: 'prev()',
      left: 16, right: 16,
      selection: 0,
      maximum: 100,
      tintColor: "#faaf21",
      id: "prg_prot"
    }).appendTo(tmp_comp);
    new TextView({left: 8,  top: '#prg_prot',text: 'Total Eau journalier'}).appendTo(tmp_comp);
    this.lbl_water = new TextView({  top: '#prg_prot',right: 16,text: 'Total Prot journalier'}).appendTo(tmp_comp);
    this.prg_water = new ProgressBar({
      top: 'prev()',
      left: 16, right: 16,
      tintColor: "blue",
      selection: 0,
      maximum: 100,
      id: "prg_water"
    }).appendTo(tmp_comp);

  }

  format_date(date){
    return date.getDate() + "."+parseInt(date.getMonth()+1) +"."+ date.getFullYear();
  }

  draw_drawer(drawer){
    let a_d = new Array();
    var o_all = new Array();

    a_d[0] = new Date();
    for (var i = 1; i <= 6; i++) {
      a_d[i] = new Date();
      a_d[i].setDate(a_d[i-1].getDate() - 1);
    }

    let spacer = "";
    let t_str = "";
    for (var i = 0; i < 10; i++) {
      spacer += "*";
      t_str += " ";
    }
    spacer = spacer + t_str + spacer + t_str + spacer;

    let col_drawer = new CollectionView({
    		  left: 0, top: 0, right: 0,
    		  //cellHeight: left_cell_height,
          height: 500,
    		  itemCount: a_d.length,
    		  createCell: () => {
    			  let cell = new Composite();

            cell.onTap(({target,ev}) => {


             });
    			  return cell;
    		  },
    		  updateCell: (cell, index) =>  {

          cell.id = "cell_ " + index;
          let txt = this.format_date(a_d[index]);
          let id = this.app.generate_date_ID(a_d[index]);
          let top = `#${index-1}_prg_water 6`;

          if(this.app.a_days[id] != null){
            o_all[id] = {"lbl_prot":null,"lbl_water":null,"p_prot":null,"p_water":null};

            if(index == 0){
              txt = "<b>" + txt + "</b>";
              top = `prev() 6`;
            }

            new TextView({id:"lbl_"+id, left: 8, top: top,text: txt,markupEnabled: true,font: '16px',textColor: "black"}).appendTo(cell);

            //new TextView({ left: 8, top: `#lbl_${id} 6`,text: 'Total Prot journalier'}).appendTo(cell);
            o_all[id].lbl_prot =  new TextView({  top: `#lbl_${id} 6`,left: 6,text: this.app.a_days[id].prot}).appendTo(cell);

            let val_prot = parseInt((this.app.a_days[id].prot/this.app.max_prot)*100);
            o_all[id].p_prot = new ProgressBar({
              top: `#lbl_${id} 6`,
              left: 36, right: 16,
              selection: val_prot,
              maximum: 100,
              tintColor: "#faaf21",
              id: index + "_prg_prot"
            }).appendTo(cell);

            //new TextView({ left: 8, top: `#${index}_prg_prot 6`,text: 'Total Eau journalier'}).appendTo(cell);
            o_all[id].lbl_prot =  new TextView({  top: `#${index}_prg_prot 6`,left: 6,text: this.app.a_days[id].water}).appendTo(cell);

            let val_water = parseInt((this.app.a_days[id].water/this.app.max_water)*100);
            o_all[id].p_prot = new ProgressBar({
              top: `#${index}_prg_prot 6`,
              left: 36, right: 16,
              selection: val_water,
              maximum: 100,
              tintColor: "blue",
              id: index + "_prg_water"
            }).appendTo(cell);
            new TextView({ left: 8,right: 8, top: `prev() 6`,text: spacer}).appendTo(cell)
          }



    		  }
    		}).appendTo(drawer);

    for (var index in a_d) {

    }

/*
    new TextView({ left: 8, top: 'prev() 6',text: 'Total Prot journalier'}).appendTo(drawer);
    this.lbl_prot = new TextView({  top: '#bt_save',right: 16,text: 'Total Prot journalier'}).appendTo(drawer);
    this.prg_prot = new ProgressBar({
      top: 'prev()',
      left: 16, right: 16,
      selection: 0,
      maximum: 100,
      tintColor: "#faaf21",
      id: "prg_prot"
    }).appendTo(drawer);
    new TextView({left: 8,  top: '#prg_prot',text: 'Total Eau journalier'}).appendTo(drawer);
    this.lbl_water = new TextView({  top: '#prg_prot',right: 16,text: 'Total Prot journalier'}).appendTo(drawer);
    this.prg_water = new ProgressBar({
      top: 'prev()',
      left: 16, right: 16,
      tintColor: "blue",
      selection: 0,
      maximum: 100,
      id: "prg_water"
    }).appendTo(drawer);*/
  }

  refreshListing(){
    this.col_list.refresh();
    this.col_details.refresh();

  }
  resetForm(){
    this.inp_label.text = null;
    this.inp_water.text = null;
    this.inp_prot.text = null;

  }

  fadeIn(widget) {
   widget.opacity = 0;
   widget.animate(
   {opacity: 1},
   {duration: 1000, easing: 'ease-in'}
   );

 }
}

let it = new cl_interface();
exports.it = it;

/*


function drawBottom(comp){
  inp_prot = new TextInput({
    left: 'prev() 5',
    width: inp_w,
    keyboard: 'decimal',
    message: 'Prot'
    }).onInput(({text}) => console.log(`Text changed to ${text}`))
      .appendTo(comp);
	inp_water = new TextInput({
		left: 'prev() 5',
		width: inp_w,
    keyboard: 'decimal',
		  message: 'Eau'
		}).onInput(({text}) => console.log(`Text changed to ${text}`))
		  .appendTo(comp);

    inp_label = new TextInput({
      left: 'prev() 5',
      width: 150,
      message: 'Dénomination'
      }).onInput(({text}) => console.log(`Text changed to ${text}`))
        .appendTo(comp);
    bt_save = new Button({
		left: 'prev() 5', top: 0,height: 60,width: 50,
		  text: '+',
      enabled: false
		}).onSelect(() => {
		  addToMeal(meal_selected,inp_water.text,inp_prot.text);
		}).appendTo(comp);
	new Button({
		centerX: true, top: 100,height: 60,
		  text: 'Test'
		}).onSelect(() => {
		  textView.text = 'Tabris.js rocks!';
		  drawer.open();
		}).appendTo(comp);
}

function drawright(comp){

	 new Canvas({layoutData: 'stretch'})
		.onResize(({target: canvas, width, height}) => {
		  const context = canvas.getContext('2d', width, height);
		  context.moveTo(0, 0);

		  const scaleFactor = tabris.device.scaleFactor;
		  const ctx = canvas.getContext('2d', col_left_width , height);
		  ctx.textBaseline = 'top';
		  ctx.textAlign = 'center';

		  ctx.fillStyle = 'white';
		  let x = 5;
		  let y = 5;
		  let border = 5;
		  ctx.fillRect(x, y, col_left_width-5 , left_cell_height-5 );
		  ctx.fillStyle = 'white';
		  ctx.fillRect(x+border, y+border, col_left_width-5-border*2, left_cell_height-5-border*2 );


		}).appendTo(comp);
}

function refreshListing(){
  col_list.refresh();
}

function drawleft(comp){

col_list = 	new CollectionView({
		  left: 0, top: 0, right: 0, bottom: 0,
		  cellHeight: left_cell_height,
		  itemCount: meals.length,
		  createCell: () => {
			  let cell = new Composite();

        cell.onTap(({target,ev}) => {
         textView.text = target.id;
         console.log("clique on : " + target.id);
         meal_selected = parseInt(target.id.replace("cell_", ""));

         if(cell_selected != null){
           resetCell(cell_selected);
         }
         makeSelected(target);
         cell_selected = target;

         });
			  return cell;
		  },
		  updateCell: (cell, index) =>  {
			let meal = meals[index];

      cell.id = "cell_ " + index;
		    new Canvas({layoutData: 'stretch'})
			.onResize(({target: canvas, width, height}) => {
			  const context = canvas.getContext('2d', width, height);
			  context.moveTo(0, 0);

			  const scaleFactor = tabris.device.scaleFactor;
			  const ctx = canvas.getContext('2d', col_left_width , height);
			  ctx.textBaseline = 'top';
			  ctx.textAlign = 'center';

			  ctx.fillStyle = meal.color;
			  let x = 5;
			  let y = 5;
			  let border = 5;
			  ctx.fillRect(x, y, col_left_width-5 , left_cell_height-5 );
			  ctx.fillStyle = 'white';
			  ctx.fillRect(x+border, y+border, col_left_width-5-border*2, left_cell_height-5-border*2 );


			}).appendTo(cell);
      var txt_label = meal.label;
      var txt_qty = "Prot: " + meal.prot + " gr, Eau: " + meal.water + " l";
      var temp_color = "black";

      if(meal_selected == index){
        txt_label = "<b>" + txt_label + "</b>";
        txt_qty = "<b>" + txt_qty + "</b>";
        temp_color = "red";
      }
		    new TextView({
				  id: "label",
				  centerX: true,
				  top:12,
				  font: '18px',
				  text: txt_label,
          textColor: temp_color,
          markupEnabled: true
				}).appendTo(cell);
			  new TextView({
				  id: "prot_qty",
				  centerX: true,
				  top: 'prev()',
				  font: '14px',
          markupEnabled: true,
				  text: txt_qty,
          textColor: temp_color
				}).appendTo(cell);
		  }
		}).appendTo(comp);
}
*/
