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

app.get("/", function (req, res) {
  res.send("It's work HAHAHAHA.");
});

app.post("/webhook", async function (req, res) {
  const data = req.body;
  console.log(data);
  console.log(data.entry[0]);
  console.log(data.entry[0].id);
  console.log(data.entry[0].changes[0].value.messages[0].from);

  const number = data.entry[0].changes[0].value.messages[0].from;

  const messageeee = {
    messaging_product: "whatsapp",
    to: `number`,
    text: {
      body: "Oi eu sou um CHAT BOT, em que posso te ajudar?",
    },
  };

  await apiChatApi("messages", messageeee);
  res.send("Ok");
  /* 

  
    for (let i in data.messages) {
        const author = data.messages[i].author;
        const body = data.messages[i].body;
        const chatId = data.messages[i].chatId;
        const senderName = data.messages[i].senderName;
        if (data.messages[i].fromMe) continue;

        if (/help/.test(body)) {
            const text = `${senderName},  this is a demo bot for https://chat-api.com/.
            Commands:
            1. chatId - view the current chat ID
            2. file [pdf/jpg/doc/mp3] - get a file
            3. ptt - get a voice message
            4. geo - get a location
            5. group - create a group with you and the bot`;
            await apiChatApi('message', {chatId: chatId, body: text});
        } else if (/chatId/.test(body)) {
            await apiChatApi('message', {chatId: chatId, body: chatId});
        } else if (/file (pdf|jpg|doc|mp3)/.test(body)) {
            const fileType = body.match(/file (pdf|jpg|doc|mp3)/)[1];
            const files = {
                doc: botUrl + "/tra.docx",
                jpg: botUrl + "/tra.jpg",
                mp3: botUrl + "/tra.mp3",
                pdf: botUrl + "/tra.pdf"
            };
            let dataFile = {
                phone: author,
                body: files[fileType],
                filename: `File *.${fileType}`
            };
            if (fileType === "jpg") dataFile['caption'] = "Text under the photo.";
            await apiChatApi('sendFile', dataFile);
        } else if (/ptt/.test(body)) {
            await apiChatApi('sendAudio', {audio: botUrl + "/tra.ogg", chatId: chatId});
        } else if (/geo/.test(body)) {
            await apiChatApi('sendLocation', {lat: 51.178843, lng: -1.826210, address: 'Stonehenge', chatId: chatId});
        } else if (/group/.test(body)) {
            let arrayPhones = [author.replace("@c.us", "")];
            await apiChatApi('group', {
                groupName: 'Bot group',
                phones: arrayPhones,
                messageText: 'Welcome to the new group!'
            });
        }
    }
    res.send('Ok'); */
});

app.get("/webhook", async function (req, res) {
  const data = req.query;
  console.log(data);
  res.send(data["hub.challenge"]);
});

app.listen(process.env.PORT ?? 3000, function () {
  console.log("Listening on port 3000..");
});

async function apiChatApi(telefone, message) {
  

  try {
    //return await apiResponse.json();

    const url = `${apiUrl}/${method}`;

    axios({
      method: "post",
      url,
      data: {
        messaging_product: "whatsapp",
        to: `${telefone}`,
        text: {
          body: message,
        },
      },
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer EAAFuiawAhM4BAKjJo0Vb6eH8UR9cNymqT0p2cmH2saZCG7J5J6xtZBQtvHOqwFoD3GHtQNxZAdAkeCcSybzZB7gT95jRVbP6iJgawuaYyxyxsZCZBjboqefClAE0gxpUQSCubxVxNDiiG5hcTFD9QjyFM03UMRg5udl3p00d0QZBADxh08uN58mBhyJTsfuhYtG02d5WZCDZBQS1uHyZCRDuobhkoAJG0nxZCYZD",
      },
    });

  } catch (e) {
    return "error";
  }
}
