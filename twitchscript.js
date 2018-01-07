var data;
var fccStreams = ["freecodecamp", "ESL_SC2", "OgamingSC2", "cretetion", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];
var bradStreams = ["llstylez", "ESL_SC2", "OgamingSC2", "cretetion", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];

function tabSwitch(tab) {
	console.log("tabSwitch() called for " + tab.id);
	for (var i = 0; i < document.getElementsByClassName("featured").length; i++){
		document.getElementsByClassName("featured")[i].id = "";
	}
	document.getElementsByClassName(tab.id + "-featured")[0].id = "show";
}

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
      console.log("We reached our target server, but it returned an error");
    }
  };

  request.onerror = function() {
    console.log("There was a connection error of some sort");
  };

  request.send();
}

function getFCCStreams() {
	var fccJson, fccGenerator;
	console.log("getFCCStreams() called!");
	for (var i = 0; i < fccStreams.length; i++){
		getJSON(fccStreams[i]);
		fccJson = data;
        if (fccJson.stream !== null){
        	fccGenerator = 
        '<div class = "featured-streamer"><a target = "_blank" href = "https://www.twitch.tv/' + fccJson.stream.channel.display_name + '"><h3>'
         + fccJson.stream.channel.status + '</h3></a><a target = "_blank" href = "https://www.twitch.tv/league%20of%20legends"><h4>Currently playing : '
          + fccJson.stream.channel.game + '</h4></a><a target = "_blank" href = "https://www.twitch.tv/' + fccJson.stream.channel.display_name + 
          '"><img src = "' + fccJson.stream.preview.medium + '" class = "img"></img></a><h4>' + fccJson.stream.viewers +
              ' viewers on <a target = "_blank" href = "https://www.twitch.tv/' + fccJson.stream.channel.display_name + '">' 
              + fccJson.stream.channel.display_name + '</a></h4></div>';



        document.getElementsByClassName("freecodecamp-featured")[0].innerHTML = fccGenerator;
        }
	}

}

function getTwitchStreams() {
  var twitchJson, twitchGenerator;
  document.getElementsByClassName("twitch-featured")[0].innerHTML = "<h2>Featured by Twitch.Tv</h2>";
  console.log("getTwitchFeatured() called!");
  getJSON("featured");
  twitchJson = data;
  for (var i = 0; i < fccStreams.length; i++){
        	twitchGenerator = 
        '<div class = "featured-streamer"><a target = "_blank" href = "https://www.twitch.tv/' + twitchJson.featured[i].stream.channel.display_name + '"><h3>'
         + twitchJson.featured[i].stream.channel.status + 
         '</h3></a><a target = "_blank" href = "https://www.twitch.tv/league%20of%20legends"><h4>Currently playing : '
          + twitchJson.featured[i].stream.channel.game + '</h4></a><a target = "_blank" href = "https://www.twitch.tv/' 
          + twitchJson.featured[i].stream.channel.display_name + 
          '"><img src = "' + twitchJson.featured[i].stream.preview.medium + '" class = "img"></img></a><br><h4>' + twitchJson.featured[0].stream.viewers +
              ' viewers on <a target = "_blank" href = "https://www.twitch.tv/' + twitchJson.featured[i].stream.channel.display_name + '">' 
              + twitchJson.featured[i].stream.channel.display_name + '</a></h4></div>';
        document.getElementsByClassName("twitch-featured")[0].innerHTML += twitchGenerator;
        }
    }


function fcc(button, streamType, streamArr) {
	tabSwitch(button);
	getArrayStreams(streamType, streamArr);

}

function brad(button, streamType, streamArr) {
	tabSwitch(button);
	getArrayStreams(streamType, streamArr);
}

function twitch(button) {
	tabSwitch(button);
	getTwitchStreams();
}

  function getArrayStreams(streamType, streamArr) {
  var json, generator;
  if (streamType === 'freecodecamp'){
        document.getElementsByClassName(streamType + "-featured")[0].innerHTML = "<h2>FFC Recommended Streams</h2>";
        } else {
        document.getElementsByClassName(streamType + "-featured")[0].innerHTML = "<h2>Brad's Recommended Streams</h2>";
        }
  console.log("get" + streamType + "Featured() called!", "streamArr = " + streamArr);
  for (var i = 0; i < streamArr.length; i++){
		getJSON(streamArr[i]);
		json = data;
        if (json.stream !== null){
        	generator = 
        '<div class = "featured-streamer"><a target = "_blank" href = "https://www.twitch.tv/' + json.stream.channel.display_name + '"><h3>'
         + json.stream.channel.status + '</h3></a><a target = "_blank" href = "https://www.twitch.tv/league%20of%20legends"><h4>Currently playing : '
          + json.stream.channel.game + '</h4></a><a target = "_blank" href = "https://www.twitch.tv/' + json.stream.channel.display_name + 
          '"><img src = "' + json.stream.preview.medium + '" class = "img"></img></a><h4>' + json.stream.viewers +
              ' viewers on <a target = "_blank" href = "https://www.twitch.tv/' + json.stream.channel.display_name + '">' 
              + json.stream.channel.display_name + '</a></h4></div>';
              if (streamType === 'freecodecamp'){
              document.getElementsByClassName(streamType + "-featured")[0].innerHTML += generator;
          } else {
          	document.getElementsByClassName(streamType + "-featured")[0].innerHTML += generator;
          }
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {

});

