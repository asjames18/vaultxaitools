import express, { Request, Response } from 'express';
import { validate } from '../middleware/validate';
import { createToolSchema, updateToolSchema } from '../schemas/tool';

// Extend Request interface to include user property
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

const router = express.Router();

// POST /api/tools - Create new tool (Admin only)
router.post(
  '/',
  validate(createToolSchema),
  async (req: AuthenticatedRequest, res: Response) => {
    // Smoke test: ensure req.user is defined
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: req.user missing' });
    }
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    
    try {
      const data = req.validatedBody;
      // use `data` instead of `req.body`...
      // Note: Tool model would need to be imported from your models
      // const tool = new Tool(data);
      // await tool.save();
      res.status(201).json({ message: 'Tool created successfully', data });
    } catch (error: any) {
      if (error.code === 11000) {
        return res.status(400).json({ error: 'Tool with this name already exists' });
      }
      res.status(500).json({ error: 'Error creating tool', message: error.message });
    }
  }
);

// PUT /api/tools/:id - Update tool (Admin only)
router.put(
  '/:id',
  validate(updateToolSchema),
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: req.user missing' });
    }
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    
    try {
      const data = req.validatedBody;
      // use `data` and req.params.id...
      // Note: Tool model would need to be imported from your models
      // const tool = await Tool.findByIdAndUpdate(
      //   req.params.id,
      //   { ...data, updatedAt: Date.now() },
      //   { new: true, runValidators: true }
      // );
      // if (!tool) {
      //   return res.status(404).json({ error: 'Tool not found' });
      // }
      res.json({ message: 'Tool updated successfully', data, id: req.params.id });
    } catch (error: any) {
      if (error.code === 11000) {
        return res.status(400).json({ error: 'Tool with this name already exists' });
      }
      res.status(500).json({ error: 'Error updating tool', message: error.message });
    }
  }
);

export default router; 