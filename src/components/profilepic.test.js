import React from 'react';
import ProfilePic from './profilepic';
import { render } from '@testing-library/react'

test('renders default image when there is no url prop', () => {
    const { container } = render(<ProfilePic />);
    expect(container.querySelector('img').src).toContain("/default.png");
});