// navbar laden + active-Klasse setzen
function loadNavbar() {
    fetch('navbar/navbar.html')
      .then(res => res.text())
      .then(data => {
        const placeholder = document.getElementById('navbar-placeholder');
        if (placeholder) {
          placeholder.innerHTML = data;
  
          // active-Klasse setzen basierend auf Pfad
          const current = window.location.pathname.toLowerCase();
          document.querySelectorAll('nav a').forEach(link => {
            const page = link.getAttribute('data-page');
            if (page && current.includes(page)) {
              link.classList.add('active'); // vllt irgend eine andere farbe?
            }
          });
        }
      });
  }
  window.addEventListener('DOMContentLoaded', () => {
    loadNavbar();
  });