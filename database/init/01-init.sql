-- Initialize DevOps Portfolio Database
-- This script runs when the PostgreSQL container starts for the first time

-- Create database if it doesn't exist (this is handled by POSTGRES_DB env var)
-- But we can add any additional setup here

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Set timezone
SET timezone = 'UTC';

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);
CREATE INDEX IF NOT EXISTS idx_tasks_updated_at ON tasks(updated_at);
CREATE INDEX IF NOT EXISTS idx_tasks_title ON tasks USING gin(title gin_trgm_ops);

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO tasks (title, description, completed) VALUES
    ('Welcome to DevOps Portfolio!', 'This is your first task. You can edit, complete, or delete it.', false),
    ('Explore the application', 'Take a look around and see what features are available.', false),
    ('Check the system status', 'Visit the home page to see real-time system health information.', true),
    ('Learn about the tech stack', 'Read the About page to understand the technologies used in this project.', false),
    ('Set up your development environment', 'Follow the setup instructions to get the project running locally.', false),
    ('Deploy to the cloud', 'Use the CI/CD pipeline to deploy your application to a cloud platform.', false)
ON CONFLICT DO NOTHING;

-- Create a view for task statistics
CREATE OR REPLACE VIEW task_stats AS
SELECT 
    COUNT(*) as total_tasks,
    COUNT(CASE WHEN completed = true THEN 1 END) as completed_tasks,
    COUNT(CASE WHEN completed = false THEN 1 END) as pending_tasks,
    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as tasks_this_week,
    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as tasks_this_month,
    ROUND(
        (COUNT(CASE WHEN completed = true THEN 1 END)::DECIMAL / NULLIF(COUNT(*), 0)) * 100, 
        2
    ) as completion_percentage
FROM tasks;

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
