function salvarNota() {
  const nota = document.getElementById("nota").value;

  if (nota.trim() !== "") {
    localStorage.setItem("nota", nota);

    document.getElementById("Resultado").innerHTML = `
      <input type="text" id="cartao" value="${nota}" readonly>
    `;
  }
}