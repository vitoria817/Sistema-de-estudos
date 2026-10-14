const nomes = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
               "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

let mes = new Date().getMonth();
let ano = new Date().getFullYear();

function montarCalendario() {
  const dias = document.getElementById("dias");
  dias.innerHTML = "";
  document.getElementById("titulo").textContent = nomes[mes] + " " + ano;

  const primeiroDia = new Date(ano, mes, 1).getDay();
  const totalDias = new Date(ano, mes + 1, 0).getDate();

  for (let i = 0; i < primeiroDia; i++) {
    dias.appendChild(document.createElement("div"));
  }

  const hoje = new Date();
  for (let d = 1; d <= totalDias; d++) {
    const div = document.createElement("div");
    div.textContent = d;
    if (d === hoje.getDate() && mes === hoje.getMonth() && ano === hoje.getFullYear()) {
      div.classList.add("hoje");
    }

    div.onclick = function () {
      document.querySelectorAll(".dias div").forEach(x => x.classList.remove("selecionado"));
      div.classList.add("selecionado");
    };

    dias.appendChild(div);
  
  }
}

function mudarMes(n) {
  mes += n;
  if (mes < 0) { mes = 11; ano--; }
  if (mes > 11) { mes = 0; ano++; }
  montarCalendario();
}

montarCalendario();

