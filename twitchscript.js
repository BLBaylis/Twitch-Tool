document.addEventListener("DOMContentLoaded", function() {
  getArrayStreams("freecodecamp", fccStreams);
  getArrayStreams("brad", bradStreams);
  getTwitchStreams();
  for (var i = 0; i < 3 ; i++){
    left = (i-1) * 100;
    left += "%";
    document.getElementsByClassName("freecodecamp-inner")[i].style.left = left;
  }
  for (var j = 0; j < 3 ; j++){
    left = (j-1) * 100;
    left += "%";
    document.getElementsByClassName("brad-inner")[j].style.left = left;
  }
  //document.getElementsByClassName("search-bar-btn")[0].addEventListener("click", streamerSearch);
  document.getElementsByClassName("refresh-streams")[0].addEventListener("click", refresh);
  document.getElementById("freecodecamp").addEventListener("click", tabSwitch);
  document.getElementById("brad").addEventListener("click", tabSwitch);
  document.getElementById("twitch").addEventListener("click", tabSwitch);
  for (var j = 0; j < document.getElementsByClassName("navbar-btn").length; j++) {
    document.getElementsByClassName("navbar-btn")[j].addEventListener("click", distanceAndDirectionForSlide);
  }
});

var left;
var bradCounter = 0;
var fccCounter = 0;
var bradStreams = ["foggedftw2", "boxerpete", "neace", "imaqtpie", "loltyler1", "tobiasfate", "karnrs"];
var fccStreams = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];
 
function tabSwitch(event) {
  console.log(event);
  event = event.target.parentElement;
  console.log(event);
  for (var i = 0; i < document.getElementsByClassName("featured").length; i++){
    document.getElementsByClassName("featured")[i].id = "";
    document.getElementsByClassName("inner-tab-div")[i].id = "";
  }
  document.getElementsByClassName(event.id + "-featured")[0].id = "show";
  document.getElementsByClassName(event.id + "-inner-tab-div")[0].id = "active";
  document.getElementsByClassName("big-tab")[0].classList.remove("big-tab");
  document.getElementById(event.id).classList.add("big-tab");
  heights("freecodecamp");
  heights("brad");
}

function replaceStreamWithChannel(toBeReplaced){
  var replaced = toBeReplaced.replace("streams", "channels");
  return replaced;
}

function getJSONPromise(query, recommendedBy){
    return new Promise(function(resolve, reject){
      var request = new XMLHttpRequest();
      request.open(
        "GET",
        "https://wind-bow.glitch.me/twitch-api" + query,
        true
        );

      request.onload = function() {
        if (this.status >= 200 && this.status < 400) {
          resolve(JSON.parse(this.response));
        } else {
          reject("We reached our target server, but it returned an error.");
          for (var i = 0; i < document.getElementsByClassName("alert").length; i++) {
            document.getElementsByClassName("alert")[i].innerHTML = "We reached our target server, but it returned an error.";
          }
        }
      };

      request.onerror = function() {
        reject("There was a connection error of some sort.");
        for (var i = 0; i < document.getElementsByClassName("alert").length; i++) {
          document.getElementsByClassName("alert")[i].innerHTML = "There was a connection error of some sort.";
        }
      }

      request.send();
    })
  }

function getJSON(query, recommendedBy, arr) {
  for (var j = 0; j < document.getElementsByClassName("alert").length; j++) {
        document.getElementsByClassName("alert")[j].innerHTML = "";
      }
  var promise = getJSONPromise(query, recommendedBy, arr);
  promise.then(function(json){
    if (json.stream !== undefined){
      if (json.stream !== null){
         var who = streamerOnline(json, recommendedBy);
         if (who === "freecodecamp"){
          fccCounter++;
         } else {
          bradCounter++;
         }
      } else {
        var offlineQuery = replaceStreamWithChannel(query);
         getJSON(offlineQuery, recommendedBy, arr);
       }
    } else {
       who = streamerOffline(json, recommendedBy);
        if (who === "freecodecamp"){
          fccCounter++;
         } else {
          bradCounter++;
         }
    }
  }).then(function(){
    if (bradCounter === bradStreams.length){
      bradCounter = 0;
      document.getElementsByClassName("brad-online")[0].innerHTML
       += "<div class = 'placeholder'></div><div class = 'placeholder'></div><div class = 'placeholder'></div><div class = 'placeholder'></div>";
      document.getElementsByClassName("brad-all")[0].innerHTML
       += "<div class = 'placeholder'></div><div class = 'placeholder'></div><div class = 'placeholder'></div><div class = 'placeholder'></div>";
      document.getElementsByClassName("brad-offline")[0].innerHTML
       += "<div class = 'placeholder'></div><div class = 'placeholder'></div><div class = 'placeholder'></div><div class = 'placeholder'></div>";
    } 
    if (fccCounter === fccStreams.length){
      fccCounter = 0;
      document.getElementsByClassName("freecodecamp-online")[0].innerHTML
       += "<div class = 'placeholder'></div><div class = 'placeholder'></div><div class = 'placeholder'></div><div class = 'placeholder'></div>";
      document.getElementsByClassName("freecodecamp-all")[0].innerHTML
       += "<div class = 'placeholder'></div><div class = 'placeholder'></div><div class = 'placeholder'></div><div class = 'placeholder'></div>";
      document.getElementsByClassName("freecodecamp-offline")[0].innerHTML
       += "<div class = 'placeholder'></div><div class = 'placeholder'></div><div class = 'placeholder'></div><div class = 'placeholder'></div>";

    }
  }).catch(function(error){
    console.log(error);
  });

}

