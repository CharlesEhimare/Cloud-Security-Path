import { Router, Request, Response } from 'express';
import { Pool } from 'pg';

const router = Router();

// Health check endpoint
router.get('/', async (req: Request, res: Response) => {
  const startTime = Date.now();
  const db = req.app.locals['db'] as Pool;
  
  try {
    // Check database connection
    const dbResult = await db.query('SELECT NOW() as current_time');
    const dbStatus = dbResult.rows[0] ? 'connected' : 'disconnected';
    
    const responseTime = Date.now() - startTime;
    const uptime = process.uptime();
    
    res.status(200).json({
      status: 'ok',
      database: dbStatus,
      uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env['NODE_ENV'] || 'development',
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({
      status: 'error',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
  }
});

// Detailed health check
router.get('/detailed', async (req: Request, res: Response) => {
  const db = req.app.locals['db'] as Pool;
  
  try {
    // Database metrics
    const dbStats = await db.query(`
      SELECT 
        (SELECT count(*) FROM tasks) as total_tasks,
        (SELECT count(*) FROM tasks WHERE completed = true) as completed_tasks,
        (SELECT count(*) FROM tasks WHERE completed = false) as pending_tasks
    `);
    
    // System metrics
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    res.json({
      status: 'ok',
      database: {
        status: 'connected',
        stats: dbStats.rows[0],
      },
      system: {
        uptime: process.uptime(),
        memory: {
          rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
          heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
          heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
          external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`,
        },
        cpu: {
          user: cpuUsage.user,
          system: cpuUsage.system,
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Detailed health check failed:', error);
    res.status(503).json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
  }
});

export { router as healthRoutes };
