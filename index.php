<!DOCTYPE HTML>
<html>
<head>
	<title>Moodal</title>
	<meta charset="utf-8">
	<link rel="stylesheet" href="css/base.css">
	<link rel="stylesheet" href="css/moodal.css">
	<script src="js/modernizr-2.6.2.min.js"></script>
</head>

<?php
// Demos
$simple = "$.moodal('Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam modi dolore reiciendis fugit? Maiores eligendi autem dolorum qui ad pariatur non eaque consequatur. Possimus eum vitae nesciunt quam consequatur inventore!')";
?>

<body>
	<div id="wrapper">
		<h1 class="heading main">Moodal</h1>
		<p>Yet another jQuery modal plugin</p>

		<h2 class="heading section">Demos</h2>
		<h3 id="simple" class="item">Simple</h3>
		<p class="desc">Just content and no extra settings</p>
		<pre class="code"><?php echo $simple; ?></pre>
	</div>

	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
	<script>!window.jQuery && document.write(unescape('%3Cscript src=js/jquery-1.8.3.min.js%3E%3C/script%3E'))</script>
	<script src="js/jquery.moodal.js"></script>

	<script>
	(function($){
		$('#simple').on('click', function(){ <?php echo $simple ?>; });
	})(jQuery);
	</script>
</body>
</html>

