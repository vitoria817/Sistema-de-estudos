(function () {
  const nomes = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
                 "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  let mes = new Date().getMonth();
  let ano = new Date().getFullYear();

  // transforma a data em texto
  function chaveData(a, m, d) {
    return a + "-" + String(m + 1).padStart(2, "0") + "-" + String(d).padStart(2, "0");
  }

  // vai salvar e ler
  function ler(chave) {
    try {
      return JSON.parse(localStorage.getItem(chave)) || [];
    } catch (e) {
      return [];
    }
  }

  function gravar(chave, valor) {
    try {
      localStorage.setItem(chave, JSON.stringify(valor));
    } catch (e) {
      console.log("Não foi possível salvar:", e);
    }
  }

  //marcações dos dias em vermelho
  const CHAVE_DIAS = "agenda_dias_marcados";
  let diasMarcados = ler(CHAVE_DIAS);

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
      const chave = chaveData(ano, mes, d);
      const div = document.createElement("div");
      div.textContent = d;

      if (d === hoje.getDate() && mes === hoje.getMonth() && ano === hoje.getFullYear()) {
        div.classList.add("hoje");
      }

      if (diasMarcados.includes(chave)) {
        div.classList.add("marcado");
      }

      div.onclick = function () {
        if (diasMarcados.includes(chave)) {
          diasMarcados = diasMarcados.filter(x => x !== chave);   // desmarca
        } else {
          diasMarcados.push(chave);                               // marca
        }
        gravar(CHAVE_DIAS, diasMarcados);
        div.classList.toggle("marcado");
      };

      dias.appendChild(div);
    }
  }

  
  window.mudarMes = function (n) {
    mes += n;
    if (mes < 0) { mes = 11; ano--; }
    if (mes > 11) { mes = 0; ano++; }
    montarCalendario();
  };

  //parte dos compromissos
  const CHAVE_COMP = "agenda_compromissos";
  let compromissos = ler(CHAVE_COMP);

  const botaoCompromisso = document.getElementById("botaoCompromisso");
  const inputTitulo = document.getElementById("DigiteCompromisso");
  const inputHora = document.getElementById("HoraCompromisso");
  const listaCompromissos = document.getElementById("listaCompromissos");

  function desenharCard(item) {
    const card = document.createElement("div");
    card.className = "compromisso";

    const info = document.createElement("div");
    info.className = "compromisso-info";

    const hora = document.createElement("div");
    hora.className = "hora";
    hora.textContent = item.hora || "--:--";

    const tituloEl = document.createElement("div");
    tituloEl.className = "titulo";
    tituloEl.textContent = item.titulo;

    info.append(hora, tituloEl);

    const apagar = document.createElement("button");
    apagar.className = "btn-apagar";
    apagar.type = "button";
    apagar.title = "Apagar compromisso";
    apagar.innerHTML = '<i class="ti ti-trash"></i>';
    apagar.addEventListener("click", function () {
      compromissos = compromissos.filter(c => c.id !== item.id);
      gravar(CHAVE_COMP, compromissos);
      card.remove();
    });

    card.append(info, apagar);
    listaCompromissos.appendChild(card);
  }

  function criarCompromisso() {
    const titulo = inputTitulo.value.trim();

    if (!titulo) {
      inputTitulo.focus();
      return;
    }

    const item = {
      id: Date.now(),
      hora: inputHora.value,
      titulo: titulo
    };

    compromissos.push(item);
    gravar(CHAVE_COMP, compromissos);
    desenharCard(item);

    inputTitulo.value = "";
    inputHora.value = "";
    inputTitulo.focus();
  }

  botaoCompromisso.addEventListener("click", criarCompromisso);

  inputTitulo.addEventListener("keydown", function (e) {
    if (e.key === "Enter") criarCompromisso();
  });

  
  montarCalendario();
  compromissos.forEach(desenharCard);
})();