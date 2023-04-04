function getTimeRotations() {
  var t = new Date(),
      h = t.getHours() % 12 / 12 * 360,
      m = t.getMinutes() * 6,
      s = t.getSeconds() * 6;
   document.querySelector('.seconds').style.transform = 'rotate(' + s + 'deg)'; 
  document.querySelector('.minutes').style.transform = 'rotate(' + m + 'deg)';
  document.querySelector('.hours').style.transform = 'rotate(' + h + 'deg)';
}

function clock() {
  getTimeRotations();
  setTimeout(clock, 1000);
}

clock();