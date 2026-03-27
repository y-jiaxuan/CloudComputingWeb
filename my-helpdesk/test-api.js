const http = require('http');

const data = JSON.stringify({
  messages: [{ role: 'user', content: 'hello' }]
});

const req = http.request(
  'http://localhost:3000/api/chat',
  { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': data.length } },
  (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.on('data', chunk => console.log('BODY:', chunk.toString()));
  }
);
req.on('error', console.error);
req.write(data);
req.end();
