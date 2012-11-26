/*
	Moodal plugin for jQuery
	@author: Renan Couto
*/

;(function($) {
	var pluginName = 'moodal',

		defaults = {
			animation: {
				speed: 300
			},

			closeIcon: 'x',

			dimensions: {
				height: 'auto',
				width: 'auto',
				limit: 50
			},

			prefix: 'moodal-',

			preloader: {
				url: 'img/preloader.gif',
				width: 16,
				height: 16
			}
		},

		$els = {};

	$[pluginName] = function(content, options) {
		var plugin,

			// Don't need to change this
			markup = {
				shade: '<div {class} {id}>',
				box: '<div {class} {id}>',
				content: '<div {class}>',
				nav: '<nav {class} {id}><ul>',
				navItem: '<li {class}><span>',
				close: '<span {class} {id}>{i}</span>',
				preloader: '<span {class} {id}><img src="{url}" height="{h}" width="{w}"></span>'
			},

			dimensions = {},

		// Setup
		Init = function() {
			Objs.Define();

			if ($.isEmptyObject($els)) {
				Objs.Setup();
				Objs.Build();
			}

			Content.Define();
			Content.Build();

			Box.Size();
			Box.Position();

			Helpers.Show($els.shade);
			Helpers.Show($els.box, plugin.settings.animation.speed);
		},

		Objs = {
			Define: function() {
				plugin = this;
				plugin.settings = $.extend(true, {}, defaults, options);
			},

			Setup: function() {
				var key, el;

				for (key in markup) {
					el = Helpers.Attrs(markup[key], key);

					if (key === 'close') {
						el = el.replace('{i}', plugin.settings.closeIcon);
					}

					if (key === 'preloader') {
						el = el
							.replace('{url}', plugin.settings.preloader.url)
							.replace('{h}', plugin.settings.preloader.height)
							.replace('{w}', plugin.settings.preloader.width);
					}

					$els[key] = $(el);
				}

				$els.body = $('body');
			},

			Build: function() {
				$els.body.append($els.shade, $els.box);
			}
		},

		Content = {
			Define: function() {
				if (!$.isPlainObject(content)) {
					content = {
						type: 'html',
						data: content
					};
				}
			},

			Build: function() {
				$els.box
					.children('.' + plugin.settings.prefix + 'content')
						.remove();

				$els.content
					.clone()
						.addClass(content.cssClass)
						.html(content.data)
						.appendTo($els.box);
			}
		},

		Box = {
			Size: function() {
				$els.box.show();

				dimensions.width = Math.round($els.box.width());
				dimensions.height = Math.round($els.box.height());

				$els.box.hide();
			},

			Position: function() {
				$els.box.css('margin', (-dimensions.height/2) + 'px 0 0' + (-dimensions.width/2) + 'px');
			}
		},

		Helpers = {
			Attrs: function(el, value) {
				value = plugin.settings.prefix + value;

				var attrs = {
					_class: 'class="' + value + '"',
					id: 'id="' + value + '"'
				};

				return el
					.replace('{class}', attrs._class)
					.replace('{id}', attrs.id);
			},

			Show: function($el, delay) {
				$el
					.delay(delay)
					.fadeIn(plugin.settings.animation.speed);
			},

			Hide: function($el, delay) {
				$el
					.delay(delay)
					.fadeOut(plugin.settings.animation.speed);
			}
		};

		Init();
	};

	$.fn[pluginName] = function(content, options) {
		new $[pluginName](content, options);
	};
})(jQuery);