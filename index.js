const config = require("./config.js");
const express = require("express");
const bodyParser = require("body-parser");
//const fetch = require('node-fetch');
const axios = require("axios");

const { token, botUrl, apiUrl } = config;
const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname + "/files"));

process.on("unhandledRejection", (err) => {
  console.log(err);
});

app.get("/", async function (req, res) {
  res.send("It's work.");
});

const chats_ativos = [];

app.post("/webhook", function (req, res) {
  const data = req.body;

  const phone_number = `${data.entry[0].changes[0].value.messages[0].from}`;
  const message_user = `${data.entry[0].changes[0].value.messages[0].text.body}`;

  let session = chats_ativos.find((telefone) => (telefone = phone_number));
  if (session) {
    //console.log(session);
  } else {
    chats_ativos.push({ telefone: phone_number, sequencia: 0 });
    //console.log("Session criada.")
    session = chats_ativos.find((telefone) => (telefone = phone_number));
  }

  let resposta_to = "";
  i = chats_ativos.findIndex((telefone) => (telefone = phone_number));
  if (message_user.toUpperCase() == "SAIR") {
    chats_ativos[i].sequencia = 0;
  }
  if (session.sequencia == 0) {
    resposta_to =
      'Olá, você ainda não possui cadastro, vamos começar? (Digite "SAIR" para finalizar conversa)\nResponda:\n1 para "Sim"\n2 para "Não"';
    chats_ativos[i].sequencia = 1;
  } else if (session.sequencia == 1) {
    if (message_user == "1") {
      resposta_to = "Ok, vamos começar :D\nPor favor, me informe seu nome.";
      chats_ativos[i].sequencia = 2;
    } else if (message_user == "2") {
      chats_ativos[i].sequencia = 0;
    } else {
      resposta_to = "Por favor, me informe o número da opção desejada.";
    }
  } else if (session.sequencia == 2) {
    chats_ativos[i].nome = message_user.toUpperCase();
    chats_ativos[i].sequencia = 3;
    resposta_to = `Olá, ${message_user}!\nAgora me informe seu CPF.`;
  } else if (session.sequencia == 3) {
    chats_ativos[i].cpf = message_user;
    resposta_to = `Por favor, confirme as informações.\nNome: ${chats_ativos[i].nome}\nCPF: ${chats_ativos[i].cpf}\n\nResponda:\n1 para "Sim"\n2 para "Não"`;
    chats_ativos[i].sequencia = 4;
  }

  apiChatApi(phone_number, resposta_to);

  res.send({ phone_number, resposta_to });
});

app.get("/webhook", async function (req, res) {
  const data = req.query;
  res.send(data["hub.challenge"]);
});

app.listen(process.env.PORT ?? 3000, function () {
  console.log("Listening on port 3000..");
});

async function apiChatApi(telefone, message) {
  let phone = telefone;
  if (phone.length != 13) {
    const a = phone.split("");
    phone = a[0] + a[1] + a[2] + a[3] + "9" + a[4] + a[5] + a[6] + a[7] + a[8] + a[9] + a[10] + a[11];
  }
  //console.log(message);
  const url = `${apiUrl}/messages`;
  axios({
    method: "post",
    url,
    data: {
      messaging_product: "whatsapp",
      to: phone,
      text: {
        body: message,
      },
    },
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.TOKEN}`,
    },
  });
}
