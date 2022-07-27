const hslToHex = (h, s, l) => {
	const hueToRgb = (p, q, t) => {
		if (t < 0) t += 1;
		if (t > 1) t -= 1;
		if (t < 1/6) return p + (q - p) * 6 * t;
		if (t < 1/2) return q;
		if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
		return p;		
	}	
	if(s == 0){
		return rgbToHex(Math.round(l*255),Math.round(l*255),Math.round(l*255));
	}	
	let q = l<0.5? l*(1+s): l+s-l*s;
	let p = 2 * l - q;
	let r = hueToRgb(p, q, h/360 + 1/3);
	let g = hueToRgb(p, q, h/360);
	let b = hueToRgb(p, q, h/360 - 1/3);
	return rgbToHex(Math.round(r*255),Math.round(g*255),Math.round(b*255))
}
const rgbToHex = (r, g, b) => {
	return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

const hexToRgb = (hex) => {	
    let dec = parseInt(hex.replace(/#/,""), 16);
    let r = (dec >> 16) & 255;
    let g = (dec >> 8) & 255;
    let b = dec & 255;    	
	return [r, g, b];
}
const createColorPicker = (fab, shape) => {
	const createPallete = (fab, shape) => {			
		const pallete = document.createElement('div');
		pallete.className="pallete " + (shape?shape:"");
		pallete.style="display:none; width:10vw; height:10vw;";
		pallete.show = async () => {
			fab.querySelector('.pallete').style.opacity = 0
			fab.querySelector('.pallete').style.display = "block";
			let interval = setInterval(() => {
				if (fab.querySelector('.pallete').style.opacity < 1){
					fab.querySelector('.pallete').style.opacity = parseFloat(fab.querySelector('.pallete').style.opacity) + 0.05;
				}else{								
					fab.querySelector('.pallete').style.opacity = null;
					clearInterval(interval);
				}						
			}, 10);				
		}
		pallete.hide = () => {
			return new Promise(resolve => {
				pallete.style.opacity = 1			
				let interval = setInterval(() => {						
					if (pallete.style.opacity > 0){
						pallete.style.opacity = parseFloat(pallete.style.opacity) - 0.05;
					}else{
						pallete.style.display = "none";
						pallete.style.opacity = null;		
						clearInterval(interval);
						resolve();
					}						
				}, 10);	
			});			
		}			
		pallete.addEventListener("click",(e) => {
			let x;
			let y;
			if(pallete.className.match('square')){
				x = Math.round(e.offsetX / e.currentTarget.offsetWidth * 100);
				y = Math.round(e.offsetY / e.currentTarget.offsetHeight * 100);
				pallete.parentElement.querySelector(".colorVal").value=hslToHex(x*3.6, 1, (100-y)*0.005+0.5);
			}else{
				x = Math.round(e.offsetX / e.currentTarget.offsetWidth * 100);
				y = Math.round(e.offsetY / e.currentTarget.offsetHeight * 100);
				let deg = (Math.atan2(x-50,50-y) * 180 / Math.PI);
				pallete.parentElement.querySelector(".colorVal").value=hslToHex(deg<0?360+deg:deg, 1, Math.abs(50-x)>Math.abs(50-y)? ((50-Math.abs(50-x))*0.02 + 1)/2: ((50-Math.abs(50-y))*0.02 + 1)/2);					
			}
			fab.querySelectorAll('input[type="radio"]').forEach(input => {
				input.parentElement.style.borderColor=pallete.parentElement.querySelector(".colorVal").value;
				input.parentElement.style.backgroundImage = input.parentElement.style.backgroundImage.replace(/%23.{6}/,pallete.parentElement.querySelector(".colorVal").value.replace("#","%23"))
			});				
			fab.querySelector('.fab-Main').style.borderColor=pallete.parentElement.querySelector(".colorVal").value;
			fab.querySelector('.fab-Main').style.backgroundImage = fab.querySelector('.fab-Main').style.backgroundImage.replace(/%23.{6}/,pallete.parentElement.querySelector(".colorVal").value.replace("#","%23"));			
							
			pallete.hide().then(() => {
				fab.querySelector('.fab-Items').hide();
			});				
		});
		return pallete;
	}
	const colorPicker = document.createElement('div');
	colorPicker.className="color-picker";
	colorPicker.appendChild(createPallete(fab, shape));
	const colorVal = document.createElement('input');
	colorVal.className="colorVal"
	colorVal.type="hidden";
	colorVal.value="#c7d0ff";			
	colorPicker.appendChild(colorVal);
	return colorPicker;
}
const hexToStrokeStyle = (hex) => {
	let dec = parseInt(hex.replace(/#/,""), 16);
	let r = (dec >> 16) & 255;
	let g = (dec >> 8) & 255;
	let b = dec & 255;    	
	return "rgba(" + r + "," + g + "," + b + ", .3)"; 
}
const createCanvas = (draw) => {
	const canvas = document.createElement("canvas");
	canvas.width = draw.clientWidth;
	canvas.height = draw.clientHeight;
	ctx = canvas.getContext('2d');
	ctx.strokeStyle = hexToStrokeStyle(document.querySelector('.colorVal').value);
	ctx.lineWidth = 13;
	return canvas
}
const drawInit = (option) => {	
	let draw = false;
	let x = 0;
	let y = 0;
	let ctx;	
	let touchIcon = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' enable-background='new 0 0 24 24' height='48px' viewBox='0 0 24 24' width='48px' fill='%23c7d0ff'%3E%3Cg%3E%3Crect fill='none' height='24' width='24' x='0'/%3E%3C/g%3E%3Cg%3E%3Cg%3E%3Cg%3E%3Cpath d='M9,11.24V7.5C9,6.12,10.12,5,11.5,5S14,6.12,14,7.5v3.74c1.21-0.81,2-2.18,2-3.74C16,5.01,13.99,3,11.5,3S7,5.01,7,7.5 C7,9.06,7.79,10.43,9,11.24z M18.84,15.87l-4.54-2.26c-0.17-0.07-0.35-0.11-0.54-0.11H13v-6C13,6.67,12.33,6,11.5,6 S10,6.67,10,7.5v10.74c-3.6-0.76-3.54-0.75-3.67-0.75c-0.31,0-0.59,0.13-0.79,0.33l-0.79,0.8l4.94,4.94 C9.96,23.83,10.34,24,10.75,24h6.79c0.75,0,1.33-0.55,1.44-1.28l0.75-5.27c0.01-0.07,0.02-0.14,0.02-0.2 C19.75,16.63,19.37,16.09,18.84,15.87z'/%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;
	let drawIcon = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='48px' viewBox='0 0 24 24' width='48px' fill='%23c7d0ff'%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M7 14c-1.66 0-3 1.34-3 3 0 1.31-1.16 2-2 2 .92 1.22 2.49 2 4 2 2.21 0 4-1.79 4-4 0-1.66-1.34-3-3-3zm13.71-9.37l-1.34-1.34c-.39-.39-1.02-.39-1.41 0L9 12.25 11.75 15l8.96-8.96c.39-.39.39-1.02 0-1.41z'/%3E%3C/svg%3E")`	
	let fab;
	if(document.getElementsByClassName('draw').length){
		let fabOption={
			className: 'drawFAB',
			blur: () => {
				fab.querySelector('.pallete').hide().then(()=>{
					fab.querySelector('.fab-Items').hide();
				});
			},
			main:{
				style: {backgroundImage: touchIcon},
				click: () => {
					if(fab.querySelector('.fab-Items').open){
						fab.querySelector('.pallete').hide().then(()=>{
							fab.querySelector('.fab-Items').hide();
						});
					}else{
						fab.querySelector('.fab-Items').show();						
					}					
				}
			},
			items:[{
				value:'pointer',
				style: {backgroundImage: touchIcon},
				click: (e) => {
					fab.value = 'pointer';
					fab.querySelector('.fab-Main').style.backgroundImage = e.currentTarget.parentElement.style.backgroundImage;
					fab.querySelector('.pallete').hide().then(()=>{
						fab.querySelector('.fab-Items').hide();
					});
				}				
			},
			{
				value:'draw',
				style: {backgroundImage: drawIcon},
				click: (e) => {
					fab.value = 'draw';
					fab.querySelector('.fab-Main').style.backgroundImage = e.currentTarget.parentElement.style.backgroundImage
					fab.querySelector('.pallete').show();
				}				
			}]
		}
		fab = createFAB(fabOption);
		fab.value = 'pointer';
		fab.appendChild(createColorPicker(fab, option?.shape));
		document.querySelector('body').appendChild(fab);
	}	
	document.querySelectorAll('.draw').forEach(drawArea => {		
		drawArea.appendChild(createCanvas(drawArea));
		drawArea.addEventListener('mousedown', e => {
			if(fab.value == 'draw'){
				draw = true;
				x = e.offsetX;
				y = e.offsetY;				
			}
		});
		drawArea.addEventListener('mousemove', e => {
			if (!draw) return;
			var canvas = drawArea.querySelector('canvas');
			ctx = canvas.getContext('2d');
			ctx.strokeStyle = hexToStrokeStyle(document.querySelector('.colorVal').value);
			ctx.beginPath();
			ctx.moveTo(x, y);
			ctx.lineTo(e.offsetX, e.offsetY);
			x = e.offsetX;
			y = e.offsetY;		
			ctx.stroke();
		});
		drawArea.addEventListener('mouseup', () => {
			draw = false;
		});
		drawArea.addEventListener('mouseout', () => {
			draw = false;
		});
		drawArea.addEventListener('touchstart', e => {
			if(fab.value == 'draw'){
				draw = true;
				var rect = e.target.getBoundingClientRect();
				x = e.targetTouches[0].clientX - rect.left;
				y = e.targetTouches[0].clientY - rect.top;
			}
		});
		drawArea.addEventListener('touchmove', e => {
			if (!draw) return;
			e.preventDefault();
			var canvas = drawArea.querySelector('canvas');
			var rect = e.target.getBoundingClientRect();
			ctx = canvas.getContext('2d');
			ctx.strokeStyle = hexToStrokeStyle(document.querySelector('.colorVal').value);
			ctx.beginPath();
			ctx.moveTo(x, y);
			ctx.lineTo(e.targetTouches[0].clientX - rect.left, e.targetTouches[0].clientY - rect.top);	
			x = e.targetTouches[0].clientX - rect.left;
			y = e.targetTouches[0].clientY - rect.top;			
			ctx.stroke();
		});		
		drawArea.addEventListener('touchend', () => {
			draw = false;
		});		
	});
}