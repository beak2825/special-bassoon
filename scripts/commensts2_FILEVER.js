// Function to fetch comments
async function fetchComments() {
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbyVh6dF9r07lVayWzWsm-q8PE39k0VoZSXIH3Auevf9xKw5If5jEXN_ryahsH32-PEzzg/exec?id=uiupdate');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Check if the comments data is nested and adjust accordingly
        const comments = data.comments ? data.comments : data;

        // Ensure the result is an array
        if (!Array.isArray(comments)) {
            throw new Error('Expected an array of comments');
        }

        displayComments(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
    }
}

// Function to escape HTML
function escapeHTML(str) {
    const div = document.createElement('div');
    div.innerText = str;
    return div.innerHTML;
}

// Function to format relative time
function formatRelativeTime(date) {
    const now = new Date();
    const secondsElapsed = Math.floor((now - date) / 1000);
    
    if (secondsElapsed < 60) return `${secondsElapsed} seconds ago`;
    const minutesElapsed = Math.floor(secondsElapsed / 60);
    if (minutesElapsed < 60) return `${minutesElapsed} minutes ago`;
    const hoursElapsed = Math.floor(minutesElapsed / 60);
    if (hoursElapsed < 24) return `${hoursElapsed} hours ago`;
    const daysElapsed = Math.floor(hoursElapsed / 24);
    if (daysElapsed < 7) return `${daysElapsed} days ago`;
    const weeksElapsed = Math.floor(daysElapsed / 7);
    if (weeksElapsed < 4) return `${weeksElapsed} weeks ago`;
    const monthsElapsed = Math.floor(daysElapsed / 30);
    if (monthsElapsed < 12) return `${monthsElapsed} months ago`;
    const yearsElapsed = Math.floor(daysElapsed / 365);
    return `${yearsElapsed} years ago`;
}

// Function to display comments
function displayComments(comments) {
    const commentsSection = document.querySelector('.comments-section');
    commentsSection.innerHTML = ''; // Clear previous comments
    const userIdLocalStorage = "test22";

    // Array of profile picture URLs
    const profilePics = [
        'https://raw.githubusercontent.com/beak2825/special-bassoon/refs/heads/main/scripts/pfp.png',
        'https://raw.githubusercontent.com/beak2825/special-bassoon/refs/heads/main/scripts/pfp2.png',
        'https://raw.githubusercontent.com/beak2825/special-bassoon/refs/heads/main/scripts/pfp3.png',
        'https://raw.githubusercontent.com/beak2825/special-bassoon/refs/heads/main/scripts/pfp4.png'
    ];

    // Array of crown placeholder cookies
    const crownCookies = [
        'z',
        'z'
    ];

    comments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment';

        // Select a random profile picture from the array
        const profilePic = document.createElement('img');
        const randomIndex = Math.floor(Math.random() * profilePics.length);
        profilePic.src = profilePics[randomIndex];
        profilePic.className = 'profile-pic';

        const commentText = document.createElement('span');
        commentText.className = 'comment-text';
        commentText.innerHTML = `<strong class="nickname">${escapeHTML(comment.nickname)}</strong>: ${escapeHTML(comment.text)}`;

        // Add timestamp with created_at and relative time
        const timestamp = document.createElement('span');
        timestamp.className = 'timestamp';
        const createdAt = new Date(comment.created_at);
        const relativeTime = formatRelativeTime(createdAt);
        timestamp.innerHTML = ` - <span style="color: black; font-weight: bold;">${createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })} (${relativeTime})</span>`;

        // Check if the comment's cookie matches one of the crown placeholder cookies
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

// Fetch comments on page load
window.onload = () => {
    fetchComments(); // Initial fetch
    setInterval(fetchComments, 19000); // Fetch comments every 11 seconds
};

// Handle posting comments
document.getElementById('postCommentBtn').onclick = async function() {
    const nickname = localStorage.getItem('nickname') || document.getElementById('nickname').value.trim();
    const text = document.getElementById('commentInput').value.trim();
    const userId = localStorage.getItem('nickname') || document.getElementById('nickname').value.trim();

    if (!localStorage.getItem('nickname') && nickname) {
        localStorage.setItem('nickname', nickname);
        document.getElementById('nickname').disabled = true;
    }

    if (text) {
        const response = await fetch(`https://script.google.com/macros/s/AKfycbyVh6dF9r07lVayWzWsm-q8PE39k0VoZSXIH3Auevf9xKw5If5jEXN_ryahsH32-PEzzg/exec?id=get_comment&nickname=${encodeURIComponent(nickname)}&text=${encodeURIComponent(text)}&cookie="test00"`, {
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
        });

        if (response.ok) {
            document.getElementById('commentInput').value = '';
            fetchComments();
        } else {
            const errorMessage = await response.text();
            alert(`Error posting comment: ${errorMessage}`);
        }
    } else {
        alert('Please enter a comment.');
    }
};

// Fetch comments on page load
fetchComments(); // Initial fetch
