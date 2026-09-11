import { Router, Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { Pool } from 'pg';

const router = Router();

// Validation middleware
const validateTask = [
  body('title').trim().isLength({ min: 1, max: 255 }).withMessage('Title must be between 1 and 255 characters'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('completed').optional().isBoolean().withMessage('Completed must be a boolean'),
];

const validateTaskId = [
  param('id').isInt({ min: 1 }).withMessage('Task ID must be a positive integer'),
];

// Get all tasks
router.get('/', async (req: Request, res: Response) => {
  const db = req.app.locals['db'] as Pool;
  
  try {
    const { completed, limit = '50', offset = '0' } = req.query;
    
    let query = 'SELECT * FROM tasks';
    const params: any[] = [];
    let paramCount = 0;
    
    if (completed !== undefined) {
      paramCount++;
      query += ` WHERE completed = $${paramCount}`;
      params.push(completed === 'true');
    }
    
    query += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(parseInt(limit as string), parseInt(offset as string));
    
    const result = await db.query(query, params);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Get single task
router.get('/:id', validateTaskId, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const db = req.app.locals['db'] as Pool;
  const { id } = req.params;
  
  try {
    const result = await db.query('SELECT * FROM tasks WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    return res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching task:', error);
    return res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// Create new task
router.post('/', validateTask, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const db = req.app.locals['db'] as Pool;
  const { title, description = '', completed = false } = req.body;
  
  try {
    const result = await db.query(
      'INSERT INTO tasks (title, description, completed) VALUES ($1, $2, $3) RETURNING *',
      [title, description, completed]
    );
    
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating task:', error);
    return res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update task
router.put('/:id', [...validateTaskId, ...validateTask], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const db = req.app.locals['db'] as Pool;
  const { id } = req.params;
  const { title, description, completed } = req.body;
  
  try {
    // Check if task exists
    const existingTask = await db.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (existingTask.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Build dynamic update query
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 0;
    
    if (title !== undefined) {
      paramCount++;
      updates.push(`title = $${paramCount}`);
      values.push(title);
    }
    
    if (description !== undefined) {
      paramCount++;
      updates.push(`description = $${paramCount}`);
      values.push(description);
    }
    
    if (completed !== undefined) {
      paramCount++;
      updates.push(`completed = $${paramCount}`);
      values.push(completed);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }
    
    paramCount++;
    updates.push(`updated_at = NOW()`);
    values.push(id);
    
    const query = `UPDATE tasks SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const result = await db.query(query, values);
    
    return res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating task:', error);
    return res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete task
router.delete('/:id', validateTaskId, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const db = req.app.locals['db'] as Pool;
  const { id } = req.params;
  
  try {
    const result = await db.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting task:', error);
    return res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Get task statistics
router.get('/stats/summary', async (req: Request, res: Response) => {
  const db = req.app.locals['db'] as Pool;
  
  try {
    const result = await db.query(`
      SELECT 
        COUNT(*) as total_tasks,
        COUNT(CASE WHEN completed = true THEN 1 END) as completed_tasks,
        COUNT(CASE WHEN completed = false THEN 1 END) as pending_tasks,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as tasks_this_week,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as tasks_this_month
      FROM tasks
    `);
    
    return res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching task statistics:', error);
    return res.status(500).json({ error: 'Failed to fetch task statistics' });
  }
});

export { router as taskRoutes };
