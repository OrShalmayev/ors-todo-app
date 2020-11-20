import React, { lazy, Suspense } from 'react';

const LazyTodos = lazy(() => import('./Todos'));

const Todos = props => (
  <Suspense fallback={null}>
    <LazyTodos {...props} />
  </Suspense>
);

export default Todos;
