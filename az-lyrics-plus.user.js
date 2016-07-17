// ==UserScript==
// @name	AzLyrics +
// @description Adds some extra functions to AzLyrics and changes theme
// @version     1.0.0
// @author      Bekir Uzun
// @namespace   https://greasyfork.org/en/scripts/21458-azlyrics
// @match       *.azlyrics.com/*
// @run-at      document-start
// @license     https://creativecommons.org/licenses/by-sa/4.0/
// @icon        https://raw.githubusercontent.com/BekirUzun/AzLyricsPlus/master/az_lyrics_plus_logo.png
// @homepage	https://github.com/BekirUzun/AzLyricsPlus
// @supportURL  https://github.com/BekirUzun/AzLyricsPlus/issues
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @grant       GM_addStyle
// @grant   	GM_setValue
// @grant   	GM_getValue
// @grant   	GM_deleteValue
// @grant   	GM_listValues
// @grant   	unsafeWindow
// ==/UserScript==
/*jshint multistr: true */
(function() {
    'use strict';

    var fontSize = GM_getValue("fontSize", '30');
    var fontGlowColor = GM_getValue("fontGlowColor", '#0000FF');
    var linkGlowColor = GM_getValue("linkGlowColor", '#FF0000');
    var boldFontGlowColor = GM_getValue("boldFontGlowColor", '#00FFFF');
    var backgroundColor = GM_getValue("backgroundColor", '#000000');
    var duration, duration_copy, path;

    var css = '.main-page {width: 90%; font-size: ' + fontSize + 'px !important; color: #FFF !important; letter-spacing: 1px !important; text-shadow: 0px 0px 5px ' + fontGlowColor + ', 0px 0px 10px ' + fontGlowColor + ', 0px 0px 15px ' + fontGlowColor + ', 0px 0px 20px ' + fontGlowColor + ', 0px 0px 30px ' + fontGlowColor + ' !important;}\
		body, .navbar-footer, .footer-wrap {background: ' + backgroundColor + '; font-family: "Righteous", cursive !important; line-height: 1.4 !important;}\
		.main-page a {color: #FFF !important; text-shadow: 0px 0px 5px ' + linkGlowColor + ', 0px 0px 10px ' + linkGlowColor + ', 0px 0px 15px ' + linkGlowColor + ', 0px 0px 20px ' + linkGlowColor + ', 0px 0px 30px ' + linkGlowColor + ' !important;}\
		.main-page b {color: #FFF !important; text-shadow: 0px 0px 5px ' + boldFontGlowColor + ', 0px 0px 10px ' + boldFontGlowColor + ', 0px 0px 15px ' + boldFontGlowColor + ', 0px 0px 20px ' + boldFontGlowColor + ', 0px 0px 30px ' + boldFontGlowColor + ' !important;}\
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
        .openSettings {position: fixed; top:0px; right:0px; background-image: url("https://raw.githubusercontent.com/BekirUzun/AzLyricsPlus/master/img/gear-icon.png"); background-size: 40px; background-repeat: no-repeat; background-position: 0px 10px; width: 50px; height:50px; z-index: 99990; cursor: pointer;}\
        .start {position: fixed; top:50px; right:0px; background-image: url("https://raw.githubusercontent.com/BekirUzun/AzLyricsPlus/master/img/play-icon.png"); background-size: 40px; background-repeat: no-repeat; background-position: 0px 10px; width: 50px; height:50px; z-index: 99991; cursor: pointer;}\
        .stop {position: fixed; top:50px; right:0px; background-image: url("https://raw.githubusercontent.com/BekirUzun/AzLyricsPlus/master/img/stop-icon.png"); background-size: 40px; background-repeat: no-repeat; background-position: 0px 10px; width: 50px; height:50px; z-index: 99990; cursor: pointer;}';

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

    //Thanks to Brock Adams @  http://stackoverflow.com/questions/26268816/how-to-get-a-greasemonkey-script-to-run-both-at-run-at-document-start-and-at-r#answer-26269087
    document.addEventListener("DOMContentLoaded", DOM_ContentReady);

    function DOM_ContentReady() {
        path = window.location.pathname;
        if (path.includes("lyrics")) {
            var holder = document.getElementsByTagName("h2")[0].getElementsByTagName("b")[0].innerHTML;
            var patharray = path.split("/");
            var artisturl = "/" + patharray[2].charAt(0) + "/" + patharray[2] + ".html";
            document.getElementsByTagName("h2")[0].innerHTML = '<a href="' + artisturl + '" ><font size="35px">' + holder + '</font></a>';
        }
        document.getElementsByClassName("pull-left")[0].src = 'https://raw.githubusercontent.com/BekirUzun/AzLyricsPlus/master/az_lyrics_plus_logo.png';

        duration = GM_getValue(path, calcDuration());
        duration_copy = duration;
        var settings = document.createElement('div');
        settings.innerHTML = '<div class="settings"><table><tbody>\
		<tr><td>Duration (seconds):</td><td><input id="duration" type="number" step="10" value="' + duration + '"></td>\
		<tr><td>Font Size (px):</td><td><input id="fontSize" type="number" value="' + fontSize + '"></td></tr>\
		<tr><td>Font Glow Color:</td><td><input id="fontGlowColor" type="color" value="' + fontGlowColor + '"></td></tr>\
		<tr><td>Bold Font Glow Color:</td><td><input id="boldFontGlowColor" type="color" value="' + boldFontGlowColor + '"></td></tr>\
		<tr><td>Link Glow Color:</td><td><input id="linkGlowColor" type="color" value="' + linkGlowColor + '"></td></tr>\
		<tr><td>Background Color:</td><td><input id="backgroundColor" type="color" value="' + backgroundColor + '"></td></tr>\
		<tr><td><button id="save" type="button">Save</button></td><td><button id="reset" type="button">Reset</button></td></tr>\
        </tbody></table> <table><tbody><tr><td>JQuery version: ' + $.fn.jquery + ' </td></tr></tbody></table>\
		<a class="closeSettings"></a>\
        </div>  <a id="openSettings" class="openSettings" ></a> <a class="start"></a> <a class="stop">';
        document.body.appendChild(settings);

        if ($.fn.jquery !== "undefined") {
            $('.openSettings, .closeSettings').click(function() {
                $(".settings").toggle(1000);
            });
            $('.main-page').click(function() {
                $(".settings").hide(1000);
            });

            $('#save').click(function() {
                saveSettings();
                window.location.reload(true);
            });
            $('#reset').click(function() {
                if (confirm("Do you really want to reset color settings on all pages and duration time on current page?") === true) {
                    resetSettings();
                    window.location.reload(true);
                }
            });
            $(".start").click(function() {
                $(".start").toggle();
                $('html, body').animate({
                    scrollTop: $("#addsong").offset().top - window.innerHeight
                }, {
                    duration: duration * 1000,
                    easing: 'linear',
                    complete: function() {
                        $(".start").show();
                    }
                });
            });
            $(".stop").click(function() {
                $(".start").toggle();
                $('html, body').stop();
            });
            $( window ).scroll(function() {
                if (GM_getValue(path, 0) === 0){
                    var height =  $('#addsong').offset().top -  $(document).scrollTop() - window.innerHeight;
                    var lines = height / fontSize * 1.4;
                    duration = (lines * 2.5);
                } else {
                    duration = duration_copy - ($(document).scrollTop() / fontSize * 1.4) * 2.5;
                }

                if (duration <= 0)
                    duration = 0.5;
                document.getElementById("duration").value = duration.toFixed(1);

            });
        } else {
            document.getElementsByClassName("openSettings")[0].addEventListener("click", toggleVisibility, false);
            document.getElementsByClassName("closeSettings")[0].addEventListener("click", toggleVisibility, false);
            document.getElementById("save").addEventListener("click", saveSettings, false);
            document.getElementById("reset").addEventListener("click", resetSettings, false);
        }
    }

    function calcDuration() {
        var dur,height =  $('#addsong').offset().top -  $(document).scrollTop() - window.innerHeight;
        var lines = height / fontSize * 1.4;
        if (lines > 0)
            dur = (lines * 2.5).toFixed(1);
        else
            dur = 0.5;
        return dur;
    }

    function toggleVisibility() {
        var selected = document.getElementsByClassName("settings")[0];
        if (selected.style.display == 'block')
            selected.style.display = 'none';
        else
            selected.style.display = 'block';
    }

    function saveSettings() {
        fontSize = document.getElementById("fontSize").value;
        fontGlowColor = document.getElementById("fontGlowColor").value;
        linkGlowColor = document.getElementById("linkGlowColor").value;
        boldFontGlowColor = document.getElementById("boldFontGlowColor").value;
        backgroundColor = document.getElementById("backgroundColor").value;
        if (document.getElementById("duration").value !== duration) {
            duration = document.getElementById("duration").value;
            GM_setValue(path, duration);
        }
        GM_setValue("fontSize", fontSize);
        GM_setValue("fontGlowColor", fontGlowColor);
        GM_setValue("linkGlowColor", linkGlowColor);
        GM_setValue("boldFontGlowColor", boldFontGlowColor);
        GM_setValue("backgroundColor", backgroundColor);
    }

    function resetEverything() {
        var keys = GM_listValues();
        alert(keys + keys.length);
        for (var i = 0; i < keys.length; i++) {
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
    function animate(elem, style, unit, from, to, time, prop) {
        if (!elem) return;
        var start = new Date().getTime();
        timer = setInterval(function() {
            var step = Math.min(1, (new Date().getTime() - start) / time);
            if (prop) {
                elem[style] = (from + step * (to - from)) + unit;
            } else {
                elem.style[style] = (from + step * (to - from)) + unit;
            }
            if (step == 1) {
                $(".start").toggle();
                clearInterval(timer);
            }
        }, 25);
        elem.style[style] = from + unit;
    }

    function scrollDown(duration) {
        var target = document.getElementById("addsong");
        animate(document.body, "scrollTop", "", document.body.scrollTop, target.offsetTop - window.innerHeight, duration, true);
    }

})();
