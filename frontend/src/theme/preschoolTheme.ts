import { extendTheme } from '@chakra-ui/react';

// Preschool-friendly color palette with good accessibility
const preschoolTheme = extendTheme({
  colors: {
    // Primary colors - warm and friendly
    primary: {
      50: '#E6F7FF',
      100: '#BAE7FF',
      200: '#91D5FF',
      300: '#69C0FF',
      400: '#40A9FF',
      500: '#1890FF', // Main primary - friendly blue
      600: '#096DD9',
      700: '#0050B3',
      800: '#003A8C',
      900: '#002766',
    },
    // Secondary colors - warm coral/orange
    secondary: {
      50: '#FFF2E8',
      100: '#FFD8BF',
      200: '#FFBB96',
      300: '#FF9C6E',
      400: '#FF7D45',
      500: '#FF7F50', // Coral - warm and inviting
      600: '#E55A2B',
      700: '#CC4125',
      800: '#B22D1F',
      900: '#991B1A',
    },
    // Success colors - nature green
    success: {
      50: '#E8F5E8',
      100: '#C3E6C3',
      200: '#9DD89D',
      300: '#76C976',
      400: '#4FBB4F',
      500: '#2E8B57', // Sea green - natural and calming
      600: '#237A47',
      700: '#1A6B37',
      800: '#125C28',
      900: '#0A4D1A',
    },
    // Warning colors - sunny yellow
    warning: {
      50: '#FFFBE6',
      100: '#FFF1B8',
      200: '#FFE58F',
      300: '#FFD666',
      400: '#FFC53D',
      500: '#FFD700', // Gold - cheerful and bright
      600: '#D4AF37',
      700: '#B8860B',
      800: '#9A7209',
      900: '#7D5E07',
    },
    // Error colors - soft red
    error: {
      50: '#FFF0F0',
      100: '#FFCCCC',
      200: '#FFA8A8',
      300: '#FF8585',
      400: '#FF6161',
      500: '#FF4757', // Soft red - not too harsh
      600: '#E63946',
      700: '#CC2936',
      800: '#B31A26',
      900: '#990F17',
    },
    // Purple accent for creativity
    purple: {
      50: '#F3E8FF',
      100: '#E9D5FF',
      200: '#DDD6FE',
      300: '#C4B5FD',
      400: '#A78BFA',
      500: '#8B5CF6', // Creative purple
      600: '#7C3AED',
      700: '#6D28D9',
      800: '#5B21B6',
      900: '#4C1D95',
    },
    // Neutral grays - soft and friendly
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
    // Enhanced background colors with better gradients
    background: {
      // Primary backgrounds
      light: '#E8F4FD', // Soft blue - calming and trustworthy
      cream: '#FFF8F0', // Warm peach cream - cozy and inviting
      mint: '#E8F5E8', // Soft mint - fresh and natural
      
      // Accent backgrounds
      lavender: '#F8F0FF', // Gentle lavender - creative and calm
      coral: '#FCE4EC', // Soft coral - warm and friendly
      aqua: '#E0F7FA', // Light aqua - refreshing and clean
      sunshine: '#FFF9C4', // Soft yellow - cheerful and bright
      sage: '#F3E5F5', // Soft sage - peaceful and balanced
      
      // Gradient combinations
      primary: 'linear-gradient(135deg, #E8F4FD 0%, #E1F5FE 50%, #F0F8FF 100%)',
      warm: 'linear-gradient(135deg, #FFF8F0 0%, #FCE4EC 50%, #FFF3E0 100%)',
      nature: 'linear-gradient(135deg, #E8F5E8 0%, #E0F2F1 50%, #F0FFF4 100%)',
      creative: 'linear-gradient(135deg, #F8F0FF 0%, #F3E5F5 50%, #E8EAF6 100%)',
      sunny: 'linear-gradient(135deg, #FFF9C4 0%, #FFFACD 50%, #FFF8DC 100%)',
      ocean: 'linear-gradient(135deg, #E0F7FA 0%, #E1F5FE 50%, #E8F4FD 100%)',
      
      // Dynamic patterns
      bubbles: 'radial-gradient(circle at 25% 25%, #E8F4FD 0%, transparent 50%), radial-gradient(circle at 75% 75%, #FCE4EC 0%, transparent 50%), linear-gradient(135deg, #FFF8F0 0%, #F8F0FF 100%)',
      clouds: 'radial-gradient(ellipse at top, #E8F4FD 0%, transparent 70%), radial-gradient(ellipse at bottom, #E8F5E8 0%, transparent 70%), linear-gradient(135deg, #FFF8F0 0%, #F0F8FF 100%)',
      rainbow: 'linear-gradient(45deg, #E8F4FD 0%, #FCE4EC 20%, #FFF9C4 40%, #E8F5E8 60%, #F8F0FF 80%, #E0F7FA 100%)',
    }
  },
  fonts: {
    heading: '"Fredoka", "Quicksand", "Comfortaa", cursive',
    body: '"Poppins", "Nunito", sans-serif',
    playful: '"Baloo 2", "Comfortaa", cursive',
    handwritten: '"Caveat", cursive',
    rounded: '"Quicksand", "Comfortaa", sans-serif',
    logo: '"Space Grotesk", "Inter", "Plus Jakarta Sans", sans-serif',
    brand: '"Outfit", "Inter", "Space Grotesk", sans-serif',
    modern: '"Inter", "Plus Jakarta Sans", sans-serif',
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
  },
  space: {
    px: '1px',
    0.5: '0.125rem',
    1: '0.25rem',
    1.5: '0.375rem',
    2: '0.5rem',
    2.5: '0.625rem',
    3: '0.75rem',
    3.5: '0.875rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
    12: '3rem',
    14: '3.5rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    28: '7rem',
    32: '8rem',
    36: '9rem',
    40: '10rem',
    44: '11rem',
    48: '12rem',
    52: '13rem',
    56: '14rem',
    60: '15rem',
    64: '16rem',
    72: '18rem',
    80: '20rem',
    96: '24rem',
  },
  radii: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
  shadows: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    base: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    md: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    outline: '0 0 0 3px rgba(66, 153, 225, 0.6)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'xl',
        _focus: {
          boxShadow: 'outline',
        },
      },
      variants: {
        solid: {
          bg: 'primary.500',
          color: 'white',
          _hover: {
            bg: 'primary.600',
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
          },
          _active: {
            bg: 'primary.700',
            transform: 'translateY(0)',
          },
        },
        playful: {
          bg: 'secondary.500',
          color: 'white',
          _hover: {
            bg: 'secondary.600',
            transform: 'scale(1.05)',
          },
          _active: {
            bg: 'secondary.700',
            transform: 'scale(0.95)',
          },
        },
        success: {
          bg: 'success.500',
          color: 'white',
          _hover: {
            bg: 'success.600',
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
          },
        },
      },
      sizes: {
        sm: {
          fontSize: 'sm',
          px: 4,
          py: 2,
        },
        md: {
          fontSize: 'md',
          px: 6,
          py: 3,
        },
        lg: {
          fontSize: 'lg',
          px: 8,
          py: 4,
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: '2xl',
          boxShadow: 'md',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          _hover: {
            transform: 'translateY(-4px)',
            boxShadow: 'xl',
          },
        },
      },
      variants: {
        playful: {
          container: {
            bg: 'background.cream',
            border: '2px solid',
            borderColor: 'primary.200',
            _hover: {
              borderColor: 'primary.400',
              transform: 'translateY(-4px) rotate(1deg)',
            },
          },
        },
        resource: {
          container: {
            bg: 'white',
            borderRadius: '3xl',
            overflow: 'hidden',
            position: 'relative',
            _before: {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              bg: 'linear-gradient(90deg, primary.400, secondary.400, success.400)',
            },
          },
        },
      },
    },
    Heading: {
      baseStyle: {
        fontFamily: 'heading',
        fontWeight: '600',
        lineHeight: 'shorter',
        letterSpacing: '-0.025em',
      },
      variants: {
        playful: {
          fontFamily: 'playful',
          color: 'primary.600',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
          fontWeight: '700',
        },
        friendly: {
          fontFamily: 'rounded',
          color: 'secondary.600',
          fontSize: '2xl',
          fontWeight: '600',
        },
        handwritten: {
          fontFamily: 'handwritten',
          color: 'purple.600',
          fontSize: '3xl',
          fontWeight: '600',
          transform: 'rotate(-1deg)',
        },
        educational: {
          fontFamily: 'heading',
          color: 'success.600',
          fontSize: 'xl',
          fontWeight: '500',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        },
        hero: {
          fontFamily: 'playful',
          fontSize: { base: '3xl', md: '4xl', lg: '5xl' },
          fontWeight: '800',
          bgGradient: 'linear(to-r, primary.500, secondary.500, purple.500)',
          bgClip: 'text',
          textShadow: '4px 4px 8px rgba(0,0,0,0.2)',
        },
      },
      sizes: {
        xs: {
          fontSize: 'sm',
          lineHeight: '1.2',
        },
        sm: {
          fontSize: 'md',
          lineHeight: '1.3',
        },
        md: {
          fontSize: 'lg',
          lineHeight: '1.4',
        },
        lg: {
          fontSize: 'xl',
          lineHeight: '1.4',
        },
        xl: {
          fontSize: '2xl',
          lineHeight: '1.3',
        },
        '2xl': {
          fontSize: '3xl',
          lineHeight: '1.2',
        },
      },
    },
    Text: {
      baseStyle: {
        fontFamily: 'body',
        lineHeight: 'tall',
        letterSpacing: '0.025em',
      },
      variants: {
        description: {
          color: 'gray.600',
          fontSize: 'md',
          lineHeight: 'tall',
          fontWeight: '400',
        },
        label: {
          color: 'gray.700',
          fontSize: 'sm',
          fontWeight: '500',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        },
        playful: {
          fontFamily: 'playful',
          color: 'primary.600',
          fontSize: 'lg',
          fontWeight: '600',
        },
        handwritten: {
          fontFamily: 'handwritten',
          color: 'purple.600',
          fontSize: 'xl',
          fontWeight: '500',
          transform: 'rotate(-0.5deg)',
        },
        rounded: {
          fontFamily: 'rounded',
          color: 'secondary.600',
          fontSize: 'md',
          fontWeight: '500',
        },
        caption: {
          fontSize: 'xs',
          color: 'gray.500',
          fontWeight: '400',
          lineHeight: 'short',
        },
        emphasis: {
          fontSize: 'lg',
          fontWeight: '600',
          color: 'gray.800',
          lineHeight: 'base',
        },
        quote: {
          fontFamily: 'handwritten',
          fontSize: 'xl',
          fontStyle: 'italic',
          color: 'purple.600',
          fontWeight: '500',
          _before: {
            content: '"',
            fontSize: '2xl',
            color: 'primary.400',
          },
          _after: {
            content: '"',
            fontSize: '2xl',
            color: 'primary.400',
          },
        },
      },
    },
    Tag: {
      baseStyle: {
        container: {
          borderRadius: 'full',
          fontWeight: 'medium',
          fontSize: 'xs',
        },
      },
      variants: {
        playful: {
          container: {
            bg: 'purple.100',
            color: 'purple.700',
            border: '1px solid',
            borderColor: 'purple.200',
          },
        },
        age: {
          container: {
            bg: 'warning.100',
            color: 'warning.800',
            border: '1px solid',
            borderColor: 'warning.200',
          },
        },
        subject: {
          container: {
            bg: 'success.100',
            color: 'success.800',
            border: '1px solid',
            borderColor: 'success.200',
          },
        },
      },
    },
  },
  styles: {
    global: {
      'html': {
        height: '100%',
        background: 'linear-gradient(135deg, #E8F4FD 0%, #E1F5FE 25%, #FFF8F0 50%, #FCE4EC 75%, #F0F8FF 100%)',
        backgroundAttachment: 'fixed',
        backgroundSize: '400% 400%',
        animation: 'gentle-gradient 20s ease infinite',
      },
      'body': {
        color: 'gray.800',
        fontFamily: 'body',
        lineHeight: 'base',
        minHeight: '100vh',
        height: '100%',
        margin: 0,
        padding: 0,
        background: 'transparent',
      },
      '*': {
        borderColor: 'gray.200',
      },
      '#root': {
        height: '100%',
        minHeight: '100vh',
        background: 'transparent',
      },
      // Enhanced scrollbar styling
      '::-webkit-scrollbar': {
        width: '8px',
      },
      '::-webkit-scrollbar-track': {
        background: 'rgba(232, 244, 253, 0.3)',
        borderRadius: '4px',
      },
      '::-webkit-scrollbar-thumb': {
        background: 'rgba(24, 144, 255, 0.6)',
        borderRadius: '4px',
        '&:hover': {
          background: 'rgba(24, 144, 255, 0.8)',
        },
      },
      // Keyframe animation for the gradient
      '@keyframes gentle-gradient': {
        '0%': { backgroundPosition: '0% 50%' },
        '25%': { backgroundPosition: '100% 50%' },
        '50%': { backgroundPosition: '100% 100%' },
        '75%': { backgroundPosition: '0% 100%' },
        '100%': { backgroundPosition: '0% 50%' },
      },
    },
  },
});

export default preschoolTheme;