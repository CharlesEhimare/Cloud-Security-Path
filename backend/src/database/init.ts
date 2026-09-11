import { Pool } from 'pg';

export const initializeDatabase = async (pool: Pool): Promise<void> => {
  try {
    // Test database connection
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection established');

    // Create tables if they don't exist
    await createTables(pool);
    console.log('✅ Database tables initialized');

    // Seed initial data if needed
    await seedInitialData(pool);
    console.log('✅ Database seeded with initial data');

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};

const createTables = async (pool: Pool): Promise<void> => {
  const createTasksTable = `
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      completed BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

  const createIndexes = `
    CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
    CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);
    CREATE INDEX IF NOT EXISTS idx_tasks_updated_at ON tasks(updated_at);
  `;

  const createTrigger = `
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ language 'plpgsql';

    DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
    CREATE TRIGGER update_tasks_updated_at
      BEFORE UPDATE ON tasks
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  `;

  await pool.query(createTasksTable);
  await pool.query(createIndexes);
  await pool.query(createTrigger);
};

const seedInitialData = async (pool: Pool): Promise<void> => {
  // Check if tasks table is empty
  const result = await pool.query('SELECT COUNT(*) FROM tasks');
  const taskCount = parseInt(result.rows[0].count);

  if (taskCount === 0) {
    const sampleTasks = [
      {
        title: 'Welcome to DevOps Portfolio!',
        description: 'This is your first task. You can edit, complete, or delete it.',
        completed: false,
      },
      {
        title: 'Explore the application',
        description: 'Take a look around and see what features are available.',
        completed: false,
      },
      {
        title: 'Check the system status',
        description: 'Visit the home page to see real-time system health information.',
        completed: true,
      },
      {
        title: 'Learn about the tech stack',
        description: 'Read the About page to understand the technologies used in this project.',
        completed: false,
      },
    ];

    for (const task of sampleTasks) {
      await pool.query(
        'INSERT INTO tasks (title, description, completed) VALUES ($1, $2, $3)',
        [task.title, task.description, task.completed]
      );
    }

    console.log(`✅ Seeded ${sampleTasks.length} sample tasks`);
  }
};
