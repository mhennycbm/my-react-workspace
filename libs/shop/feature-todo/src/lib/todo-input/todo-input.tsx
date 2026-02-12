import { useState, FormEvent } from 'react';
import styles from './todo-input.module.css';

interface TodoInputProps {
  onAdd: (text: string) => void;
}

export function TodoInput({ onAdd }: TodoInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedValue = inputValue.trim();
    if (trimmedValue) {
      onAdd(trimmedValue);
      setInputValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles['todo-input-form']}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="What needs to be done?"
        className={styles['todo-input']}
        aria-label="New todo input"
      />
      <button type="submit" className={styles['add-button']}>
        Add Todo
      </button>
    </form>
  );
}

export default TodoInput;
