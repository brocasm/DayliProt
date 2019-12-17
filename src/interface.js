const {Button, TextView, contentView, Canvas, Device, Composite, drawer, CollectionView, TextInput, ProgressBar,ActionSheet,ImageView } = require('tabris');

var config = require("./config");
var conf = config.conf;

const inp_w = 55;
const col_left_width = tabris.device.screenWidth / 2;//50%
const left_cell_height = 70;
const right_cell_height = 25;
const col_height = 350;

const color_meal_selected = "#369ae5";

drawer.set({enabled: true});

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
    this.fn_onSaveTap = null;
  }
  draw_interface(meals){
    this.comp_left = new Composite({left: 0, top: 0, width: col_left_width, height: col_height, background: 'linear-gradient(#D9D9D9, #FFFFFF)'}).appendTo(contentView);
  	this.comp_righ = new Composite({right: 0, top: 0, width: col_left_width, height: col_height,background: 'linear-gradient(#D9D9D9, #FFFFFF)'}).appendTo(contentView);
    this.comp_bottom = new Composite({left: 0, top: 350, width: tabris.device.screenWidth, height: tabris.device.screenHeight - col_height,background: 'linear-gradient(#FFFFFF,#D9D9D9)'}).appendTo(contentView);




    this.draw_right();
  	this.draw_left(meals);
  	this.draw_bottom();
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

          var txt_label = entry.name + " p: "+entry.prot+"g, e: "+entry.water+"l";
          var txt_qty = "qty";
            new TextView({
              id: "label",
              centerX: true,
              top:'prev()',
              font: '18px',
              text: txt_label,
              textColor: "black",
              markupEnabled: true
            }).appendTo(cell);

          }
        }).appendTo(this.comp_righ);
  }
  draw_left(meals){
    this.col_list = 	new CollectionView({
    		  left: 0, top: 0, right: 0, bottom: 0,
    		  cellHeight: left_cell_height,
    		  itemCount: meals.length,
    		  createCell: () => {
    			  let cell = new Composite();

            cell.onTap(({target,ev}) => {
              if(this.fn_onCellTap != null){
                this.fn_onCellTap(target,ev);
              }
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
  draw_bottom(){
    this.inp_prot = new TextInput({
      left: 'prev() 5',
      width: inp_w,
      keyboard: 'decimal',
      message: 'Prot'
      }).onInput(({text}) => console.log(`Text changed to ${text}`))
        .appendTo(this.comp_bottom);
  	this.inp_water = new TextInput({
  		left: 'prev() 5',
  		width: inp_w,
      keyboard: 'decimal',
  		message: 'Eau'
  		}).onInput(({text}) => console.log(`Text changed to ${text}`))
  		  .appendTo(this.comp_bottom);

      this.inp_label = new TextInput({
        left: 'prev() 5',
        width: 150,
        message: 'Dénomination'
        }).onInput(({text}) => console.log(`Text changed to ${text}`))
          .appendTo(this.comp_bottom);
      this.bt_save = new Button({
  		left: 'prev() 5', top: 0,height: 60,width: 50,
  		  text: '+',
        enabled: false,
        id: "bt_save"
  		}).onSelect(() => {
        if(this.fn_onSaveTap != null){
          this.fn_onSaveTap();
        }
  		}).appendTo(this.comp_bottom);



  }
  maj_progress(water= 0, prot= 0){
    this.prg_prot.selection = parseInt(prot);
    this.lbl_prot.text = this.prg_prot.selection + "g";

    this.prg_water.selection = parseInt(water);
    this.lbl_water.text = this.prg_water.selection + "l";

  }
  draw_total(){
    new TextView({ left: 8, top: '#bt_save',text: 'Total Prot journalier'}).appendTo(this.comp_bottom);
    this.lbl_prot = new TextView({  top: '#bt_save',right: 16,text: 'Total Prot journalier'}).appendTo(this.comp_bottom);
    this.prg_prot = new ProgressBar({
      top: 'prev()',
      left: 16, right: 16,
      selection: 50,
      id: "prg_prot"
    }).appendTo(this.comp_bottom);
    new TextView({left: 8,  top: '#prg_prot',text: 'Total Eau journalier'}).appendTo(this.comp_bottom);
    this.lbl_water = new TextView({  top: '#prg_prot',right: 16,text: 'Total Prot journalier'}).appendTo(this.comp_bottom);
    this.prg_water = new ProgressBar({
      top: 'prev()',
      left: 16, right: 16,
      tintColor: "blue",
      selection: 50,
      id: "prg_water"
    }).appendTo(this.comp_bottom);

  }

  refreshListing(){
    this.col_list.refresh();
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

exports.it = new cl_interface();
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