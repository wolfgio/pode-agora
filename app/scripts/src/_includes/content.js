window.addEventListener('scroll', function () {
  if(window.pageYOffset >= 60 ) {
    if(document.getElementById('sec1').className === 'animated '){
      document.getElementById('sec1').className += 'fadeInLeft';
      document.getElementById('sec2').className += 'fadeInLeft';
      document.getElementById('sec3').className += 'fadeInLeft';
    }
  }
});