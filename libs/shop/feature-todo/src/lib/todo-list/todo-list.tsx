import { Todo } from '../types';
import { TodoItem } from '../todo-item/todo-item';
import styles from './todo-list.module.css';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className={styles['empty-state']}>
        <p className={styles['empty-message']}>No todos to display</p>
        <p className={styles['empty-hint']}>Add a new todo to get started!</p>
      </div>
    );
  }

  return (
    <ul className={styles['todo-list']}>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

export default TodoList;
