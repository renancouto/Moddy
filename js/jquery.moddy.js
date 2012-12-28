/*
	Moddy plugin for jQuery
	@author: Renan Couto
*/

;(function($) {
	var pluginName = 'moddy',

		defaults = {
			animation: {
				speed: 300
			},

			callbacks: {
				// show, hide
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

			nav: {
				selected: 'selected'
			},

			prefix: 'moddy-',

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
		plugin = {},
		preloader;

	$[pluginName] = function(content, options) {
		// Don't need to change this
		var markup = {
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

			contents = [],

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

			Content.Setup();

			Helpers.Show($els.shade);
		},

		Objs = {
			Define: function() {
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
			Setup: function() {
				var i, t, item;

				if ($.isArray(content)) {
					for (i = 0, t = content.length; i < t; i++) {
						contents.push(this.Define(content[i], i));
					}
				}
				else {
					contents.push(this.Define(content, 0));
				}

				t = contents.length;

				this.Reset();
				Nav.Setup(t > 1);

				for (i = 0; i < t; i++) {
					item = contents[i];

					if (item.type === 'ajax') {
						this.Load(item);
					}
					else {
						this.Build(item);
					}

					if (t > 1) {
						Nav.Build(item);
					}
				}
			},

			Define: function(item, index) {
				if ($.isPlainObject(item)) {
					if (item.ajax) {
						item.type = 'ajax';
						item.data = item.ajax;
					}

					item.index = index;
					return item;
				}
				else {
					return {
						type: 'html',
						data: item,
						index: index
					};
				}
			},

			Reset: function() {
				$els.box
					.addClass(plugin.settings.theme)
					.removeAttr('style');

				$els.content
					.removeAttr('style')
					.children()
						.remove();

				if (plugin.settings.close.show) {
					$els.box.append($els.close);
				}
			},

			Load: function(item) {
				var settings = {
					dataType: 'html',

					complete: function() {
						if (!item.index) {
							Helpers.Hide($els.preloader);
						}
					},

					error: function(a, b, c) {
						throw new Error (pluginName + ' ajax error:', a, b, c);
					},

					success: function(data) {
						item.data = data;
						setTimeout(function(){ Content.Build(item, true); }, plugin.settings.animation.speed);
					}
				};

				settings = $.extend(true, {}, settings, item.data);

				Preloader.Setup();
				Helpers.Show($els.preloader, 0, function() { $.ajax(settings); });
			},

			Build: function(item, fromAjax) {
				var $item = $els.contentItem
					.clone()
						.html(item.data)
						.attr('data-index', item.index)
						.appendTo($els.content);

				Content.Size($item);

				if (item.index) {
					$item.hide();
				}
				else {
					if (plugin.settings.callbacks.build && $.isFunction(plugin.settings.callbacks.build)) {
						plugin.settings.callbacks.build($item);
					}

					Box.Setup();
					Helpers.Show($els.box, fromAjax ? 0 : plugin.settings.animation.speed, plugin.settings.callbacks.show, $item);
				}
			},

			Size: function($item) {
				$els.box.show();

				var dim = {
					width: $item.width(),
					height: $item.height()
				};

				$.data($item[0], 'dimensions', dim);

				$els.box.hide();
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

				$els.content.removeClass('overflow-y');

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

		Nav = {
			Setup: function(build) {
				$els.nav
					.remove()
					.children()
						.empty();

				if (build) {
					$els.box.append($els.nav);
				}
			},

			Build: function(item) {
				var label = item.nav && item.nav.label ? item.nav.label : null,

				$item = $els.navItem
					.clone()
						.html(label)
						.attr({'title': label, 'data-index': item.index})
						.on('click', function() {
							var $this = $(this);

							if ($this.hasClass(plugin.settings.nav.selected)) {
								return;
							}

							Nav.Change($this);

							if (item.nav && item.nav.callback && $.isFunction(item.nav.callback)) {
								item.nav.callback($this);
							}
						})
						.appendTo($els.nav.children());

				if (!item.index) {
					$item.addClass(plugin.settings.nav.selected);
				}
			},

			Change: function($item) {
				$item
					.addClass(plugin.settings.nav.selected)
					.siblings()
						.removeClass(plugin.settings.nav.selected);

				$els.content
					.children()
						.hide()
						.filter('[data-index="' + $item.attr('data-index') + '"]')
							.show();
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

			Close: function(callback) {
				Helpers.Hide($els.box);
				Helpers.Hide($els.shade, plugin.settings.animation.speed, callback ? callback : plugin.settings.callbacks.hide);

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

			Show: function($el, delay, callback, params) {
				setTimeout(function(){
					if ($el.is('#' + plugin.settings.prefix + 'box') && !$els.shade.is(':visible')) {
						$els.box.hide();
						return;
					}

					$el.fadeIn(plugin.settings.animation.speed, callback ? callback(params) : null);
				}, delay ? delay + 1 : 0);
			},

			Hide: function($el, delay, callback) {
				$el
					.delay(delay ? delay + 1 : 0)
					.stop(true, true)
					.fadeOut(plugin.settings.animation.speed, function() {
						if (callback && $.isFunction(callback)) {
							callback();
						}

						if ($el.is('#' + plugin.settings.prefix + 'shade') && $els.box.is(':visible')) {
							$els.box.hide();
						}
					});
			}
		};

		Init();

		// Exposed Methods
		$[pluginName].Close = Common.Close;
	};
})(jQuery);