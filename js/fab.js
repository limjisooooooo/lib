const fabInit = (option) => {
    document.getElementsByTagName('body')[0].appendChild(createFAB(option));
}
const createFAB = (option) => {
	const createTouch = () => {
		const createTouchRad = (x, y, r, color) => {
			const touchRadius = document.createElement('span');
			touchRadius.className="touch-Radius"
			touchRadius.style.backgroundColor = color;
			touchRadius.style.left = x-r + "px";
			touchRadius.style.top = y-r + "px";
			touchRadius.style.width = r*2 + "px";
			touchRadius.style.height = r*2 + "px";
			return touchRadius;
		}
		const touchRoot = document.createElement('span');
		touchRoot.className="touch-Root";
		touchRoot.addEventListener('mousedown', e => {
			touchRoot.appendChild(createTouchRad(e.offsetX, e.offsetY, ((e.currentTarget.offsetWidth ** 2 + e.currentTarget.offsetWidth ** 2) ** (1/2)), touchRoot.parentElement.computedStyleMap().get('border-color')));
		})
		touchRoot.addEventListener('mouseup', () => {
			touchRoot.removeChild(touchRoot.querySelector('.touch-Radius'));
			touchRoot.parentElement.click();
		})
		return touchRoot
	}	
	const createFABMain = (fab, main) => {
		const fabMain = document.createElement("div");
		fabMain.className = "fab-Main";
        if(main?.style){
            Object.keys(main.style).map(key => {
                fabMain.style[key] = main.style[key];
            });
        }
		fabMain.appendChild(createTouch());
		fabMain.addEventListener('click',() => {
            if(main?.click){
                main.click();
            }
            else{
                if(fab.querySelector('.fab-Items').open){
                    fab.querySelector('.fab-Items').hide();
                }			
                else{
                    fab.querySelector('.fab-Items').show();
                }
            }            
		});
		return fabMain;
	}	
	const createFABItems = (fab, items) => {
		const createFABItem = (item) => {
			const fabItem = document.createElement("div");
			const radio = document.createElement("input");
			fabItem.className = "fab-Item";		
			radio.type="radio";
			radio.name="fabItem";
			radio.value=item.value;
			radio.addEventListener("click", (e) => {
                if(item?.click) {
                    item.click(e);
                }else{
                    fabItem.parentElement.hide();                
                }
				
			})
			fabItem.appendChild(radio);
            if(item?.style){
                Object.keys(item.style).map(key => {
                    fabItem.style[key] = item.style[key];
                });
            }
			fabItem.appendChild(createTouch());
			fabItem.addEventListener("click", () => {
				radio.click();
			})
			return fabItem;
		}
		const fabItems = document.createElement("div");
		fabItems.className = "fab-Items" + (fab.reverse?" reverse":"");
		fabItems.style.display = "none";
        fabItems.open = false;
		fabItems.hide = () => {
			fabItems.open = false;
			let h = fabItems.clientHeight
			fabItems.style.height = h + "px";
			let interval = setInterval(() => {						
				if (h > 0){
					h -= 5
					fabItems.style.height = h + "px";
				}else{
					fabItems.style.display = "none";
					fabItems.style.height = null;		
					clearInterval(interval);
				}						
			}, 10);
		}
		fabItems.show = () => {
			fabItems.open = true;
			fabItems.style.visibility = "hidden";
			fabItems.style.display = "";
			const target = fabItems.clientHeight;
			fabItems.style.height = "0px";
			fabItems.style.visibility = null;
			let interval = setInterval(() => {						
				if (parseInt(fabItems.style.height) < target){
					fabItems.style.height = parseInt(fabItems.style.height) + 5 + "px";
				}else{
					fabItems.style.height = null;		
					clearInterval(interval);
				}						
			}, 1);
		}
		items?.map(item => {
			fabItems.appendChild(createFABItem(item));
		})
		return fabItems;
	}	
	let x=0;
    let y=0;
    let fabMove = false;
	const fab = document.createElement("div");	
    fab.reverse = option?.reverse
    fab.className = "fab" + (fab.reverse? " reverse": "") + (option?.className? " "+option?.className:"");
	fab.tabIndex = -1;
    if(option?.style){
        Object.keys(option.style).map(key => {
            fab.style[key] = option.style[key];
        });  
    }  
	fab.appendChild(createFABMain(fab, option?.main));
	fab.appendChild(createFABItems(fab, option?.items));
	fab.addEventListener('touchstart', (e) => {
		x = e.targetTouches[0].pageX
		y = e.targetTouches[0].pageY			
		fabMove = true;
	});
	fab.addEventListener('touchend', () => {
		fabMove = false;		
        if(option?.click) option.click();
	});
	fab.addEventListener('touchmove', (e) => {
		if(fabMove){
			e.preventDefault();
            let coor = fab.getBoundingClientRect();
            if (fab.reverse){
                fab.style.right = fab.computedStyleMap().get('right').value - e.targetTouches[0].pageX + x + "px";
                fab.style.bottom = fab.computedStyleMap().get('bottom').value - e.targetTouches[0].pageY + y + "px";
            }else{
                fab.style.left = fab.computedStyleMap().get('left').value + e.targetTouches[0].pageX - x + "px";
                fab.style.top = fab.computedStyleMap().get('top').value +  e.targetTouches[0].pageY - y + "px";                
            }
			x = e.targetTouches[0].pageX;			
			y = e.targetTouches[0].pageY;
		}
	});		
	fab.addEventListener('mousedown', (e) => {
		x = e.pageX
		y = e.pageY
		fabMove = true;
	});
	fab.addEventListener('mouseup', () => {
		fabMove = false;
        if(option?.click) option.click();
	})	
	fab.addEventListener('mousemove', (e) => {
		if(fabMove){
            if (fab.reverse){
                fab.style.right = fab.computedStyleMap().get('right').value - e.pageX + x + "px";
                fab.style.bottom = fab.computedStyleMap().get('bottom').value - e.pageY + y + "px";
            }else{
                fab.style.left = fab.computedStyleMap().get('left').value + e.pageX - x + "px";
                fab.style.top = fab.computedStyleMap().get('top').value +  e.pageY - y + "px";
            }            	           
			x = e.pageX;
			y = e.pageY;
		}
	})		
	fab.addEventListener('blur', () => {
        if(option?.blur){
            option.blur();
        }
        else{
            fab.querySelector('.fab-Items').hide();
        }		
	})
	return fab;
}