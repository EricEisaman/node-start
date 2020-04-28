const socket = io();
const msg = document.getElementById("msg");
const nameInput = document.getElementById("name-input");
const nameBtn = document.getElementById("name-btn");
const playerList = document.getElementById("player-list");
const sendMsgBtn = document.getElementById("send-msg-btn");
const msgInput = document.getElementById("msg-input");
const idInput = document.getElementById("id-input");
sendMsgBtn.addEventListener("click", e => {
  socket.emit("send-msg", { id: idInput.value, msg: msgInput.value });
  msgInput.value = "";
});
nameBtn.addEventListener("click", e => {
  socket.emit("set-name", nameInput.value);
  nameInput.value = "";
});
function updateName(data){
  const listItem = document.getElementById(data.id);
  const me = socket.id === data.id;
  if (listItem) {
    if (me) listItem.innerHTML = `id: ${data.id}   name: <em>${data.name}</em>`;
    else listItem.innerHTML = `id: ${data.id}   name: ${data.name}`;
  } else {
    if (me)
      playerList.innerHTML += `<li id=${data.id}>id: ${data.id}   name: <em>${data.name}</em></li>`;
    else
      playerList.innerHTML += `<li id=${data.id}>id: ${data.id}   name: ${data.name}</li>`;
  }
}
socket.on("update-name", data => {
  updateName(data);
});
socket.on("connect", () => {
  console.log("My Socket ID: ", socket.id);
});
socket.on("msg", data => {
  msg.innerHTML = data;
});
socket.on("remove-player", id=>{
  const el = document.getElementById(id);
  if(el) el.parentNode.removeChild(el);
})
socket.on("current-players", playersArray=>{
  playersArray.forEach(playerData=>{
    updateName(playerData)
  })
})
