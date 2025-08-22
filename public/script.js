// DOM Elements
const socket = io();
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const nameModal = document.getElementById('name-modal');
const nameInput = document.getElementById('name-input');
const saveNameBtn = document.getElementById('save-name');
const changeNameBtn = document.getElementById('change-name');
let myName = localStorage.getItem('chatName') || '';

function showNameModal() {
  nameModal.classList.add('show');
  nameInput.value = myName;
  nameInput.focus();
}
function hideNameModal() {
  nameModal.classList.remove('show');
}
function setName(name) {
  myName = name.trim() || 'Anonymous';
  localStorage.setItem('chatName', myName);
  document.getElementById('chat-title').textContent = `${myName} (You)`;
}
if (!myName) showNameModal();
else setName(myName);

saveNameBtn.onclick = () => {
  setName(nameInput.value);
  hideNameModal();
};
changeNameBtn.onclick = showNameModal;

form.addEventListener('submit', function(e) {
  e.preventDefault();
  if (input.value.trim()) {
    socket.emit('chat message', { name: myName, text: input.value });
    input.value = '';
  }
});

socket.on('chat message', function(msg) {
  addMessage(msg);
});

function addMessage(msg) {
  const li = document.createElement('li');
  li.className = 'message' + (msg.name === myName ? ' self' : '');
  li.innerHTML = `
    <span class="name">${msg.name}</span>
    <span class="bubble">${msg.text}</span>
    <span class="time">${formatTime(msg.time)}</span>
  `;
  messages.appendChild(li);
  messages.scrollTop = messages.scrollHeight;
}

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Git configuration
git config --global core.autocrlf true
