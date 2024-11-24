// Validation schemas for different data types
export const validationSchemas = {
  invoice: {
    serialNumber: {
      required: true,
      pattern: /^[A-Z0-9]{6,}$/,
      message: 'Serial number must be at least 6 alphanumeric characters',
    },
    customerName: {
      required: true,
      minLength: 2,
      message: 'Customer name is required',
    },
    productName: {
      required: true,
      message: 'Product name is required',
    },
    quantity: {
      required: true,
      min: 1,
      message: 'Quantity must be at least 1',
    },
    tax: {
      required: true,
      min: 0,
      max: 100,
      message: 'Tax must be between 0 and 100',
    },
    totalAmount: {
      required: true,
      min: 0,
      message: 'Total amount must be greater than 0',
    },
    date: {
      required: true,
      isDate: true,
      message: 'Valid date is required',
    },
  },
  product: {
    name: {
      required: true,
      minLength: 2,
      message: 'Product name must be at least 2 characters',
    },
    quantity: {
      required: true,
      min: 0,
      message: 'Quantity must be 0 or greater',
    },
    unitPrice: {
      required: true,
      min: 0,
      message: 'Unit price must be greater than 0',
    },
    tax: {
      required: true,
      min: 0,
      max: 100,
      message: 'Tax must be between 0 and 100',
    },
  },
  customer: {
    customerName: {
      required: true,
      minLength: 2,
      message: 'Customer name must be at least 2 characters',
    },
    phoneNumber: {
      required: true,
      pattern: /^\+?[\d\s-]{10,}$/,
      message: 'Valid phone number is required',
    },
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Invalid email format',
    },
  },
};

// File validation
export const fileValidation = {
  supportedFormats: {
    'application/pdf': ['.pdf'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'application/vnd.ms-excel': ['.xls'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
  },
  maxSize: 5 * 1024 * 1024, // 5MB
};

// Validation functions
export const validateField = (value, rules) => {
  if (rules.required && !value) {
    return rules.message || 'This field is required';
  }

  if (rules.minLength && value.length < rules.minLength) {
    return rules.message || `Minimum length is ${rules.minLength} characters`;
  }

  if (rules.pattern && !rules.pattern.test(value)) {
    return rules.message || 'Invalid format';
  }

  if (rules.min !== undefined && value < rules.min) {
    return rules.message || `Minimum value is ${rules.min}`;
  }

  if (rules.max !== undefined && value > rules.max) {
    return rules.message || `Maximum value is ${rules.max}`;
  }

  if (rules.isDate && isNaN(Date.parse(value))) {
    return rules.message || 'Invalid date';
  }

  return null;
};

export const validateObject = (data, schema) => {
  const errors = {};
  let hasErrors = false;

  Object.entries(schema).forEach(([field, rules]) => {
    const error = validateField(data[field], rules);
    if (error) {
      errors[field] = error;
      hasErrors = true;
    }
  });

  return { isValid: !hasErrors, errors };
};

export const validateFile = (file) => {
  if (!file) {
    return { isValid: false, error: 'No file selected' };
  }

  // Check file size
  if (file.size > fileValidation.maxSize) {
    return { 
      isValid: false, 
      error: `File size exceeds ${fileValidation.maxSize / (1024 * 1024)}MB limit` 
    };
  }

  // Check file type
  const isSupported = Object.entries(fileValidation.supportedFormats).some(
    ([mimeType, extensions]) => {
      return file.type === mimeType || extensions.some(ext => 
        file.name.toLowerCase().endsWith(ext)
      );
    }
  );

  if (!isSupported) {
    return { 
      isValid: false, 
      error: 'Unsupported file format. Please upload PDF, Excel, or image files (jpg, png)' 
    };
  }

  return { isValid: true };
};
