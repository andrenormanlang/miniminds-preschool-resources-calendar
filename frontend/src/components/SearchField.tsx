import React, { useState } from 'react';
import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  Box,
  FormControl,
  FormLabel,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiSearch, FiX } from 'react-icons/fi';

interface SearchFieldProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'flushed' | 'unstyled';
  isDisabled?: boolean;
  label?: string;
  showClearButton?: boolean;
  width?: string | number;
  maxWidth?: string | number;
}

const SearchField: React.FC<SearchFieldProps> = ({
  placeholder = 'Search...',
  value,
  onChange,
  onSearch,
  onClear,
  size = 'md',
  variant = 'default',
  isDisabled = false,
  label,
  showClearButton = true,
  width = 'full',
  maxWidth,
}) => {
  const [internalValue, setInternalValue] = useState(value || '');
  const searchValue = value !== undefined ? value : internalValue;

  // High contrast colors for accessibility
  const bgColor = useColorModeValue('#FFFFFF', '#2D3748');
  const borderColor = useColorModeValue('#CBD5E0', '#4A5568');
  const focusBorderColor = useColorModeValue('#1890FF', '#63B3ED');
  const textColor = useColorModeValue('#2D3748', '#F7FAFC');
  const placeholderColor = useColorModeValue('#718096', '#A0AEC0');
  const iconColor = useColorModeValue('#4A5568', '#CBD5E0');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch?.(searchValue);
    }
  };

  const handleClear = () => {
    const newValue = '';
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
    onClear?.();
  };

  const inputStyles = {
    bg: bgColor,
    borderColor: borderColor,
    color: textColor,
    _placeholder: {
      color: placeholderColor,
    },
    _hover: {
      borderColor: focusBorderColor,
    },
    _focus: {
      borderColor: focusBorderColor,
      boxShadow: `0 0 0 1px ${focusBorderColor}`,
    },
    _disabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
  };

  const SearchInput = (
    <InputGroup size={size} width={width} maxWidth={maxWidth}>
      <InputLeftElement pointerEvents="none">
        <FiSearch color={iconColor} />
      </InputLeftElement>
      
      <Input
        placeholder={placeholder}
        value={searchValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        isDisabled={isDisabled}
        variant={variant}
        pl="2.5rem"
        pr={showClearButton && searchValue ? "2.5rem" : "1rem"}
        sx={inputStyles}
        aria-label={label || placeholder}
      />
      
      {showClearButton && searchValue && (
        <InputRightElement>
          <IconButton
            aria-label="Clear search"
            icon={<FiX />}
            size="sm"
            variant="ghost"
            onClick={handleClear}
            color={iconColor}
            _hover={{
              bg: useColorModeValue('gray.100', 'gray.600'),
            }}
          />
        </InputRightElement>
      )}
    </InputGroup>
  );

  if (label) {
    return (
      <FormControl isDisabled={isDisabled}>
        <FormLabel 
          fontSize="sm" 
          fontWeight="medium" 
          color={textColor}
          mb={2}
        >
          {label}
        </FormLabel>
        {SearchInput}
      </FormControl>
    );
  }

  return SearchInput;
};

export default SearchField;