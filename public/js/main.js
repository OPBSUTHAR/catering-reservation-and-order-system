// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
  console.log('Catering Reservation System initialized');
  
  // Initialize components
  initNavigation();
  initMobileMenu();
  initReservationForm();
  initMenuFilter();
  initTestimonialsSlider();
  initScrollToTop();
  initAnimations();
  initAuthState();
});

/**
 * Initialize Navigation
 */
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath) {
      link.classList.add('active');
    }
    
    link.addEventListener('click', function(e) {
      // Smooth scroll for anchor links
      if (linkPath.startsWith('#')) {
        e.preventDefault();
        const targetId = linkPath.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}

/**
 * Initialize Mobile Menu Toggle
 */
function initMobileMenu() {
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
      menuToggle.classList.toggle('open');
      document.body.classList.toggle('no-scroll');
    });
    
    // Close menu when clicking on a link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuToggle.classList.remove('open');
        document.body.classList.remove('no-scroll');
      });
    });
  }
}

/**
 * Initialize Reservation Form
 */
function initReservationForm() {
  const reservationForm = document.getElementById('reservation-form');
  
  if (reservationForm) {
    const dateInput = document.getElementById('reservation-date');
    const timeInput = document.getElementById('reservation-time');
    const guestsInput = document.getElementById('reservation-guests');
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    
    // Set default time to next full hour
    const now = new Date();
    const nextHour = new Date(now.setHours(now.getHours() + 1, 0, 0, 0));
    timeInput.value = nextHour.toTimeString().substring(0, 5);
    
    reservationForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const submitBtn = reservationForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
      
      try {
        // Form data
        const formData = {
          name: document.getElementById('reservation-name').value,
          email: document.getElementById('reservation-email').value,
          phone: document.getElementById('reservation-phone').value,
          date: dateInput.value,
          time: timeInput.value,
          guests: guestsInput.value,
          specialRequests: document.getElementById('reservation-requests').value,
          items: getSelectedMenuItems()
        };
        
        // Here you would typically send the data to your backend
        console.log('Reservation data:', formData);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Show success message
        showAlert('Reservation submitted successfully! We will contact you shortly.', 'success');
        reservationForm.reset();
        
      } catch (error) {
        console.error('Reservation error:', error);
        showAlert('There was an error submitting your reservation. Please try again.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    });
  }
}

/**
 * Get selected menu items from the form
 */
function getSelectedMenuItems() {
  const selectedItems = [];
  const itemCheckboxes = document.querySelectorAll('.menu-item-checkbox:checked');
  
  itemCheckboxes.forEach(checkbox => {
    const itemId = checkbox.value;
    const itemElement = document.getElementById(`menu-item-${itemId}`);
    const itemName = itemElement.querySelector('.menu-item-name').textContent;
    const itemPrice = itemElement.querySelector('.menu-item-price').textContent;
    
    selectedItems.push({
      id: itemId,
      name: itemName,
      price: itemPrice
    });
  });
  
  return selectedItems;
}

/**
 * Initialize Menu Filter
 */
function initMenuFilter() {
  const filterButtons = document.querySelectorAll('.menu-filter-btn');
  const menuItems = document.querySelectorAll('.menu-item');
  
  if (filterButtons.length && menuItems.length) {
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Update active filter button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        const filterValue = this.getAttribute('data-filter');
        
        // Filter menu items
        menuItems.forEach(item => {
          if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }
}

/**
 * Initialize Testimonials Slider
 */
function initTestimonialsSlider() {
  const slider = document.querySelector('.testimonials-slider');
  if (!slider) return;
  
  let currentIndex = 0;
  const testimonials = slider.querySelectorAll('.testimonial');
  const totalTestimonials = testimonials.length;
  
  function showTestimonial(index) {
    testimonials.forEach((testimonial, i) => {
      testimonial.classList.toggle('active', i === index);
    });
  }
  
  // Auto-rotate testimonials
  setInterval(() => {
    currentIndex = (currentIndex + 1) % totalTestimonials;
    showTestimonial(currentIndex);
  }, 5000);
  
  // Initial display
  showTestimonial(currentIndex);
}

/**
 * Initialize Scroll to Top Button
 */
function initScrollToTop() {
  const scrollToTopBtn = document.getElementById('scroll-to-top');
  
  if (scrollToTopBtn) {
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('show');
      } else {
        scrollToTopBtn.classList.remove('show');
      }
    });
    
    scrollToTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

/**
 * Initialize Animations
 */
function initAnimations() {
  const animateElements = document.querySelectorAll('.animate');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });
  
  animateElements.forEach(element => {
    observer.observe(element);
  });
}

/**
 * Initialize Authentication State
 */
function initAuthState() {
  const authLinks = document.querySelectorAll('.auth-link');
  const userMenu = document.getElementById('user-menu');
  
  // Check if user is logged in (you would replace this with actual auth check)
  const isLoggedIn = localStorage.getItem('authToken') !== null;
  
  if (isLoggedIn) {
    authLinks.forEach(link => {
      if (link.classList.contains('login-link')) {
        link.style.display = 'none';
      }
    });
    
    if (userMenu) {
      userMenu.style.display = 'block';
    }
  } else {
    authLinks.forEach(link => {
      if (link.classList.contains('logout-link')) {
        link.style.display = 'none';
      }
    });
    
    if (userMenu) {
      userMenu.style.display = 'none';
    }
  }
}

/**
 * Show Alert Message
 */
function showAlert(message, type = 'success') {
  const alertContainer = document.getElementById('alert-container');
  
  if (!alertContainer) {
    console.warn('Alert container not found');
    return;
  }
  
  const alertElement = document.createElement('div');
  alertElement.className = `alert alert-${type}`;
  alertElement.textContent = message;
  
  alertContainer.appendChild(alertElement);
  
  // Remove alert after 5 seconds
  setTimeout(() => {
    alertElement.classList.add('fade-out');
    setTimeout(() => {
      alertElement.remove();
    }, 300);
  }, 5000);
}

/**
 * Format Currency
 */
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

/**
 * Debounce Function for Performance
 */
function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

// Expose functions to global scope if needed
window.showAlert = showAlert;
window.formatCurrency = formatCurrency;