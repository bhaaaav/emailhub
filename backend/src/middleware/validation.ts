import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateRegister = (req: Request, res: Response, next: NextFunction): void => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }
  
  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }
  
  next();
};

export const validateEmail = (req: Request, res: Response, next: NextFunction): void => {
  const schema = Joi.object({
    recipient: Joi.string().email().required(),
    subject: Joi.string().min(1).max(500).required(),
    body: Joi.string().min(1).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }
  
  next();
};
