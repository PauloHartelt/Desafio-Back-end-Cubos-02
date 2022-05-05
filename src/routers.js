const express = require("express");

const app = express();

const {
  listarContas,
  criarConta,
  atualizarUsuario,
  deletarConta
} = require("./bankControllers/bControllers");

const {
  depositarEmConta,
  sacarEmConta,
  transferirEntreContas,
  exibirSaldo,
  exibirExtrato
} = require("./clientControllers/cControllers");

app.get("/contas", listarContas);

app.post("/contas", criarConta);

app.put("/contas/:numeroConta/usuario", atualizarUsuario);

app.delete("/contas/:numeroConta", deletarConta);

app.post("/transacoes/depositar", depositarEmConta);

app.post("/transacoes/sacar", sacarEmConta);

app.post("/transacoes/transferir", transferirEntreContas);

app.get("/contas/saldo", exibirSaldo);

app.get("/contas/extrato", exibirExtrato);

module.exports = app;
