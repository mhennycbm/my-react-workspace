import { useState, useEffect } from 'react';
import { Todo, FilterType } from './types';
import { TodoInput } from './todo-input/todo-input';
import { TodoList } from './todo-list/todo-list';
import { TodoFilters } from './todo-filters/todo-filters';
import styles from './feature-todo.module.css';

const LOCAL_STORAGE_KEY = 'todos-app-data';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function loadTodosFromStorage(): Todo[] {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    }
  } catch (error) {
    console.error('Error loading todos from localStorage:', error);
  }
  return [];
}

function saveTodosToStorage(todos: Todo[]): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
    }
  } catch (error) {
    console.error('Error saving todos to localStorage:', error);
  }
}

export function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>(() => loadTodosFromStorage());
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    saveTodosToStorage(todos);
  }, [todos]);

  const handleAddTodo = (text: string) => {
    const newTodo: Todo = {
      id: generateId(),
      text,
      completed: false,
      createdAt: Date.now(),
    };
    setTodos((prev) => [...prev, newTodo]);
  };

  const handleToggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const handleClearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  const getFilteredTodos = (): Todo[] => {
    switch (filter) {
      case 'active':
        return todos.filter((todo) => !todo.completed);
      case 'completed':
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  };

  const filteredTodos = getFilteredTodos();
  const activeCount = todos.filter((todo) => !todo.completed).length;
  const hasCompleted = todos.some((todo) => todo.completed);

  return (
    <div className={styles['container']}> 
      <div className={styles['todo-app']}> 
        <header className={styles['header']}> 
          <h1 className={styles['title']}>Todo App</h1> 
          <p className={styles['subtitle']}>Organize your tasks efficiently</p> 
        </header>

        <div className={styles['content']}> 
          <TodoInput onAdd={handleAddTodo} /> 
          <TodoList
            todos={filteredTodos}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
          /> 
          <TodoFilters
            currentFilter={filter}
            onFilterChange={setFilter}
            activeCount={activeCount}
            onClearCompleted={handleClearCompleted}
            hasCompleted={hasCompleted}
          /> 
        </div>
      </div>
    </div>
  );
}

export default TodoApp;