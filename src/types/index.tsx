export interface DropdownItemName {
  common: string;
  official: string;
  nativeName?: Record<string, { official: string; common: string }>;
  [key: string]: any;
}

export interface DropdownItem {
  name: DropdownItemName;
  flag: string;
}

export interface SearchableDropdownProps {
  apiUrl: string;
  onSelect: (item: DropdownItem) => void;
  debounceDelay?: number;
}
