window.onload = function () {
  const text = "Welcome to...Type Along!";
  const title = document.getElementById('title');
  let index = 0;

  function type() {
    if (index < text.length) {
      title.textContent += text.charAt(index);
      index++;
      setTimeout(type, 100);
    }else{
        startBtn.style.display = "block";
    }
  }

 setTimeout(type, 1500);
};

const button = document.getElementById('startBtn');
button.addEventListener('click', () => {
  window.location.href = 'menu.html'; 
});
