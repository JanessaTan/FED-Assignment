/* assets/js/contact.js */
(function() {
  const form = document.getElementById('contactForm');
  const messageField = document.getElementById('contactMessage');
  const charCount = document.getElementById('contactCharCount');
  
  // Character counter for message field
  messageField.addEventListener('input', function() {
    const length = this.value.length;
    charCount.textContent = `${length}/1000 characters`;
    
    // Change color when approaching limit
    if (length > 900) {
      charCount.style.color = 'var(--warn)';
    } else {
      charCount.style.color = 'var(--muted)';
    }
  });
  
  // Form submission handler
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get all form values
    const reason = document.getElementById('contactReason').value;
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const phone = document.getElementById('contactPhone').value.trim();
    const message = messageField.value.trim();
    const method = document.querySelector('input[name="contactMethod"]:checked').value;
    
    // Validate required fields
    if (!reason || !name || !email || !message) {
      alert('Please fill in all required fields.');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      document.getElementById('contactEmail').focus();
      return;
    }
    
    // If phone method selected, require phone number
    if (method === 'phone' && !phone) {
      alert('Please provide a phone number if you prefer to be contacted by phone.');
      document.getElementById('contactPhone').focus();
      return;
    }
    
    // Create contact object
    const contact = {
      reason: reason,
      name: name,
      email: email,
      phone: phone || 'Not provided',
      message: message,
      contactMethod: method,
      timestamp: new Date().toISOString()
    };
    
    // Save to localStorage
    const contactList = store.get('contactList', []);
    contactList.push(contact);
    store.set('contactList', contactList);

    
    // Show success message
    alert('✓ Thank you for contacting us! We will get back to you within 1-2 business days.');

    // Redirect after 2 seconds
    setTimeout(function() {
        location.href = 'home.html';
    }, 2000);
});
  
  // Form reset handler
  form.addEventListener('reset', function() {
    charCount.textContent = '0/1000 characters';
    charCount.style.color = 'var(--muted)';
  });
})();