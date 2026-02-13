import { lazy, Suspense } from 'react';
import { Route, Routes, Navigate, Link } from 'react-router-dom';
import { LoadingSpinner } from '@org/shop-shared-ui';
import './app.css';

// Lazy load feature components
const ProductList = lazy(() => import('@org/shop-feature-products').then(m => ({ default: m.ProductList })));
const ProductDetail = lazy(() => import('@org/shop-feature-product-detail').then(m => ({ default: m.ProductDetail })));
const TodoApp = lazy(() => import('@org/shop-feature-todo').then(m => ({ default: m.TodoApp })));

export function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">Official Shop Demo</h1>
          <nav className="app-nav">
            <Link to="/products" className="nav-link">Products</Link>
            <Link to="/todos" className="nav-link">Todos</Link>
          </nav>
        </div>
      </header>

      <main className="app-main">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Navigate to="/products" replace />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/todos" element={<TodoApp />} />
            <Route path="*" element={<Navigate to="/products" replace />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;
