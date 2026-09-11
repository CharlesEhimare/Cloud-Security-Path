import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import styled from 'styled-components';
import { apiService } from '../services/api';

const TasksContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 2rem;
  text-align: center;
`;

const TaskForm = styled.form`
  background: white;
  padding: 2rem;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  border: 1px solid ${props => props.theme.colors.border};
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  background: ${props => {
    switch (props.$variant) {
      case 'primary': return props.theme.colors.primary;
      case 'secondary': return props.theme.colors.secondary;
      case 'danger': return props.theme.colors.danger;
      default: return props.theme.colors.primary;
    }
  }};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TaskCard = styled.div<{ $completed: boolean }>`
  background: white;
  padding: 1.5rem;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  border: 1px solid ${props => props.theme.colors.border};
  opacity: ${props => props.$completed ? 0.7 : 1};
  transition: all 0.2s;

  &:hover {
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const TaskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const TaskTitle = styled.h3<{ $completed: boolean }>`
  color: ${props => props.$completed ? props.theme.colors.textMuted : props.theme.colors.text};
  text-decoration: ${props => props.$completed ? 'line-through' : 'none'};
  margin-bottom: 0.5rem;
`;

const TaskDescription = styled.p<{ $completed: boolean }>`
  color: ${props => props.$completed ? props.theme.colors.textMuted : props.theme.colors.text};
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const TaskMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textMuted};
`;

const TaskActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Checkbox = styled.input`
  margin-right: 0.5rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.colors.textMuted};
`;

const ErrorMessage = styled.div`
  background: ${props => props.theme.colors.danger}20;
  color: ${props => props.theme.colors.danger};
  padding: 1rem;
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: 1rem;
`;

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

const Tasks: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  const queryClient = useQueryClient();

  const { data: tasks, isLoading, error } = useQuery('tasks', apiService.getTasks);
  const { data: health } = useQuery('health', apiService.getHealth);

  const createTaskMutation = useMutation(apiService.createTask, {
    onSuccess: () => {
      queryClient.invalidateQueries('tasks');
      setFormData({ title: '', description: '' });
    },
  });

  const updateTaskMutation = useMutation(
    ({ id, completed }: { id: number; completed: boolean }) =>
      apiService.updateTask(id, { completed }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tasks');
      },
    }
  );

  const deleteTaskMutation = useMutation(apiService.deleteTask, {
    onSuccess: () => {
      queryClient.invalidateQueries('tasks');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim()) {
      createTaskMutation.mutate(formData);
    }
  };

  const handleToggleComplete = (id: number, completed: boolean) => {
    updateTaskMutation.mutate({ id, completed: !completed });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTaskMutation.mutate(id);
    }
  };

  if (health?.status !== 'ok') {
    return (
      <TasksContainer>
        <ErrorMessage>
          Backend API is not available. Please check if the backend service is running.
        </ErrorMessage>
      </TasksContainer>
    );
  }

  return (
    <TasksContainer>
      <PageTitle>Task Management</PageTitle>

      <TaskForm onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="title">Task Title</Label>
          <Input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter task title..."
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="description">Description</Label>
          <TextArea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter task description..."
          />
        </FormGroup>
        <ButtonGroup>
          <Button type="submit" disabled={createTaskMutation.isLoading}>
            {createTaskMutation.isLoading ? 'Creating...' : 'Create Task'}
          </Button>
        </ButtonGroup>
      </TaskForm>

      {isLoading ? (
        <LoadingMessage>Loading tasks...</LoadingMessage>
      ) : error ? (
        <ErrorMessage>Error loading tasks. Please try again.</ErrorMessage>
      ) : (
        <TaskList>
          {tasks?.map((task: Task) => (
            <TaskCard key={task.id} $completed={task.completed}>
              <TaskHeader>
                <div>
                  <TaskTitle $completed={task.completed}>{task.title}</TaskTitle>
                  <TaskDescription $completed={task.completed}>
                    {task.description}
                  </TaskDescription>
                </div>
                <TaskActions>
                  <Checkbox
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleComplete(task.id, task.completed)}
                  />
                  <Button
                    $variant="danger"
                    onClick={() => handleDelete(task.id)}
                    disabled={deleteTaskMutation.isLoading}
                  >
                    Delete
                  </Button>
                </TaskActions>
              </TaskHeader>
              <TaskMeta>
                <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                <span>Updated: {new Date(task.updatedAt).toLocaleDateString()}</span>
              </TaskMeta>
            </TaskCard>
          ))}
          {tasks?.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6c757d' }}>
              No tasks yet. Create your first task above!
            </div>
          )}
        </TaskList>
      )}
    </TasksContainer>
  );
};

export default Tasks;
