const express = require('express');
const https = require('https');
const app = express();
app.use(express.json());

const apiKey = 'sk-af02f844384046ce9ece885574560a43'; // tu API Key DeepSeek

app.post('/', (req, res) => {
try {
const userInput = req.body.request.intent.slots.question.value;

const data = JSON.stringify({
model: "deepseek-chat",
messages: [{ role: "user", content: userInput }],
temperature: 0.7
});

const options = {
hostname: 'api.deepseek.com',
path: '/v1/chat/completions',
method: 'POST',
headers: {
'Authorization': `Bearer ${apiKey}`,
'Content-Type': 'application/json'
}
};

const apiRequest = https.request(options, (apiResponse) => {
let body = '';

apiResponse.on('data', (chunk) => { body += chunk; });
apiResponse.on('end', () => {
try {
const parsed = JSON.parse(body);
const reply = parsed.choices[0].message.content.trim();

res.json({
version: '1.0',
response: {
outputSpeech: {
type: 'PlainText',
text: reply
},
shouldEndSession: false
}
});
} catch (error) {
console.error("Error parseando respuesta:", error);
res.json({
version: '1.0',
response: {
outputSpeech: {
type: 'PlainText',
text: "Lo siento, no pude interpretar la respuesta de la IA."
},
shouldEndSession: false
}
});
}
});
});

apiRequest.on('error', (error) => {
console.error("Error en conexión HTTPS:", error);
res.json({
version: '1.0',
response: {
outputSpeech: {
type: 'PlainText',
text: "Lo siento, no pude contactar a la inteligencia artificial."
},
shouldEndSession: false
}
});
});

apiRequest.write(data);
apiRequest.end();

} catch (error) {
console.error("Error general:", error);
res.json({
version: '1.0',
response: {
outputSpeech: {
type: 'PlainText',
text: "Ocurrió un error inesperado."
},
shouldEndSession: false
}
});
}
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
console.log(`Servidor Llarvis escuchando en el puerto ${port}`);
});
