const fs = require("fs");

const bancoDeDados = require("./database");

const date = new Date(),
  data = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

function modificarArquivo(lista, nomeDoArquivo) {
  let dataString = JSON.stringify(lista);

  fs.writeFileSync(nomeDoArquivo, "module.exports = ");

  fs.appendFileSync(nomeDoArquivo, dataString);
}

function buscarNaConta(numeroDaConta) {
  return bancoDeDados.contas.find(conta => conta.numero === numeroDaConta);
}

function validarCamposUnicos(email, cpf) {
  return bancoDeDados.contas.find(
    conta => conta.usuario.email === email || conta.usuario.cpf === cpf
  );
}

module.exports = { data, modificarArquivo, buscarNaConta, validarCamposUnicos };
