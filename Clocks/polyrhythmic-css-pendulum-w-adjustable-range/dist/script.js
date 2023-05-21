const pitches = document.querySelectorAll('.pitch')
document.documentElement.style.setProperty('--pitch-n', pitches.length)
Array.from(pitches).forEach((pitch, i) => {
  pitch.style.setProperty('--index', i + 1)
})