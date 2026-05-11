import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../src/pages/Login';

describe('Login Component', () => {
  it('renders login form properly', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    expect(screen.getByText('Welcome Back to AdmitBridge')).toBeTruthy();
  });
});
