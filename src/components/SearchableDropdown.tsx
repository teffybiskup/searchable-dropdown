import React, { useCallback, useEffect, useState } from "react";
import { SearchableDropdownProps, DropdownItem } from "../types";
import Container from 'react-bootstrap/Container';

const SearchableDropdown = ({ apiUrl, onSelect, debounceDelay = 300 }: SearchableDropdownProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DropdownItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (query.trim() === '') {
        setResults([]);
        setError(null);
        return;
      }

      const fetchData = async () => {
        setLoading(true);

        try {
          const response = await fetch(`${apiUrl}${encodeURIComponent(query)}?fields=name,flag`);
          if (!response.ok) throw new Error("Api Error");
          const data = await response.json();
          setResults(data || []);
          setError(null);
        } catch (err) {
          console.error(err);
          setError('No results found.');
          setResults([]);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, debounceDelay);

    return () => clearTimeout(handler);
  }, [apiUrl, debounceDelay, query]);

  const handleSelect = ((item: DropdownItem) => {
    setQuery(item.name?.common);
    setIsOpen(false);
    onSelect?.(item);
  })

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setQuery(e.target.value);
    setIsOpen(true);
  }, []);

  return (
    <Container className="text-center">
      <h1>Search</h1>
      <input
        className="w-25"
        id="search"
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        placeholder="Search"
      />
      {isOpen && (
        <div className="border w-25 mx-auto text-center">
          {loading && <div>Loading...</div>}
          {error && <div>{error}</div>}
          {(!loading 
            && !error 
            && query.trim() !== '' 
            && results.length === 0) && (
            <div>No results found.</div>
          )}
          {(!loading 
            && !error 
            && results.map((item, idx) =>
              <div key={idx} onClick={() => handleSelect(item)}>
                {item.flag} {item.name?.common}
              </div>
            )
          )}
        </div>
      )}
    </Container>
  );
};

export default SearchableDropdown;
