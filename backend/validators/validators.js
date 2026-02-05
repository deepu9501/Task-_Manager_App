const { body } = require('express-validator');

// Validation rules for user registration
exports.registerValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ max: 50 })
        .withMessage('Name cannot be more than 50 characters'),
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
];

// Validation rules for user login
exports.loginValidation = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

// Validation rules for creating a task
exports.createTaskValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ max: 100 })
        .withMessage('Title cannot be more than 100 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description cannot be more than 500 characters'),
    body('category')
        .optional()
        .trim()
        .isIn(['Work', 'Personal', 'Urgent', 'Other'])
        .withMessage('Category must be Work, Personal, Urgent, or Other'),
    body('priority')
        .optional()
        .isIn(['High', 'Medium', 'Low'])
        .withMessage('Priority must be High, Medium, or Low'),
    body('dueDate')
        .optional()
        .isISO8601()
        .withMessage('Please provide a valid date')
];

// Validation rules for updating a task
exports.updateTaskValidation = [
    body('title')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Title cannot be empty')
        .isLength({ max: 100 })
        .withMessage('Title cannot be more than 100 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description cannot be more than 500 characters'),
    body('category')
        .optional()
        .trim()
        .isIn(['Work', 'Personal', 'Urgent', 'Other'])
        .withMessage('Category must be Work, Personal, Urgent, or Other'),
    body('priority')
        .optional()
        .isIn(['High', 'Medium', 'Low'])
        .withMessage('Priority must be High, Medium, or Low'),
    body('dueDate')
        .optional()
        .isISO8601()
        .withMessage('Please provide a valid date'),
    body('isCompleted')
        .optional()
        .isBoolean()
        .withMessage('isCompleted must be a boolean')
];
