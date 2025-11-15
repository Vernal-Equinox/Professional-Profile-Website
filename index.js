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

  // Function to remove all active classes from nav links
  function removeAllActiveClasses() {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  }

  // Function to handle page loading (shared between sidebar and portfolio tiles)
  function loadPage(href, linkElement) {
    const currentBody = document.querySelector('#page-body');
    
    if (currentBody) {
      currentBody.classList.add('page-transition-out');
    }
    
    setTimeout(() => {
      fetch(href)
        .then(res => {
          if (!res.ok) throw new Error('Page not found');
          return res.text();
        })
        .then(html => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          const incomingBody = doc.querySelector('#page-body');
          
          if (incomingBody && currentBody) {
            currentBody.innerHTML = incomingBody.innerHTML;
            
            currentBody.classList.remove('page-transition-out');
            currentBody.classList.add('page-transition-in');
            
            setTimeout(() => {
              currentBody.classList.remove('page-transition-in');
            }, 500);
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Re-attach event listeners for newly loaded portfolio tiles
            attachPortfolioTileListeners();
          }
        })
        .catch(error => {
          console.error('Error loading page:', error);
          alert('Failed to load page. Please try again.');
          currentBody.classList.remove('page-transition-out');
        });
    }, 300);
  }

  // Handle sidebar navigation links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      removeAllActiveClasses();
      this.classList.add('active');
      
      const href = this.getAttribute('href');
      loadPage(href, this);
    });
  });

  // Function to attach event listeners to portfolio tiles
  function attachPortfolioTileListeners() {
    document.querySelectorAll('.port-tile').forEach(tile => {
      tile.addEventListener('click', function (e) {
        e.preventDefault();
        
        removeAllActiveClasses();
        
        const href = this.getAttribute('href');
        loadPage(href, this);
      });
    });
  }

  // Initial attachment of portfolio tile listeners
  attachPortfolioTileListeners();

  // Handle header anchor links for smooth scrolling
  document.querySelectorAll('.header-link').forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        removeAllActiveClasses();
        
        const targetId = this.getAttribute('href');
        
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        } else {
          const pageBody = document.querySelector('#page-body');
          if (pageBody) {
            pageBody.innerHTML = initialHomeHTML;
            
            setTimeout(() => {
              const newTargetSection = document.querySelector(targetId);
              if (newTargetSection) {
                newTargetSection.scrollIntoView({ 
                  behavior: 'smooth', 
                  block: 'start' 
                });
              }
            }, 100);
          }
        }
      });
    });

document.addEventListener('click', function(e) {
  if (e.target.tagName === 'A' && 
      e.target.getAttribute('href')?.startsWith('#') && 
      !e.target.classList.contains('nav-link') &&
      !e.target.classList.contains('header-link')) {
    
    removeAllActiveClasses();
    
    const targetId = e.target.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
      e.preventDefault();
      targetSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }
});
});