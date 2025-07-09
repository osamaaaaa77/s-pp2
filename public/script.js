const socket = io();

const currentWord = document.getElementById("current-word");
const answerInput = document.getElementById("answer");
const answerChat = document.getElementById("answer-chat");
const chatInput = document.getElementById("chat-input");
const chatMessages = document.getElementById("chat-messages");
const scoresDiv = document.getElementById("scores");
const changeName = document.getElementById("change-name");
changeName.onclick = () => {
  const name = prompt("اكتب اسمك:");
  if (name) socket.emit("set name", name);
};
socket.on("set name", (name) => {
  socket.data = { name };
});
socket.on("new round", (data) => {
  currentWord.textContent = data.word;
  answerInput.value = "";
  answerChat.innerHTML = "";
  renderScores(data.scores);
});
socket.on("round result", (data) => {
  answerChat.textContent = `🏆 ${data.winner}   جاوب  `;
  renderScores(data.scores);
});
socket.on("state", (data) => {
  currentWord.textContent = data.word;
  renderScores(data.scores);
});
socket.on("chat message", (data) => {
  const div = document.createElement("div");
  div.textContent = `${data.name}: ${data.msg}`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});
answerInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const ans = answerInput.value.trim();
    if (ans !== "") {
      socket.emit("answer", ans);
    }
    answerInput.value = "";
  }
});
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const msg = chatInput.value.trim();
    if (msg !== "") {
      socket.emit("chat message", msg);
    }
    chatInput.value = "";
  }
});

function renderScores(scores) {
  scoresDiv.innerHTML = "";
  scores.sort((a, b) => b.points - a.points);
  scores.forEach((p) => {
    const div = document.createElement("div");
    div.textContent = `${p.name}: ${p.points}`;
    scoresDiv.appendChild(div);
  });
}
