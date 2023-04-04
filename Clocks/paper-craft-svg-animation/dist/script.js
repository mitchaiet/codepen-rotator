!(function () {

    const svg = document.getElementsByClassName('move');
    const svgWrap = document.querySelector(".svg-wrap");

    for(let i = 0; i < svg.length; i++){
        
        svgWrap.addEventListener('mousemove', function(e){
            let path = svg[i].querySelector('.paths')
            let contsY = (((e.pageY / window.innerHeight) * 100) - 50) * 0.15;
            let contsX = (((e.pageX / window.innerWidth) * 100) - 50) * 0.15;
            path.style.transform='translate('+ contsX +'%,' + contsY + '%)';
        });
        svgWrap.addEventListener('touchmove', function(e){
            let path = svg[i].querySelector('.paths')
            let contsY = (((e.changedTouches[0].pageY / window.innerHeight) * 100) - 50) * 0.15;
            let contsX = (((e.changedTouches[0].pageX / window.innerWidth) * 100) - 50) * 0.15;
            path.style.transform='translate('+ contsX +'%,' + contsY + '%)';
        });
    }
    
    

})();