import React from 'react';
import { Icon, IconProps } from '@chakra-ui/react';
import {
  FiBook,
  FiEdit,
  FiStar,
  FiHeart,
  FiAward,
  FiSun,
  FiBox,
  FiUsers,
  FiSmile,
  FiTarget,
} from 'react-icons/fi';

// Enhanced icon wrapper component with preschool-friendly styling
interface EducationalIconProps extends IconProps {
  variant?: 'default' | 'playful' | 'outlined' | 'filled' | 'rounded';
  animation?: 'none' | 'bounce' | 'wiggle' | 'pulse' | 'spin';
}

const EducationalIconWrapper: React.FC<EducationalIconProps & { children: React.ReactNode }> = ({
  children,
  variant = 'default',
  animation = 'none',
  color = 'primary.500',
  boxSize = '6',
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'playful':
        return {
          bg: 'primary.100',
          borderRadius: 'full',
          p: 2,
          border: '2px solid',
          borderColor: 'primary.300',
          _hover: {
            bg: 'primary.200',
            borderColor: 'primary.400',
            transform: 'scale(1.1)',
          },
        };
      case 'outlined':
        return {
          border: '2px solid',
          borderColor: 'currentColor',
          borderRadius: 'md',
          p: 1,
          _hover: {
            bg: 'primary.50',
          },
        };
      case 'filled':
        return {
          bg: 'primary.500',
          color: 'white',
          borderRadius: 'md',
          p: 2,
          _hover: {
            bg: 'primary.600',
          },
        };
      case 'rounded':
        return {
          bg: 'secondary.100',
          borderRadius: 'full',
          p: 2,
          _hover: {
            bg: 'secondary.200',
          },
        };
      default:
        return {};
    }
  };

  const getAnimationStyles = () => {
    switch (animation) {
      case 'bounce':
        return {
          animation: 'bounce-gentle 2s infinite',
        };
      case 'wiggle':
        return {
          _hover: {
            animation: 'wiggle 0.5s ease-in-out',
          },
        };
      case 'pulse':
        return {
          animation: 'pulse 2s infinite',
        };
      case 'spin':
        return {
          _hover: {
            animation: 'spin 1s linear infinite',
          },
        };
      default:
        return {};
    }
  };

  return (
    <Icon
      color={color}
      boxSize={boxSize}
      transition="all 0.2s ease"
      cursor="pointer"
      {...getVariantStyles()}
      {...getAnimationStyles()}
      {...props}
    >
      {children}
    </Icon>
  );
};

// Individual icon components with educational context using basic React Icons
export const ReadingIcon: React.FC<EducationalIconProps> = (props) => (
  <EducationalIconWrapper {...props}>
    <FiBook />
  </EducationalIconWrapper>
);

export const WritingIcon: React.FC<EducationalIconProps> = (props) => (
  <EducationalIconWrapper {...props}>
    <FiEdit />
  </EducationalIconWrapper>
);

export const AchievementIcon: React.FC<EducationalIconProps> = (props) => (
  <EducationalIconWrapper {...props}>
    <FiStar />
  </EducationalIconWrapper>
);

export const LoveIcon: React.FC<EducationalIconProps> = (props) => (
  <EducationalIconWrapper {...props}>
    <FiHeart />
  </EducationalIconWrapper>
);

export const ProblemSolvingIcon: React.FC<EducationalIconProps> = (props) => (
  <EducationalIconWrapper {...props}>
    <FiTarget />
  </EducationalIconWrapper>
);

export const EducationIcon: React.FC<EducationalIconProps> = (props) => (
  <EducationalIconWrapper {...props}>
    <FiAward />
  </EducationalIconWrapper>
);

export const CreativityIcon: React.FC<EducationalIconProps> = (props) => (
  <EducationalIconWrapper {...props}>
    <FiSun />
  </EducationalIconWrapper>
);

export const BuildingIcon: React.FC<EducationalIconProps> = (props) => (
  <EducationalIconWrapper {...props}>
    <FiBox />
  </EducationalIconWrapper>
);

export const SuccessIcon: React.FC<EducationalIconProps> = (props) => (
  <EducationalIconWrapper {...props}>
    <FiAward />
  </EducationalIconWrapper>
);

export const StorytellingIcon: React.FC<EducationalIconProps> = (props) => (
  <EducationalIconWrapper {...props}>
    <FiBook />
  </EducationalIconWrapper>
);

export const LearningIcon: React.FC<EducationalIconProps> = (props) => (
  <EducationalIconWrapper {...props}>
    <FiBook />
  </EducationalIconWrapper>
);

export const EditingIcon: React.FC<EducationalIconProps> = (props) => (
  <EducationalIconWrapper {...props}>
    <FiEdit />
  </EducationalIconWrapper>
);

export const TeachingIcon: React.FC<EducationalIconProps> = (props) => (
  <EducationalIconWrapper {...props}>
    <FiUsers />
  </EducationalIconWrapper>
);

export const CaringIcon: React.FC<EducationalIconProps> = (props) => (
  <EducationalIconWrapper {...props}>
    <FiSmile />
  </EducationalIconWrapper>
);

// Icon collection object for easy access
export const EducationalIcons = {
  Reading: ReadingIcon,
  Writing: WritingIcon,
  Achievement: AchievementIcon,
  Love: LoveIcon,
  ProblemSolving: ProblemSolvingIcon,
  Education: EducationIcon,
  Creativity: CreativityIcon,
  Building: BuildingIcon,
  Success: SuccessIcon,
  Storytelling: StorytellingIcon,
  Learning: LearningIcon,
  Editing: EditingIcon,
  Teaching: TeachingIcon,
  Caring: CaringIcon,
};

export default EducationalIcons;