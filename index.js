document.addEventListener('DOMContentLoaded', function() {
  
    // Set current year in footer
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }

    const pageBody = document.querySelector('#page-body');
    const initialHomeHTML = pageBody ? pageBody.innerHTML : '';
  
    const siteTitle = document.querySelector('.site-title');
    if (siteTitle) {
      siteTitle.addEventListener('click', function (e) {
        e.preventDefault();
        if (pageBody) pageBody.innerHTML = initialHomeHTML;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Sidebar toggle functionality
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main');
    const header = document.querySelector('header');

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        if (mainContent) {
            mainContent.classList.toggle('expanded');
        }
        if (header) {
            header.classList.toggle('expanded');
          }
        });
    }
  
    // Handle sidebar navigation links (existing functionality)
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
            const incomingBody = doc.querySelector('#page-body');
            if (incomingBody) {
              const currentBody = document.querySelector('#page-body');
              if (currentBody) {
                currentBody.innerHTML = incomingBody.innerHTML;
                currentBody.scrollIntoView({ behavior: 'smooth', block: 'start' });
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }
          })
          .catch(error => {
            console.error('Error loading page:', error);
            alert('Failed to load page. Please try again.');
          });
      });
    });
  
    // Handle header anchor links for smooth scrolling
    document.querySelectorAll('.header-link').forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
          targetSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      });
    });
  });