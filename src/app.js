const {Button, TextView, contentView, Canvas, Device, Composite, drawer, CollectionView} = require('tabris');





const textView = new TextView({
  centerX: true, top: 'prev() 50',
  font: '24px'
}).appendTo(contentView);

drawer
.set({enabled: true})
.append(new TextView({text: 'Drawer content'}));

var comp_home;

const col_left_width = tabris.device.screenWidth / 2;//50%
const left_cell_height = 70;
var meals = new Array();
meals[0] = { 
		  "label": "Petit Déj", 
		  "color": "#eeff00aa", 
		  "prot": 0,
		  "water": 0,
		};
meals[1] = { 
		  "label": "Encas 1", 
		  "color": "#a2ff00aa", 
		  "prot": 0,
		  "water": 0,
		};
meals[2] = { 
		  "label": "Midi", 
		  "color": "#00ffe1aa", 
		  "prot": 0,
		  "water": 0,
		};
meals[3] = { 
		  "label": "Encas 2", 
		  "color": "#e600ffaa", 
		  "prot": 0,
		  "water": 0,
		};
meals[4] = { 
		  "label": "Soir", 
		  "color": "#969296aa", 
		  "prot": 0,
		  "water": 0,
		};


/*let meals = [
  ['Petit Déj', 'Staudacher'],
  ['Encas Matin', 'Bull'],
  ['Repas Midi', 'Krause'],
  ['Encas AM', 'Böhme López'],
  ['Repas Soir', 'Knauer']
].map(([label, color]) => ({label, color}));
*/

draw_interface();
function draw_interface(){	
	comp_home = new Composite({left: 0, top: 0, width: col_left_width, height: 350}).appendTo(contentView);
	let comp_right = new Composite({right: 0, top: 0, width: col_left_width, height: 350}).appendTo(contentView);
	drawleft(comp_home);
	drawright(comp_right);
	
	/*new Button({
		  centerX: true, top: 100,
		  text: 'Show message'
		}).onSelect(() => {
		  textView.text = 'Tabris.js rocks!';
		  drawer.open();
		}).appendTo(comp_home);*/
	
	
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

function drawleft(comp){
	
	new CollectionView({
		  left: 0, top: 0, right: 0, bottom: 0,
		  cellHeight: left_cell_height,
		  itemCount: meals.length,
		  createCell: () => {
			  let cell = new Composite();		  
			  
			  
			  return cell;
		  },
		  updateCell: (cell, index) =>  {
			let meal = meals[index];
		    cell.apply({
		    	'#label': {text: meal.label},
		    	'#prot_qty': {text: "Prot: 0 gr, Eau: 0 l"}
		      });
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
		    new TextView({
				  id: "label",
				  centerX: true,
				  top:12,
				  font: '18px',
				  text: meal.label
				}).appendTo(cell);
			  new TextView({
				  id: "prot_qty",
				  centerX: true,
				  top: 'prev()',				 
				  font: '14px',
				  text: "Prot: " + meal.prot + " gr / Eau: " + meal.water + " l" 
				}).appendTo(cell);
		  }
		}).appendTo(comp);
}


function drawShapes(canvas, width, height) {
	  const scaleFactor = tabris.device.scaleFactor;
	  const ctx = canvas.getContext('2d', width * scaleFactor, height * scaleFactor);
	  ctx.scale(scaleFactor, scaleFactor);
	  ctx.textBaseline = 'top';
	  ctx.textAlign = 'center';

	  ctx.fillStyle = '#db4437aa';
	  ctx.fillRect(40, 20, 80, 60);
	  ctx.fillStyle = '#3f51b5aa';
	  ctx.fillRect(60, 40, 80, 60);
	  ctx.fillStyle = '#8dbd00aa';
	  ctx.fillRect(20, 60, 80, 60);
	  ctx.fillStyle = 'black';
	  ctx.fillText('transparency', 80, 130);

	  ctx.lineWidth = 2;
	  ctx.strokeStyle = '#db4437';
	  drawLinear(ctx, 220, 40);
	  ctx.stroke();

	  ctx.strokeStyle = '#3f51b5';
	  drawQuadratic(ctx, 220, 70);
	  ctx.stroke();

	  ctx.strokeStyle = '#8dbd00';
	  drawBezier(ctx, 220, 100);
	  ctx.stroke();
	  ctx.fillText('curves', 220, 130);

	  ctx.lineWidth = 2;
	  ctx.strokeStyle = 'black';
	  drawPath(ctx, 80, 220, 50);
	  ctx.stroke();
	  ctx.fillText('path', 80, 270);

	  drawArc(ctx, 220, 220, 45);
	  ctx.fillStyle = '#fed100';
	  ctx.fill();
	  ctx.fillStyle = 'black';
	  ctx.fillText('arc', 220, 270);
	}

	function drawLinear(ctx, x, y) {
	  ctx.beginPath();
	  ctx.moveTo(x - 50, y);
	  ctx.lineTo(x - 25, y - 15);
	  ctx.lineTo(x + 25, y + 15);
	  ctx.lineTo(x + 50, y);
	}

	function drawQuadratic(ctx, x, y) {
	  ctx.beginPath();
	  ctx.moveTo(x - 50, y);
	  ctx.quadraticCurveTo(x - 25, y - 25, x, y);
	  ctx.quadraticCurveTo(x + 25, y + 25, x + 50, y);
	}

	function drawBezier(ctx, x, y) {
	  ctx.beginPath();
	  ctx.moveTo(x - 50, y);
	  ctx.bezierCurveTo(x - 50, y - 25, x, y - 25, x, y);
	  ctx.bezierCurveTo(x, y + 25, x + 50, y + 25, x + 50, y);
	}

	function drawPath(ctx, x, y, radius) {
	  ctx.beginPath();
	  const rotate = -Math.PI / 2;
	  ctx.moveTo(x, y - radius);
	  for (let i = 0; i <= 4 * Math.PI; i += (4 * Math.PI) / 5) {
	    ctx.lineTo(x + radius * Math.cos(i + rotate), y + radius * Math.sin(i + rotate));
	  }
	  ctx.closePath();
	}

	function drawArc(ctx, x, y, radius) {
	  ctx.beginPath();
	  ctx.moveTo(x, y);
	  ctx.arc(x, y, radius, Math.PI / 4, -Math.PI / 4);
	  ctx.closePath();
	}