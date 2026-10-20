let tarefas = [];
try {
    tarefas = JSON.parse(localStorage.getItem("foco_tarefas")) || [];
} catch(e){
    tarefas = [];
}


let lista = document.getElementById("lista");
let resumo = document.getElementById("resumo");
let novaTarefa = document.getElementById("novaTarefa");


function salvar(){
    localStorage.setItem("foco_tarefas", JSON.stringify(tarefas));
}

function desenhar(){
    lista.innerHTML = "";

let feitas = tarefas.filter(t => t.feita).length;
    if(tarefas.length == 0){
        resumo.textContent = "nenhuma tarefa por aqui ainda";
        lista.innerHTML = "<div class='vazio'>Adicione sua primeira tarefa lá em cima</div>";
        return;
    }
    resumo.textContent = feitas + " de " + tarefas.length + " feitas";

    tarefas.forEach(t => {
        let div = document.createElement("div");
        div.className = "tarefa";
        if(t.feita) div.classList.add("feita");

        let check = document.createElement("input");
        check.type = "checkbox";
        check.checked = t.feita;
        check.onchange = function(){
            t.feita = check.checked;
            salvar();
            desenhar();
        };

        let texto = document.createElement("span");
        texto.textContent = t.texto;

        let remover = document.createElement("button");
        remover.innerHTML = "<i class='ti ti-trash'></i>";
        remover.onclick = function(){
            tarefas = tarefas.filter(x => x.id != t.id);
            salvar();
            desenhar();
        };

        div.append(check, texto, remover);
        lista.appendChild(div);
    });
}

function adicionar(){
    let texto = novaTarefa.value.trim();
    if(texto == ""){
     novaTarefa.focus();
 return;
    }
    tarefas.push({id: Date.now(), texto: texto, feita: false});
    salvar();
    novaTarefa.value = "";
    desenhar();
    novaTarefa.focus();
}

document.getElementById("adicionar").onclick = adicionar;

novaTarefa.onkeydown = function(e){
    if(e.key == "Enter") adicionar();
};

document.getElementById("limpar").onclick = function(){
    tarefas = tarefas.filter(t => !t.feita);
    
    salvar();
    desenhar();
};
desenhar();