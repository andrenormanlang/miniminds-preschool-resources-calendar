import React from 'react';
import { Box, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { EducationalIcons } from './icons/EducationalIcons';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'stacked' | 'minimal' | 'colorful' | 'gradient';
  showIcon?: boolean;
  showTagline?: boolean;
  color?: string;
  iconColor?: string;
  to?: string;
}

const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'default',
  showIcon = true,
  showTagline = false,
  color = 'white',
  iconColor = 'yellow.300',
  to = '/',
}) => {
  const getSizeProps = () => {
    switch (size) {
      case 'sm':
        return {
          headingSize: 'md',
          iconSize: '6',
          taglineSize: 'xs',
          spacing: 2,
        };
      case 'lg':
        return {
          headingSize: 'xl',
          iconSize: '10',
          taglineSize: 'sm',
          spacing: 3,
        };
      case 'xl':
        return {
          headingSize: '2xl',
          iconSize: '12',
          taglineSize: 'md',
          spacing: 4,
        };
      default: // md
        return {
          headingSize: 'lg',
          iconSize: '8',
          taglineSize: 'xs',
          spacing: 2,
        };
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'gradient':
        return {
          bgGradient: 'linear(to-r, primary.400, secondary.400, purple.400)',
          bgClip: 'text',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          fontWeight: '800',
        };
      case 'colorful':
        return {
          color: 'primary.500',
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

  const LogoContent = () => {
    if (variant === 'stacked') {
      return (
        <VStack spacing={1} align="center">
          {showIcon && (
            <EducationalIcons.Learning 
              variant="playful" 
              boxSize={iconSize} 
              color={iconColor}
              animation="pulse"
            />
          )}
          <VStack spacing={0} align="center">
            <Heading
              size={headingSize}
              fontFamily="logo"
              letterSpacing="-0.02em"
              lineHeight="0.9"
              {...variantStyles}
            >
              Mini Minds
            </Heading>
            {showTagline && (
              <Text
                fontSize={taglineSize}
                fontFamily="modern"
                fontWeight="500"
                color="whiteAlpha.800"
                letterSpacing="0.05em"
                textTransform="uppercase"
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
        {showIcon && (
          <EducationalIcons.Learning 
            variant="playful" 
            boxSize={iconSize} 
            color={iconColor}
            animation="bounce"
          />
        )}
        <VStack spacing={0} align="start">
          <Heading
            size={headingSize}
            fontFamily="logo"
            letterSpacing="-0.02em"
            lineHeight="1"
            {...variantStyles}
          >
            MiniMinds
          </Heading>
          {showTagline && (
            <Text
              fontSize={taglineSize}
              fontFamily="modern"
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

  if (to) {
    return (
      <Box
        as={RouterLink}
        to={to}
        _hover={{
          transform: 'scale(1.02)',
          transition: 'transform 0.2s ease',
        }}
        cursor="pointer"
      >
        <LogoContent />
      </Box>
    );
  }

  return <LogoContent />;
};

export default Logo;