function htmlGenerator (json, isItTwitch, isItSearch, i) {
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


  } else if (isItSearch) {
      generator = 
        '<span class = "button-span"><button class = "close">&times;</button></span><div class = "featured-streamer height-set featured-streamer-search"><a target = "_blank" href = "https://www.twitch.tv/'
         + json.stream.channel.display_name + '"><h3>'
         + json.stream.channel.status + '</h3></a><h4>Currently playing : <a target = "_blank" href = "https://www.twitch.tv/directory/game/' + 
         encodeURIComponent(json.stream.channel.game) + '">'
          + json.stream.channel.game + '</h4></a><a target = "_blank" href = "https://www.twitch.tv/' + json.stream.channel.display_name + 
          '"><img src = "' + json.stream.preview.medium + '" class = "img"></img></a><h4>' + json.stream.viewers +
              ' viewers on <a target = "_blank" href = "https://www.twitch.tv/' + json.stream.channel.display_name + '">' 
              + json.stream.channel.display_name + '</a></h4></div>';
  } else {
    generator = 
        '<div class = "featured-streamer"><a target = "_blank" href = "https://www.twitch.tv/' + json.stream.channel.display_name + '"><h3>'
         + json.stream.channel.status + '</h3></a><h4>Currently playing : <a target = "_blank" href = "https://www.twitch.tv/directory/game/' + 
         encodeURIComponent(json.stream.channel.game) + '">'
          + json.stream.channel.game + '</h4></a><a target = "_blank" href = "https://www.twitch.tv/' + json.stream.channel.display_name + 
          '"><img src = "' + json.stream.preview.medium + '" class = "img"></img></a><h4>' + json.stream.viewers +
              ' viewers on <a target = "_blank" href = "https://www.twitch.tv/' + json.stream.channel.display_name + '">' 
              + json.stream.channel.display_name + '</a></h4></div>';

  }
  return generator;
}

function streamerSearch() {
  var generator;
  var searchTerm = document.getElementsByClassName("search-bar")[0].value;
  if (searchTerm !== ""){
    var promise = getJSONPromise("/streams/" + searchTerm);
    promise.then(function(json){
      if (json.stream !== undefined){
        if (json.stream !== null){
          generator = htmlGenerator(json, false, true);
          searchResultDecoration(generator);
        } else {
         var promiseOffline = getJSONPromise("/channels/" + searchTerm);
         promiseOffline.then(function(json){
          searchOffline(json, searchTerm);
         })
        }
      }
    }).catch(function(error){
     console.log(error);
    });
  }
}

function searchResultDecoration(generator) {
  document.getElementsByClassName("search-result-div")[0].innerHTML = generator;
  document.getElementsByClassName("button-span")[0].style.display = "inline-block";
  document.getElementsByClassName("close")[0].addEventListener("click", function(){
  document.getElementsByClassName("search-result-div")[0].innerHTML = "";
  document.getElementsByClassName("search-result-div")[0].style.paddingBottom = "0";
});

}

function refresh () {
    getArrayStreams('freecodecamp', fccStreams);
    getArrayStreams("brad", bradStreams);
    getTwitchStreams();
}

function streamerCounter(element) {
  console.log(document.getElementsByClassName("brad-all")[0].childElementCount);
}


function getArrayStreams(recommendedBy, arr){
  document.getElementsByClassName(recommendedBy + "-online")[0].innerHTML = "";
  document.getElementsByClassName(recommendedBy + "-all")[0].innerHTML = "";
  document.getElementsByClassName(recommendedBy + "-offline")[0].innerHTML = "";
  for (var i = 0; i < arr.length; i++){
    getJSON("/streams/" + arr[i], recommendedBy, arr);
  };
}

function streamerOnline(json, recommendedBy) {
      var generator = htmlGenerator(json, false, false);
      document.getElementsByClassName(recommendedBy + "-all")[0].innerHTML += generator;
      document.getElementsByClassName(recommendedBy + "-online")[0].innerHTML += generator;
      heights(recommendedBy);
      return recommendedBy;
}

