$(document).ready(function() {
  setInterval(myfunc, 1000);
  $('.second').addClass('rotate');
  $('.minute').addClass('rotate-reverse');
  $('.hour').addClass('rotate');

  function myfunc() {
    var dt = new Date();
    var hour = dt.getHours();
    var minute = dt.getMinutes();
    var second = dt.getSeconds();
    $('p').html(hour + ":" + minute + ":" + second);
    for (var i = 0; i < second; i++) {
      if (i < 30) {
        if (i == 0) {
          $('.second div').removeClass('light-before').removeClass('light-after');
          for (var j = 0; j < minute; j++) {
            if (j < 30) {
              if (j == 0) {
                $('.minute div').removeClass('light-before').removeClass('light-after');
                for (var k = 1; k <= hour; k++) {
                  if (hour >= 13 || hour == 1) {
                    $('.hour div').removeClass('light-before').removeClass('light-after');
                  }
                  if (k >= 19) {
                    for (n = 0; n <= k - 13; n++) {
                      $('.hour div').eq(n).addClass('light-before');
                      if (n >= 6) {
                        $('.hour div').eq(n - 6).addClass('light-after');
                      }
                    }
                  } else if (k >= 13 && k <= 18) {
                    for (m = 0; m <= k - 13; m++) {
                      $('.hour div').eq(m).addClass('light-before');
                    }
                  } else if (k >= 7 && k <= 12) {
                    $('.hour div').eq(k - 7).addClass('light-after');
                  } else if (k <= 6) {
                    $('.hour div').eq(k - 1).addClass('light-before');
                  }
                }
              }
              $('.minute div').eq(j).addClass('light-before');
            } else if (j >= 30) {
              $('.minute div').eq(j - 30).addClass('light-before');
              $('.minute div').eq(j - 30).addClass('light-after');
            }
          }
        }
        $('.second div').eq(i).addClass('light-before');
      } else if (i >= 30) {
        $('.second div').eq(i - 30).addClass('light-before');
        $('.second div').eq(i - 30).addClass('light-after');
      }
    }
  }
});