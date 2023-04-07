//javascript timer function belongs to:
//https://codepen.io/mathiasschjott/pen/rerdGj
//used here with many thanks 
function startTime() {
  offset = 1; //add an hour for GMT British SUmmertime
  var today = new Date();
  var h = today.getUTCHours();
  
  //United Kingdom British Summertime Adjustment 1 Hour Ahead
  if (h+offset == 24) h = -1;

  var m = today.getUTCMinutes();
  var s = today.getUTCSeconds();
  h = h + offset;
  if (h > 24) {
    h = h - 24;
  }
  if (h < 0) {
    h = h + 24;
  }
  h = checkTime(h);
  m = checkTime(m);
  s = checkTime(s);
  document.getElementById('clock').innerHTML = h + ":" + m + "/" + s;
  var t = setTimeout(function() {
    startTime()
  }, 500);
}

function checkTime(i) {
  if (i < 10) {
    i = "0" + i
  };
  return i;
}

startTime()