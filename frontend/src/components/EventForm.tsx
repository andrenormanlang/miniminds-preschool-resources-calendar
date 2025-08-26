// src/components/EventForm.tsx

import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  Stack,
  Image,
  Text,
  useToast,
  Select,
  Divider,
  VStack,
  Progress,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { Resource } from "../types/type";
import { useDropzone } from "react-dropzone";
import { useAuthFetch } from "../utils/authUtils";
import { FiUploadCloud, FiX } from "react-icons/fi";
import AISuggestions from "./AISuggestions";
import AIDescriptionEnhancer from "./AIDescriptionEnhancer";

// API base URL configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

type FormData = {
  title: string;
  type: string;
  subject: string;
  ageGroup: string;
  description: string;
  eventDate: string;
  imageUrl: string;
};

type EventFormProps = {
  resource?: Resource;
  onSubmit: (data: FormData) => void;
};

const ageGroupOptions = [
  { value: "1-2 years", label: "1-2 years (Toddlers)" },
  { value: "2-3 years", label: "2-3 years (Early Preschool)" },
  { value: "3-4 years", label: "3-4 years (Preschool)" },
  { value: "4-5 years", label: "4-5 years (Pre-Kindergarten)" },
  { value: "5-6 years", label: "5-6 years (Kindergarten)" },
];

const subjectOptions = [
  { value: "Literacy", label: "Literacy & Language" },
  { value: "Numeracy", label: "Numeracy & Math" },
  { value: "Science", label: "Science & Discovery" },
  { value: "Arts", label: "Arts & Crafts" },
  { value: "Music", label: "Music & Movement" },
  { value: "SocialEmotional", label: "Social-Emotional Learning" },
  { value: "PhysicalDevelopment", label: "Physical Development" },
  { value: "SensoryPlay", label: "Sensory Play" },
  { value: "ProblemSolving", label: "Critical Thinking & Problem Solving" },
  { value: "WorldCultures", label: "World Cultures & Diversity" },
  { value: "NatureOutdoors", label: "Nature & Outdoor Learning" },
  { value: "PlayfulLearning", label: "Playful Learning" },
  { value: "Other", label: "Other" },
];

const typeOptions = [
  { value: "Activity", label: "Activity" },
  { value: "Printable", label: "Printable Worksheet" },
  { value: "Game", label: "Game" },
  { value: "Book", label: "Book Recommendation" },
  { value: "Song", label: "Song or Rhyme" },
  { value: "Craft", label: "Craft Project" },
  { value: "Experiment", label: "Science Experiment" },
  { value: "OutdoorActivity", label: "Outdoor Activity" },
  { value: "DigitalResource", label: "Digital Resource" },
  { value: "LessonPlan", label: "Lesson Plan" },
  { value: "VideoLink", label: "Video Link" },
  { value: "ParentTip", label: "Parent Tip" },
  { value: "Other", label: "Other" },
];

