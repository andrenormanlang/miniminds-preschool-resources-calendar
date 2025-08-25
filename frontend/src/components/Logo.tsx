import React from 'react';
import { Box, Heading, HStack, Text, VStack, Icon } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaBrain } from 'react-icons/fa';

// Custom brain icon for MiniMinds
const BrainIcon: React.FC<{ size?: string; color?: string }> = ({ 
  size = '32px', 
  color = '#FFB800' 
}) => (
  <Box
    as="svg"
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    transition="all 0.3s ease"
    _hover={{
      transform: 'scale(1.1) rotate(5deg)',
    }}
  >
    {/* Brain shape - simplified and more reliable */}
    <path
      d="M20 40c0-10 8-18 18-18s18 8 18 18c3-8 10-14 18-14s16 6 16 14c0 4-2 8-4 10 2 3 4 7 4 11 0 8-6 15-14 17-2 6-8 12-16 12s-14-6-16-12c-8-2-14-9-14-17 0-4 2-8 4-11-2-2-4-6-4-10z"
      fill={color}
      stroke="rgba(74, 85, 104, 0.8)"
      strokeWidth="1.5"
    />
    
    {/* Brain details */}
    <path
      d="M35 50c4-2 8-2 12 0M45 55c3-1 6-1 9 0M38 60c3-1 6-1 9 0"
      stroke="rgba(74, 85, 104, 0.6)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    
    {/* Simple sparkles */}
    <circle cx="25" cy="30" r="2" fill="rgba(255, 224, 102, 0.8)" />
    <circle cx="75" cy="35" r="1.5" fill="rgba(255, 224, 102, 0.6)" />
    <circle cx="70" cy="65" r="2" fill="rgba(255, 224, 102, 0.8)" />
  </Box>
);

// Simple reliable icon using emoji
const SimpleIcon: React.FC<{ size?: string; color?: string }> = ({ 
  size = '32px', 
}) => (
  <Box
    fontSize={size}
    transition="all 0.3s ease"
    _hover={{
      transform: 'scale(1.1) rotate(5deg)',
    }}
    role="img"
    aria-label="Brain icon"
  >
    🧠
  </Box>
);

// Fallback icon using React Icons
const FallbackIcon: React.FC<{ size?: string; color?: string }> = ({ 
  size = '32px', 
  color = '#FFB800' 
}) => (
  <Icon
    as={FaBrain}
    boxSize={size}
    color={color}
    transition="all 0.3s ease"
    _hover={{
      transform: 'scale(1.1) rotate(5deg)',
    }}
  />
);

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'stacked' | 'minimal' | 'colorful' | 'gradient';
  showIcon?: boolean;
  showTagline?: boolean;
  color?: string;
  iconColor?: string;
  to?: string;
  isInteractive?: boolean;
  useFallbackIcon?: boolean;
}

const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'default',
  showIcon = true,
  showTagline = false,
  color = 'white',
  iconColor = '#FFB800',
  to = '/',
  isInteractive = true,
  useFallbackIcon = false,
}) => {
  const getSizeProps = () => {
    switch (size) {
      case 'sm':
        return {
          headingSize: 'md',
          iconSize: '24px',
          taglineSize: 'xs',
          spacing: 2,
        };
      case 'lg':
        return {
          headingSize: 'xl',
          iconSize: '40px',
          taglineSize: 'sm',
          spacing: 3,
        };
      case 'xl':
        return {
          headingSize: '2xl',
          iconSize: '48px',
          taglineSize: 'md',
          spacing: 4,
        };
      default: // md
        return {
          headingSize: 'lg',
          iconSize: '32px',
          taglineSize: 'xs',
          spacing: 2,
        };
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'gradient':
        return {
          bgGradient: 'linear(to-r, #FFB800, #FF8C00, #FF6B6B)',
          bgClip: 'text',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          fontWeight: '800',
        };
      case 'colorful':
        return {
          color: '#FFB800',
          textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
          fontWeight: '700',
        };
      case 'minimal':
        return {
          color: color,
          fontWeight: '600',
          textShadow: 'none',
        };
      default:
        return {
          color: color,
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          fontWeight: '700',
        };
    }
  };

  const { headingSize, iconSize, taglineSize, spacing } = getSizeProps();
  const variantStyles = getVariantStyles();

  const renderIcon = () => {
    let IconComponent;
    
    if (useFallbackIcon) {
      IconComponent = FallbackIcon;
    } else {
      // Try simple emoji icon first as most reliable
      IconComponent = SimpleIcon;
    }
    
    return (
      <Box
        animation="bounce 2s ease-in-out infinite"
        css={{
          '@keyframes bounce': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-4px)' },
          },
        }}
      >
        <IconComponent size={iconSize} color={iconColor} />
      </Box>
    );
  };

  const LogoContent = () => {
    if (variant === 'stacked') {
      return (
        <VStack spacing={1} align="center">
          {showIcon && renderIcon()}
          <VStack spacing={0} align="center">
            <Heading
              size={headingSize}
              fontFamily="'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif"
              letterSpacing="-0.02em"
              lineHeight="0.9"
              {...variantStyles}
            >
              MiniMinds
            </Heading>
            {showTagline && (
              <Text
                fontSize={taglineSize}
                fontFamily="'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
                fontWeight="500"
                color="whiteAlpha.800"
                letterSpacing="0.05em"
                textTransform="uppercase"
                mt={1}
              >
                Learning Platform
              </Text>
            )}
          </VStack>
        </VStack>
      );
    }

    return (
      <HStack spacing={spacing} align="center">
        {showIcon && renderIcon()}
        <VStack spacing={0} align="start">
          <Heading
            size={headingSize}
            fontFamily="'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif"
            letterSpacing="-0.02em"
            lineHeight="1"
            {...variantStyles}
          >
            MiniMinds
          </Heading>
          {showTagline && (
            <Text
              fontSize={taglineSize}
              fontFamily="'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
              fontWeight="500"
              color={variant === 'minimal' ? 'gray.600' : 'whiteAlpha.800'}
              letterSpacing="0.05em"
              textTransform="uppercase"
              lineHeight="1"
            >
              Learning Platform
            </Text>
          )}
        </VStack>
      </HStack>
    );
  };

  if (to && isInteractive) {
    return (
      <Box
        as={RouterLink}
        to={to}
        _hover={{
          transform: 'scale(1.05)',
          transition: 'all 0.3s ease',
        }}
        _active={{
          transform: 'scale(0.98)',
        }}
        cursor="pointer"
        transition="all 0.3s ease"
        role="button"
        aria-label="Navigate to home page"
      >
        <LogoContent />
      </Box>
    );
  }

  return <LogoContent />;
};

export default Logo;

// Named exports for convenience
export { BrainIcon };

// Preset configurations
export const LogoPresets = {
  header: {
    size: 'md' as const,
    variant: 'default' as const,
    showIcon: true,
    showTagline: false,
    color: 'white',
    iconColor: '#FFB800',
  },
  hero: {
    size: 'xl' as const,
    variant: 'gradient' as const,
    showIcon: true,
    showTagline: true,
    color: 'white',
    iconColor: '#FFB800',
  },
  footer: {
    size: 'sm' as const,
    variant: 'minimal' as const,
    showIcon: true,
    showTagline: false,
    color: 'gray.600',
    iconColor: '#FFB800',
  },
  mobile: {
    size: 'sm' as const,
    variant: 'default' as const,
    showIcon: true,
    showTagline: false,
    color: 'white',
    iconColor: '#FFB800',
  },
};