
  const shareBox = document.querySelector(".share-box");
  const modal = document.getElementById("shareModal");
  const closeBtn = document.getElementById("closeModal");
  const shareBtn = document.getElementById("shareBtn");
  const userKey = localStorage.getItem('analytics_sidentifier') || '';
  shareBox.addEventListener("click", () => modal.style.display = "flex");
  closeBtn.addEventListener("click", () => modal.style.display = "none");

  shareBtn.addEventListener("click", () => {
    const yourEmail = document.getElementById("yourEmail").value.trim();
    const sendingTo = document.getElementById("sendingTo").value.trim();

    if (!sendingTo) {
      alert("Please fill the 'Sending To' field.");
      return;
    }

    const baseUrl = "https://mail.google.com/mail/?view=cm&fs=1";
    const subject = encodeURIComponent("game site");
    const body = encodeURIComponent(
      "the new game site is https://script.google.com/macros/s/AKfycbyAWMq0wM0E1MaxRZd1yZ3sdesJ7HORSqUL1xSngz-PiDGk3JNdQqMdUrFXpt14suw64g/exec?ref=" 
      + encodeURIComponent(yourEmail) + '-' + encodeURIComponent(sendingTo) + encodeURIComponent(userKey)
    );
    
    const mailUrl = `${baseUrl}&to=&su=${subject}&body=${body}&tf=1`;
    
    window.open(mailUrl, "_blank");
    modal.style.display = "none";
  });
