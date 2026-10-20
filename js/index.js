let meses = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
let diasSemana = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];
let hoje = new Date();

function ler(chave){
    try {
        return JSON.parse(localStorage.getItem(chave)) || [];
    } catch(e){
        return [];
    }
}

let compromissos = ler("agenda_compromissos");
let tarefas = ler("foco_tarefas");

function desenharSubtitulo(){
    let total = compromissos.length + tarefas.filter(t => !t.feita).length;
    let texto = "";
    if(total == 0){
        texto = "nada pra hoje, aproveita!";
    } else if(total == 1){
        texto = "você tem 1 compromisso pra hoje";
    } else {
        texto = "você tem " + total + " compromissos pra hoje";
    }
    document.getElementById("subtitulo").textContent = diasSemana[hoje.getDay()] + ", " + hoje.getDate() + " de " + meses[hoje.getMonth()] + " · " + texto;
}

function desenharAgenda(){
    let area = document.getElementById("agendaHoje");
    area.innerHTML = "";
    if(compromissos.length == 0){
        area.innerHTML = "<span class='vazio'>Nada marcado ainda</span>";
        return;
    }
    compromissos.sort((a, b) => (a.hora || "99:99").localeCompare(b.hora || "99:99"));
    compromissos.slice(0, 4).forEach(c => {
        let linha = document.createElement("div");
        linha.className = "linha";
        let hora = document.createElement("span");
        hora.className = "hora";
        hora.textContent = c.hora || "--:--";
        let texto = document.createElement("span");
        texto.textContent = c.titulo;
        linha.append(hora, texto);
        area.appendChild(linha);
    });
}

function desenharTarefas(){
    let area = document.getElementById("tarefasHoje");
    area.innerHTML = "";
    if(tarefas.length == 0){
        area.innerHTML = "<span class='vazio'>Nenhuma tarefa ainda</span>";
        return;
    }
    tarefas.slice(0, 4).forEach(t => {
        let linha = document.createElement("label");
        linha.className = "linha";
        if(t.feita) linha.classList.add("feita");
        let check = document.createElement("input");
        check.type = "checkbox";
        check.checked = t.feita;
        check.onchange = function(){
            t.feita = check.checked;
            localStorage.setItem("foco_tarefas", JSON.stringify(tarefas));
            desenharTarefas();
            desenharSubtitulo();
        };
        let texto = document.createElement("span");
        texto.textContent = t.texto;
        linha.append(check, texto);
        area.appendChild(linha);
    });
}

let notaRapida = document.getElementById("notaRapida");
notaRapida.value = localStorage.getItem("nota_rapida") || "";
notaRapida.oninput = function(){
    localStorage.setItem("nota_rapida", notaRapida.value);
};

desenharSubtitulo();
desenharAgenda();
desenharTarefas();