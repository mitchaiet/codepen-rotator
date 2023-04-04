var $document = $(document),
    $hours = $('.hours'),
    $minutes = $('.minutes'),
    $seconds = $('.seconds'),
    $count = $('.count');

var currentDate = new Date();

function format(d) {
  d = d.toString();
  if (d.length == 1)
    d = '0' + d;
  return d;
}

function loop(now) {
  
  currentDate.setTime(Date.now());
  
  var hours = currentDate.getHours();
  var minutes = currentDate.getMinutes();
  var seconds = currentDate.getSeconds();
  
  $hours.css('transform','rotate(' + ((((hours / 12) * 360) + 180) % 360) + 'deg)');
  
  $minutes.css('transform', 'rotate(' + (((minutes / 60) * 360) + 180) + 'deg)');
  
  $seconds.css('transform', 'rotate(' + (((seconds / 60) * 360) + 180) + 'deg)');
  
  $count.html(format(hours) + ':' + format(minutes) + ':' + format(seconds));
  
  requestAnimationFrame(loop);
  
}

loop(0);