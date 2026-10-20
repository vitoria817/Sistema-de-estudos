let notas = [];
try {
    notas = JSON.parse(localStorage.getItem("notas_cantinho")) || [];
} catch(e){
    notas = [];
}

let atual = null;
let filtro = "Todas";
let busca = "";
let emojis = ["😊","💖","📚","✨","🔥","🧠","✏️","⭐"];

let buscar = document.getElementById("buscar");
let filtros = document.getElementById("filtros");
let listaNotas = document.getElementById("listaNotas");
let tituloNota = document.getElementById("tituloNota");
let conteudo = document.getElementById("conteudo");
let materiaNota = document.getElementById("materiaNota");
let tagsVisiveis = document.getElementById("tagsVisiveis");
let favorita = document.getElementById("favorita");
let painelEmoji = document.getElementById("painelEmoji");

function salvar(){
    localStorage.setItem("notas_cantinho", JSON.stringify(notas));
}

function pegarNota(){
    return notas.find(n => n.id == atual);
}

function semHtml(html){
    return new DOMParser().parseFromString(html, "text/html").body.textContent;
}

function textoData(ms){
    let d = new Date(ms);
    let h = new Date();
    let a = new Date(h.getFullYear(), h.getMonth(), h.getDate());
    let b = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    let diff = Math.round((a - b) / 86400000);
    if(diff == 0) return "hoje";
    if(diff == 1) return "ontem";
    return String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth() + 1).padStart(2, "0");
}

function desenharFiltros(){
    filtros.innerHTML = "";
    let materias = ["Todas"];
    notas.forEach(n => {
        if(n.materia && !materias.includes(n.materia)) materias.push(n.materia);
    });
    if(!materias.includes(filtro)) filtro = "Todas";
    materias.forEach((m, i) => {
        let b = document.createElement("button");
        b.textContent = m;
        b.className = "chip cor" + (i % 4);
        if(m == filtro) b.classList.add("ativo");
        b.onclick = function(){
            filtro = m;
            desenharFiltros();
            desenharLista();
        };
        filtros.appendChild(b);
    });
}

function desenharLista(){
    listaNotas.innerHTML = "";
    let lista = notas.filter(n => {
        if(filtro != "Todas" && n.materia != filtro) return false;
        let texto = (n.titulo + " " + n.materia + " " + n.tags.join(" ") + " " + semHtml(n.conteudo)).toLowerCase();
        return texto.includes(busca.toLowerCase());
    });
    lista.sort((a, b) => b.data - a.data);

    if(lista.length == 0){
        listaNotas.innerHTML = "<div class='sem-notas'>Nenhuma nota encontrada</div>";
        return;
    }

    lista.forEach(n => {
        let card = document.createElement("div");
        card.className = "cartao-nota";
        if(n.id == atual) card.classList.add("ativa");
        let titulo = document.createElement("h4");
        titulo.textContent = n.titulo || "Sem título";
        let info = document.createElement("p");
        info.textContent = (n.materia ? n.materia + " · " : "") + textoData(n.data);
        card.append(titulo, info);
        if(n.favorita){
            let estrela = document.createElement("i");
            estrela.className = "ti ti-star-filled";
            card.appendChild(estrela);
        }
        card.onclick = function(){
            abrirNota(n.id);
        };
        listaNotas.appendChild(card);
    });
}

function desenharTags(){
    let n = pegarNota();
    tagsVisiveis.innerHTML = "";
    n.tags.forEach((t, i) => {
        let s = document.createElement("span");
        s.className = "tag cor" + ((i + 1) % 4);
        s.textContent = t;
        s.title = "Clique para remover";
        s.onclick = function(){
            n.tags.splice(i, 1);
            salvar();
            desenharTags();
            desenharLista();
        };
        tagsVisiveis.appendChild(s);
    });
}

function desenharEstrela(){
    let n = pegarNota();
    favorita.innerHTML = n.favorita ? "<i class='ti ti-star-filled'></i>" : "<i class='ti ti-star'></i>";
}

function abrirNota(id){
    atual = id;
    let n = pegarNota();
    tituloNota.value = n.titulo;
    conteudo.innerHTML = n.conteudo;
    materiaNota.value = n.materia;
    desenharTags();
    desenharEstrela();
    desenharLista();
}

function novaNota(){
    let n = {id: Date.now(), titulo: "", materia: "", conteudo: "", tags: [], favorita: false, data: Date.now()};
    notas.unshift(n);
    salvar();
    filtro = "Todas";
    busca = "";
    buscar.value = "";
    desenharFiltros();
    abrirNota(n.id);
    tituloNota.focus();
}

function salvarConteudo(){
    let n = pegarNota();
    n.conteudo = conteudo.innerHTML;
    n.data = Date.now();
    salvar();
    desenharLista();
}

tituloNota.oninput = function(){
    let n = pegarNota();
    n.titulo = tituloNota.value;
    n.data = Date.now();
    salvar();
    desenharLista();
};

conteudo.oninput = salvarConteudo;

materiaNota.onchange = function(){
    let n = pegarNota();
    n.materia = materiaNota.value.trim();
    salvar();
    desenharFiltros();
    desenharLista();
};

favorita.onclick = function(){
    let n = pegarNota();
    n.favorita = !n.favorita;
    salvar();
    desenharEstrela();
    desenharLista();
};

buscar.oninput = function(){
    busca = buscar.value;
    desenharLista();
};

document.getElementById("novaNota").onclick = novaNota;

document.getElementById("apagarNota").onclick = function(){
    if(!confirm("Apagar essa nota?")) return;
    notas = notas.filter(n => n.id != atual);
    salvar();
    if(notas.length == 0){
        novaNota();
    } else {
        desenharFiltros();
        abrirNota(notas[0].id);
    }
};

document.querySelectorAll(".ferramentas button").forEach(b => {
    b.onmousedown = function(e){
        e.preventDefault();
    };
});

document.querySelectorAll(".ferramentas button[data-cmd]").forEach(b => {
    b.onclick = function(){
        conteudo.focus();
        document.execCommand(b.dataset.cmd);
        salvarConteudo();
    };
});

document.getElementById("marcar").onclick = function(){
    conteudo.focus();
    let cor = document.queryCommandValue("hiliteColor");
    if(cor == "rgb(255, 240, 160)"){
        document.execCommand("hiliteColor", false, "transparent");
    } else {
        document.execCommand("hiliteColor", false, "#fff0a0");
    }
    salvarConteudo();
};

document.getElementById("imagem").onclick = function(){
    let link = prompt("Cole o link da imagem:");
    if(link){
        conteudo.focus();
        document.execCommand("insertImage", false, link);
        salvarConteudo();
    }
};

emojis.forEach(e => {
    let b = document.createElement("button");
    b.textContent = e;
    b.onmousedown = function(ev){
        ev.preventDefault();
    };
    b.onclick = function(){
        conteudo.focus();
        document.execCommand("insertText", false, e);
        salvarConteudo();
    };
    painelEmoji.appendChild(b);
});

document.getElementById("emoji").onclick = function(){
    if(painelEmoji.style.display == "flex"){
        painelEmoji.style.display = "none";
    } else {
        painelEmoji.style.display = "flex";
    }
};

if(notas.length == 0){
    novaNota();
} else {
    desenharFiltros();
    abrirNota(notas[0].id);
}