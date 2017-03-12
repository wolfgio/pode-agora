window.addEventListener('scroll', function () {
  if(window.pageYOffset >= 60 ) {
    if(document.getElementById('sec1').className === 'animated '){
      document.getElementById('sec1').className += 'fadeInLeft';
      document.getElementById('sec2').className += 'fadeInLeft';
      document.getElementById('sec3').className += 'fadeInLeft';
    }
  }
});

function login() {
  var usr = document.getElementById('usr').value;
  var pwd = document.getElementById('pwd').value;
  return (usr === 'agorapode' && pwd === "123")
}

function irAgendamento(agendamento) {
  window.location.href='./cadastro.html'
}

function scrollToLista(e){
  e.preventDefault();
  window.location.href="#services";
}
