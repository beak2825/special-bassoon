(function () {
    // Inject HTML content at the bottom of the page
    const htmlContent = `
        <div class="comments-container">
            <input type="text" id="nickname" placeholder="Enter your nickname" />
            <textarea id="commentInput" class="comment-input" placeholder="Live Chat... SAY HI NOW"></textarea>
            <button class="button-82-pushable" id="postCommentBtn">
                <span class="button-82-shadow"></span>
                <span class="button-82-edge"></span>
                <span class="button-82-front text">Send</span>
            </button>
            <div class="comments-section"></div>
        </div>
    `;
    const styleContent = `
        /* Add your CSS styles here */
        .comments-container { 
            margin: 20px; padding: 10px; border: 1px solid #ccc; 
        }
        /* Include all your styles here from the original CSS */
    `;

    // Append HTML
    const container = document.createElement('div');
    container.innerHTML = htmlContent;
    document.body.appendChild(container);

    // Inject styles
    const styleTag = document.createElement('style');
    styleTag.innerText = styleContent;
    document.head.appendChild(styleTag);

    // JavaScript code for handling the functionality
    async function fetchComments() {
        try {
            const response = await fetch(
                'https://script.google.com/macros/s/AKfycbyh4u3HNBYklOYU5TeNDR-J73n1qW8L6mPMJ_hzdK5ZWz_u07D-vKRhgocoOr5SwBkBrw/exec?get'
            );
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            const comments = data.comments || data;
            if (!Array.isArray(comments)) throw new Error('Expected an array of comments');
            displayComments(comments);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    }

    function displayComments(comments) {
        const commentsSection = document.querySelector('.comments-section');
        commentsSection.innerHTML = '';
        comments.forEach((comment) => {
            const commentDiv = document.createElement('div');
            commentDiv.innerText = `${comment.nickname}: ${comment.text}`;
            commentsSection.appendChild(commentDiv);
        });
    }

    document.getElementById('postCommentBtn').onclick = async function () {
        const nickname = localStorage.getItem('nickname') || document.getElementById('nickname').value.trim();
        const text = document.getElementById('commentInput').value.trim();

        if (!nickname || !text) {
            alert('Please enter both nickname and comment.');
            return;
        }

        if (!localStorage.getItem('nickname')) {
            localStorage.setItem('nickname', nickname);
            document.getElementById('nickname').disabled = true;
        }

        try {
            const response = await fetch(
                `https://script.google.com/macros/s/AKfycbyh4u3HNBYklOYU5TeNDR-J73n1qW8L6mPMJ_hzdK5ZWz_u07D-vKRhgocoOr5SwBkBrw/exec?post&nickname=${encodeURIComponent(
                    nickname
                )}&text=${encodeURIComponent(text)}`,
                { method: 'POST' }
            );
            if (response.ok) {
                document.getElementById('commentInput').value = '';
                fetchComments();
            } else {
                console.error('Error posting comment');
            }
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };

    // Initialize the comments system
    window.onload = () => {
        fetchComments();
        setInterval(fetchComments, 19000);
    };
})();
