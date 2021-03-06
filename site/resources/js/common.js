// Google Analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-86578-24', 'auto');
ga('send', 'pageview');

$(function() {
	$('nav .menu-link').click(function() {
		$('nav').toggleClass('expanded');
	});

	// Report mailing list subscriptions to Analytics
	$('#mc-embedded-subscribe-form').submit(function() {
		ga('send', 'event', 'Mailing List', 'Subscribe', 'Release Announcements');
	});

	// On docs pages, select the current page in the nav
	$('nav.side a[href="'+window.location.pathname+'"]').addClass('current');

	// Wire up any tabs to show their contents when clicked
	$('.tab-box .tabs .tab').click(function(event) {
		var tabname = $(this).data('tab');
		var $tabbox = $(this).closest('.tab-box');
		if ($tabbox.hasClass('os-tabs')) {
			// switch all tabs on the page to this tab's OS
			$('.tab-box.os-tabs .tab').removeClass('active');
			$('.tab-box.os-tabs .tab-box-body').hide();
			$('.tab-box.os-tabs .tab-'+tabname).addClass('active');
			$('.tab-box-body.tab-'+tabname).show();
		} else {
			// otherwise, just switch tabs in this box
			$('.tab', $tabbox).removeClass('active');
			$('.tab-box-body', $tabbox).hide();
			$('.tab-box.os-tabs .tab-'+tabname, $tabbox).addClass('active');
			$('.tab-box-body.tab-'+tabname, $tabbox).show();
		}
		return suppress(event);
	});

	// Also select the current tab based on the OS, if relevant
	selectTabsByOS();
});

function selectTabsByOS() {
	var os = "linux";
	if (/Macintosh/i.test(navigator.userAgent)) {
		os = "mac";
	} else if (/Windows/i.test(navigator.userAgent)) {
		os = "windows";
	}
	$('.tab-box.os-tabs .tabs .tab-'+os).click();
}


// Get info from the URI
var caddy = {
	queryString: {},
	hash: {}
};
parseQueryString();

// Get values out of the query string and into the caddy global var;
// also gets the hash portion, without the # character.
function parseQueryString()
{
	if (window.location.hash)
		caddy.hash = window.location.hash.substr(1);

	var qs = window.location.search;
	if (!qs)
		return caddy.queryString;
	if (qs.length > 0 && qs[0] == "?")
		qs = qs.substring(1);
	var pairs = qs.split("&");
	for (var i = 0; i < pairs.length; i++)
	{
		var pair = pairs[i];
		keyVal = pair.split("=", 2);
		if (keyVal.length == 1)
			keyVal.push(true);	// empty values default to boolean true so we can know they exist (this is our convention)
		var key = decodeURIComponent(keyVal[0].replace(/\+/g, " "));
		var val = typeof keyVal[1] === 'string'
					? decodeURIComponent(keyVal[1].replace(/\+/g, " "))
					: keyVal[1];
		caddy.queryString[key] = val;
	}

	return caddy.queryString;
}

// suppress completely suppresses an event in all browsers.
function suppress(event)
{
	if (!event)
		return false;
	if (event.preventDefault)
		event.preventDefault();
	if (event.stopPropagation)
		event.stopPropagation();
	event.cancelBubble = true;
	return false;
}