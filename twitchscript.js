var data;
var fccStreams = ["ESL_SC2", "OgamingSC2", "cretetion", "storbeck", "habathcx"];
var bradStreams = ["foggedftw2", "boxerpete", "neace", "imaqtpie", "loltyler1", "tobiasfate", "karnrs"];
var offlineShowing = false;
var heightGenInfo = 
{"320pxwidth" : 
[{"online" : ["top", "divHeights", "totalActualHeight", "desiredHeight"]}, 
{"1" : [17.5, 444, 897, 900]}, 
{"2" : [10, 888, 897, 900]}, 
{"3" : [7.5, 1332, 1447, "desiredHeight"]}, 
{"4" : [5, 1776, "desiredHeight"]}, 
{"5" : [4, 2220, 2392, "desiredHeight"]}]};
var tabWidth = { "320px" : 29.6};

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
  //Not sure if removing class of twitch-div breaks anything
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
	}
	document.getElementsByClassName(tab.id + "-featured")[0].id = "show";
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

function whatShouldTopBe(streamType, streamingArr, streamingStr) {
      switch(streamingArr.length) {
    case 0:
        console.log("1 online");
        document.getElementsByClassName(streamType + "-featured")[0].style.height = "500px";
        document.getElementsByClassName(streamType + "-" + streamingStr)[0].style.top = "4%";
        break;
    case 1:
        console.log("2online");
        document.getElementsByClassName(streamType + "-" + streamingStr)[0].style.top = "17.5%";
        break;
    case 2 :
        console.log("3 online");
        document.getElementsByClassName(streamType + "-" + streamingStr)[0].style.top = "10%";
        break;
    case 3 :
        console.log("4 online");
        document.getElementsByClassName(streamType + "-" + streamingStr)[0].style.top = "7.5%";
        break;
    case 4 :
        console.log("5 online");
        document.getElementsByClassName(streamType + "-" + streamingStr)[0].style.top = "5%";
        break;        
    default:
        console.log("else online");
        document.getElementsByClassName(streamType + "-" + streamingStr)[0].style.top = "4%";
        }
      }

function streamerSearch() {
	var json, generator;
	searchTerm = document.getElementsByClassName("search-bar")[0].value;
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

function getArrayStreams(streamType, streamArr) {
  var json, onlineGenerator, offlineGenerator, margins;
  var divHeights = 0;
  var online = [];
  var offline =[];
  document.getElementsByClassName("freecodecamp-featured")[0].innerHTML = 
  "<h2>FFC Recommended Streams</h2><div class = 'freecodecamp-online'></div><div class = 'freecodecamp-offline'></div>";
  document.getElementsByClassName("brad-featured")[0].innerHTML = 
  "<h2>Brad's Recommended Streams</h2><div class = 'brad-online'></div><div class = 'brad-offline'></div>";
  console.log("getting" + streamType + "streams!");
  for (var i = 0; i < streamArr.length; i++){
    getJSON(streamArr[i]);
    json = data;
    if (json.stream !== null){
      online.push(streamArr[i]);
      onlineGenerator = htmlGenerator(json, false);
      document.getElementsByClassName(streamType + "-online")[0].innerHTML += onlineGenerator;
      divHeights += document.getElementsByClassName("height-set")[0].offsetHeight;
    } else {
      offline.push(streamArr[i]);
    }
  }
  console.log("people online = " + online.length, "people offline = " + offline, json);
  margins = online.length * 6;
  document.getElementsByClassName(streamType + "-featured")[0].style.height = "calc(" + margins + "vh + " + divHeights + "px)";
  whatShouldTopBe(streamType, online, "online");
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

document.addEventListener("DOMContentLoaded", function() {
	getArrayStreams('freecodecamp', fccStreams);
});

