// DOM Elements
const socket = io();
const usernameModal = document.getElementById('username-modal');
const chatContainer = document.getElementById('chat-container');
const usernameInput = document.getElementById('username-input');
const setUsernameBtn = document.getElementById('set-username');
const messages = document.getElementById('messages');
const form = document.getElementById('form');
const input = document.getElementById('input');
const emojiBtn = document.getElementById('emoji-btn');
const emojiPicker = document.getElementById('emoji-picker');
const changeUsernameBtn = document.getElementById('change-username');
const userDisplay = document.getElementById('user-display');
const nameModal = document.getElementById('name-modal');
const nameInput = document.getElementById('name-input');
const saveNameBtn = document.getElementById('save-name');

// Emoji Picker
const picker = new EmojiButton({
  position: 'bottom-start',
  autoHide: false,
});

emojiBtn.addEventListener('click', () => {
  picker.togglePicker(emojiBtn);
});

picker.on('emoji', (emoji) => {
  input.value += emoji;
  input.focus();
});

// Name Management
let myName = localStorage.getItem('chatName') || '';

function showNameModal() {
  nameModal.classList.add('show');
  nameInput.value = myName;
  nameInput.focus();
}

function hideNameModal() {
  nameModal.classList.remove('show');
  document.querySelector('.chat-container').style.display = 'block';
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

// Set Username
setUsernameBtn.addEventListener('click', () => {
  const username = usernameInput.value.trim();
  if (username) {
    socket.emit('set username', username);
    userDisplay.textContent = username;
    usernameModal.style.display = 'none';
    chatContainer.style.display = 'block';
    usernameModal.setAttribute('aria-hidden', 'true');
    chatContainer.setAttribute('aria-hidden', 'false');
  }
});

// Change Username
changeUsernameBtn.addEventListener('click', () => {
  usernameModal.style.display = 'flex';
  chatContainer.style.display = 'none';
  usernameModal.setAttribute('aria-hidden', 'false');
  chatContainer.setAttribute('aria-hidden', 'true');
  usernameInput.focus();
});

// Send Message
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = input.value.trim();
  if (message) {
    socket.emit('chat message', message);
    input.value = '';
  }
});

// Receive Messages
socket.on('chat message', (data) => {
  const li = document.createElement('li');
  li.textContent = `${data.user}: ${data.message}`;
  messages.appendChild(li);
  messages.scrollTop = messages.scrollHeight;
});

// User Joined/Left
socket.on('user joined', (msg) => {
  const li = document.createElement('li');
  li.textContent = msg;
  li.style.fontStyle = 'italic';
  messages.appendChild(li);
  messages.scrollTop = messages.scrollHeight;
});

socket.on('user left', (msg) => {
  const li = document.createElement('li');
  li.textContent = msg;
  li.style.fontStyle = 'italic';
  messages.appendChild(li);
  messages.scrollTop = messages.scrollHeight;
});
