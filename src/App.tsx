import React from 'react';
import SearchableDropdown from './components/SearchableDropdown';
import { DropdownItem } from './types';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const handleSelect = (item: DropdownItem) => {
    console.log("Selected", item);
  }

  return (
    <>
      <SearchableDropdown 
        apiUrl="https://restcountries.com/v3.1/name/" 
        onSelect={handleSelect}
      />
    </>
  );
}

export default App;
