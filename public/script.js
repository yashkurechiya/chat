 
document.addEventListener('DOMContentLoaded', () => {
    const chatArea = document.getElementById('chatArea');
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const toggleAnon = document.getElementById('toggleAnon');
    const notice = document.getElementById('notice');
 
    const initializeUser = () => {
        let name = sessionStorage.getItem('username');
        if (!name) {
            name = prompt("Please enter your name:", "Guest");
            if (!name) name = "Guest";
            sessionStorage.setItem('username', name);
        }
        return name;
    };
    
    const userName = initializeUser();
    let isAnonymous = false;
    const currentUser = {
        name: userName,
        avatar: `https://i.pravatar.cc/48?u=${userName}`
    };

    
    const socket = io();
 
    const formatTime = (isoString) => {
        if (!isoString) return '';
        return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const scrollToBottom = () => {
        chatArea.scrollTop = chatArea.scrollHeight;
    };

  
    const renderMessage = (m) => {
        const isYou = m.sender_name === currentUser.name && !m.is_anonymous;
        
        const row = document.createElement('div');
        row.className = 'msg-row' + (isYou ? ' you' : '');

        const bubble = document.createElement('div');
        bubble.className = 'msg-bubble';
        
        if (!isYou && !m.is_anonymous) {
            const senderName = document.createElement('div');
            senderName.className = 'sender-name';
            senderName.textContent = m.sender_name;
            bubble.appendChild(senderName);
        }

        const content = document.createElement('div');
        content.className = 'msg-content';
        content.textContent = m.content;

        const meta = document.createElement('div');
        meta.className = 'msg-meta';
        meta.textContent = formatTime(m.created_at);

        bubble.appendChild(content);
        bubble.appendChild(meta);

        if (!isYou) {
            const avatar = document.createElement('div');
            avatar.className = 'avatar-small';
            if (m.avatar_url && !m.is_anonymous) {
                avatar.style.backgroundImage = `url(${m.avatar_url})`;
            }
            else if (m.is_anonymous) {
                 avatar.style.backgroundImage = 'url(https://cdn-icons-png.flaticon.com/128/5397/5397237.png)';
            }
            row.appendChild(avatar);
        }

        row.appendChild(bubble);
        chatArea.appendChild(row);
    };

    const updateAnonNotice = () => {
        if (isAnonymous) {
            notice.textContent = "🕶️ You are now appearing as Anonymous!";
            notice.classList.add('active');
            toggleAnon.classList.add('active');
        } else {
            notice.textContent = "";
            notice.classList.remove('active');
            toggleAnon.classList.remove('active');
        }
    };
 
    const loadMessages = async () => {
        try {
            const res = await fetch('/api/messages');
            if (!res.ok) throw new Error('Failed to fetch messages');
            const messages = await res.json();
            chatArea.innerHTML = ''; // Clear existing messages
            messages.forEach(renderMessage);
            scrollToBottom();
        } catch (err) {
            console.error(err);
            chatArea.textContent = 'Could not load messages.';
        }
    };
 

    const sendMessage = async () => {
        const content = messageInput.value.trim();
        if (!content) return;

        const payload = {
            content: content,
            is_anonymous: isAnonymous,
            sender_name: isAnonymous ? 'Anonymous' : currentUser.name,
            avatar_url: isAnonymous ? null : currentUser.avatar
        };

        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error('Message failed to send');
            
            messageInput.value = '';
        } catch (err) {
            console.error(err);
        }
    };

    sendBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    });

    toggleAnon.addEventListener('click', () => {
        isAnonymous = !isAnonymous;
        updateAnonNotice();
    });
 
    socket.on('new_message', (message) => {
        renderMessage(message);
        scrollToBottom();
    });
 
    loadMessages();
    updateAnonNotice();
});