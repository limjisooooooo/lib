# lib
	# draw
		please include .js and .css file in your html code
		Example =>
			<script type="text/javascript" src="./js/draw.js"></script>
			<link rel="stylesheet" type="text/css" id="theme" href="./css/draw.css"/>
		and
		write code your HTML
			<div class="draw"></draw>
		and your script
			document.addEventListener("DOMContentLoaded", () => {
				drawInit();
			})
			or
			<html>			
				...
				</body>
				<script>
					drawInit();
				</scipt>
			</html>
		now, you can draw anything inside the drawclass.
		the parameter of the drawInit function is object type.
		the key-value pair of the parameter is as follows:
			{shape?:'square'}
			
		more options and modules will be added.
		
			