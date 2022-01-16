var elevationProfile;

require([
  "esri/config",
  "esri/WebScene",
  "esri/views/SceneView",
  "esri/widgets/ElevationProfile",
  "esri/widgets/ElevationProfile/ElevationProfileLine",
  "esri/core/Accessor",
  "esri/widgets/Home",
], (
  esriConfig,
  WebScene,
  SceneView,
  ElevationProfile,
  ElevationProfileLine,
  Accessor,
  Home
) => {
  esriConfig.apiKey =
    "AAPK163c666f38c5401c99a9921de4bd73bdFwHnfAbYvkzVAA--yLMd5lw9R-P3-Q9WUWPgfmj8Fu7lskz2HMEiBXOsOobAfZ5q";

  const webscene = new WebScene({
    portalItem: {
      id: "9a542f6755274436985617a462ffdf44",
    },
  });

  // create the scene view
  const view = new SceneView({
    container: "viewDiv",
    map: webscene,
    camera: {
      position: {
        spatialReference: { latestWkid: 3857, wkid: 102100 },
        x: -8238359,
        y: 4967229,
        z: 686,
      },
      heading: 353,
      tilt: 66,
    },
  });

  // create the elevation profile widget
  elevationProfile = new ElevationProfile({
    view: view,
    // configure widget with desired profile lines
    profiles: [
      {
        type: "ground", // first profile line samples the ground elevation
        color: "#d3af37",
        title: "Human Path",
      },
      {
        type: "view", // second profile samples the view and shows building profiles
        color: "#114C92",
        title: "Spidey Path",
      },
    ],
    // hide the select button
    // this button can be displayed when there are polylines in the
    // scene to select and display the elevation profile for
    visibleElements: {
      selectButton: false,
    },
  });

  let homeWidget = new Home({
    view: view,
    label: "Can Spidey Make it?",
    id: "can-spidey-make-it",
  });

  homeWidget.on("go", function (event) {
    console.log("went home responsive!");
  });

  elevationProfile.on("clear-profile", function (event) {
    console.log("clicked");
  });

  //   select line button: elevationProfile.visibleElements.selectButton = true;

  // add the widget to the view
  view.ui.add(elevationProfile, "top-right");
  view.ui.add(homeWidget, "top-left");
});

// watching the elevation profile
//    var groundTitle = elevationProfile.profiles.items[0].get(
//       "statistics.maxDistance"
//     );
//   var groundTitle = elevationProfile.profiles.items[0];

// INSTRUCTIONS BUTTON FUNCTIONS
// Get the modal
var instructions_modal = document.getElementById("instructions_modal");

// Get the button that opens the modal
var instructions_button = document.getElementById("instructions_button");

// Get the <span> element that closes the modal
var instructions_span =
  document.getElementsByClassName("instructions_close")[0];

// When the user clicks the button, open the modal
instructions_button.onclick = function () {
  instructions_modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
instructions_span.onclick = function () {
  instructions_modal.style.display = "none";
};

// SPIDEY DATA BUTTON FUNCTIONS
var data_modal = document.getElementById("data_modal");
var data_button = document.getElementById("data_button");
var data_span = document.getElementsByClassName("data_close")[0];
data_button.onclick = function () {
  data_modal.style.display = "block";
};
data_span.onclick = function () {
  data_modal.style.display = "none";
};

// MODAL CLOSING (BOTH)
// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == instructions_modal) {
    instructions_modal.style.display = "none";
  }
  if (event.target == data_modal) {
    data_modal.style.display = "none";
  }
};

const newProfileButton = document.getElementsByClassName(
  "esri-elevation-profile__footer"
);
var widgetButtonCounter = 0;
window.onload = function () {
  newProfileButton[0].addEventListener("click", () => {
    widgetButtonCounter++;
    console.log("widget button counter: " + widgetButtonCounter);
    if (widgetButtonCounter % 2 == 0) {
      newProfileCreated();
    }
    if (widgetButtonCounter % 2 == 1) {
      resetProfile();
    }
  });
};

function newProfileCreated() {
  var spidey_data_text = document.getElementById("spidey_data_text");
  if (
    spidey_data_text.innerHTML ===
    "No data available. Make sure to finish creating an elevation profile."
  ) {
    var resultData = "";
    var stats = elevationProfile.profiles.items[0].statistics;
    console.log(stats);
    var totalKg = Math.round(stats.maxDistance * (133.0/61));
    var totalN = Math.round(totalKg*9.80665);
    var totalCal = Math.round(totalN*0.2388);
    var couldHe = "CAN";
    if (totalCal > 4000) {
        couldHe = "CANNOT";
    }
    resultData +=
        "<strong>Basic Trip Facts</strong>" +
      "<br>Web Fluid Used: " + Math.round(stats.maxDistance / 2) + " meters ✦ " + 
      "Average Elevation: " + Math.round(stats.avgElevation * 10) / 10 + " degrees ✦ " +
      "Travel Distance: " + Math.round(stats.maxDistance) + " meters" + 
      "<br><br><strong>Spidey Physics</strong>" + 
      "<br>Spidey uses Newton’s second law of motion to achieve distance fast. Despite Spidey’s speed magnitude remaining unchanged while swinging, the direction of circular motion is always changing." + 
      "<br><br>Total tension force for swing = Centripital Acceleration Formula (CAF) + acceleration of gravity (g)<br>CAF: a = v^2/R ✦ g = 9.8 m/sec^2" + 
      "<br><br>Assuming Spidey is moving at a velocity of 50mph or 22 m/s, and travels with a 61 meters web strand every swing, the centripetal acceleration is (22)^2 / 61, or 8.2 feet/sec^2 per swing. Let's assume Spidey, a high school student, weighs 73 kilograms." + 
      "<br>Therefore, total tension force for a swing: 76.6 kg + 61.2 kg = <strong>133.8 kg</strong>" + 
      "<br><br>Since, the trip is " + Math.round(stats.maxDistance) + " meters, the total force on spidey for the trip is " + totalKg + "kg." +
      "<br>This is " + totalN + " newtons, or " + totalCal + " calories." + 
      "<br><br><strong>Assuming Spidey eats 4000 calories per day, he " + couldHe + " make this trip today!</strong>"
      ;
    spidey_data_text.innerHTML = resultData;
  }
}

function resetProfile() {
  var spidey_data_text = document.getElementById("spidey_data_text");
  if (
    spidey_data_text.innerHTML !==
    "No data available. Make sure to finish creating an elevation profile."
  ) {
    spidey_data_text.innerHTML =
      "No data available. Make sure to finish creating an elevation profile.";
  }
}