function streamerOffline(json, recommendedBy){
    document.getElementsByClassName(recommendedBy + "-offline")[0].innerHTML += 
    '<div class = "offline-streamer"><h3 class = "status"><a target = "_blank" href = "https://www.twitch.tv/' + json.display_name + '">'
     + json.display_name + '</a> is offline!</h3><a target = "_blank" href = "https://www.twitch.tv/' + json.display_name + '"><img class = "logo" src="' 
     + json.logo + '"></a></div>';
     document.getElementsByClassName(recommendedBy + "-all")[0].innerHTML += 
    '<div class = "offline-streamer"><h3 class = "status"><a target = "_blank" href = "https://www.twitch.tv/' + json.display_name + '">' + json.display_name + 
    '</a> is offline!</h3><a target = "_blank" href = "https://www.twitch.tv/' + json.display_name + '"><img class = "logo" src="' + json.logo + '"></a></div>';
    heights(recommendedBy);
    return recommendedBy;
}

function searchOffline(json, searchTerm){
  generator = 
      '<span class = "button-span"><button class = "close">&times;</button></span><div class = "search-result-inner"><h3><a target = "_blank" href = "https://www.twitch.tv/' 
      + searchTerm + '">' + searchTerm + '</a> is offline!</h3><a target = "_blank" href = "https://www.twitch.tv/'
       + searchTerm + '"><img class = "logo" src="' + json.logo + '"></a></div>';
      document.getElementsByClassName("search-result-div")[0].style.padding = " 0 0 2vh 0";
      searchResultDecoration(generator);
}

function getTwitchStreams() {
  var promise = getJSONPromise("/streams/featured");
  promise.then(function(json){
    var generator;
    var counter = 0;
    document.getElementsByClassName("twitch-outer")[0].innerHTML = "";
    for (var i = 0; i < json.featured.length; i++){
      generator = htmlGenerator(json, true, false, i);
      document.getElementsByClassName("twitch-outer")[0].innerHTML += generator;
      counter++;
    }
    if (counter === json.featured.length){
      document.getElementsByClassName("twitch-outer")[0].innerHTML += "<div class = 'placeholder'></div>";
    }
  })
}

function heights(recommendedBy) {
  var active = Number(removePercent(document.getElementsByClassName(recommendedBy + "-inner")[0].style.left));
  var height1 = document.getElementsByClassName(recommendedBy + "-online")[0].offsetHeight;
  var height2 = document.getElementsByClassName(recommendedBy + "-all")[0].offsetHeight;
  var height3 = document.getElementsByClassName(recommendedBy + "-offline")[0].offsetHeight;
  if (active === -200){
    document.getElementsByClassName(recommendedBy + "-outer")[0].style.height = height3 + "px";
  } else if (active === -100){
    document.getElementsByClassName(recommendedBy + "-outer")[0].style.height = height2 + "px";
  } else {
    document.getElementsByClassName(recommendedBy + "-outer")[0].style.height = height1 + "px";
  } 
}

function distanceAndDirectionForSlide(button) {
  var currLocation, destination, distance, direction;
  var arr = ["online", "all", "offline"];
  if (button.target.classList.contains("btn-online")){
    destination = "online";
  } else if (button.target.classList.contains("btn-offline")){
    destination = "offline";
  } else {
    destination = "all";
  }
  var currLocation = document.getElementById("on-off-all").classList[3];
  distance = arr.indexOf(currLocation) - arr.indexOf(destination);
  if (distance < 0){
    direction = "left";
  } else {
    direction = "right";
  }
  distance = Math.abs(distance);
  slide(direction, distance);
  document.getElementById("on-off-all").id = "";
  document.getElementsByClassName(destination)[0].id = "on-off-all";
}

function removePercent(toBeTrimmed) {
  var trimmed = toBeTrimmed.slice(0, toBeTrimmed.length -1);
  return trimmed;
}

function slide(direction, distance) {
  var bradResult, fccResult;
  var check = Number(removePercent(document.getElementsByClassName("freecodecamp-inner")[0].style.left));
  for (var i = 0; i < 3; i++){
    fccResult = Number(removePercent(document.getElementsByClassName("freecodecamp-inner")[i].style.left));
    bradResult = Number(removePercent(document.getElementsByClassName("brad-inner")[i].style.left));
    if (check > -200 && direction === "left" && distance === 1){
      bradResult -= 100;
      fccResult -= 100;    
    } else if (check > -100 && direction === "left" && distance === 2){
      bradResult -= 200;
      fccResult -= 200; 
    } else if (check < 0 && direction === "right" && distance === 1){
      bradResult = bradResult + 100;
      fccResult = fccResult + 100;  
    } else if (check < -100 && direction === "right" && distance === 2){
      bradResult += 200;
      fccResult += 200;
    }
    bradResult = bradResult + "%";
    fccResult = fccResult + "%";
    document.getElementsByClassName("freecodecamp-inner")[i].style.left = fccResult;
    document.getElementsByClassName("brad-inner")[i].style.left = bradResult;  
    } 
  heights("freecodecamp");
  heights("brad");
}