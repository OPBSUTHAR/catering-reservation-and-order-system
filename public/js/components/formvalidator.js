// formvalidator.js - Form Validation Component
class FormValidator {
  /**
   * Initialize form validator
   * @param {string} formId - ID of the form to validate
   * @param {Object} config - Configuration object
   */
  constructor(formId, config = {}) {
    this.form = document.getElementById(formId);
    this.config = {
      errorClass: 'error',
      errorElement: 'small',
      errorElementClass: 'error-message',
      inputErrorClass: 'input-error',
      ...config
    };

    if (!this.form) {
      throw new Error(`Form with ID "${formId}" not found`);
    }

    this.fields = {};
    this.init();
  }

  /**
   * Initialize form validation
   */
  init() {
    // Find all validatable fields
    this.form.querySelectorAll('[data-validation]').forEach(field => {
      const fieldName = field.name || field.id;
      if (!fieldName) return;

      this.fields[fieldName] = {
        element: field,
        rules: field.dataset.validation.split('|'),
        errors: []
      };

      // Add event listeners for real-time validation
      field.addEventListener('input', () => this.validateField(fieldName));
      field.addEventListener('blur', () => this.validateField(fieldName));
    });

    // Add form submission handler
    this.form.addEventListener('submit', (e) => {
      if (!this.validateAll()) {
        e.preventDefault();
        this.focusFirstInvalidField();
      }
    });
  }

  /**
   * Validate all form fields
   * @returns {boolean} - True if all fields are valid
   */
  validateAll() {
    let isValid = true;

    Object.keys(this.fields).forEach(fieldName => {
      if (!this.validateField(fieldName)) {
        isValid = false;
      }
    });

    return isValid;
  }

  /**
   * Validate a single field
   * @param {string} fieldName - Name/ID of the field to validate
   * @returns {boolean} - True if field is valid
   */
  validateField(fieldName) {
    const field = this.fields[fieldName];
    if (!field) return true;

    // Clear previous errors
    this.clearFieldErrors(fieldName);
    field.errors = [];

    // Validate against each rule
    field.rules.forEach(rule => {
      const [ruleName, param] = rule.split(':');
      const validationMethod = `validate${ruleName.charAt(0).toUpperCase() + ruleName.slice(1)}`;

      if (typeof this[validationMethod] === 'function') {
        const error = this[validationMethod](field.element, param);
        if (error) {
          field.errors.push(error);
        }
      }
    });

    // Display errors if any
    if (field.errors.length > 0) {
      this.displayFieldErrors(fieldName);
      return false;
    }

    return true;
  }

  /**
   * Clear all errors for a field
   * @param {string} fieldName - Name/ID of the field
   */
  clearFieldErrors(fieldName) {
    const field = this.fields[fieldName];
    if (!field) return;

    // Remove error class from input
    field.element.classList.remove(this.config.inputErrorClass);

    // Remove existing error messages
    const errorElements = field.element.parentNode.querySelectorAll(`.${this.config.errorElementClass}`);
    errorElements.forEach(el => el.remove());
  }

  /**
   * Display errors for a field
   * @param {string} fieldName - Name/ID of the field
   */
  displayFieldErrors(fieldName) {
    const field = this.fields[fieldName];
    if (!field || field.errors.length === 0) return;

    // Add error class to input
    field.element.classList.add(this.config.inputErrorClass);

    // Create and append error messages
    field.errors.forEach(error => {
      const errorElement = document.createElement(this.config.errorElement);
      errorElement.className = `${this.config.errorElementClass} ${this.config.errorClass}`;
      errorElement.textContent = error;
      field.element.parentNode.appendChild(errorElement);
    });
  }

  /**
   * Focus the first invalid field
   */
  focusFirstInvalidField() {
    for (const fieldName in this.fields) {
      if (this.fields[fieldName].errors.length > 0) {
        this.fields[fieldName].element.focus();
        break;
      }
    }
  }

  /**
   * Add custom validation rule
   * @param {string} ruleName - Name of the rule
   * @param {Function} validator - Validation function
   * @param {string} errorMessage - Error message to display
   */
  addRule(ruleName, validator, errorMessage) {
    const methodName = `validate${ruleName.charAt(0).toUpperCase() + ruleName.slice(1)}`;
    this[methodName] = (input, param) => {
      return validator(input.value, param) ? null : errorMessage;
    };
  }

  /* ========== BUILT-IN VALIDATION RULES ========== */

  /**
   * Validate required field
   */
  validateRequired(input) {
    return input.value.trim() !== '' ? null : 'This field is required';
  }

  /**
   * Validate email format
   */
  validateEmail(input) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(input.value.trim()) ? null : 'Please enter a valid email address';
  }

  /**
   * Validate minimum length
   */
  validateMin(input, min) {
    return input.value.length >= parseInt(min) 
      ? null 
      : `Must be at least ${min} characters`;
  }

  /**
   * Validate maximum length
   */
  validateMax(input, max) {
    return input.value.length <= parseInt(max)
      ? null
      : `Must be no more than ${max} characters`;
  }

  /**
   * Validate password confirmation
   */
  validateConfirm(input, fieldToMatch) {
    const field = this.fields[fieldToMatch];
    if (!field) return null;
    
    return input.value === field.element.value
      ? null
      : 'Passwords do not match';
  }

  /**
   * Validate phone number format
   */
  validatePhone(input) {
    const re = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,3}[-\s\.]?[0-9]{3,6}$/;
    return re.test(input.value.trim()) ? null : 'Please enter a valid phone number';
  }

  /**
   * Validate numeric value
   */
  validateNumeric(input) {
    return !isNaN(input.value) ? null : 'Must be a number';
  }

  /**
   * Validate checkbox is checked
   */
  validateChecked(input) {
    return input.checked ? null : 'This field must be checked';
  }

  /**
   * Validate against a regular expression
   */
  validateRegex(input, pattern) {
    try {
      const re = new RegExp(pattern);
      return re.test(input.value) ? null : 'Invalid format';
    } catch (e) {
      console.error('Invalid regex pattern:', pattern);
      return null;
    }
  }
}

export default FormValidator;