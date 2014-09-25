const PREFS = {
	useArranger: true,
	useBlacklist: true,
	blacklist: [],
	blacklistMethod: "pct-greyscale",
	blacklistNormal: true,
	blacklistRecruit: true,
	blacklistOOC: true,
	blacklistIC: false,
	useHighlighter: true,
	highlightColor: "#ffaa00"
};

function setDefaultPrefs() {
	for (var key in PREFS) {
		var val = PREFS[key];
		switch (typeof val) {
			case "object":
				if (!localStorage[key]) {
					localStorage[key] = JSON.stringify(val);
				}
			default:
				if (!localStorage[key]) {
					localStorage[key] = val;
				}
		}
	}
}

function loadOptions() {
	setDefaultPrefs();

	var
		useArranger = localStorage["useArranger"],
		useHighlighter = localStorage["useHighlighter"],
		highlightColor = localStorage["highlightColor"],
		useBlacklist = localStorage["useBlacklist"],
		blacklistMethod = localStorage["blacklistMethod"],
		blacklistNormal = localStorage["blacklistNormal"],
		blacklistRecruit = localStorage["blacklistRecruit"],
		blacklistOOC = localStorage["blacklistOOC"],
		blacklistIC = localStorage["blacklistIC"],
		blacklist = blacklistToArray();

	/* This part sets up the dialog with the existing options */
	if (useArranger == "true") { document.getElementById('pct-use-arranger').setAttribute('checked', true); }
	if (useBlacklist == "true") { document.getElementById('pct-use-blacklist').setAttribute('checked', true); }
	if (blacklistMethod) { document.querySelector('input[value='+blacklistMethod+']').setAttribute('checked', true); }
	if (blacklistNormal == "true") { document.getElementById('pct-bl-normal').setAttribute('checked', true); }
	if (blacklistRecruit == "true") { document.getElementById('pct-bl-rec').setAttribute('checked', true); }
	if (blacklistOOC == "true") { document.getElementById('pct-bl-ooc').setAttribute('checked', true); }
	if (blacklistIC == "true") { document.getElementById('pct-bl-ic').setAttribute('checked', true); }
	if (useHighlighter) { document.getElementById('pct-use-highlighter').setAttribute('checked', true); }
	document.getElementById('pct-highlight-color').value = highlightColor;

	(function (myArray) {
		var listbox = document.getElementById("pct-blacklist");
		if (!myArray) { return false; }
		
		for(i=0; i<myArray.length; i++) {
			addListitem(listbox, myArray[i]);
		}
	})(blacklist);

	document.getElementById('pct-blacklist-add').addEventListener('click', addItemByDialog);
	document.getElementById('pct-blacklist-remove').addEventListener('click', deleteItems);

	var inputs = document.getElementsByTagName('input');
	for (var i = 0; i<inputs.length; i++) {
		inputs[i].addEventListener('change', saveOption);
	}
}

function confirmSaved() {
	var savedFlag = document.getElementById('saved');

	savedFlag.style.opacity = 100;
	setTimeout( function() { savedFlag.style.opacity = 0; }, 1250);
}

function saveOption(evt) {
	var target = evt.currentTarget,
		oldValue = localStorage[target.name],
		newValue;
	
	if (target.type == "checkbox") {
		newValue = target.checked;
	} else if ((target.type == "radio") || (target.type == "color")) {
		newValue = target.value;
	}
	
	if (oldValue != newValue) {
		localStorage[target.name] = newValue;
		confirmSaved();
	}
}

function saveBlacklist() {
	var blacklistArray = getListitems(document.getElementById('pct-blacklist')),
		blacklist = JSON.stringify(blacklistArray);
	
	localStorage["blacklist"] = blacklist;
	confirmSaved();
}

function addListitem(listbox, text) {
	var newItem = document.createElement("option");
	newItem.textContent = text;
	listbox.appendChild(newItem);
}

function getListitems(listbox) {
	var myArray = [],
		items = listbox.children;

	for (i=0; i<items.length; i++) {
		myArray.push(items[i].textContent);
	}
	return myArray;
}

function addItemByDialog() {
	var listbox = document.getElementById('pct-blacklist'),
		name = prompt("Enter a username to blacklist:");

	if (name) {
		addListitem(listbox, name);
		saveBlacklist();
	}
}

function deleteItems() {
	var listbox = document.getElementById('pct-blacklist'),
		allItems = listbox.children;

	for (i=0; i<allItems.length; i++) {
		if (allItems[i].selected) {
			listbox.removeChild(allItems[i]);
		}
	}
	saveBlacklist();
}

document.addEventListener('DOMContentLoaded', loadOptions);
