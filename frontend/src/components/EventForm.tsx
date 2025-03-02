// src/components/EventForm.tsx

import React, { useState } from 'react';
import {
  Box,
  Button,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  Stack,
  Image,
  Spinner,
  Text,
  useToast,
} from '@chakra-ui/react';
import { Resource } from '../types/type';
import { useDropzone } from 'react-dropzone';
import { useAuthFetch } from '../utils/authUtils';

type FormData = {
  title: string;
  type: string;
  subject: string;
  ageGroup: string;
  rating: number;
  description: string;
  eventDate: string;
  imageUrl: string;
};

type EventFormProps = {
  resource?: Resource;
  onSubmit: (data: FormData) => void;
};

const EventForm: React.FC<EventFormProps> = ({ resource, onSubmit }) => {
  const { authFetch, getToken } = useAuthFetch();
  const toast = useToast();
  const [formData, setFormData] = useState<FormData>({
    title: resource?.title || '',
    type: resource?.type || '',
    subject: resource?.subject || '',
    ageGroup: resource?.ageGroup || '',
    rating: resource?.rating || 1,
    description: resource?.description || '',
    eventDate: resource?.eventDate ? new Date(resource.eventDate).toISOString().split('T')[0] : '',
    imageUrl: resource?.imageUrl || '',
  });

  const [uploading, setUploading] = useState<boolean>(false);

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const uploadData = new FormData();
    uploadData.append('image', file);

    setUploading(true);

    try {
      const token = await getToken();
      
      const response = await fetch('http://localhost:4000/api/resources/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: uploadData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      setFormData({ ...formData, imageUrl: data.imageUrl });
      
      toast({
        title: "Image uploaded",
        status: "success",
        duration: 3000,
      });
    } catch (err) {
      console.error('Upload error:', err);
      toast({
        title: "Upload failed",
        description: err instanceof Error ? err.message : "Failed to upload image",
        status: "error",
        duration: 5000,
      });
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNumberChange = (valueAsString: string, valueAsNumber: number) => {
    setFormData({ ...formData, rating: valueAsNumber });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format the date correctly before sending up to parent
    const formattedData = {
      ...formData,
      // Ensure date is in ISO format for API
      eventDate: new Date(formData.eventDate).toISOString()
    };
    
    onSubmit(formattedData);
  };

  return (
    <Box as="form" onSubmit={handleSubmit} p={4}>
      <Stack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Title</FormLabel>
          <Input name="title" value={formData.title} onChange={handleChange} />
        </FormControl>

        <FormControl>
          <FormLabel>Image</FormLabel>
          <Box
            {...getRootProps()}
            border="2px dashed"
            borderColor="gray.300"
            p={4}
            textAlign="center"
            cursor="pointer"
          >
            <input {...getInputProps()} />
            {uploading ? (
              <Spinner />
            ) : (
              <Text>Drag 'n' drop an image here, or click to select one</Text>
            )}
          </Box>
          {formData.imageUrl && (
            <Image src={formData.imageUrl} alt="Preview" boxSize="100px" mt={2} />
          )}
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Type</FormLabel>
          <Input name="type" value={formData.type} onChange={handleChange} />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Subject</FormLabel>
          <Input name="subject" value={formData.subject} onChange={handleChange} />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Age Group</FormLabel>
          <Input name="ageGroup" value={formData.ageGroup} onChange={handleChange} />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Rating</FormLabel>
          <NumberInput
            min={1}
            max={5}
            value={formData.rating}
            onChange={handleNumberChange}
          >
            <NumberInputField name="rating" />
          </NumberInput>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Description</FormLabel>
          <Textarea name="description" value={formData.description} onChange={handleChange} />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Event Date</FormLabel>
          <Input
            name="eventDate"
            type="date"
            value={formData.eventDate.toString().split('T')[0]}
            onChange={handleChange}
          />
        </FormControl>

        <Button 
          type="submit" 
          bgColor="blue.600" 
          color="white"
          _hover={{ bgColor: "blue.700" }}
        >
          Submit
        </Button>
      </Stack>
    </Box>
  );
};

export default EventForm;
