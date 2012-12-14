<!DOCTYPE HTML>
<html>
<head>
	<title>Moddy</title>
	<meta charset="utf-8">
	<link rel="stylesheet" href="css/base.css">
	<link rel="stylesheet" href="css/moddy.css">
	<script src="js/modernizr-2.6.2.min.js"></script>
</head>

<?php
// Demos
$simple = "$.moddy('Lorem ipsum dolor sit amet, consectetur adipisicing elit.')";
$fixedWidth = "$.moddy('Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta quod soluta molestiae. Quis maiores aspernatur blanditiis aliquid ullam dolorem esse est ea.', { dimensions: { width: 500 }})";
$ajax = "$.moddy({ ajax: { url: 'content/simple.php' }})";
$callbacks = "$.moddy('Lorem ipsum dolor sit amet, consectetur adipisicing elit.', { callbacks: { show: function(\$el) { console.log(\$el[0]); }, hide: function() { console.log('hide'); } } })";
$multiple = "$.moddy(['Lorem ipsum dolor sit amet, consectetur adipisicing elit.', 'Quis maiores aspernatur blanditiis aliquid ullam dolorem esse est ea.'])";
$multipleAjax = "$.moddy([{ ajax: { url: 'content/a.php' }, nav: { label: 'Content A' } }, { ajax: { url: 'content/b.php' }, nav: { label: 'Content B' } }])";
?>

<body>
	<div class="main-wrapper">
		<header class="main-header">
			<!-- <div class="moddy-icon">
				<div class="horn"></div>
				<div class="eye left"></div>
				<div class="eye right"></div>
				<div class="nose left"></div>
				<div class="nose right"></div>
				<div class="ears"></div>
				<div class="close">x</div>
			</div> -->

			<h1 class="heading main">Moddy</h1>
			<p>Yet another jQuery modal plugin</p>
		</header>

		<div class="content">
			<h2 class="heading section">Demos</h2>

			<section id="simple" class="content-block clickable" title="Click to run!">
				<h3 class="heading">Simple</h3>
				<p class="desc">Just content and no extra settings</p>
				<pre class="code"><?php echo $simple; ?>;</pre>
			</section>

			<section id="fixedWidth" class="content-block clickable" title="Click to run!">
				<h3 class="heading">Fixed width</h3>
				<pre class="code"><?php echo $fixedWidth; ?>;</pre>
			</section>

			<section id="ajax" class="content-block clickable" title="Click to run!">
				<h3 class="heading">Loaded content via Ajax</h3>
				<p class="desc">You can use any jquery's ajax settings</p>
				<pre class="code"><?php echo $ajax; ?>;</pre>
			</section>

			<section id="callbacks" class="content-block clickable" title="Click to run!">
				<h3 class="heading">With callbacks</h3>
				<p class="desc">Available: on show (returns the content item); on hide</p>
				<pre class="code"><?php echo $callbacks; ?>;</pre>
			</section>

			<section id="multiple" class="content-block clickable" title="Click to run!">
				<h3 class="heading">Multiple content</h3>
				<p class="desc"></p>
				<pre class="code"><?php echo $multiple; ?>;</pre>
			</section>

			<section id="multipleAjax" class="content-block clickable" title="Click to run!">
				<h3 class="heading">Multiple content</h3>
				<p class="desc">With Ajax</p>
				<pre class="code"><?php echo $multipleAjax; ?>;</pre>
			</section>
		</div>
	</div>

	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
	<script>!window.jQuery && document.write(unescape('%3Cscript src=js/jquery-1.8.3.min.js%3E%3C/script%3E'))</script>
	<script src="js/jquery.moddy.js"></script>
	<script src="js/jquery.actual.js"></script>

	<script>
	(function($){
		$('#simple.clickable').on('click', function(){ <?php echo $simple ?>; });
		$('#fixedWidth.clickable').on('click', function(){ <?php echo $fixedWidth ?>; });
		$('#ajax.clickable').on('click', function(){ <?php echo $ajax ?>; });
		$('#callbacks.clickable').on('click', function(){ <?php echo $callbacks ?>; });
		$('#multiple.clickable').on('click', function(){ <?php echo $multiple ?>; });
		$('#multipleAjax.clickable').on('click', function(){ <?php echo $multipleAjax ?>; });
	})(jQuery);
	</script>
</body>
</html>

