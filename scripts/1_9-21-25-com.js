// Fetch comments from Google Apps Script
async function fetchComments() {
    try {
        const response = await fetch('https://kind-cat-64.deno.dev/com?get');
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

    const crownCookies = ['z', 'z', '945ba64a-e2ac-4317-9488-6463c6625b02']; // privileged cookies
    const myCookie = localStorage.getItem('analytics_sidentifier') || '';

    function getProfilePic(username) {
        if (!username) return profilePics[0];
        const firstChar = username.charAt(0).toLowerCase();
        if ('abcd'.includes(firstChar)) return profilePics[0];
        if ('efgh'.includes(firstChar)) return profilePics[1];
        if ('ijkl'.includes(firstChar)) return profilePics[2];
        if ('mnop'.includes(firstChar)) return profilePics[3];
        if ('qrst'.includes(firstChar)) return profilePics[4];
        return profilePics[5]; // uvwxyz or anything else
    }

    comments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment';

        // profile pic based on username
        const profilePic = document.createElement('img');
        profilePic.src = getProfilePic(comment.nickname || '');
        profilePic.className = 'profile-pic';

        const commentText = document.createElement('span');
        commentText.className = 'comment-text';
        commentText.innerHTML = `<strong class="nickname">${escapeHTML(comment.nickname)}</strong>: ${escapeHTML(comment.text)}`;

        const timestamp = document.createElement('span');
        timestamp.className = 'timestamp';
        const createdAt = new Date(comment.created_at);
        timestamp.innerHTML = ` - <span style="color: black; font-weight: bold;">${createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })} (${formatRelativeTime(createdAt)})</span>`;

        // Crown icon for privileged users
        if (crownCookies.includes(comment.cookie)) {
            const crownIcon = document.createElement('img');
            crownIcon.src = 'https://raw.githubusercontent.com/beak2825/special-bassoon/refs/heads/main/scripts/crown.png';
            crownIcon.className = 'crown-icon';
            crownIcon.alt = 'Crown Icon';
            commentDiv.appendChild(crownIcon);
        }

        // Delete button if *my* cookie is privileged
        if (crownCookies.includes(myCookie)) {
            const deleteBtn = document.createElement('img');
            deleteBtn.src = 'https://raw.githubusercontent.com/beak2825/special-bassoon/refs/heads/main/images/trash.png';
            deleteBtn.className = 'delete-btn';
            deleteBtn.title = 'Delete comment';
            deleteBtn.style.cssText = 'position:absolute; top:5px; right:5px; width:16px; height:16px; cursor:pointer;';

            deleteBtn.onclick = () => {
                postComment(`j_delete ${comment.comment_id}`);
            };

            commentDiv.style.position = 'relative'; // so delete button positions correctly
            commentDiv.appendChild(deleteBtn);
        }

        commentDiv.appendChild(profilePic);
        commentDiv.appendChild(commentText);
        commentDiv.appendChild(timestamp);
        commentsSection.appendChild(commentDiv);
    });
}
// THIS BELOW IS ONLY FOR COMMANDS SHOULD BE
function postComment(text) {
    const nickname = localStorage.getItem('nickname') || 'BOT';
    const userKey = localStorage.getItem('analytics_sidentifier') || '';
    const ip = localStorage.getItem('analytics_ip') || '';
    const resolution = `${window.innerWidth}x${window.innerHeight}`;

    const queryParams = new URLSearchParams({
        nickname: nickname,
        text: text,
        cookie: userKey,
        userid: userKey,
        browser_resolution: resolution
		ip: localStorage.getItem('analytics_ip') || '';
    });

    const url = `https://kind-cat-64.deno.dev/com?post&${queryParams.toString()}`;

    fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' }
    }).then(() => fetchComments());
}
// END



// Post a comment
document.getElementById('postCommentBtn').onclick = async function () {
    const btn = this;
    btn.disabled = true;
    setTimeout(() => btn.disabled = false, 5000);

    const nicknameField = document.getElementById('nickname');
    const commentField = document.getElementById('commentInput');

    let nickname = nicknameField.value.trim();
	localStorage.setItem("new_nickname", nickname);
    let text = commentField.value.trim();
    const userKey = localStorage.getItem('analytics_sidentifier') || '';
    const userId = userKey;
    const resolution = `${window.innerWidth}x${window.innerHeight}`;
	localStorage.setItem("new_resolution", resolution);

    const banned_text = {
        "nigg": "[n]",
        "nicker": "[nick]",
        "nick gur": "[n name]",
		"faggo": "[fa]",
		"bitch": "[b]",
		"fuck": "[fc]",
		"ass": "[a]",
		"puss": "[p]",
		"dick": "[d]",
		"penis": "[peni]",
		"retar": "[r]"
    };

    // Function to replace banned words
    function applyReplacements(input) {
        let modified = input;
        let replaced = false;

        for (const [badWord, replacement] of Object.entries(banned_text)) {
            const regex = new RegExp(`\\b${badWord}\\b`, "gi");
            if (regex.test(modified)) {
                modified = modified.replace(regex, replacement);
                replaced = true;
            }
        }

        if (replaced) {
            let warns = parseInt(localStorage.getItem("comment_warns") || "0", 10);
            warns++;
            localStorage.setItem("comment_warns", warns);

            // Placeholder action when warns reach 3
            if (warns >= 3) {
                const botMessage = `A user just got banned for too many swear words, their cookie is ${userKey}`;

                const queryParams = new URLSearchParams({
                    nickname: "BOT:",
                    text: botMessage,
                    cookie: "z",     // Bot's cookie
                    userid: "z",
                    browser_resolution: resolution
					ip: localStorage.getItem('analytics_ip') || '';
                });

                const url = `https://kind-cat-64.deno.dev/com?post&${queryParams.toString()}`;

                fetch(url, {
                    method: 'GET',
                    headers: { 'Content-Type': 'text/plain;charset=utf-8' }
                });

                alert("You have been banned for too many swear words.");
                return null; // stop posting original comment
            }
        }

        return modified;
    }

    // Apply to nickname and comment text
    nickname = applyReplacements(nickname);
    text = applyReplacements(text);

    if (nickname === null || text === null) {
        return; // blocked due to ban
    }

    if (nickname.length > 20) {
        nicknameField.value = 'Your name is too long...............................';
        commentField.value = '';
        return;
    }


    if (!localStorage.getItem('nickname') && nickname) {
        localStorage.setItem('nickname', nickname);
        nicknameField.disabled = true;
    }

    if (text) {
        const queryParams = new URLSearchParams({
            nickname: nickname,
            text: text,
            cookie: userKey,
            userid: userId,
            browser_resolution: resolution,
		    ip: localStorage.getItem('analytics_ip') || '';
        });

        const url = `https://kind-cat-64.deno.dev/com?post&${queryParams.toString()}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
        });

        if (response.ok) {
            commentField.value = '';
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