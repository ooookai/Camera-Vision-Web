$(function() {
$("#visionGuide").modal("show");

//File to base64 setting
//start// you can do this once in a page, and this function will appear in all your files
File.prototype.convertToBase64 = function(callback) {
    var FR = new FileReader();
    FR.onload = function(e) {
      callback(e.target.result);
    };
    FR.readAsDataURL(this);
  };
  //end//

$("#inputCamera").on('change', function() {
  // alert("file change");

  var selectedFile = this.files[0];
  selectedFile.convertToBase64(function(base64) {
    getVision(base64.split(",")[1]);
  }, "json");
});

function getVision(img) {
  // alert("get vision");

  var visionApiURL = "https://vision.googleapis.com/v1/images:annotate?key=< insert browser_api_key_here >";

  var visionData = {};
  var visionImage = {
    "content": img
  };
  var visionFeature = [{
    "maxResults": 10,
    "type": "LABEL_DETECTION"
  }, {
    "maxResults": 10,
    "type": "TEXT_DETECTION"
  }, {
    "maxResults": 5,
    "type": "LOGO_DETECTION"
  }];

  var visionRequest = {
    "image": visionImage,
    "features": visionFeature
  };

  visionData = {
    "requests": [
      visionRequest
    ]
  };

  // console.log(visionData);

  $("#recognizingText").show();

  $.ajax({
    //catche: false,
    url: visionApiURL,
    data: JSON.stringify(visionData),
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    processData: false,
    success: function(response) {

      $("#recognizingText").hide();

      // alert("vision success")

      console.log(response.responses[0].labelAnnotations);
      console.log(response.responses[0].textAnnotations);

      var i = 0;

      $(".visionResult").html("");

      if (response.responses[0].labelAnnotations) {

        var visionLabel = response.responses[0].labelAnnotations;
        if (visionLabel) {

          $(".visionResult").append($("<dt/>").text("Label"));

          for (i = 0; i < visionLabel.length; i++) {
            // console.log("visionText"+ (i+1) +" : "+ visionText[i] );

            // $(".visionResult").append($("<dt/>").text("Label-" + (i + 1)));
            $(".visionResult").append($("<dd/>").text(visionLabel[i].description + "　[ score: " + visionLabel[i].score + " ]"));
          }
        } else {
          $(".visionResult").append($("<h4/>").text("No Label"));
        }
      }

      if (response.responses[0].logoAnnotations) {

        var visionLogo = response.responses[0].logoAnnotations;
        if (visionLogo) {

          $(".visionResult").append($("<dt/>").text("Logo"));

          for (i = 0; i < visionLogo.length; i++) {
            // console.log("visionText"+ (i+1) +" : "+ visionText[i] );

            // $(".visionResult").append($("<dt/>").text("Logo-" + (i + 1)));
            $(".visionResult").append($("<dd/>").text(visionLogo[i].description + "　[ score: " + visionLogo[i].score + " ]"));
          }
        } else {
          $(".visionResult").append($("<h4/>").text("No Logo"));
        }
      }

      if (response.responses[0].textAnnotations) {
        var visionText = response.responses[0].textAnnotations[0].description.split(/\n/);
        if (visionText) {
          for (i = 0; i < visionText.length - 1; i++) {
            // console.log("visionText"+ (i+1) +" : "+ visionText[i] );

            $(".visionResult").append($("<dt/>").text("Text-" + (i + 1)));
            $(".visionResult").append($("<dd/>").text(visionText[i]));

          }
        } else {
          $(".visionResult").append($("<h4/>").text("No Text"));
        }
      }
      $('#visionResult').modal('show');
    }
  });

}

var video = document.querySelector('video');
var canvas = document.querySelector('canvas');
canvas.width = $(window).width();
canvas.height = $(window).width();
var ctx = canvas.getContext('2d');
var localMediaStream = null;

$("#getVisionBtn").on("click", function() {
  console.log("get Vision");

  ctx.drawImage(video, 0, 0, $(window).width(), $(window).width());
  // "image/webp" works in Chrome 18. In other browsers, this will fall back to image/png.
  getVision(canvas.toDataURL('image/png').split(",")[1]);

});

function snapshot() {
  console.log("snapshot");

  if (localMediaStream) {
    console.log("localMediaStream");
    ctx.drawImage(video, 0, 0, $(window).width(), $(window).width());
    // "image/webp" works in Chrome 18. In other browsers, this will fall back to image/png.
    document.querySelector('img').src = canvas.toDataURL('image/png');
  }
}

$("video").on("click", function() {
  console.log("click video");
  // snapshot();

  ctx.drawImage(video, 0, 0, $(window).width(), $(window).width());
  // "image/webp" works in Chrome 18. In other browsers, this will fall back to image/png.
  getVision(canvas.toDataURL('image/png').split(",")[1]);
});

var mediaSourcesList = {
  "video": [{}, {}, {}],
  "audio": [{}, {}, {}],
  "other": [{}, {}, {}]
};

function gotSources(sourceInfos) {
  // console.log("gotSources");
  // console.log(sourceInfos);

  var sourceLength = {
    "video": 0,
    "audio": 0,
    "other": 0
  };

  for (var i = 0; i < sourceInfos.length; i++) {
    // console.log(sourceInfo);

    try {
      var sourceInfo = sourceInfos[i];
      // alert("kind:" + sourceInfo.kind.toString() + "-facing:" + sourceInfo.facing.toString() + "-id:" + sourceInfo.id.toString());

      if (sourceInfo.kind === 'audio') {
        mediaSourcesList.audio[sourceLength["audio"]].id = sourceInfo.id;
        mediaSourcesList.audio[sourceLength["audio"]].facing = sourceInfo.facing;
        sourceLength["audio"] += 1;
        // console.log("length-audio=" + sourceLength["audio"]);

      } else if (sourceInfo.kind === 'video') {
        mediaSourcesList.video[sourceLength["video"]].id = sourceInfo.id;
        mediaSourcesList.video[sourceLength["video"]].facing = sourceInfo.facing;
        sourceLength["video"] += 1;
        // console.log("length-video=" + sourceLength["video"]);

      } else {
        mediaSourcesList.other[sourceLength["other"]].id = sourceInfo.id;
        mediaSourcesList.other[sourceLength["other"]].facing = sourceInfo.facing;
        sourceLength["other"] += 1;
        // console.log("length-other=" + sourceLength["other"]);

      }
    } catch (e) {
      alert("error");
      alert(e);
    }
  }
  // alert(JSON.stringify(mediaSourcesList));
  getMedia();

}

var sourceConstraints = {
  // audio: {
  //   optional: [{
  //     sourceId: ""
  //   }]
  // },
  video: {
    optional: [{
      sourceId: ""
    }]
  }
};

function setMediaSource(kind, index) {
  if (index > 0) {
    sourceConstraints[kind].optional[0].sourceId = mediaSourcesList[kind][index - 1].id;
  } else {
    sourceConstraints[kind].optional[0].sourceId = "";
  }
}

function setMedia() {
  MediaStreamTrack.getSources(gotSources);
}

function getMedia() {
  // alert("getMedia");

  // setMediaSource("audio", 0);
  setMediaSource("video", 2); //main camera

  // console.log("sourceConstraints");
  // console.log(sourceConstraints);

  navigator.webkitGetUserMedia(
    // {'audio': false,'video': true}
    sourceConstraints,
    function(stream) {
      console.log("setStream success");
      var video = document.querySelector('video');
      video.src = window.URL.createObjectURL(stream);
      localMediaStream = stream;
    },
    function(error) {
      console.log("error");
      console.log(error);
      alert(error.constraintName + "-" + error.message + "-" + error.name);
    }
  );
}

setMedia();
});
