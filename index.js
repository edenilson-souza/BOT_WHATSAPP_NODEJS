const config = require("./config.js");
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const {token, botUrl, apiUrl} = config;
const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname + "/files"));

process.on('unhandledRejection', err => {
    console.log(err)
});

app.get('/', function (req, res) {
    res.send("It's work HAHAHAHA.");
});

app.post('/webhook', async function (req, res) {
    const data = req.body;
    console.log(data);
    console.log(data.entry[0]);
    console.log(data.entry[0].id)
    console.log(data.entry[0].changes[0].value.messages[0].from);

    const number = data.entry[0].changes[0].value.messages[0].from;

    const messageeee = 
    { "messaging_product": "whatsapp", 
        "to": number, 
        "text": {
			"body": "PRIMEIRA MENSAGEM"
		}
    };






    await apiChatApi('message', messageeee);
    res.send('Ok');
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

app.get('/webhook', async function (req, res) {
    const data = req.query;
    console.log(data);
    res.send(data["hub.challenge"]);
});

app.listen(process.env.PORT ?? 3000, function () {
    console.log('Listening on port 3000..');
});



async function apiChatApi(method, params) {
    const options = {};
    options['method'] = "POST";
    options['body'] = JSON.stringify(params);
    options['headers'] = 
    {
        'Content-Type': 'application/json', 
        "Authorization": `${token}`
    };

    

    const url = `${apiUrl}/${method}`;

    const apiResponse = await fetch(url, options);
    try {
        return await apiResponse.json();
    } catch (e) {
        return 'error'
    }
}