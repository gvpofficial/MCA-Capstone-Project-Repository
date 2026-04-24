const messagesEl = document.getElementById('messages');
const chatForm = document.getElementById('chatForm');
const nameInput = document.getElementById('nameInput');
const messageInput = document.getElementById('messageInput');

async function fetchMessages() {
  const response = await fetch('/api/messages');
  const data = await response.json();

  messagesEl.innerHTML = '';
  data.forEach((item) => {
    const article = document.createElement('article');
    article.className = 'message';

    const meta = document.createElement('div');
    meta.className = 'meta';
    const time = new Date(item.timestamp).toLocaleTimeString();
    meta.textContent = `${item.sender} • ${time}`;

    const content = document.createElement('div');
    content.className = 'content';
    content.textContent = item.content;

    article.append(meta, content);
    messagesEl.appendChild(article);
  });

  messagesEl.scrollTop = messagesEl.scrollHeight;
}

chatForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = {
    sender: nameInput.value,
    content: messageInput.value,
  };

  const response = await fetch('/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    messageInput.value = '';
    await fetchMessages();
  }
});

fetchMessages();
setInterval(fetchMessages, 2000);
