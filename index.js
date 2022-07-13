let z = 0
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
const Buff = require('buffer');
const fs = require('fs');
const youtubedl = require('youtube-dl-exec')
const req = require('express/lib/request');
var date
let b
let ipverif
let user = []
//IP IS ONLY USED FOR VERIFICATION AND IS NOT LOGGED
process.on('uncaughtException',(err)=>{
  console.log(err.name, err.message)
  io.emit('error',(err.name,err.message))
  fs.writeFileSync('crashdump.log',`Whoops! The system has encountered an error and stopped unexpectedly. Here are the errors infos:\nDate: ${Date.now()}\nStop Code: ${err.name}\nMore Informations: ${err.message}.\nThe timestamp gived at the date part can be decrypted by the timestamptool.js. (./timestamptool.js)`)
})
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/launch.html');
})
io.on('connection', (socket) => {
  socket.on('join', function (data) {
    socket.join(data.ip); // We are using room of socket io
  })
  socket.on('ip',(ip)=>{
    ipverif = ip
    user = [ip] = socket.id
  })
  socket.on('chat message', (msg) => {
    if(!msg.includes("youtube.be") && !msg.includes("youtube.com")) return;
       youtubedl(msg, {
  dumpSingleJson: true,
  noWarnings: true,
  noCallHome: true,
  noCheckCertificate: true,
  preferFreeFormats: true,
  youtubeSkipDashManifest: true
}).then(output => {
  io.emit('ipalert',ipverif)
  console.log(socket.broadcast.to(user[ipverif]))
  io.sockets.in(ipverif).emit('chat message',output)}).catch(err=>{
    io.emit('ipalert',ipverif)
  io.emit('chat message',"Lien invalide !")
})
  });
})
http.listen(port, () => {
  console.log('Youtube Video Downloader - Launched 🟢')
});