module.exports = {
  banco: {
    nome: "Cubos Bank",
    numero: "123",
    agencia: "0001",
    senha: "Cubos123Bank"
  },
  contas: [
    {
      numero: "2594491",
      saldo: 500,
      usuario: {
        nome: "Booba",
        cpf: "00011122214",
        data_nascimento: "2021-03-15",
        telefone: "71999998888",
        email: "Booba@bar2.com",
        senha: "12345"
      }
    },
    {
      numero: "6504869",
      saldo: 500,
      usuario: {
        nome: "Biiba",
        cpf: "00011122114",
        data_nascimento: "2021-03-15",
        telefone: "71999998888",
        email: "Biiba@bar2.com",
        senha: "12345"
      }
    }
  ],
  saques: [
    { data: "2022-4-29 17:14:26", numero_conta: "6504869", valor: 1 },
    { data: "2022-4-29 17:18:41", numero_conta: "6504869", valor: 1 }
  ],
  depositos: [
    { data: "2022-4-29 16:54:35", numero_conta: "6504869", valor: 1000 },
    { data: "2022-4-29 17:11:8", numero_conta: "6504869", valor: 1 },
    { data: "2022-4-29 17:18:24", numero_conta: "6504869", valor: 1 }
  ],
  transferencias: [
    {
      data: "2022-4-29 17:23:30",
      numero_conta_origem: "6504869",
      numero_conta_destino: "2594491",
      valor: 500
    }
  ]
};
