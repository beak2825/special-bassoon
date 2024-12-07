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
/* Base button styles */
.button-82-pushable {
  background-color: #007bff; /* Blue color */
  color: white; /* White text */
  border: none; /* No border */
  border-radius: 25px; /* Rounded corners */
  padding: 12px 24px; /* Padding for size */
  font-size: 16px; /* Font size */
  cursor: pointer; /* Cursor to pointer on hover */
  text-align: center;
  transition: all 0.3s ease; /* Smooth transitions */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Shadow behind the button */
  position: relative; /* For positioning the checkmark */
}

/* Hover effect */
.button-82-pushable:hover {
  background-color: #0056b3; /* Darker blue on hover */
  transform: scale(1.05); /* Slight expansion on hover */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3); /* Darker shadow */
}

/* Pressed state (active) */
.button-82-pushable:active {
  transform: scale(0.95); /* Slight shrink when pressed */
  background-color: #00408b; /* Even darker blue */
  box-shadow: none; /* Remove shadow when pressed */
}

/* Add checkmark inside the button */
.button-82-pushable .checkmark {
  display: none; /* Hidden by default */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 20px; /* Checkmark size */
  color: white;
  animation: fadeInOut 1s ease forwards; /* Animation for checkmark */
}

/* Checkmark appearance and disappearance animation */
@keyframes fadeInOut {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  30% {
    opacity: 1;
    transform: scale(1);
  }
  70% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0);
  }
}

/* When the button is in its 'processing' state */
.button-82-pushable.processing {
  opacity: 0; /* Fading out the button */
  pointer-events: none; /* Disable interaction during processing */
}

/* Styling for the text when fading */
.button-82-pushable.processing-text {
  opacity: 0; /* Text fade */
}


/* Styling for the nickname input field */
#nickname {
  width: 100%; /* Full width */
  padding: 12px; /* Padding inside the input */
  font-size: 16px; /* Font size */
  border-radius: 25px; /* Rounded corners */
  border: 2px solid #ccc; /* Light grey border */
  background-color: #f9f9f9; /* Light background color */
  color: #333; /* Dark text color */
  outline: none; /* Remove default outline on focus */
  transition: all 0.3s ease; /* Smooth transitions for focus and hover */
  box-sizing: border-box; /* Include padding and border in the width */
}

/* Focus state */
#nickname:focus {
  border-color: #007bff; /* Blue border on focus */
  background-color: #fff; /* White background on focus */
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.5); /* Light blue shadow on focus */
}

/* Placeholder text styling */
#nickname::placeholder {
  color: #aaa; /* Grey placeholder text */
  font-style: italic; /* Italicize placeholder */
}

/* Optional: when the input is disabled */
#nickname:disabled {
  background-color: #e0e0e0; /* Grey background when disabled */
  border-color: #bbb; /* Lighter border */
}
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
