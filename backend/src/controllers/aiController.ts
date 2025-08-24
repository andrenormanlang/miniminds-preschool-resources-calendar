import { Request, Response } from "express";
import AIService from "../services/aiService.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const aiService = new AIService();

export const generateContentSuggestions = async (
  req: Request,
  res: Response
) => {
  try {
    const { ageGroup, subject, type } = req.body;

    if (!ageGroup || !subject || !type) {
      return res.status(400).json({
        success: false,
        message: "ageGroup, subject, and type are required",
      });
    }

    const suggestions = await aiService.generateContentSuggestions(
      ageGroup,
      subject,
      type
    );

    res.json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    console.error("Error generating content suggestions:", error);
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to generate suggestions",
    });
  }
};

export const getPersonalizedRecommendations = async (
  req: Request,
  res: Response
) => {
  try {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Get user's resources
    const userResources = await prisma.resource.findMany({
      where: { userId: user.id },
      select: {
        type: true,
        subject: true,
        ageGroup: true,
        title: true,
      },
    });

    const recommendations = await aiService.getPersonalizedRecommendations(
      userResources
    );

    res.json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    console.error("Error generating recommendations:", error);
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to generate recommendations",
    });
  }
};

export const answerQuestion = async (req: Request, res: Response) => {
  try {
    const { question, context } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    const answer = await aiService.answerEducationQuestion(question, context);

    res.json({
      success: true,
      data: { answer },
    });
  } catch (error) {
    console.error("Error answering question:", error);
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to generate answer",
    });
  }
};

export const enhanceDescription = async (req: Request, res: Response) => {
  try {
    const { title, description, type, ageGroup, subject } = req.body;

    if (!title || !description || !type || !ageGroup || !subject) {
      return res.status(400).json({
        success: false,
        message:
          "All fields (title, description, type, ageGroup, subject) are required",
      });
    }

    const enhancedDescription = await aiService.enhanceActivityDescription(
      title,
      description,
      type,
      ageGroup,
      subject
    );

    res.json({
      success: true,
      data: { enhancedDescription },
    });
  } catch (error) {
    console.error("Error enhancing description:", error);
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to enhance description",
    });
  }
};

export const chat = async (req: Request, res: Response) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const response = await aiService.chat(message, conversationHistory);

    res.json({
      success: true,
      data: { response },
    });
  } catch (error) {
    console.error("Error in chat:", error);
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to generate response",
    });
  }
};

export const chatStream = async (req: Request, res: Response) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // Set headers for Server-Sent Events
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");

    try {
      const response = await aiService.chat(message, conversationHistory);

      // Simulate streaming by sending chunks
      const words = response.split(" ");
      for (let i = 0; i < words.length; i++) {
        const chunk = words.slice(0, i + 1).join(" ");
        res.write(
          `data: ${JSON.stringify({ content: chunk, done: false })}\n\n`
        );
        await new Promise((resolve) => setTimeout(resolve, 50)); // Small delay for effect
      }

      res.write(
        `data: ${JSON.stringify({ content: response, done: true })}\n\n`
      );
      res.end();
    } catch (error) {
      res.write(
        `data: ${JSON.stringify({
          error: "Failed to generate response",
          done: true,
        })}\n\n`
      );
      res.end();
    }
  } catch (error) {
    console.error("Error in chat stream:", error);
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to start chat stream",
    });
  }
};
