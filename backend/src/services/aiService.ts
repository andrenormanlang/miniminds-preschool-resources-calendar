import { GoogleGenerativeAI } from "@google/generative-ai";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

class AIService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is required in environment variables");
    }

    this.genAI = new GoogleGenerativeAI(apiKey);

    // Allow the model to be configurable via environment variable.
    // Default to a widely-supported text generation model for v1beta if not provided.
    // Default to gemini-2.5-flash (can be overridden by GEN_AI_MODEL env var)
    const configuredModel = process.env.GEN_AI_MODEL || "gemini-2.5-flash";
    try {
      this.model = this.genAI.getGenerativeModel({ model: configuredModel });
    } catch (err) {
      console.warn(
        `Failed to initialize configured model '${configuredModel}', falling back to 'text-bison-001'`,
        err
      );
      this.model = this.genAI.getGenerativeModel({ model: "text-bison-001" });
    }
  }

  /**
   * Generate educational content suggestions based on age group and subject
   */
  async generateContentSuggestions(
    ageGroup: string,
    subject: string,
    type: string
  ) {
    const prompt = `
      As an expert early childhood educator, suggest 3 creative ${type} activities for ${ageGroup} children focusing on ${subject}.
      
      For each activity, provide:
      1. A catchy title
      2. A brief description (2-3 sentences)
      3. Required materials
      4. Learning objectives
      5. Safety considerations (if applicable)
      
      Make sure the activities are:
      - Age-appropriate for ${ageGroup}
      - Engaging and fun
      - Educational and aligned with early learning standards
      - Safe and suitable for the specified age group
      
      IMPORTANT: Return ONLY a valid JSON array with objects containing: title, description, materials, objectives, safety.
      
      Example format:
      [
        {
          "title": "Activity Name",
          "description": "Brief description of the activity",
          "materials": "List of materials needed",
          "objectives": "Learning objectives",
          "safety": "Safety considerations"
        }
      ]
      
      Do not include any text before or after the JSON array.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();

      // Clean up the response text - remove markdown code blocks if present
      text = text
        .replace(/```json\s*/g, "")
        .replace(/```\s*$/g, "")
        .trim();

      // Try to parse as JSON, fallback to creating structured response if parsing fails
      try {
        const parsed = JSON.parse(text);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch (parseError) {
        console.log(
          "Failed to parse JSON, attempting to extract structured data:",
          parseError
        );

        // If JSON parsing fails, try to extract useful information from the text
        // and create a structured response
        const lines = text.split("\n").filter((line: string) => line.trim());
        const suggestions = [];
        let currentSuggestion: any = {};

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (
            trimmedLine.toLowerCase().includes("title") ||
            trimmedLine.match(/^\d+\./)
          ) {
            if (currentSuggestion.title) {
              suggestions.push(currentSuggestion);
              currentSuggestion = {};
            }
            currentSuggestion.title = trimmedLine
              .replace(/^\d+\.\s*/, "")
              .replace(/title:\s*/i, "")
              .replace(/['"]/g, "");
          } else if (trimmedLine.toLowerCase().includes("description")) {
            currentSuggestion.description = trimmedLine
              .replace(/description:\s*/i, "")
              .replace(/['"]/g, "");
          } else if (trimmedLine.toLowerCase().includes("materials")) {
            currentSuggestion.materials = trimmedLine
              .replace(/materials:\s*/i, "")
              .replace(/['"]/g, "");
          } else if (trimmedLine.toLowerCase().includes("objectives")) {
            currentSuggestion.objectives = trimmedLine
              .replace(/objectives:\s*/i, "")
              .replace(/['"]/g, "");
          } else if (trimmedLine.toLowerCase().includes("safety")) {
            currentSuggestion.safety = trimmedLine
              .replace(/safety:\s*/i, "")
              .replace(/['"]/g, "");
          } else if (
            trimmedLine &&
            !currentSuggestion.description &&
            currentSuggestion.title
          ) {
            // If we have a title but no description, use this line as description
            currentSuggestion.description = trimmedLine;
          }
        }

        if (currentSuggestion.title) {
          suggestions.push(currentSuggestion);
        }

        // If we still don't have good suggestions, create a fallback
        if (suggestions.length === 0) {
          return [
            {
              title: `Creative ${type} Ideas for ${ageGroup}`,
              description:
                text.substring(0, 200) + (text.length > 200 ? "..." : ""),
              materials: "See full description for details",
              objectives: `Suitable for ${ageGroup} focusing on ${subject}`,
              safety: "Always supervise children during activities",
            },
          ];
        }

        return suggestions;
      }
    } catch (error) {
      console.error("Error generating content suggestions:", error);

      // If the error indicates the model isn't supported for generateContent, attempt a fallback
      // to text-bison-001 (if not already using it) which supports text generation for many tasks.
      const currentModel = process.env.GEN_AI_MODEL || "text-bison-001";
      if (currentModel !== "text-bison-001") {
        try {
          console.info(
            "Attempting fallback to text-bison-001 for content generation..."
          );
          const fallbackModel = this.genAI.getGenerativeModel({
            model: "text-bison-001",
          });
          const fallbackResult = await fallbackModel.generateContent(prompt);
          const fallbackResponse = await fallbackResult.response;
          const fallbackText = fallbackResponse.text();
          try {
            const parsed = JSON.parse(fallbackText);
            return Array.isArray(parsed) ? parsed : [parsed];
          } catch (parseError) {
            console.warn(
              "Fallback response JSON parse failed, returning fallback text:",
              parseError
            );
            return [
              {
                title: `Creative ${type} Ideas for ${ageGroup}`,
                description:
                  fallbackText.substring(0, 200) +
                  (fallbackText.length > 200 ? "..." : ""),
                materials: "See full description for details",
                objectives: `Suitable for ${ageGroup} focusing on ${subject}`,
                safety: "Always supervise children during activities",
              },
            ];
          }
        } catch (fallbackError) {
          console.error("Fallback generation also failed:", fallbackError);
        }
      }

      throw new Error("Failed to generate content suggestions");
    }
  }

  /**
   * Get personalized recommendations based on user's resources and preferences
   */
  async getPersonalizedRecommendations(
    userResources: any[],
    preferences?: any
  ) {
    const resourceSummary = userResources.map((r) => ({
      type: r.type,
      subject: r.subject,
      ageGroup: r.ageGroup,
    }));

    const prompt = `
      Based on a user's current educational resources: ${JSON.stringify(
        resourceSummary
      )}, 
      suggest 5 new activities that would complement their existing collection.
      
      Focus on:
      - Filling gaps in their current collection
      - Progressive skill development
      - Variety in learning approaches
      - Age-appropriate challenges
      
      For each recommendation, provide:
      1. Title
      2. Type (Activity, Game, Craft, etc.)
      3. Subject area
      4. Age group
      5. Why this complements their collection
      6. Brief description
      
      Format as JSON array with objects containing: title, type, subject, ageGroup, reason, description.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        return JSON.parse(text);
      } catch {
        return { recommendations: text };
      }
    } catch (error) {
      console.error("Error generating recommendations:", error);
      // don't expose provider details to callers, but include original error in logs
      throw new Error("Failed to generate recommendations");
    }
  }

  /**
   * Answer questions about early childhood education
   */
  async answerEducationQuestion(question: string, context?: string) {
    const systemPrompt = `
      You are an expert early childhood education assistant for MiniMinds, a platform for educational resources for children aged 2-6 years.
      
      Your role is to:
      - Provide helpful, accurate information about early childhood education
      - Suggest age-appropriate activities and learning approaches
      - Support parents and educators with practical advice
      - Focus on play-based learning and developmentally appropriate practices
      
      Always:
      - Keep responses concise but informative
      - Consider safety and age-appropriateness
      - Encourage positive learning experiences
      - Reference established early childhood education principles when relevant
      
      ${context ? `Context: ${context}` : ""}
    `;

    const fullPrompt = `${systemPrompt}\n\nQuestion: ${question}`;

    try {
      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error answering question:", error);
      throw new Error("Failed to generate answer");
    }
  }

  /**
   * Generate activity descriptions and improve existing ones
   */
  async enhanceActivityDescription(
    title: string,
    currentDescription: string,
    type: string,
    ageGroup: string,
    subject: string
  ) {
    const prompt = `
      Enhance this educational activity for ${ageGroup} children:
      
      Current Title: ${title}
      Type: ${type}
      Subject: ${subject}
      Current Description: ${currentDescription}
      
      Please provide an enhanced version with:
      1. An improved, catchy title that's engaging and descriptive
      2. An enhanced description that includes:
         - Clear and engaging explanation
         - Specific learning outcomes
         - Step-by-step instructions if appropriate
         - Required materials
         - Tips for success
         - Keep it concise but comprehensive (2-3 paragraphs max)
      
      IMPORTANT: Return ONLY a valid JSON object with the format:
      {
        "title": "Enhanced activity title",
        "description": "Enhanced activity description"
      }
      
      Do not include any text before or after the JSON object.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();

      // Clean up the response text - remove markdown code blocks if present
      text = text
        .replace(/```json\s*/g, "")
        .replace(/```\s*$/g, "")
        .trim();

      try {
        return JSON.parse(text);
      } catch (parseError) {
        console.log(
          "Failed to parse JSON for enhancement, returning text format:",
          parseError
        );
        // Fallback: return original title with enhanced description
        return {
          title: title,
          description: text,
        };
      }
    } catch (error) {
      console.error("Error enhancing description:", error);

      // Provide a clearer error message when model is not found and suggest checking config
      if (
        error &&
        (error as any).message &&
        (error as any).message.includes("not found")
      ) {
        throw new Error(
          `AI model error: ${
            (error as any).message
          }. Check GEN_AI_MODEL/GEMINI_API_KEY environment variables and the available models.`
        );
      }

      // If OpenAI fallback is configured, try it before failing
      const openAiKey = process.env.OPENAI_API_KEY;
      if (openAiKey) {
        try {
          console.info("Attempting OpenAI fallback for enhancement...");
          const openaiResp = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${openAiKey}`,
              },
              body: JSON.stringify({
                model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
                messages: [
                  {
                    role: "system",
                    content:
                      "You are an assistant that improves short educational activity descriptions for parents and teachers.",
                  },
                  { role: "user", content: prompt },
                ],
                max_tokens: 400,
              }),
            }
          );

          if (!openaiResp.ok) {
            const errText = await openaiResp.text();
            console.error("OpenAI fallback returned error:", errText);
          } else {
            const openaiData: any = await openaiResp.json();
            const content: string =
              openaiData?.choices?.[0]?.message?.content || "";
            try {
              return JSON.parse(content);
            } catch (parseError) {
              return {
                title: title,
                description: content,
              };
            }
          }
        } catch (openError) {
          console.error("OpenAI fallback failed:", openError);
        }
      }

      throw new Error("Failed to enhance description");
    }
  }

  /**
   * Chat functionality for general questions
   */
  async chat(message: string, conversationHistory?: any[]) {
    const systemPrompt = `
      You are MiniMinds AI Assistant, a helpful and friendly early childhood education expert.
      You help parents, teachers, and caregivers find the best educational activities and resources for children aged 2-6 years.
      
      Your personality:
      - Warm and encouraging
      - Knowledgeable about child development
      - Practical and solution-oriented
      - Safety-conscious
      - Supportive of different learning styles
      
      Keep responses conversational, helpful, and focused on early childhood education.
    `;

    let conversationContext = "";
    if (conversationHistory && conversationHistory.length > 0) {
      conversationContext =
        "\n\nConversation history:\n" +
        conversationHistory
          .slice(-5)
          .map((msg: any) => `${msg.role}: ${msg.content}`)
          .join("\n");
    }

    const fullPrompt = `${systemPrompt}${conversationContext}\n\nUser: ${message}`;

    try {
      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error in chat:", error);
      throw new Error("Failed to generate chat response");
    }
  }
}

export default AIService;
