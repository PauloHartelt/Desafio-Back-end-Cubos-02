let bancoDeDados = require("../database.js"),
  {
    modificarArquivo,
    buscarNaConta,
    validarCamposUnicos
  } = require("../supplements");

const listarContas = (requisicao, resposta) => {
  try {
    const { senha_banco: senhaDoBanco } = requisicao.query;
    if (!senhaDoBanco) {
      return resposta.status(400).json({
        mensagem: "Senha do banco não informada!"
      });
    }
    if (senhaDoBanco !== bancoDeDados.banco.senha) {
      return resposta.status(400).json({
        mensagem: "Senha do banco informada é inválida!"
      });
    }
    return resposta.status(200).json(bancoDeDados.contas);
  } catch (erro) {
    return resposta.status(500).json({
      mensagem: "Erro interno no servidor!"
    });
  }
};

const criarConta = (requisicao, resposta) => {
  try {
    const {
      nome,
      cpf,
      data_nascimento: dataDeNascimento,
      telefone,
      email,
      senha
    } = requisicao.body;

    if (!nome) {
      return resposta.status(400).json({
        mensagem: "Campo nome não informado!"
      });
    } else if (!cpf) {
      return resposta.status(400).json({
        mensagem: "Campo cpf não informado!"
      });
    } else if (!dataDeNascimento) {
      return resposta.status(400).json({
        mensagem: "Campo data de nascimento não informado!"
      });
    } else if (!telefone) {
      return resposta.status(400).json({
        mensagem: "Campo telefone não informado!"
      });
    } else if (!email) {
      return resposta.status(400).json({
        mensagem: "Campo email não informado!"
      });
    } else if (!senha) {
      return resposta.status(400).json({
        mensagem: "Campo senha não informado!"
      });
    } else if (!Number(senha) || senha.includes(".")) {
      return resposta.status(400).json({
        mensagem: "Campo senha precisa ter só números!"
      });
    }
    const camposUnicos = validarCamposUnicos(email, cpf);

    if (camposUnicos) {
      return resposta.status(400).json({
        mensagem: "Já existe uma conta com o cpf ou e-mail informado!"
      });
    }
    const novaConta = {
      numero: `${Math.floor(Math.random() * 10000001)}`,
      saldo: 0,
      usuario: { ...requisicao.body }
    };

    bancoDeDados.contas.push(novaConta);

    modificarArquivo(bancoDeDados, "./src/database.js");

    resposta.status(204).json(novaConta);
  } catch (erro) {
    return resposta.status(500).json({
      mensagem: "Erro interno no servidor!"
    });
  }
};

const atualizarUsuario = (requisicao, resposta) => {
  try {
    const {
        nome,
        cpf,
        data_nascimento: dataDeNascimento,
        telefone,
        email,
        senha
      } = requisicao.body,
      { numeroConta } = requisicao.params;

    if (!nome) {
      return resposta.status(400).json({
        mensagem: "Campo nome não informado!"
      });
    } else if (!cpf) {
      return resposta.status(400).json({
        mensagem: "Campo cpf não informado!"
      });
    } else if (!dataDeNascimento) {
      return resposta.status(400).json({
        mensagem: "Campo data de nascimento não informado!"
      });
    } else if (!telefone) {
      return resposta.status(400).json({
        mensagem: "Campo telefone não informado!"
      });
    } else if (!email) {
      return resposta.status(400).json({
        mensagem: "Campo email não informado!"
      });
    } else if (!senha) {
      return resposta.status(400).json({
        mensagem: "Campo senha não informado!"
      });
    } else if (!Number(numeroConta)) {
      return resposta.status(400).json({
        mensagem: "Número da conta inválido!"
      });
    } else if (!Number(senha) || senha.includes(".")) {
      return resposta.status(400).json({
        mensagem: "Campo senha precisa ter só números!"
      });
    }
    const camposUnicos = validarCamposUnicos(email, cpf);

    if (camposUnicos) {
      return resposta.status(400).json({
        mensagem: "Já existe uma conta com o cpf ou e-mail informado!"
      });
    }
    const conta = buscarNaConta(numeroConta);

    if (conta) {
      conta.usuario = { ...requisicao.body };

      modificarArquivo(bancoDeDados, "./src/database.js");

      return resposta.status(204).json(conta);
    } else {
      return resposta.status(400).json({
        mensagem: "Conta não encontrada!"
      });
    }
  } catch (erro) {
    return resposta.status(500).json({
      mensagem: "Erro interno no servidor!"
    });
  }
};

const deletarConta = (requisicao, resposta) => {
  try {
    const { numeroConta } = requisicao.params;

    if (!Number(numeroConta)) {
      return resposta.status(400).json({
        mensagem: "Número da conta inválido!"
      });
    }
    const conta = buscarNaConta(numeroConta);

    if (conta) {
      if (conta.saldo > 0) {
        return resposta.status(400).json({
          mensagem: "A conta só pode ser removida se o saldo for zero!"
        });
      } else {
        bancoDeDados.contas.splice(bancoDeDados.contas.indexOf(conta), 1);

        modificarArquivo(bancoDeDados, "./src/database.js");

        return resposta.status(204).json(bancoDeDados.contas);
      }
    } else {
      return resposta.status(400).json({
        mensagem: "Conta não encontrada ou inexistente!"
      });
    }
  } catch (erro) {
    return resposta.status(500).json({
      mensagem: "Erro interno no servidor!"
    });
  }
};

module.exports = {
  listarContas,
  criarConta,
  atualizarUsuario,
  deletarConta
};
