import React, { useEffect, useState } from 'react';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Box,
  useDisclosure
} from '@chakra-ui/react';

interface NotificationBannerProps {
  status?: 'info' | 'warning' | 'success' | 'error';
  title?: string;
  message: string;
  autoClose?: boolean;
  duration?: number;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({
  status = 'info',
  title,
  message,
  autoClose = true,
  duration = 5000,
}) => {
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true });
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (autoClose && isOpen) {
      const id = setTimeout(() => {
        onClose();
      }, duration);
      
      setTimeoutId(id);
      
      return () => {
        if (timeoutId) clearTimeout(timeoutId);
      };
    }
  }, [autoClose, duration, isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <Box position="fixed" top="70px" left="50%" transform="translateX(-50%)" zIndex="1000" width="90%" maxW="600px">
      <Alert status={status} variant="solid" borderRadius="md" boxShadow="lg">
        <AlertIcon />
        {title && <AlertTitle mr={2}>{title}</AlertTitle>}
        <AlertDescription>{message}</AlertDescription>
        <CloseButton position="absolute" right="8px" top="8px" onClick={onClose} />
      </Alert>
    </Box>
  );
};

export default NotificationBanner;