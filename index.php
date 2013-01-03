<!DOCTYPE HTML>
<html>
<head>
	<title>Moddy</title>
	<meta charset="utf-8">
	<link rel="stylesheet" href="css/base.css">
	<link rel="stylesheet" href="css/moddy.css">
	<script src="js/modernizr-2.6.2.min.js"></script>

	<meta name="google-site-verification" content="googlea35d3a24b1f5905e.html" />
	<script>
	var _gaq = _gaq || [];
		_gaq.push(['_setAccount', 'UA-34287307-1']);
		_gaq.push(['_setDomainName', 'renancouto.com']);
		_gaq.push(['_trackPageview']);

	(function() {
		var ga = document.createElement('script');
			ga.type = 'text/javascript';
			ga.async = true;
			ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	})();
	</script>
</head>

<?php
// Demos
$simple = "$.moddy('Lorem ipsum dolor sit amet, consectetur adipisicing elit.')";
$fixedWidth = "$.moddy('Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta quod soluta molestiae. Quis maiores aspernatur blanditiis aliquid ullam dolorem esse est ea.', { dimensions: { width: 500 }})";
$ajax = "$.moddy({ ajax: { url: 'content/simple.php' }})";
$callbacks = "$.moddy('Lorem ipsum dolor sit amet, consectetur adipisicing elit.', { callbacks: { build: function(\$el) { console.log('build', \$el[0]); }, show: function(\$el) { console.log('show', \$el[0]); }, hide: function() { console.log('hide'); } } })";
$multiple = "$.moddy(['Lorem ipsum dolor sit amet, consectetur adipisicing elit.', 'Quis maiores aspernatur blanditiis aliquid ullam dolorem esse est ea.'])";
$multipleAjax = "$.moddy([{ ajax: { url: 'content/a.php' }, nav: { label: 'Content A' } }, { ajax: { url: 'content/b.php' }, nav: { label: 'Content B' } }])";
?>

<body>
	<div class="main-wrapper">
		<header class="main-header">
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
				<p class="desc">Available: on build / show (returns the content item); on hide</p>
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

