gsap.set('svg', {
	visibility: 'visible'
})

let tl = gsap.timeline({
	repeat: -1,
	defaults: {
		duration: 4,
		ease: 'none'
	}
});
tl.fromTo('.mainPath', {
	drawSVG: '0% 20%'
}, {
	drawSVG: '100% 120%'	
})
.to('#whole', {
	rotation: 360,
	svgOrigin: '400 300'
}, 0).timeScale(1.25)
