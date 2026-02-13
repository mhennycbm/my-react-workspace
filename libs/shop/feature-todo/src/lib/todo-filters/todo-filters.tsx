import { FilterType } from '../types';
import styles from './todo-filters.module.css';

interface TodoFiltersProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  activeCount: number;
  onClearCompleted?: () => void;
  hasCompleted?: boolean;
}

export function TodoFilters({ 
  currentFilter, 
  onFilterChange, 
  activeCount,
  onClearCompleted,
  hasCompleted = false
}: TodoFiltersProps) {
  const filters: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' },
  ];

  return (
    <div className={styles['filters-container']}>
      <div className={styles['counter']}>
        <span className={styles['count']}>{activeCount}</span>
        <span className={styles['label']}>{activeCount === 1 ? 'item' : 'items'} left</span>
      </div>
      
      <div className={styles['filter-buttons']}>
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`${styles['filter-button']} ${
              currentFilter === filter.value ? styles['active'] : ''
            }`}
            aria-pressed={currentFilter === filter.value}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {hasCompleted && onClearCompleted && (
        <button
          onClick={onClearCompleted}
          className={styles['clear-completed']}
          aria-label="Clear completed todos"
        >
          Clear completed
        </button>
      )}
    </div>
  );
}

export default TodoFilters;
