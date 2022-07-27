# lib
	#draw
		please include .js and .css file in your html code
		Example =>
			<script type="text/javascript" src="./js/draw.js"></script>
			<script type="text/javascript" src="./js/fab.js"></script>
			<link rel="stylesheet" type="text/css" id="theme" href="./css/draw.css"/>
			<link rel="stylesheet" type="text/css" id="theme" href="./css/fab.css"/>
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
![image](https://user-images.githubusercontent.com/48266115/180960754-f84066d2-974d-49e8-b3f5-0151329e5974.png)
<br>
	
		the parameter of the drawInit function is object type.
		the key-value pair of the parameter is as follows:
			{shape?:'square'}

		more options and modules will be added.	
			
