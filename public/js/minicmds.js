var d;
function Stvbutton() {
  if (d == 0) {
    document.getElementById("7tv").style.display = "none";
    document.getElementById("stats").style.display = "none";
    document.getElementById("moderation").style.display = "none";
    return (d = 1);
  } else {
    document.getElementById("7tv").style.display = "inline";
    document.getElementById("stats").style.display = "none";
    document.getElementById("moderation").style.display = "none";
    return (d = 0);
  }
}

var d1;
function stats() {
  if (d1 == 0) {
    document.getElementById("stats").style.display = "none";
    document.getElementById("7tv").style.display = "none";
    document.getElementById("moderation").style.display = "none";
    return (d1 = 1);
  } else {
    document.getElementById("stats").style.display = "inline";
    document.getElementById("7tv").style.display = "none";
    document.getElementById("moderation").style.display = "none";
    return (d1 = 0);
  }
}

var d2;
function moderation() {
  if (d2 == 0) {
    document.getElementById("stats").style.display = "none";
    document.getElementById("7tv").style.display = "none";
    document.getElementById("moderation").style.display = "none";
    return (d2 = 1);
  } else {
    document.getElementById("stats").style.display = "none";
    document.getElementById("7tv").style.display = "none";
    document.getElementById("moderation").style.display = "inline";
    return (d2 = 0);
  }
}
