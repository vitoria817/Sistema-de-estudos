let bichinho = document.getElementById("bichinho");
let balao = document.getElementById("balao");
let timer;

function ficarFeliz(){
bichinho.classList.add("feliz");
balao.textContent = "Muito bem!";

    clearTimeout(timer);
    timer = setTimeout(function(){
        bichinho.classList.remove("feliz");
        balao.textContent = "Conclua sua tarefa";
    }, 2500);
}

document.addEventListener("change", function(e){
if(!e.target.closest(".tarefa")) return;
    if(!e.target.checked) return;
    ficarFeliz();
});