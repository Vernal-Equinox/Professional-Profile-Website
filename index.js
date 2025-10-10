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

    // Handle sidebar navigation links (existing functionality)
    document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      // Remove active class from all links
      removeAllActiveClasses();
      
      // Remove active class from all links
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      
      // Add active class to clicked link
      this.classList.add('active');
      
      const href = this.getAttribute('href');
      const currentBody = document.querySelector('#page-body');
      
      // Add transition-out class
      if (currentBody) {
        currentBody.classList.add('page-transition-out');
      }
      
      // Wait for transition, then load new content
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
              
              // Remove transition-out and add transition-in
              currentBody.classList.remove('page-transition-out');
              currentBody.classList.add('page-transition-in');
              
              // Remove transition-in class after animation
              setTimeout(() => {
                currentBody.classList.remove('page-transition-in');
              }, 500);
              
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          })
          .catch(error => {
            console.error('Error loading page:', error);
            alert('Failed to load page. Please try again.');
            currentBody.classList.remove('page-transition-out');
          });
      }, 300); // Match this to transition-out duration
    });
  });
  
    // Handle header anchor links for smooth scrolling
    document.querySelectorAll('.header-link').forEach(link => {
        link.addEventListener('click', function (e) {
          e.preventDefault();
          // Remove active class from sidebar nav links
          removeAllActiveClasses();
          
          const targetId = this.getAttribute('href');
          
          // Check if we're on the home page and the section exists
          const targetSection = document.querySelector(targetId);
          if (targetSection) {
            // We're on home page, just scroll to the section
            targetSection.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start' 
            });
          } else {
            // We're on a different page, load home content first
            const pageBody = document.querySelector('#page-body');
            if (pageBody) {
              // Restore the initial home content
              pageBody.innerHTML = initialHomeHTML;
              
              // Wait for content to load, then scroll to section
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

      // Handle any other links (like hero buttons)
  document.addEventListener('click', function(e) {
    // Check if it's a link with # (anchor) that's not a nav-link
    if (e.target.tagName === 'A' && 
        e.target.getAttribute('href')?.startsWith('#') && 
        !e.target.classList.contains('nav-link') &&
        !e.target.classList.contains('header-link')) {
      
      // Remove active class from sidebar nav links
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