import { registerUser } from '../services/auth.js';

export const registerUserController = async (req, res, next) => {
  try {
    const newUser = await registerUser(req.body);
    const data = {
      name: newUser.name,
      email: newUser.email,
    };

    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data,
    });
  } catch (error) {
    next(error);
  }
};
