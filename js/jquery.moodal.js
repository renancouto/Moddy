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

			close: {
				show: true,
				icon: 'x',
				title: 'Close'
			},

			dimensions: {
				height: 'auto',
				width: 'auto',
				framePadding: 50,
				minWidth: 400
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

		$els = {},
		preloader;

	$[pluginName] = function(content, options) {
		var plugin,

			// Don't need to change this
			markup = {
				shade: '<div {class} {id}>',
				box: '<div {class} {id}>',
				content: '<div {class}>',
				contentItem: '<div {class}>',
				nav: '<nav {class} {id}><ul>',
				navItem: '<li {class}><span>',
				close: '<span {class} {id} title="{title}">{i}</span>',
				preloader: '<span {class} {id}><img src="{url}" height="{h}" width="{w}"></span>'
			},

			dim = {
				box: {},
				frame: {},
				limit: {},
				preloader: {}
			},

			ajaxSettings = {
				dataType: 'html',

				complete: function() {
					Helpers.Hide($els.preloader);
				},

				error: function(a, b, c) {
					throw new Error (pluginName + ' ajax error:', a, b, c);
				},

				success: function(data) {
					content.data = data;
					setTimeout(function(){ Content.Build(true); }, plugin.settings.animation.speed);
				}
			},

		// Setup
		Init = function() {
			Objs.Define();

			if ($.isEmptyObject($els)) {
				Objs.Setup();
				Objs.Build();

				Common.Handlers();
			}

			Frame.Size();
			Frame.Handler.Set();

			Content.Define();

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
						el = el
							.replace('{i}', plugin.settings.close.icon)
							.replace('{title}', plugin.settings.close.title);
					}

					if (key === 'preloader') {
						el = el
							.replace('{url}', plugin.settings.preloader.url)
							.replace('{h}', plugin.settings.preloader.height)
							.replace('{w}', plugin.settings.preloader.width);

						preloader = el;
					}
					else {
						$els[key] = $(el);
					}
				}

				$els.frame = $(window);
				$els.body = $('body');
			},

			Build: function() {
				$els.box.append($els.content);
				$els.body.append($els.shade, $els.box);
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
					.removeAttr('style');

				$els.content
					.removeAttr('style')
					.attr('class', plugin.settings.prefix + 'content ' + content.cssClass ? content.cssClass : '')
					.children()
						.remove();

				if (plugin.settings.close.show) {
					$els.box.append($els.close);
				}
			},

			Build: function(fromAjax) {
				$els.contentItem
					.clone()
						.html(content.data)
						.appendTo($els.content);

				Box.Setup();
				Helpers.Show($els.box, fromAjax ? 0 : plugin.settings.animation.speed);
			},

			Load: function() {
				var settings = $.extend(true, {}, ajaxSettings, content.data.ajax);

				Preloader.Setup();
				Helpers.Show($els.preloader, 0, function() { $.ajax(settings); });
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
				},

				Set = {
					Width: function (width) {
						dim.box.width = width;

						Reset('width');
						Reset('height');

						Apply('width');

						Define('height', 'height');
						Apply('height');
					},

					Height: function (height) {
						dim.box.height = height;

						Reset('height');
						Reset('width');

						Define('width', 'width');
						Apply('width');
					}
				};

				if (update) {
					Reset('width');
					Reset('height');
				}

				$els.box
					.show()
					.removeClass('min-width');

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

				if (dim.frame.width <= plugin.settings.dimensions.minWidth) {
					$els.box.addClass('min-width');
					Set.Width(dim.frame.width);
				}
				else if (dim.box.width > dim.limit.width) {
					Set.Width(dim.limit.width);
				}

				if (dim.box.height > dim.limit.height) {
					Set.Height(dim.limit.height);
				}

				dim.content = {
					height: $els.content.height(),
					width: $els.content.width()
				};

				if (dim.box.height < dim.content.height) {
					$els.content.addClass('overflow-y');
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

				$els.content.css('max-height', dim.box.height + 'px');
			}
		},

		Frame = {
			Size: function() {
				dim.frame.width = $els.frame.width();
				dim.frame.height = $els.frame.height();
				dim.limit.width = dim.frame.width - plugin.settings.dimensions.framePadding;
				dim.limit.height = dim.frame.height - plugin.settings.dimensions.framePadding;
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

		Preloader = {
			Setup: function() {
				if (!$els.preloader || !$els.preloader.length) {
					$els.preloader = $(preloader);
					$els.preloader.appendTo($els.body);
				}

				$els.preloader
					.attr('class', plugin.settings.prefix + 'preloader ' + plugin.settings.theme)
					.show();

				dim.preloader = {
					width: $els.preloader.width(),
					height: $els.preloader.height()
				};

				$els.preloader.hide();

				this.Position();
			},

			Position: function() {
				$els.preloader.css('margin', -dim.preloader.height/2 + 'px 0 0 ' + -dim.preloader.width/2 + 'px');
			}
		},

		Common = {
			Handlers: function() {
				$els.shade.on('click', Common.Close);
				$els.close.on('click', Common.Close);
			},

			Close: function() {
				Helpers.Hide($els.box);
				Helpers.Hide($els.shade, plugin.settings.animation.speed);
				Frame.Handler.Remove();
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

			Show: function($el, delay, callback) {
				setTimeout(function(){
					if ($el.is('#' + plugin.settings.prefix + 'box') && !$els.shade.is(':visible')) {
						$els.box.hide();
						return;
					}

					$el.fadeIn(plugin.settings.animation.speed, callback);
				}, delay ? delay + 1 : 0);
			},

			Hide: function($el, delay, callback) {
				$el
					.delay(delay ? delay + 1 : 0)
					.stop(true, true)
					.fadeOut(plugin.settings.animation.speed, function() {
						if (callback) {
							callback();
						}

						if ($el.is('#' + plugin.settings.prefix + 'shade') && $els.box.is(':visible')) {
							$els.box.hide();
						}
					});
			}
		};

		Init();
	};

	$.fn[pluginName] = function(content, options) {
		new $[pluginName](content, options);
	};
})(jQuery);