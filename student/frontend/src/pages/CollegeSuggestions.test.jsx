import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CollegeSuggestions from './CollegeSuggestions';

// Mock the global fetch which is used by authFetch
global.fetch = vi.fn();

describe('CollegeSuggestions Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders college cards successfully after fetching data', async () => {
    const mockData = [
      {
        university_name: 'Test University',
        country: 'US',
        fee: 25000,
        tier: 1,
        university_link: 'http://test.edu'
      }
    ];
    
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });

    render(<CollegeSuggestions />);

    // Wait for the mock data to be rendered into cards
    await waitFor(() => {
      expect(screen.getByText('Test University')).toBeInTheDocument();
    });
    
    const usaElements = screen.getAllByText('USA');
    expect(usaElements.length).toBeGreaterThan(0);
    expect(screen.getByText('Tier 1')).toBeInTheDocument();
    expect(screen.getByText('$25,000/year')).toBeInTheDocument();
  });
});
