import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchableDropdown from '../components/SearchableDropdown';

const mockResults = [
  { name: { common: 'Germany' }, flag: '🇩🇪' },
  { name: { common: 'Greece' }, flag: '🇬🇷' },
];

describe('SearchableDropdown', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows results after typing', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResults,
    });

    render(<SearchableDropdown apiUrl="/api/" onSelect={jest.fn()} />);

    fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: 'ge' } });

    await screen.findByText('🇩🇪 Germany');
    expect(screen.getByText('🇩🇪 Germany')).toBeInTheDocument();
    expect(screen.getByText('🇬🇷 Greece')).toBeInTheDocument();
  });

  it('shows error on API failure', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false });

    render(<SearchableDropdown apiUrl="/api/" onSelect={jest.fn()} />);

    fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: 'fail' } });
    expect(screen.getByText('No results found.')).toBeInTheDocument();
  });

  it('calls onSelect when item is clicked', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResults,
    });
    const onSelect = jest.fn();

    render(<SearchableDropdown apiUrl="/api/" onSelect={onSelect} />);

    fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: 'ge' } });

    await screen.findByText('🇩🇪 Germany');
    fireEvent.click(screen.getByText('🇩🇪 Germany'));

    expect(onSelect).toHaveBeenCalledWith(mockResults[0]);
  });

  it('shows no results found when API returns empty', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    render(<SearchableDropdown apiUrl="/api/" onSelect={jest.fn()} />);

    fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: 'xyz' } });
    expect(screen.getByText('No results found.')).toBeInTheDocument();
  });
});
