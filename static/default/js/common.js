function go(url) {
	window.location.href = url
}
function $id(id) {
	return document.getElementById(id)
}
function iv(id) {
	return $id(id).value
}
function cls(cn, type, func, args) {
	$(cn).live(type, args, function(e) {
		args = args || Array($(e.target)) || args.unshift($(e.target));
		func(args)
	})
}
function getScript(url, callback) {
	var query = arguments[2] || '';
	var ts = +new Date;
	var ret = url.replace(/([?&])_=[^&]*/, "$1_=" + ts);
	url = ret + ((ret === url) ? (/\?/.test(url) ? '&' : '?') + '_=' + ts : '');
	url = url + query;
	var head = document.head || document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.async = 'async';
	script.onload = script.onreadystatechange = function() {
		var isReady = !script.readyState || /loaded|complete/.test(script.readyState);
		if (isReady) {
			script.onload = script.onreadystatechange = null;
			head.removeChild(script);
			callback && callback()
		}
	};
	script.src = url;
	head.appendChild(script)
}
function localDate(timestamp) {
	return new Date(timestamp * 1000).toLocaleString().substr(0, 16).replace(/年|月/g, "-").replace(/日/g, " ")
}
function get(url, data, title, f) {
	$.ajax({
		'url': url,
		'type': 'GET',
		'data': data,
		'dataType': 'json',
		'success': function(res) {
			f(res, title)
		}
	})
}
function post(url, data, title, f) {
	$.ajax({
		'url': url,
		'type': 'POST',
		'data': data,
		'dataType': 'json',
		'success': function(res) {
			f(res, title)
		}
	})
}
function jsonp(url, data, title, f) {
	$.ajax({
		url: url,
		data: data,
		type: 'POST',
		dataType: 'jsonp',
		jsonp: 'jsonpcallback',
		success: function(res) {
			f(res, title)
		}
	})
}
function dialog(url, data) {
	if (!data.width) {
		data.width = 600
	}
	if (!data.height) {
		data.height = 310
	}
	if (url) return art.dialog.open(url, data);
	else return art.dialog(data)
}
function artConfirm(config, fok, fc) {
	art.dialog.confirm(config, fok, fc)
}
function frameDialogClose() {
	$.each(parent.art.dialog.list, function(i, e) {
		e.close()
	})
}
function tips(msg, ctime, followflag) {
	followflag = document.getElementById(followflag);
	var html = "<div class='append'><div class='tips'><div class='tips_content'>" + msg + "</div></div></div>";
	var config = {
		title: "提示",
		content: html,
		time: ctime,
		opacity: 0.87,
		follow: followflag,
		width: 230,
		height: 40,
		padding: '0'
	};
	return dialog('', config)
}
function needlogin(func) {
	NEEDLOGIN_ACTION = func;
	if ($.cookie('uid') == null || $.cookie('uid') == '') {
		var config = {
			title: "快捷登录",
			lock: true,
			opacity: 0.87,
			'height': 330,
			'width': 620
		};
		fastDialog = dialog('/login/needlogin', config);
		window.event.stopPropagation();
		return false
	}
	return true
}
function successTip(msg) {
	tips(msg, 1);
	setTimeout(function() {
		frameDialogClose()
	}, 1000)
}
function goRegister() {
	if ($.cookie('uid') == null || $.cookie('uid') == '') {
		var config = {
			title: "快捷注册",
			lock: true,
			opacity: 0.87,
			'height': 540,
			'width': 650
		};
		fastDialog = dialog('/sign.html', config);
		return false
	}
	return true
}
function defaultImg(that) {
	that.src = "/Static/default/images/headimg/120/long.png"
}
function searchMenu(that) {
	$(that).addClass('expand');
	$(that).siblings('ul').show()
}
function detailTabOptions(that, cls) {
	$('.taboptions>div').hide();
	$('.taboptions').children(cls).show();
	$(that).siblings('li').removeClass('hover');
	$(that).addClass('hover').show()
}
function fold(that) {
	var parent = $(that).parent();
	var wrap = parent.parent();
	if (parent.hasClass('up')) {
		wrap.children('div').show();
		parent.removeClass('up')
	} else {
		wrap.children('div').hide();
		parent.addClass('up')
	}
}
function scrollLoad(container, select, url, params, callback) {
	clearTimeout(loadtime);
	var loadtime = setTimeout(function() {
		var marginBot = 0;
		marginBot = document.documentElement.scrollTop ? document.documentElement.scrollHeight - (document.documentElement.scrollTop + document.body.scrollTop) - document.documentElement.clientHeight : document.body.scrollHeight - document.body.scrollTop - document.body.clientHeight;
		if (marginBot <= 40 && !loading && hasdata) {
			loading = 1;
			page = params['page'] ? params['page'] + 1 : 1;
			params['page'] = page;
			jsonLoad(url, params, callback)
		}
	}, 200);
	$(container).imagesLoaded(function() {
		$(container).masonry({
			itemSelector: select,
			isAnimated: false,
			gutterWidth: 2
		})
	})
}
function jsonLoad(url, params, f) {
	get(url, params, '', function(data) {
		f(data)
	})
}(function() {
	var $backToTopFun = function() {
			var st = jQuery(document).scrollTop(),
				winh = jQuery(window).height();
			(st > 0) ? jQuery(".gotop").show() : jQuery(".gotop").hide();
			if (!window.XMLHttpRequest) {
				$backToTopEle.css("top", st + winh - 166)
			}
		};
	jQuery(document).ready(function() {
		jQuery(".gotop").click(function() {
			jQuery("html, body").animate({
				scrollTop: 0
			}, 600)
		});
		jQuery(window).bind("scroll", $backToTopFun);
		$backToTopFun();
		positionFooter()
	});

	function positionFooter() {
		var footerHeight = $('#footer').height();
		var footerTop = ($(window).scrollTop() + $(window).height() - footerHeight) + "px";
		if (($(document.body).height() + footerHeight) < $(window).height()) {
			$('#footer').css({
				position: "fixed"
			})
		}
	}
	$(window).scroll(positionFooter).resize(positionFooter)
})();
var lazyload = {
	image_count_sprite: 4,
	imgShow: null,
	init: function() {
		lazyload.triggerLoad(0)
	},
	onError: function(img) {
		img.attr('src', $('#placeholder').val());
		img.onerror = null;
		img.attr('width', lazyload.image_width);
		img.addClass('error-img');
		img.parents('.lazyImage').addClass('loaded');
		return true
	},
	lazyload: function(element) {
		var distY = element.parent().offset().top;
		var distReal = distY - $(window).scrollTop();
		var winHeight = $(window).height();
		if (distReal < winHeight && distReal > 0) {
			var img = element.children('a').children('img');
			var imgSrc = img.attr('lazyurl');
			img.attr({
				"src": imgSrc
			});
			img.bind("load", function() {
				lazyload.lazyloadShow(img)
			}).bind("error", function() {
				lazyload.onError(img)
			})
		}
	},
	lazyloadShow: function(el) {
		el.parent().parent('.lazyImage').addClass('loaded');
		el.parent().parent().show();
		el.fadeIn()
	},
	triggerLoad: function() {
		$('.lazyImage').not(".loaded").each(function() {
			lazyload.lazyload($(this));
		})
	}
};
$(window).scroll(function() {
	window.clearTimeout(lazyload.imgShow);
	lazyload.imgShow = window.setTimeout((function() {
		lazyload.triggerLoad();
	}), 1000)
});
$(function() {
	lazyload.init()
});

window.socket = io.connect("http://local.yicker/");