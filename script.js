const socket = io();
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const usernameModal = document.getElementById('username-modal');
const usernameInput = document.getElementById('username-input');
const setUsernameBtn = document.getElementById('set-username');
const chatContainer = document.getElementById('chat-container');
const userDisplay = document.getElementById('user-display');
const changeUsernameBtn = document.getElementById('change-username');

let username = localStorage.getItem('chat-username') || '';

function showUsernameModal() {
  usernameModal.style.display = 'flex';
  chatContainer.style.display = 'none';
  usernameInput.value = '';
  usernameInput.focus();
}

function setUsername(name) {
  username = name || 'Anonymous';
  localStorage.setItem('chat-username', username);
  userDisplay.textContent = username;
  usernameModal.style.display = 'none';
  chatContainer.style.display = '';
  input.focus();
}

setUsernameBtn.onclick = function() {
  if (usernameInput.value.trim()) {
    setUsername(usernameInput.value.trim());
  }
};

usernameInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    setUsernameBtn.click();
  }
});

changeUsernameBtn.onclick = function() {
  showUsernameModal();
};

if (!username) {
  showUsernameModal();
} else {
  setUsername(username);
}

form.addEventListener('submit', function(e) {
  e.preventDefault();
  if (input.value.trim()) {
    socket.emit('chat message', { name: username, text: input.value });
    input.value = '';
  }
});

socket.on('chat message', function(msg) {
  const item = document.createElement('li');
  item.className = 'chat-bubble';
  const time = msg.time ? new Date(msg.time) : new Date();
  const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  item.innerHTML = `<strong>${msg.name || 'Anonymous'}:</strong> ${msg.text}<span class="timestamp">${timeStr}</span>`;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
});

// Emoji picker (basic)
const emojiBtn = document.getElementById('emoji-btn');
const emojiPicker = document.getElementById('emoji-picker');
const emojis = ['😀','😂','😍','😎','😊','👍','🙏','🎉','😢','😡','🤔','🥳'];

emojiBtn.onclick = function() {
  emojiPicker.innerHTML = emojis.map(e => `<button class='emoji-item'>${e}</button>`).join(' ');
  emojiPicker.style.display = emojiPicker.style.display === 'none' ? 'block' : 'none';
};

emojiPicker.onclick = function(e) {
  if (e.target.classList.contains('emoji-item')) {
    input.value += e.target.textContent;
    emojiPicker.style.display = 'none';
    input.focus();
  }
};
