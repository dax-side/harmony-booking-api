import express from 'express';
import { register, login, getMe, updateDetails } from '../controllers/auth.controller';
import { protect } from '../middlewares/auth.middleware';
import { body } from 'express-validator';
import { validate } from '../middlewares/validation.middleware';

const router = express.Router();

// Register validation
const registerValidation = [
  body('name').not().isEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

// Login validation
const loginValidation = [
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

// Update validation
const updateValidation = [
  body('name').optional().not().isEmpty().withMessage('Name is required'),
  body('email').optional().isEmail().withMessage('Please include a valid email'),
];

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.get('/me', protect, getMe);
router.put('/me', protect, updateValidation, validate, updateDetails);

export default router; 