// ==UserScript==
// @name         AzLyrics+
// @namespace    http://twitter.com/BekirUzun
// @version      0.1.3
// @description  Adds some extra functions to AzLyrics and changes theme
// @author       BekirUzn
// @match        *.azlyrics.com/*
// @homepage     https://github.com/BekirUzun/AzLyricsPlus/
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @updateURL    https://raw.githubusercontent.com/BekirUzun/AzLyricsPlus/master/az-lyrics-plus.user.js
// @downloadURL  https://raw.githubusercontent.com/BekirUzun/AzLyricsPlus/master/az-lyrics-plus.user.js
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        unsafeWindow
// ==/UserScript==

/*jshint multistr: true */


(function() {
    'use strict';

    var fontSize =  GM_getValue("fontSize", '30');
    var fontGlowColor = GM_getValue("fontGlowColor", '#0000FF');
    var linkGlowColor = GM_getValue("linkGlowColor", '#FF0000');
	var boldFontGlowColor = GM_getValue("boldFontGlowColor", '#00FFFF');
    
	var css ='.main-page {width: 90%; font-size: '+fontSize+'px !important; color: #FFF !important; letter-spacing: 1px !important; text-shadow: 0px 0px 5px '+fontGlowColor+', 0px 0px 10px '+fontGlowColor+', 0px 0px 15px '+fontGlowColor+', 0px 0px 20px '+fontGlowColor+', 0px 0px 30px '+fontGlowColor+' !important;}\
		body, .navbar-footer, .footer-wrap {background-color: #000 !important; font-family: "Righteous", cursive !important;}\
		.main-page a {color: #FFF !important; text-shadow: 0px 0px 5px '+linkGlowColor+', 0px 0px 10px '+linkGlowColor+', 0px 0px 15px '+linkGlowColor+', 0px 0px 20px '+linkGlowColor+', 0px 0px 30px '+linkGlowColor+' !important;}\
		.main-page b {color: #FFF !important; text-shadow: 0px 0px 5px '+boldFontGlowColor+', 0px 0px 10px '+boldFontGlowColor+', 0px 0px 15px '+boldFontGlowColor+', 0px 0px 20px '+boldFontGlowColor+', 0px 0px 30px '+boldFontGlowColor+' !important;}\
		.navbar-default {background-color: #55F !important; border-color: #66F !important;}\
		.btn-menu, .btn-primary { background-color: #00F !important; border-color: #00A !important; margin: 1px !important;}\
		.btn-default, .breadcrumb, .panel.album-panel {background-color: #222 !important; border-color: #800 !important;}\
		.btn.focus, .btn:focus, .btn:hover {background-color: #008 !important; border-color: #008 !important;}\
		.lboard-wrap, .links-menu-wrap {background-color: #33D !important; padding-bottom: 10px !important;}\
		@font-face {font-family: "Righteous"; font-style: normal; font-weight: 400; src: local("Righteous"), local("Righteous-Regular"), url(https://fonts.gstatic.com/s/righteous/v5/w5P-SI7QJQSDqB3GziL8XVtXRa8TVwTICgirnJhmVJw.woff2) format("woff2"); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000;}\
		.settings {font-size: 12pt; width: 25em; position: fixed; top: 0px; right: 0px; background: #21B262; color: #ffffff; height: 100%; z-index: 99995; font-family: "Open Sans", Helvetica, sans-serif;  display: none; padding: 40px 10px 10px 10px;}\
		.settings table {width: 100%;}\
		.settings td {padding: 0.2em 0 0 0; width: 50%; line-height: 2em;}\
		.settings button {background-color: #ed4933; box-shadow: none !important; width: 90%; height: 2.0em; color: #fff; font-family: "Open Sans", Helvetica, sans-serif;	font-size: 15pt; font-weight: 400; letter-spacing: 0.1em; border-radius: 4px; border: none; cursor: pointer;}\
		.settings input {font-size: 12pt; color: #fff; font-family: "Open Sans", Helvetica, sans-serif; line-height: 2em; background: rgba(100, 100, 100, 0.25); border-radius: 4px; border: none; padding: 0em 0em 0em 0.3em; text-decoration: none; width: 90%;}\
		input[type="color"] {background: rgba(0, 0, 0, 0); width: 92%; height: 2em; border: none; padding: 0em; position: relative;}\
		.closeSettings {position: fixed; top:0px; right:0px; background-image: url("http://bekiruzun.com/test/1/assets/css/images/close.svg"); background-repeat: no-repeat; background-position: 1em 1em; width: 3em; height: 2em; cursor: pointer;}\
        .openSettings {position: fixed; top:0px; right:0px; background-image: url("http://bekiruzun.com/test/1/assets/css/images/settings.svg"); background-size: 40px; background-repeat: no-repeat; background-position: 0px 10px; width: 50px; height:50px; z-index: 99990; cursor: pointer;}';

    if (typeof GM_addStyle != "undefined") {
        GM_addStyle(css);
    } else if (typeof PRO_addStyle != "undefined") {
        PRO_addStyle(css);
    } else if (typeof addStyle != "undefined") {
        addStyle(css);
    } else {
        var node = document.createElement("style");
        node.type = "text/css";
        node.appendChild(document.createTextNode(css));
        var head = document.getElementsByTagName("head");
        if (head.length > 0) {
            head[0].appendChild(node);
        } else {
            document.documentElement.appendChild(node);
        }
    }
    
    function countLines() {
        var divHeight = document.getElementsByClassName('col-xs-12 col-lg-8 text-center')[0].offsetHeight;
        var lines = divHeight / 42;
        return lines.toFixed(1);
    }

    var path = window.location.pathname;
    if(path.includes("lyrics")){
        var holder = document.getElementsByTagName("h2")[0].getElementsByTagName("b")[0].innerHTML;
        var patharray = path.split("/");
        var artisturl = "/" + patharray[2].charAt(0) + "/" + patharray[2] + ".html";
        document.getElementsByTagName("h2")[0].innerHTML = '<a href="' +artisturl+ '" ><font size="35px">' + holder + '</font></a>';
    }

    var start = document.createElement ('div');
    start.innerHTML = '<button id="start" style="position: fixed; right: 0px; bottom: 50px;" type="button">Start Sliding</button>';
    document.body.appendChild (start);

    document.getElementById ("start").addEventListener (
        "click", function() {scrollDown(duration * 1000);}, false
    );

    var test1 = document.createElement ('div');
    test1.innerHTML = '<button id="test1" style="position: fixed; right: 0px; bottom: 100px;" type="button">Count Lines</button>';
    document.body.appendChild (test1);

    document.getElementById ("test1").addEventListener ( "click", function() {
        document.getElementsByTagName("h2")[0].innerHTML = 'Path: ' + path + '</br> Line count : ' + countLines();
    }, false);

    var stop = document.createElement ('div');
    stop.innerHTML = '<button id="stop" style="position: fixed; right: 0px; bottom: 25px;" type="button">Stop Sliding</button>';
    document.body.appendChild (stop);

    document.getElementById("stop").addEventListener (
        "click", function() {clearInterval(timer);}, false
    );

    var duration = GM_getValue(path, countLines() * 2.5);
    var settings = document.createElement('div');
    settings.innerHTML = '<div class="settings"><table><tbody>\
		<tr><td>Duration (seconds):</td><td><input id="duration" type="number" step="10" value="' + duration + '"></td>\
		<tr><td>Font Size (px):</td><td><input id="fontSize" type="number" value="' + fontSize + '"></td></tr>\
		<tr><td>Font Glow Color:</td><td><input id="fontGlowColor" onchange="changeToHex()" type="color" value="' + fontGlowColor + '"></td></tr>\
		<tr><td>Bold Font Glow Color:</td><td><input id="boldFontGlowColor" onchange="changeToHex()" type="color" value="' + boldFontGlowColor + '"></td></tr>\
		<tr><td>Link Glow Color:</td><td><input id="linkGlowColor" onchange="changeToHex()" type="color" value="' + linkGlowColor + '"></td></tr>\
		<tr><td><button id="save" type="button">Save</button></td><td><button id="reset" type="button">Reset</button></td></tr></tbody></table>\
		<a class="closeSettings"></a>\
	</div> <a id="openSettings" class="openSettings" ></a>';
    document.body.appendChild(settings);

    $('.openSettings, .closeSettings').click(function(){
        $(".settings").toggle(1000);
    });

    /*
    var durationDiv = document.createElement ('div');
    durationDiv.innerHTML = '<input id="duration" style="position: fixed; right: 0px; top: 0px;" type="number" value="' + duration + '">';
    document.body.appendChild (durationDiv);


    var setDurationDiv = document.createElement ('div');
    setDurationDiv.innerHTML = '<button id="setDuration" style="position: fixed; right: 0px; top: 25px;" type="button">Set Duration (seconds) </button>';
    document.body.appendChild (setDurationDiv);

*/
    document.getElementById("save").addEventListener("click", saveSettings, false );
    document.getElementById("reset").addEventListener("click", resetSettings, false );
    document.getElementById("fontGlowColor").addEventListener("change", changeToHex, false );
    document.getElementById("fontGlowColorVal").addEventListener("input", changeToColor, false );

    function setDurationFunc() {
        duration = document.getElementById("duration").value;
        GM_setValue(path, duration);
    }
    function changeToHex(){
        document.getElementById("fontGlowColorVal").value = document.getElementById("fontGlowColor").value;
    }
    function changeToColor(){
        document.getElementById("fontGlowColor").value = document.getElementById("fontGlowColorVal").value;
    }

    function toggleVisibility(cl) {
       var selected = document.getElementsByClassName(cl)[0];
       if(selected.style.display == 'block')
          selected.style.display = 'none';
       else
          selected.style.display = 'block';
    }

    function saveSettings() {
        duration = document.getElementById("duration").value;
        fontSize = document.getElementById("fontSize").value;
        fontGlowColor = document.getElementById("fontGlowColor").value;
        linkGlowColor = document.getElementById("linkGlowColor").value;
        boldFontGlowColor = document.getElementById("boldFontGlowColor").value;
        GM_setValue(path, duration);
        GM_setValue("fontSize", fontSize);
        GM_setValue("fontGlowColor", fontGlowColor);
        GM_setValue("linkGlowColor", linkGlowColor);
        GM_setValue("boldFontGlowColor", boldFontGlowColor);
    }

    
    function resetEverything() {
        var keys = GM_listValues();
        alert(keys + keys.length);
        for (var i=0; i<keys.length; i++) {
            GM_deleteValue(keys[i]);
        }
    }

    function resetSettings() {
        GM_deleteValue(path);
        GM_deleteValue("fontSize");
        GM_deleteValue("fontGlowColor");
        GM_deleteValue("linkGlowColor");
        GM_deleteValue("boldFontGlowColor");
    }

    

    var timer;
    function animate(elem,style,unit,from,to,time,prop) {
        if(!elem) return;
        var start = new Date().getTime();
        timer = setInterval(function() {
            var step = Math.min(1,(new Date().getTime()-start)/time);
            if (prop) {
                elem[style] = (from+step*(to-from))+unit;
            } else {
                elem.style[style] = (from+step*(to-from))+unit;
            }
            if( step == 1) clearInterval(timer);
        },25);
        elem.style[style] = from+unit;
    }

    function scrollDown(duration) {
        var target = document.getElementById("addsong");
        animate(document.body, "scrollTop", "", document.body.scrollTop, target.offsetTop - window.innerHeight, duration, true);
    }

})();
