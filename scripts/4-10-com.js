// Fetch comments from Google Apps Script
async function fetchComments() {
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbyh4u3HNBYklOYU5TeNDR-J73n1qW8L6mPMJ_hzdK5ZWz_u07D-vKRhgocoOr5SwBkBrw/exec?get');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const comments = Array.isArray(data.comments) ? data.comments : data;
        displayComments(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
    }
}

// Escape HTML for safety
function escapeHTML(str) {
    const div = document.createElement('div');
    div.innerText = str;
    return div.innerHTML;
}

// Format timestamp
function formatRelativeTime(date) {
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} days ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks} weeks ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} months ago`;
    return `${Math.floor(days / 365)} years ago`;
}

// Render comments
function displayComments(comments) {
    const commentsSection = document.querySelector('.comments-section');
    commentsSection.innerHTML = '';

    const profilePics = [
        'https://raw.githubusercontent.com/beak2825/special-bassoon/refs/heads/main/scripts/pfp.png',
        'https://raw.githubusercontent.com/beak2825/special-bassoon/refs/heads/main/scripts/pfp2.png',
        'https://raw.githubusercontent.com/beak2825/special-bassoon/refs/heads/main/scripts/pfp3.png',
        'https://raw.githubusercontent.com/beak2825/special-bassoon/refs/heads/main/scripts/pfp4.png',
        'https://raw.githubusercontent.com/beak2825/special-bassoon/refs/heads/main/images/pfp1.png',
        'https://raw.githubusercontent.com/beak2825/special-bassoon/refs/heads/main/images/pfp2.gif'
    ];

    const crownCookies = ['z', 'z'];

    comments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment';

        const profilePic = document.createElement('img');
        profilePic.src = profilePics[Math.floor(Math.random() * profilePics.length)];
        profilePic.className = 'profile-pic';

        const commentText = document.createElement('span');
        commentText.className = 'comment-text';
        commentText.innerHTML = `<strong class="nickname">${escapeHTML(comment.nickname)}</strong>: ${escapeHTML(comment.text)}`;

        const timestamp = document.createElement('span');
        timestamp.className = 'timestamp';
        const createdAt = new Date(comment.created_at);
        timestamp.innerHTML = ` - <span style="color: black; font-weight: bold;">${createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })} (${formatRelativeTime(createdAt)})</span>`;

        if (crownCookies.includes(comment.cookie)) {
            const crownIcon = document.createElement('img');
            crownIcon.src = 'https://raw.githubusercontent.com/beak2825/special-bassoon/refs/heads/main/scripts/crown.png';
            crownIcon.className = 'crown-icon';
            crownIcon.alt = 'Crown Icon';
            commentDiv.appendChild(crownIcon);
        }

        commentDiv.appendChild(profilePic);
        commentDiv.appendChild(commentText);
        commentDiv.appendChild(timestamp);
        commentsSection.appendChild(commentDiv);
    });
}

// Post a comment
document.getElementById('postCommentBtn').onclick = async function () {
    const nickname = localStorage.getItem('nickname') || document.getElementById('nickname').value.trim();
    const text = document.getElementById('commentInput').value.trim();
    const userKey = localStorage.getItem('userKey') || ''; // Cookie alias
    const userId = userKey || nickname || 'anonymous'; // Fallback for userid
    const resolution = `${window.innerWidth}x${window.innerHeight}`;

    if (!localStorage.getItem('nickname') && nickname) {
        localStorage.setItem('nickname', nickname);
        document.getElementById('nickname').disabled = true;
    }

    if (text) {
        const queryParams = new URLSearchParams({
            post: '',
            nickname: nickname,
            text: text,
            cookie: userKey,
            userid: userId,
            browser_resolution: resolution
        });

        const url = `https://script.google.com/macros/s/AKfycbyh4u3HNBYklOYU5TeNDR-J73n1qW8L6mPMJ_hzdK5ZWz_u07D-vKRhgocoOr5SwBkBrw/exec?${queryParams.toString()}`;

        const response = await fetch(url, {
            method: 'GET', // Still text-only via query string
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
        });

        if (response.ok) {
            document.getElementById('commentInput').value = '';
            fetchComments();
        } else {
            const errorText = await response.text();
            alert(`Error posting comment: ${errorText}`);
        }
    } else {
        alert('Please enter a comment.');
    }
};

// Initial load
window.onload = () => {
    fetchComments();
    setInterval(fetchComments, 19000);
};
