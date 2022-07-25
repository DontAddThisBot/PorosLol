window.onload = function () {
  const process = require("process");

  // Printing the number of seconds
  // the Node.js process is running
  var lengthOfName = process.uptime();

  document.getElementById("output").innerHTML = lengthOfName;
};
