document.addEventListener('DOMContentLoaded', function() {
  
    // Set current year in footer
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
  
    // Handle navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
    
        fetch(href)
          .then(res => {
            if (!res.ok) throw new Error('Page not found');
            return res.text();
          })
          .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            // Grab only the replaceable part from the fetched page
            const incomingBody = doc.querySelector('#page-body');
            if (incomingBody) {
              const currentBody = document.querySelector('#page-body');
              if (currentBody) {
                currentBody.innerHTML = incomingBody.innerHTML;
                currentBody.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }
          })
          .catch(error => {
            console.error('Error loading page:', error);
            alert('Failed to load page. Please try again.');
          });
      });
    });
  });