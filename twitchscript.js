var data;
var fccStreams = ["ESL_SC2", "OgamingSC2", "cretetion", "storbeck", "habathcx"];
var bradStreams = ["foggedftw2", "boxerpete", "neace", "imaqtpie", "loltyler1", "tobiasfate", "karnrs"];
var offlineShowing = false;

function getJSON(query) {
  var request = new XMLHttpRequest();
  request.open(
    "GET",
    "https://wind-bow.glitch.me/twitch-api/streams/" + query,
    false
  );

  request.onload = function() {
    if (this.status >= 200 && this.status < 400) {
      console.log("success");
      data = JSON.parse(this.response);
      console.log(data);
    } else {
      for (var i = 0; i < document.getElementsByClassName("featured").length; i++) {
        document.getElementsByClassName("featured")[i].innerHTML += "We reached our target server, but it returned an error.";
      }
    }
  };

  request.onerror = function() {
    for (var i = 0; i < document.getElementsByClassName("featured").length; i++) {
        document.getElementsByClassName("featured")[i].innerHTML += "There was a connection error of some sort.";
      }
    }

  request.send();
}

function htmlGenerator (json, isItTwitch, i) {
  if (isItTwitch) {
    var generator = '<div class = "featured-streamer"><a target = "_blank" href = "https://www.twitch.tv/' + 
        json.featured[i].stream.channel.display_name + '"><h3>'
         + json.featured[i].stream.channel.status + 
         '</h3></a><h4>Currently playing : <a target = "_blank" href = "https://www.twitch.tv/directory/game/' + 
         encodeURIComponent(json.featured[i].stream.channel.game) + '">'
          + json.featured[i].stream.channel.game + '</h4></a><a target = "_blank" href = "https://www.twitch.tv/' 
          + json.featured[i].stream.channel.display_name + 
          '"><img src = "' + json.featured[i].stream.preview.medium + '" class = "img"></img></a><br><h4>' + json.featured[i].stream.viewers +
              ' viewers on <a target = "_blank" href = "https://www.twitch.tv/' + json.featured[i].stream.channel.display_name + '">' 
              + json.featured[i].stream.channel.display_name + '</a></h4></div>';


  } else {
      generator = 
        '<div class = "featured-streamer height-set"><a target = "_blank" href = "https://www.twitch.tv/' + json.stream.channel.display_name + '"><h3>'
         + json.stream.channel.status + '</h3></a><h4>Currently playing : <a target = "_blank" href = "https://www.twitch.tv/directory/game/' + 
         encodeURIComponent(json.stream.channel.game) + '">'
          + json.stream.channel.game + '</h4></a><a target = "_blank" href = "https://www.twitch.tv/' + json.stream.channel.display_name + 
          '"><img src = "' + json.stream.preview.medium + '" class = "img"></img></a><h4>' + json.stream.viewers +
              ' viewers on <a target = "_blank" href = "https://www.twitch.tv/' + json.stream.channel.display_name + '">' 
              + json.stream.channel.display_name + '</a></h4></div>';
  }
  return generator;
}

function tabSwitch(tab) {
	console.log("tabSwitch() called for " + tab.id);
	for (var i = 0; i < document.getElementsByClassName("featured").length; i++){
		document.getElementsByClassName("featured")[i].id = "";
    document.getElementsByClassName("inner-tab-div")[i].id = "";
	}
	document.getElementsByClassName(tab.id + "-featured")[0].id = "show";
  document.getElementsByClassName(tab.id + "-inner-tab-div")[0].id = "active";
}

function offlineOnline() {
  if (!offlineShowing) {
		document.getElementsByClassName("freecodecamp-online")[0].classList.add("move-online");
		document.getElementsByClassName("freecodecamp-offline")[0].classList.add("move-offline");
		document.getElementsByClassName("brad-online")[0].classList.add("move-online");
		document.getElementsByClassName("brad-offline")[0].classList.add("move-offline");
		offlineShowing = true;
  } else {
	  document.getElementsByClassName("freecodecamp-online")[0].classList.remove("move-online");
	  document.getElementsByClassName("freecodecamp-offline")[0].classList.remove("move-offline");
	  document.getElementsByClassName("brad-online")[0].classList.remove("move-online");
	  document.getElementsByClassName("brad-offline")[0].classList.remove("move-offline");
	  offlineShowing = false;
  }
}

