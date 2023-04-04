const $clock = $('.clock');
const $container = $('.site-container');
const letters = 'itdiswcbydraequarterhltwentywfivehalfptenytopastqlonineonesixthreefourfivetwoeightelevenseventwelvetenmsoclock';
const words = ['it','is','a','quarter','twenty','five','half','ten','to','past','nine','one','six','three','four','five2','two','eight','eleven','seven','twelve','ten2','oclock'];
const wordsByIndex = new Array(letters.length);
wordsByIndex.fill('');
const hrs = ['twelve', 'one', 'two', 'three', 'four', 'five2', 'six', 'seven', 'eight', 'nine', 'ten2', 'eleven'];

// turn letters into array
let lettersArray = letters.split('');

// get words by index
words.forEach(word => {
  let range = [0,0];
  if(word.indexOf('2') > 0) {
    let findWord = word.replace('2', '');
    range = [letters.lastIndexOf(findWord), letters.lastIndexOf(findWord) + findWord.length - 1];
  } else {
    range = [letters.indexOf(word), letters.indexOf(word) + word.length - 1];
  }
  for(let i=range[0]; i<=range[1]; i++) {
    wordsByIndex[i] = word;
  }
});

// add letters to clock
lettersArray.forEach((letter, index) => {
  let $letter = $('<span class="letter">' + letter + '</span>');
  $letter.addClass(wordsByIndex[index]);
  $clock.append($letter);
});

// do the updates
runLoop();
setInterval(() => {
  runLoop();
}, 5000);

function runLoop() {
  const date = new Date();
  let hr = date.getHours();
  const min = date.getMinutes();
  
  getBackgroundImage(hr);

  // 12hr time
  hr = hr > 12 ? hr - 12 : hr;

  reset();
  lightUp(['it', 'is']);
  lightUp(getPrefix(min));
  lightUp(getHour(hr, min));
  lightUp(getPostfix(min));
}

function getBackgroundImage(hr){
  let keyword = 'blue%20sky';
  if(hr < 4 || hr > 20) {
    keyword = 'night';
  } else if(hr < 8) {
    keyword = 'sunrise';
  } else if(hr > 16) {
    keyword = 'sunset';
  }
  //keyword = encodeURIComponent(keyword);
  let url = 'https://source.unsplash.com/category/nature/?' + keyword;
  
  // because we're using the simple unsplash api
  // and not doing any ajax, the browser won't
  // recognise that the image should change because
  // the endpoint url only changes as the
  // keywords do :(
  // a better implementation would be to use ajax
  // and retrieve an actual image path
  
  $container
    .css('background-image', 'none')
    .removeClass('night')
    .css('background-image', 'url(' + url + ')');
  
  if(keyword.indexOf('night') >= 0) {
    $container.addClass('night');
  }
}


function getPrefix(min) {
  min = round5(min);
  switch(min) {
    case 5:  return ['five', 'past'];
    case 10: return ['ten', 'past'];
    case 15: return ['a', 'quarter', 'past'];
    case 20: return ['twenty', 'past'];
    case 25: return ['twenty', 'five', 'past'];
    case 30: return ['half', 'past'];
    case 35: return ['twenty', 'five', 'to'];
    case 40: return ['twenty', 'to'];
    case 45: return ['a', 'quarter', 'to'];
    case 50: return ['ten', 'to'];
    case 55: return ['five', 'to'];
    case 0:
    case 60:
    default: return [''];
  }
}

function getPostfix(min) {
  min = round5(min);
  if(min === 0 || min === 60) {
    return 'oclock';
  } else {
    return '';
  }
}

function getHour(hour, min) {
  min = round5(min);
  if(min <= 30) {
    return hour === 12 ? hrs[0] : hrs[hour];
  } else if(hour === 11) {
    return hrs[0];
  } else {
    return hour === 12 ? hrs[1] : hrs[hour + 1];
  }
}

function lightUp(words) {
  if(!Array.isArray(words)) words = [words];
  words.forEach(word => {
    if(word.length > 0) {
      $('.' + word).addClass('is-active');
    }
  });
}

function reset() {
  $('.letter').removeClass('is-active');
}

function round5(num) {
  return Math.round(num/5) * 5;
}