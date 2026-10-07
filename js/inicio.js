//colinha para qunando clicar no botão ir para a tela de destino
function trocarTela(destino){
    window.location.href=destino;
}
document.querySelectorAll('.btn-ir').forEach(botao=>{
    botao.addEventListener('click', ()=>{
        const destino = botao.getAttribute('data-destino');
        trocarTela(destino);
    });
}); 