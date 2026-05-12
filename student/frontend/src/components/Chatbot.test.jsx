import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Chatbot from './Chatbot';

describe('Chatbot Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders chatbot FAB initially', () => {
    render(<Chatbot />);
    const fab = screen.getByTitle('Chat with AdmitBridge AI');
    expect(fab).toBeInTheDocument();
  });

  it('starts SpeechRecognition when mic is clicked', () => {
    const mockStart = vi.fn();
    const mockStop = vi.fn();
    
    // Mock the Web Speech API correctly as a constructor
    window.SpeechRecognition = vi.fn(function() {
      this.start = mockStart;
      this.stop = mockStop;
      this.onstart = null;
      this.onresult = null;
      this.onerror = null;
      this.onend = null;
    });
    window.webkitSpeechRecognition = window.SpeechRecognition;

    render(<Chatbot />);
    
    // Open chat window first
    fireEvent.click(screen.getByTitle('Chat with AdmitBridge AI'));
    
    // Find and click the mic button
    const micBtn = screen.getByTitle('Click to speak');
    fireEvent.click(micBtn);
    
    expect(window.SpeechRecognition).toHaveBeenCalled();
    expect(mockStart).toHaveBeenCalled();
  });
});
