import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TodoApp } from './feature-todo';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('TodoApp', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should render successfully', () => {
    const { baseElement } = render(<TodoApp />);
    expect(baseElement).toBeTruthy();
  });

  it('should display empty state when no todos exist', () => {
    render(<TodoApp />);
    expect(screen.getByText('No todos to display')).toBeTruthy();
    expect(screen.getByText('0')).toBeTruthy();
    expect(screen.getByText('items left', { exact: false })).toBeTruthy();
  });

  it('should add a new todo when form is submitted', () => {
    render(<TodoApp />);
    
    const input = screen.getByPlaceholderText('What needs to be done?');
    const addButton = screen.getByText('Add Todo');

    fireEvent.change(input, { target: { value: 'Test todo' } });
    fireEvent.click(addButton);

    expect(screen.getByText('Test todo')).toBeTruthy();
    expect(screen.getByText('1')).toBeTruthy();
    expect(screen.getByText('item left', { exact: false })).toBeTruthy();
  });

  it('should toggle todo completion status', () => {
    render(<TodoApp />);
    
    const input = screen.getByPlaceholderText('What needs to be done?');
    fireEvent.change(input, { target: { value: 'Test todo' } });
    fireEvent.click(screen.getByText('Add Todo'));

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(screen.getByText('0')).toBeTruthy();
    expect(screen.getByText('items left', { exact: false })).toBeTruthy();
  });

  it('should delete a todo', () => {
    render(<TodoApp />);
    
    const input = screen.getByPlaceholderText('What needs to be done?');
    fireEvent.change(input, { target: { value: 'Test todo' } });
    fireEvent.click(screen.getByText('Add Todo'));

    const deleteButton = screen.getByLabelText('Delete "Test todo"');
    fireEvent.click(deleteButton);

    expect(screen.queryByText('Test todo')).toBeNull();
    expect(screen.getByText('No todos to display')).toBeTruthy();
  });

  it('should filter todos by status', () => {
    render(<TodoApp />);
    
    const input = screen.getByPlaceholderText('What needs to be done?');
    
    // Add two todos
    fireEvent.change(input, { target: { value: 'Active todo' } });
    fireEvent.click(screen.getByText('Add Todo'));
    fireEvent.change(input, { target: { value: 'Completed todo' } });
    fireEvent.click(screen.getByText('Add Todo'));

    // Mark second one as completed
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]);

    // Filter by active
    fireEvent.click(screen.getByText('Active'));
    expect(screen.queryByText('Active todo')).toBeTruthy();
    expect(screen.queryByText('Completed todo')).toBeNull();

    // Filter by completed
    fireEvent.click(screen.getByText('Completed'));
    expect(screen.queryByText('Active todo')).toBeNull();
    expect(screen.queryByText('Completed todo')).toBeTruthy();

    // Show all
    fireEvent.click(screen.getByText('All'));
    expect(screen.queryByText('Active todo')).toBeTruthy();
    expect(screen.queryByText('Completed todo')).toBeTruthy();
  });

  it('should clear completed todos', () => {
    render(<TodoApp />);
    
    const input = screen.getByPlaceholderText('What needs to be done?');
    
    // Add two todos
    fireEvent.change(input, { target: { value: 'Todo 1' } });
    fireEvent.click(screen.getByText('Add Todo'));
    fireEvent.change(input, { target: { value: 'Todo 2' } });
    fireEvent.click(screen.getByText('Add Todo'));

    // Mark first one as completed
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);

    // Clear completed
    fireEvent.click(screen.getByText('Clear completed'));

    expect(screen.queryByText('Todo 1')).toBeNull();
    expect(screen.queryByText('Todo 2')).toBeTruthy();
  });

  it('should persist todos to localStorage', async () => {
    const { unmount } = render(<TodoApp />);
    
    const input = screen.getByPlaceholderText('What needs to be done?');
    fireEvent.change(input, { target: { value: 'Persistent todo' } });
    fireEvent.click(screen.getByText('Add Todo'));

    // Wait for localStorage to be updated
    await waitFor(() => {
      const stored = localStorageMock.getItem('todos-app-data');
      expect(stored).toBeTruthy();
      if (stored) {
        const todos = JSON.parse(stored);
        expect(todos).toHaveLength(1);
        expect(todos[0].text).toBe('Persistent todo');
      }
    });

    unmount();

    // Render again and check if todo is loaded
    render(<TodoApp />);
    expect(screen.getByText('Persistent todo')).toBeTruthy();
  });
});
