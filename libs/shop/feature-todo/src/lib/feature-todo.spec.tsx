import { render } from '@testing-library/react';

import OrgShopFeatureTodo from './feature-todo';

describe('OrgShopFeatureTodo', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<OrgShopFeatureTodo />);
    expect(baseElement).toBeTruthy();
  });
});
