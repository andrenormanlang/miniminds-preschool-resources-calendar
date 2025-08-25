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
  Spinner,
  Text,
  useToast,
  Select,
  Divider,
} from "@chakra-ui/react";
import { Resource } from "../types/type";
import { useDropzone } from "react-dropzone";
import { useAuthFetch } from "../utils/authUtils";
import AISuggestions from "./AISuggestions";
import AIDescriptionEnhancer from "./AIDescriptionEnhancer";

// API base URL configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

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

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const uploadData = new FormData();
    uploadData.append("image", file);

    setUploading(true);

    try {
      const token = await getToken();

      const response = await fetch(`${API_BASE_URL}/resources/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      setFormData({ ...formData, imageUrl: data.imageUrl });

      toast({
        title: "Image uploaded",
        status: "success",
        duration: 3000,
      });
    } catch (err) {
      console.error("Upload error:", err);
      toast({
        title: "Upload failed",
        description:
          err instanceof Error ? err.message : "Failed to upload image",
        status: "error",
        duration: 5000,
      });
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Format the date correctly before sending up to parent
    const formattedData = {
      ...formData,
      // Ensure date is in ISO format for API
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
            <Image
              src={formData.imageUrl}
              alt="Preview"
              boxSize="100px"
              mt={2}
            />
          )}
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Type</FormLabel>
          <Select name="type" value={formData.type} onChange={handleChange}>
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Subject</FormLabel>
          <Select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
          >
            {subjectOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Age Group</FormLabel>
          <Select
            name="ageGroup"
            value={formData.ageGroup}
            onChange={handleChange}
          >
            {ageGroupOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Description</FormLabel>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </FormControl>

        {/* AI Description Enhancer */}
        <AIDescriptionEnhancer
          title={formData.title}
          description={formData.description}
          type={formData.type}
          ageGroup={formData.ageGroup}
          subject={formData.subject}
          onEnhancementUpdate={(enhancedTitle, enhancedDescription) =>
            setFormData({
              ...formData,
              title: enhancedTitle,
              description: enhancedDescription,
            })
          }
        />

        <Divider />

        {/* AI Content Suggestions */}
        <AISuggestions
          ageGroup={formData.ageGroup}
          subject={formData.subject}
          type={formData.type}
          onSuggestionSelect={(suggestion) => {
            setFormData({
              ...formData,
              title: suggestion.title,
              description: suggestion.description,
            });
          }}
        />

        <Divider />

        <FormControl isRequired>
          <FormLabel>Event Date</FormLabel>
          <Input
            name="eventDate"
            type="date"
            value={formData.eventDate.toString().split("T")[0]}
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
