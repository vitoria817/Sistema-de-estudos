const pausar= document.getElementById('pausar');
const escolhertempo = document.getElementById('pomodoro25');

let valor =0;
let intervalo;

function pomodoro(){

    clearInterval(intervalo);

    valor = 1500;

    intervalo = setInterval(() => {

        valor--;

        let minutos = Math.floor(valor / 60);
        let segundos = valor % 60;

        contador.value = minutos + ":" + segundos;

    }, 1000);
}

function pausarContador(){

    clearInterval(intervalo);

    valor = 300;

    intervalo = setInterval(() => {

        valor--;

        let minutos = Math.floor(valor / 60);
        let segundos = valor % 60;

        contador.value = minutos + ":" + segundos;

    }, 1000);
};


// lista de tarefas
(function () {
  const CHAVE = "foco_tarefas";
  const lista = document.getElementById("listaTarefas");
  const inputNova = document.getElementById("novaTarefa");

  let tarefas = [];
  try {
    tarefas = JSON.parse(localStorage.getItem(CHAVE)) || [];
  } catch (e) {
    tarefas = [];
  }

  function salvar() {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(tarefas));
    } catch (e) {
      console.log("Não foi possível salvar:", e);
    }
  }

  function desenhar() {
    lista.innerHTML = "";

    tarefas.forEach(function (t) {
      const li = document.createElement("li");
      li.className = "tarefa";

      const label = document.createElement("label");

      const check = document.createElement("input");
      check.type = "checkbox";
      check.checked = t.feita;
      check.addEventListener("change", function () {
        t.feita = check.checked;
        salvar();
      });

      const caixa = document.createElement("span");
      caixa.className = "caixa";
      caixa.innerHTML = '<i class="ti ti-check"></i>';

      const texto = document.createElement("span");
      texto.className = "textoTarefa";
      texto.textContent = t.texto;

      label.append(check, caixa, texto);

      const remover = document.createElement("button");
      remover.type = "button";
      remover.className = "btnRemoverTarefa";
      remover.title = "Remover tarefa";
      remover.innerHTML = '<i class="ti ti-x"></i>';
      remover.addEventListener("click", function () {
        tarefas = tarefas.filter(x => x.id !== t.id);
        salvar();
        desenhar();
      });

      li.append(label, remover);
      lista.appendChild(li);
    });
  }

  inputNova.addEventListener("keydown", function (e) {
    if (e.key !== "Enter") return;
    const texto = inputNova.value.trim();
    if (!texto) return;

    tarefas.push({ id: Date.now(), texto: texto, feita: false });
    salvar();
    desenhar();
    inputNova.value = "";
  });

  desenhar();
})();