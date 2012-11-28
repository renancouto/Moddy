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
			},

			resize: {
				timer: 500
			},

			theme: 'regular'
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

			dim = {
				box: {},
				frame: {},
				limit: {}
			},

			ajaxSettings = {
				dataType: 'html',

				error: function(a, b, c) {
					throw new Error (pluginName + ' ajax error:', a, b, c);
				},

				success: function(data) {
					content.data = data;
					Content.Build(true);
				}
			},

		// Setup
		Init = function() {
			Objs.Define();

			if ($.isEmptyObject($els)) {
				Objs.Setup();
				Objs.Build();

				Handlers.Setup();
			}

			Content.Define();

			Frame.Size();
			Frame.Handler.Set();

			Helpers.Show($els.shade);
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

				$els.frame = $(window);
				$els.body = $('body');
			},

			Build: function() {
				$els.body.append($els.shade, $els.preloader, $els.box);
			}
		},

		Content = {
			Define: function() {
				var SetType = function(type) {
					content = {
						type: type,
						data: content
					};
				};

				this.Reset();

				if (!$.isPlainObject(content)) {
					SetType('html');
					Content.Build();
				}

				if (content.ajax) {
					SetType('ajax');
					Content.Load();
				}
			},

			Reset: function() {
				$els.box
					.addClass(plugin.settings.theme)
					.removeAttr('style')
					.children('.' + plugin.settings.prefix + 'content')
						.remove();

				$els.preloader.attr('class', plugin.settings.prefix + 'preloader ' + plugin.settings.theme);
			},

			Build: function(fromAjax) {
				$els.content
					.clone()
						.addClass(content.cssClass)
						.html(content.data)
						.appendTo($els.box);

				Box.Setup();
				Helpers.Show($els.box, fromAjax ? 0 : plugin.settings.animation.speed);
			},

			Load: function() {
				var settings = $.extend(true, {}, ajaxSettings, content.data.ajax);
				$.ajax(settings);
			}
		},

		Box = {
			Setup: function(update) {
				if (update) {
					Frame.Size();
				}

				this.Size(update);
				this.Position(update);
			},

			Size: function(update) {
				var Apply = function(prop) {
					$els.box[prop](dim.box[prop]);
				},

				Define = function(prop, method) {
					dim.box[prop] = (method === 'outerHeight' || method === 'outerWidth') ? Math.round($els.box[method](true)) : Math.round($els.box[method]());
				},

				Reset = function(prop) {
					var props = {};
						props[prop] = 'auto';

					if (update) {
						props['max-' + prop] = 'none';
					}

					$els.box.css(props);
				};

				if (update) {
					Reset('width');
					Reset('height');
				}

				$els.box.show();

				if (plugin.settings.dimensions.width !== 'auto') {
					dim.box.width = plugin.settings.dimensions.width;
					Apply('width');
				}

				if (plugin.settings.dimensions.height !== 'auto') {
					dim.box.height = plugin.settings.dimensions.height;
					Apply('height');
				}

				Define('width', update ? 'width' : 'outerWidth');
				Define('height', update ? 'height' : 'outerHeight');

				if (dim.box.width > dim.limit.width) {
					dim.box.width = dim.limit.width;

					Reset('width');
					Reset('height');

					Apply('width');

					Define('height', 'height');
					Apply('height');
				}

				if (dim.box.height > dim.limit.height) {
					dim.box.height = dim.limit.height;

					Reset('height');
					Reset('width');

					Define('width', 'width');
					Apply('width');
				}

				if (!update) {
					$els.box.hide();
				}
			},

			Position: function(update) {
				$els.box.css({
					'margin-top': -dim.box.height/2 + 'px',
					'margin-left': -dim.box.width/2 + 'px',
					'max-height': dim.box.height + 'px',
					'max-width': dim.box.width + 'px',
					'top': '50%',
					'left': '50%'
				});
			}
		},

		Frame = {
			Size: function() {
				dim.frame.width = $els.frame.width();
				dim.frame.height = $els.frame.height();
				dim.limit.width = dim.frame.width - plugin.settings.dimensions.limit;
				dim.limit.height = dim.frame.height - plugin.settings.dimensions.limit;
			},

			Handler: {
				Set: function() {
					var timeout;

					$els.frame.on('resize.' + pluginName, function(){
						clearTimeout(timeout);
						timeout = setTimeout(function() { Box.Setup(true); }, plugin.settings.resize.timer);
					});
				},

				Remove: function() {
					$els.frame.off('resize.' + pluginName);
				}
			}
		},

		Handlers = {
			Setup: function() {
				$els.shade.on('click', function(){
					Helpers.Hide($els.box);
					Helpers.Hide($els.shade, plugin.settings.animation.speed);
					Frame.Handler.Remove();
				});
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
					.delay(delay ? delay + 1 : 0)
					.fadeIn(plugin.settings.animation.speed);
			},

			Hide: function($el, delay) {
				$el
					.delay(delay ? delay + 1 : 0)
					.fadeOut(plugin.settings.animation.speed);
			}
		};

		Init();
	};

	$.fn[pluginName] = function(content, options) {
		new $[pluginName](content, options);
	};
})(jQuery);