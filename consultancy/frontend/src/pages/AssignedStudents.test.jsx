import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AssignedStudents from './AssignedStudents';

const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    clear: () => { store = {}; }
  };
})();
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

global.fetch = vi.fn();

vi.stubGlobal('import', { meta: { env: { VITE_API_URL: 'http://localhost:5000/api' } } });

describe('AssignedStudents Component', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_API_URL', 'http://localhost:5000/api');
    vi.clearAllMocks();
    window.localStorage.clear();
    window.localStorage.setItem('token', 'fake-token');
    window.localStorage.setItem('user', JSON.stringify({ email: 'testconsultancy@example.com' }));
    
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ([
        {
          _id: "app_123",
          studentName: "Test Student",
          status: "Applied",
          targetCourse: "Computer Science",
          targetCountry: "USA",
          examScore: "320",
          email: "test@student.com",
          cgpa: "3.8"
        }
      ])
    });
  });

  it('renders students and opens modal on View Details', async () => {
    render(<AssignedStudents />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Student')).toBeInTheDocument();
    });
    
    const viewBtns = screen.getAllByText(/View Details/i);
    fireEvent.click(viewBtns[0]);
    
    expect(screen.getByText('Application Details')).toBeInTheDocument();
    expect(screen.getByText(/Accept Application/i)).toBeInTheDocument();
  });

  it('handles Accept Application workflow', async () => {
    render(<AssignedStudents />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Student')).toBeInTheDocument();
    });
    
    const viewBtns = screen.getAllByText(/View Details/i);
    fireEvent.click(viewBtns[0]);
    
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });
    
    const acceptBtn = screen.getByText(/Accept Application/i);
    fireEvent.click(acceptBtn);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
      const putCall = global.fetch.mock.calls[1];
      expect(putCall[0]).toContain('/students/applications/app_123/status');
      expect(putCall[1].method).toBe('PUT');
      expect(JSON.parse(putCall[1].body).status).toBe('Accepted');
    });
    
    // Change filter to All to see the Accepted student
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: 'All' } });
    
    await waitFor(() => {
      expect(screen.queryByText('Application Details')).not.toBeInTheDocument();
      // The badge should now say Accepted
      const statusBadge = screen.getByText('Accepted');
      expect(statusBadge).toBeInTheDocument();
    });
  });

  it('handles Send Request to Student workflow (Pending state)', async () => {
    render(<AssignedStudents />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Student')).toBeInTheDocument();
    });
    
    const viewBtns = screen.getAllByText(/View Details/i);
    fireEvent.click(viewBtns[0]);
    
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });
    
    const textarea = screen.getByPlaceholderText(/e.g., Please upload your 12th-grade mark sheet/i);
    fireEvent.change(textarea, { target: { value: 'Please send new transcripts.' } });
    
    const requestBtn = screen.getByText(/Send Request to Student/i);
    fireEvent.click(requestBtn);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
      const putCall = global.fetch.mock.calls[1];
      expect(putCall[0]).toContain('/students/applications/app_123/status');
      expect(putCall[1].method).toBe('PUT');
      expect(JSON.parse(putCall[1].body).status).toBe('Pending');
    }, { timeout: 2000 });
  });
});
