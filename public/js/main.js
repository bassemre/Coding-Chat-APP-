const cahtForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

//Get username and room from URL (query string but not from middleware(cant usable in this case) so we use  qs library CDN) or below method
const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
const { username, room } = params;

//1)------------emit connection to server
//from socket io library in javascript in front end by running <script src="/socket.io/socket.io.js"></script>
//we get access to io and when we call it that will emit connection event to API
const socket = io();
//------------emit connection to server

//2)-----------emit join chat room event-----
socket.emit("joinRoom", { username, room });

//-----------emit join chat room event-----

//3)------------Get user and room info-----------
socket.on("roomUsers", ({ room, users }) => {
  outPutRoomName(room);
  outPutusers(users);
});

//------------Get user and room info-----------

//4)-----------message from the server---------------
//Add listener to message event from server(API)
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message); //instesd of console it for test

  //we want to scroll down chat every time to get message
  chatMessages.scrollTop = chatMessages.scrollHeight;
});
//-----------message from the server---------------

//5)----------emit chatMessage event when write message in chat-----------
//Message submit
cahtForm.addEventListener("submit", (e) => {
  e.preventDefault();
  //get message text
  const msg = e.target.elements.msg.value;
  //emit message to server
  socket.emit("chatMessage", { msg, username });

  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();

  //we need to clear input after send message
});
//----------emit chatMessage event when write message in chat-----------

//output Message to DOM
//function can call it before declaration (Hoisting)
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;

  document.querySelector(".chat-messages").appendChild(div);
}

//ADD room name to DOM (info)
function outPutRoomName(room) {
  roomName.innerText = room;
}

//ADD user to userList DOM
function outPutusers(users) {
  userList.innerHTML = `${users
    .map((user) => `<li>${user.username}</li>`)
    .join("")}`;
}