function whatShouldTopAndHeightsBe(streamType, margins, divHeights) {
  document.getElementsByClassName(streamType + "-online")[0].style.height = "calc(" + margins + "vh + " + divHeights + "px)";
  var height = document.getElementsByClassName(streamType + "-online")[0].offsetHeight;
  var headingMargins = document.getElementsByClassName("fullscreen")[0].offsetHeight/25;
  console.log(headingMargins);
  var headingHeight = document.getElementsByClassName(streamType + "-heading")[0].offsetHeight + headingMargins;
  console.log(headingHeight, height);
  document.getElementsByClassName(streamType + "-featured")[0].style.height = height + headingHeight + "px";
  document.getElementsByClassName(streamType + "-online")[0].style.top = (headingHeight/height) * 100 + "%";
      }

function streamerSearch() {
	var json, generator;
	searchTerm = document.getElementsByClassName("search-bar")[0].value;
  if (searchTerm !== ""){
    getJSON(searchTerm);
    json = data;
    if (json.stream === null){
      generator = '<div class = "search-result-inner"><h3>' + searchTerm + ' is offline!</h3></div>';
      document.getElementsByClassName("search-result-div")[0].style.padding = "3vh 0";
    } else {
      generator = htmlGenerator(json, false);
    }
    document.getElementsByClassName("search-result-div")[0].innerHTML = generator;
  }
}

function getArrayStreams(streamType, streamArr) {
  var json, onlineGenerator, offlineGenerator, margins;
  var divHeights = 0;
  var online = [];
  var offline =[];
  document.getElementsByClassName("freecodecamp-featured")[0].innerHTML = 
  "<h2 class = 'freecodecamp-heading'>FFC Recommended Streams</h2><div class = 'freecodecamp-online'></div><div class = 'freecodecamp-offline'></div>";
  document.getElementsByClassName("brad-featured")[0].innerHTML = 
  "<h2 class = 'brad-heading'>Brad's Recommended Streams</h2><div class = 'brad-online'></div><div class = 'brad-offline'></div>";
  console.log("getting" + streamType + "streams!");
  for (var i = 0; i < streamArr.length; i++){
    getJSON(streamArr[i]);
    json = data;
    if (json.stream !== null){
      online.push(streamArr[i]);
      onlineGenerator = htmlGenerator(json, false);
      document.getElementsByClassName(streamType + "-online")[0].innerHTML += onlineGenerator;
    } else {
      offline.push(streamArr[i]);
    }
  }
  for (var j = 0; j < online.length; j++){
      divHeights += document.getElementsByClassName("height-set")[j].offsetHeight;
  }
  margins = online.length * 6;
  console.log("people online = " + online.length, "people offline = " + offline.length, json);
  whatShouldTopAndHeightsBe(streamType, margins, divHeights);
  for (var k = 0; k < offline.length; k++){
    document.getElementsByClassName(streamType + "-offline")[0].innerHTML += '<div class = "search-result-inner"><h3>' 
    + offline[k] + ' is offline!</h3></div>';
  }
}


function getTwitchStreams() {
  var json, generator;
  document.getElementsByClassName("twitch-featured")[0].innerHTML = "<h2>Featured by Twitch.Tv</h2>";
  console.log("getting Twitch streams!");
  getJSON("featured");
  json = data;
  for (var i = 0; i < json.featured.length; i++){
        generator = htmlGenerator(json, true, i);
        document.getElementsByClassName("twitch-featured")[0].innerHTML += generator;
        }
    }

function fcc(button) {
	tabSwitch(button);
	getArrayStreams('freecodecamp', fccStreams);

}

function brad(button) {
	tabSwitch(button);
	getArrayStreams("brad", bradStreams);
}

function twitch(button) {
	tabSwitch(button);
	getTwitchStreams();
}

function refresh () {
  var whosStreams;
  for (var i = 0; i < 3; i++){
    if (document.getElementsByClassName("tab")[i].contains(document.getElementById("active"))){
      whosStreams = document.getElementsByClassName("tab")[i].id;
    }
  }
  if (whosStreams === "freecodecamp"){
    getArrayStreams('freecodecamp', fccStreams);
  } else if (whosStreams === "brad"){
    getArrayStreams("brad", bradStreams);
  } else {
    getTwitchStreams();
  }
}

document.addEventListener("DOMContentLoaded", function() {
	getArrayStreams('freecodecamp', fccStreams);
});

