let bancoDeDados = require("../database"),
  { data, modificarArquivo, buscarNaConta } = require("../supplements");

const depositarEmConta = (requisicao, resposta) => {
  try {
    const { numero_conta: numeroDaConta, valor } = requisicao.body;

    if (!numeroDaConta && !valor) {
      return resposta.status(400).json({
        mensagem: "O número da conta e o valor são obrigatórios!"
      });
    } else if (!Number(numeroDaConta) || !Number(valor)) {
      return resposta.status(400).json({
        mensagem: "O número da conta ou o valor é inválido!"
      });
    }

    if (valor <= 0) {
      return resposta.status(400).json({
        mensagem: "O valor depositado deve ser maior que zero!"
      });
    }

    const conta = buscarNaConta(numeroDaConta);

    if (conta) {
      conta.saldo += valor;

      const deposito = {
        data,
        numero_conta: numeroDaConta,
        valor: Number(valor)
      };

      bancoDeDados.depositos.push(deposito);

      modificarArquivo(bancoDeDados, "./src/database.js");

      return resposta.status(204).json(conta.saldo);
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

const sacarEmConta = (requisicao, resposta) => {
  try {
    const { numero_conta: numeroDaConta, valor, senha } = requisicao.body;

    if (!numeroDaConta) {
      return resposta.status(400).json({
        mensagem: "O número da conta é obrigatório!"
      });
    } else if (!valor) {
      return resposta.status(400).json({
        mensagem: "O valor é obrigatório!"
      });
    } else if (!senha) {
      return resposta.status(400).json({
        mensagem: "A senha é obrigatória!"
      });
    }

    const conta = buscarNaConta(numeroDaConta);

    if (!Number(numeroDaConta)) {
      return resposta.status(400).json({
        mensagem: "O número da conta é inválido!"
      });
    } else if (!Number(valor) || valor < 0) {
      return resposta.status(400).json({
        mensagem: "O valor é inválido!"
      });
    } else if (senha !== conta.usuario.senha || !Number(senha)) {
      return resposta.status(400).json({
        mensagem: "A senha é inválida!"
      });
    }

    if (conta) {
      if (conta.saldo < valor) {
        return resposta.status(400).json({
          mensagem: "Saldo insuficiente!"
        });
      } else {
        conta.saldo -= valor;

        const saque = {
          data,
          numero_conta: numeroDaConta,
          valor: Number(valor)
        };

        bancoDeDados.saques.push(saque);

        modificarArquivo(bancoDeDados, "./src/database.js");

        return resposta.status(204).json(conta.saldo);
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

const transferirEntreContas = (requisicao, resposta) => {
  try {
    const {
      numero_conta_origem: numeroDaContaDeOrigem,
      numero_conta_destino: numeroDaContaDeDestino,
      valor,
      senha
    } = requisicao.body;

    if (!numeroDaContaDeOrigem) {
      return resposta.status(400).json({
        mensagem:
          "O número da conta de origem é obrigatório e não pode ser zero!"
      });
    } else if (!numeroDaContaDeDestino) {
      return resposta.status(400).json({
        mensagem:
          "O número da conta de destino é obrigatório e não pode ser zero!"
      });
    } else if (!valor) {
      return resposta.status(400).json({
        mensagem: "O valor é obrigatório e não pode ser zero!"
      });
    } else if (!senha) {
      return resposta.status(400).json({
        mensagem: "A senha é obrigatória e não pode ser zero!"
      });
    }

    if (!Number(numeroDaContaDeOrigem)) {
      return resposta.status(400).json({
        mensagem: "O número da conta de origem é inválido!"
      });
    } else if (
      !Number(numeroDaContaDeDestino) ||
      numeroDaContaDeDestino === numeroDaContaDeOrigem
    ) {
      return resposta.status(400).json({
        mensagem: "O número da conta de destino é inválido!"
      });
    } else if (!Number(valor)) {
      return resposta.status(400).json({
        mensagem: "O valor é inválido!"
      });
    }
    const contaDeOrigem = buscarNaConta(numeroDaContaDeOrigem),
      contaDeDestino = buscarNaConta(numeroDaContaDeDestino);

    if (!contaDeOrigem) {
      return resposta.status(400).json({
        mensagem: "O número da conta de origem não foi encontrado!"
      });
    } else if (!contaDeDestino) {
      return resposta.status(400).json({
        mensagem: "O número da conta de destino não foi encontrado!"
      });
    }

    if (senha !== contaDeOrigem.usuario.senha || !Number(senha)) {
      return resposta.status(400).json({
        mensagem: "A senha é inválida."
      });
    }

    if (contaDeOrigem.saldo < valor) {
      return resposta.status(400).json({
        mensagem: "Saldo insuficiente!"
      });
    } else {
      contaDeOrigem.saldo -= valor;
      contaDeDestino.saldo += valor;

      const transferencia = {
        data,
        numero_conta_origem: numeroDaContaDeOrigem,
        numero_conta_destino: numeroDaContaDeDestino,
        valor: Number(valor)
      };

      bancoDeDados.transferencias.push(transferencia);

      modificarArquivo(bancoDeDados, "./src/database.js");

      return resposta.status(204).json(contaDeOrigem.saldo);
    }
  } catch (erro) {
    return resposta.status(500).json({
      mensagem: "Erro interno no servidor!"
    });
  }
};

const exibirSaldo = (requisicao, resposta) => {
  try {
    const { numero_conta: numeroDaConta, senha } = requisicao.query;

    if (!numeroDaConta) {
      return resposta.status(400).json({
        mensagem: "O número da conta é obrigatório!"
      });
    } else if (!senha) {
      return resposta.status(400).json({
        mensagem: "A senha é obrigatória!"
      });
    } else if (!Number(numeroDaConta)) {
      return resposta.status(400).json({
        mensagem: "O número da conta é inválido!"
      });
    }
    const conta = buscarNaConta(numeroDaConta);

    if (!conta) {
      return resposta.status(400).json({
        mensagem: "Conta bancária não encontrada!"
      });
    } else if (senha !== conta.usuario.senha || !Number(senha)) {
      return resposta.status(400).json({
        mensagem: "A senha é inválida!"
      });
    }

    return resposta.status(200).json({
      saldo: conta.saldo
    });
  } catch (erro) {
    return resposta.status(500).json({
      mensagem: "Erro interno no servidor!"
    });
  }
};

const exibirExtrato = (requisicao, resposta) => {
  try {
    const { numero_conta: numeroDaConta, senha } = requisicao.query;

    if (!numeroDaConta) {
      return resposta.status(400).json({
        mensagem: "O número da conta é obrigatório!"
      });
    } else if (!senha) {
      return resposta.status(400).json({
        mensagem: "A senha é obrigatória!"
      });
    } else if (!Number(numeroDaConta)) {
      return resposta.status(400).json({
        mensagem: "O número da conta é inválido!"
      });
    }
    const conta = buscarNaConta(numeroDaConta);

    if (!conta) {
      return resposta.status(400).json({
        mensagem: "Conta bancária não encontrada!"
      });
    } else if (senha !== conta.usuario.senha || !Number(senha)) {
      return resposta.status(400).json({
        mensagem: "A senha é inválida!"
      });
    }

    const extrato = {
      depositos: bancoDeDados.depositos,
      saques: bancoDeDados.saques,
      transferenciasEnviadas: bancoDeDados.transferencias.filter(
        transferencia => transferencia.numero_conta_origem === numeroDaConta
      ),
      transferenciasRecebidas: bancoDeDados.transferencias.filter(
        transferencia => transferencia.numero_conta_destino === numeroDaConta
      )
    };

    return resposta.status(201).json(extrato);
  } catch (erro) {
    return resposta.status(500).json({
      mensagem: "Erro interno no servidor!"
    });
  }
};

module.exports = {
  depositarEmConta,
  sacarEmConta,
  transferirEntreContas,
  exibirSaldo,
  exibirExtrato
};
