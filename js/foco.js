const contador = document.getElementById('contador');
const incrementar = document.getElementById('incrementar');
const pausar = document.getElementById('pausar');
const resetar = document.getElementById('resetar');
const escolhertempo = document.getElementById('escolhertempo');

let valor =0;
let intervalo;

function contadorAtivo(){
  if(valor<100000){
    valor++;
    contador.value = valor;
  }
}
function pausarContador(){
    clearInterval(intervalo);
}
incrementar.addEventListener('click', () => {
  clearInterval(intervalo);
  intervalo = setInterval(contadorAtivo, 1000);
});

pausar.addEventListener('click', pausarContador);
resetar.addEventListener('click', () => {
  clearInterval(intervalo);
  valor = 0;
  contador.value = valor;
});

