import { Todo } from '../types';
import styles from './todo-item.module.css';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <li className={`${styles['todo-item']} ${todo.completed ? styles['completed'] : ''}`}>
      <label className={styles['todo-label']}>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className={styles['todo-checkbox']}
          aria-label={`Mark "${todo.text}" as ${todo.completed ? 'active' : 'completed'}`}
        />
        <span className={styles['todo-text']}>{todo.text}</span>
      </label>
      <button
        onClick={() => onDelete(todo.id)}
        className={styles['delete-button']}
        aria-label={`Delete "${todo.text}"`}
      >
        ✕
      </button>
    </li>
  );
}

export default TodoItem;