const EventForm: React.FC<EventFormProps> = ({ resource, onSubmit }) => {
  const { getToken } = useAuthFetch();
  const toast = useToast();
  
  const [formData, setFormData] = useState<FormData>({
    title: resource?.title || "",
    type: resource?.type || "",
    subject: resource?.subject || "",
    ageGroup: resource?.ageGroup || "",
    description: resource?.description || "",
    eventDate: resource?.eventDate
      ? new Date(resource.eventDate).toISOString().split("T")[0]
      : "",
    imageUrl: resource?.imageUrl || "",
  });

  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const uploadImage = async (file: File): Promise<boolean> => {
    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    setUploadProgress(0);

    try {
      const token = await getToken();

      // Create XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest();
      
      const uploadPromise = new Promise<{ imageUrl: string; publicId?: string }>((resolve, reject) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(progress);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const result = JSON.parse(xhr.responseText);
              resolve(result);
            } catch {
              reject(new Error('Invalid response format'));
            }
          } else {
            try {
              const error = JSON.parse(xhr.responseText);
              reject(new Error(error.message || `Upload failed: ${xhr.status}`));
            } catch {
              reject(new Error(`Upload failed: ${xhr.status}`));
            }
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Network error during upload'));
        });
      });

      xhr.open('POST', `${API_BASE_URL}/resources/upload`);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send(formData);

      const result = await uploadPromise;

      setFormData(prev => ({ ...prev, imageUrl: result.imageUrl }));

      toast({
        title: "Image uploaded successfully",
        status: "success",
        duration: 3000,
      });

      return true;

    } catch (error) {
      console.error('Upload error:', error);
      
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : 'Failed to upload image',
        status: "error",
        duration: 5000,
      });

      return false;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please select a JPEG, PNG, GIF, or WebP image.',
        status: 'error',
        duration: 5000,
      });
      return;
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: 'File too large',
        description: 'Please select a file smaller than 10MB.',
        status: 'error',
        duration: 5000,
      });
      return;
    }

    await uploadImage(file);
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, imageUrl: "" }));
  };

  const { getRootProps, getInputProps } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    disabled: uploading
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.type || !formData.subject || !formData.ageGroup || !formData.eventDate) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields (title, type, subject, age group, and event date).",
        status: "error",
        duration: 5000,
      });
      return;
    }

    const formattedData = {
      ...formData,
      eventDate: new Date(formData.eventDate).toISOString(),
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
            borderColor={uploading ? "blue.300" : "gray.300"}
            bg={uploading ? "blue.50" : "gray.50"}
            p={6}
            textAlign="center"
            cursor={uploading ? "not-allowed" : "pointer"}
            borderRadius="md"
            transition="all 0.2s"
            _hover={!uploading ? { borderColor: "blue.400", bg: "blue.50" } : {}}
          >
            <input {...getInputProps()} disabled={uploading} />
            {uploading ? (
              <VStack spacing={3}>
                <Icon as={FiUploadCloud} w={8} h={8} color="blue.500" />
                <Text color="blue.600" fontWeight="medium">
                  Uploading image...
                </Text>
                <Progress 
                  value={uploadProgress} 
                  colorScheme="blue" 
                  size="sm" 
                  w="full" 
                  borderRadius="full"
                />
                <Text fontSize="sm" color="gray.600">
                  {uploadProgress}% complete
                </Text>
              </VStack>
            ) : (
              <VStack spacing={3}>
                <Icon as={FiUploadCloud} w={8} h={8} color="gray.400" />
                <Text color="gray.600" fontWeight="medium">
                  Drag & drop an image here, or click to select
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Supports: JPEG, PNG, GIF, WebP (max 10MB)
                </Text>
              </VStack>
            )}
          </Box>
          
          {formData.imageUrl && (
            <Flex mt={4} p={4} border="1px" borderColor="gray.200" borderRadius="md" bg="gray.50">
              <Image
                src={formData.imageUrl}
                alt="Preview"
                boxSize="80px"
                objectFit="cover"
                borderRadius="md"
                mr={3}
              />
              <Box flex={1}>
                <Text fontWeight="medium" fontSize="sm" color="gray.700">
                  Image uploaded successfully
                </Text>
                <Text fontSize="xs" color="gray.500" noOfLines={2}>
                  {formData.imageUrl}
                </Text>
                <Button
                  size="xs"
                  variant="ghost"
                  colorScheme="red"
                  leftIcon={<Icon as={FiX} />}
                  onClick={removeImage}
                  mt={2}
                >
                  Remove
                </Button>
              </Box>
            </Flex>
          )}
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Type</FormLabel>
          <Select name="type" value={formData.type} onChange={handleChange}>
            <option value="">Select a type</option>
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Subject</FormLabel>
          <Select name="subject" value={formData.subject} onChange={handleChange}>
            <option value="">Select a subject</option>
            {subjectOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Age Group</FormLabel>
          <Select name="ageGroup" value={formData.ageGroup} onChange={handleChange}>
            <option value="">Select an age group</option>
            {ageGroupOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Description</FormLabel>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter a description for this resource..."
            rows={4}
          />
        </FormControl>

        <Divider />
        
        <AIDescriptionEnhancer
          title={formData.title}
          description={formData.description}
          type={formData.type}
          ageGroup={formData.ageGroup}
          subject={formData.subject}
          onEnhancementUpdate={(enhancedTitle: string, enhancedDescription: string) => {
            setFormData(prev => ({ 
              ...prev, 
              title: enhancedTitle,
              description: enhancedDescription 
            }));
          }}
        />

        <Divider />

        <AISuggestions
          ageGroup={formData.ageGroup}
          subject={formData.subject}
          type={formData.type}
          onSuggestionSelect={(suggestion) => {
            setFormData(prev => ({
              ...prev,
              title: suggestion.title,
              description: suggestion.description,
            }));
          }}
        />

        <FormControl isRequired>
          <FormLabel>Event Date</FormLabel>
          <Input
            name="eventDate"
            type="date"
            value={formData.eventDate}
            onChange={handleChange}
          />
        </FormControl>

        <Button 
          type="submit" 
          colorScheme="blue" 
          size="lg"
          isDisabled={uploading}
        >
          {resource ? "Update Resource" : "Create Resource"}
        </Button>
      </Stack>
    </Box>
  );
};

export default EventForm;
