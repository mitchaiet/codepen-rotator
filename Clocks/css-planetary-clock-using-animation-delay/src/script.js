function init() {
   for (var i = 0; i < 60; i++) {
      $(".dots").append('<div class="dot" style="transform:translate(-50%,-50%) rotate(' + (i * 6) + 'deg)"></div>');
      /*Haven't looked into html pre-processors*/
   }
   var d = new Date();
   var hour = ((d.getHours()%12) * 60 + d.getMinutes()) * 60 + d.getSeconds(); /*hours + minutes + seconds value in seconds*/
   var minute = d.getMinutes() * 60 + d.getSeconds(); /*minutes + seconds value in seconds*/
   var second = d.getSeconds(); /*seconds in ... seconds*/
   $(".hour, .hour >.hand").css("animation-delay","-" + hour + "s");
   $(".minute, .minute >.hand").css("animation-delay","-" + minute + "s");
   $(".second, .second >.hand").css("animation-delay","-" + second + "s");
   
}
init();