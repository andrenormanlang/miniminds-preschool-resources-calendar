import nodeFetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

// Constants
const API_URL = "http://localhost:4000/api";
const NUM_RESOURCES = 50; // Changed to 50 resources

// Resource options from your form
const typeOptions = [
  "Activity",
  "Printable",
  "Game",
  "Book",
  "Song",
  "Craft",
  "Experiment",
  "OutdoorActivity",
  "DigitalResource",
  "LessonPlan",
  "VideoLink",
  "ParentTip",
];

const subjectOptions = [
  "Literacy",
  "Numeracy",
  "Science",
  "Arts",
  "Music",
  "SocialEmotional",
  "PhysicalDevelopment",
  "SensoryPlay",
  "ProblemSolving",
  "WorldCultures",
  "NatureOutdoors",
  "PlayfulLearning",
];

const ageGroupOptions = [
  "1-2 years",
  "2-3 years",
  "3-4 years",
  "4-5 years",
  "5-6 years",
];

// Sample images (replace with actual URLs if you have them)
const sampleImages = [
  "https://images.unsplash.com/photo-1472162072942-cd5147eb3902",
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
  "https://images.unsplash.com/photo-1588075592446-265bad68d2b6",
  "https://images.unsplash.com/photo-1555861496-0666c8981751",
  "https://images.unsplash.com/photo-1582094937003-835cadee03cc",
];

// Template descriptions for different types of resources
const descriptionTemplates = {
  Activity: [
    "This hands-on activity helps children develop fine motor skills while learning about {subject}. Perfect for {ageGroup} children, it requires minimal setup and provides maximum engagement.",
    "A fun interactive activity that introduces basic {subject} concepts. Children will love the colorful materials and engaging process.",
  ],
  Printable: [
    "This printable worksheet focuses on {subject} skills for {ageGroup}. It includes clear instructions and can be completed with crayons or markers.",
    "A beautiful, easy-to-use printable that helps reinforce {subject} concepts. Features age-appropriate challenges for {ageGroup}.",
  ],
  Game: [
    "This game makes learning {subject} fun for {ageGroup}! It involves simple rules and encourages social interaction while building important skills.",
    "An educational game that teaches {subject} concepts through play. Suitable for {ageGroup}, it can be played in small groups or pairs.",
  ],
  Book: [
    "A delightful picture book that introduces {subject} concepts to {ageGroup} children. Features colorful illustrations and simple language.",
    "This storybook adventure makes {subject} exciting for young learners. Ideal for {ageGroup}, it includes discussion questions for deeper understanding.",
  ],
  // Add more templates as needed
};

// Title templates
const titleTemplates = {
  Activity: [
    "{subject} Exploration for Little Hands",
    "Hands-on {subject} Discovery",
    "Creative {subject} Play Activity",
    "{subject} Learning Adventure",
  ],
  Printable: [
    "My First {subject} Worksheet",
    "{subject} Coloring Pages",
    "Cut and Paste {subject} Fun",
    "{subject} Tracing Activity",
  ],
  Game: [
    "{subject} Matching Game",
    "The Amazing {subject} Race",
    "{subject} Bingo Challenge",
    "Count and Learn {subject} Game",
  ],
  // Add more as needed
};

// Swedish holidays for Spring 2025
const swedishHolidays2025 = [
  "2025-01-01", // New Year's Day
  "2025-01-06", // Epiphany
  "2025-04-18", // Good Friday
  "2025-04-20", // Easter Sunday
  "2025-04-21", // Easter Monday
  "2025-05-01", // Labour Day
  "2025-05-29", // Ascension Day
  "2025-06-06", // National Day
  "2025-06-08", // Pentecost
  "2025-06-20", // Midsummer Eve
];

// Helper function to get spring weekday dates (March-May 2025) in Sweden, excluding holidays
const getSpringWeekdayDate = () => {
  // Spring in Sweden is roughly March through May
  const springStart = new Date("2025-03-01");
  const springEnd = new Date("2025-05-31");

  let validDate = false;
  let dateStr = "";

  while (!validDate) {
    // Generate a random date within spring 2025
    const randomDay = Math.floor(
      Math.random() * (springEnd.getTime() - springStart.getTime())
    );
    const date = new Date(springStart.getTime() + randomDay);

    // Format as YYYY-MM-DD
    dateStr = date.toISOString().split("T")[0];

    // Check if it's a weekday (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const dayOfWeek = date.getDay();
    const isWeekday = dayOfWeek > 0 && dayOfWeek < 6;

    // Check if it's not a holiday
    const isHoliday = swedishHolidays2025.includes(dateStr);

    // Valid if it's a weekday and not a holiday
    validDate = isWeekday && !isHoliday;
  }

  return dateStr;
};

// Replace the existing getRandomFutureDate function with our new spring weekday function
const getRandomFutureDate = getSpringWeekdayDate;

// Helper function to get random item from array
const getRandomItem = (array) =>
  array[Math.floor(Math.random() * array.length)];

// Generate a random resource
const generateResource = () => {
  const type = getRandomItem(typeOptions);
  const subject = getRandomItem(subjectOptions);
  const ageGroup = getRandomItem(ageGroupOptions);

  // Get title template and fill it
  const titleTemplate = getRandomItem(
    titleTemplates[type] || titleTemplates["Activity"]
  );
  const title = titleTemplate.replace("{subject}", subject);

  // Get description template and fill it
  const descTemplate = getRandomItem(
    descriptionTemplates[type] || descriptionTemplates["Activity"]
  );
  const description = descTemplate
    .replace("{subject}", subject.toLowerCase())
    .replace("{ageGroup}", ageGroup.toLowerCase());

  return {
    title,
    type,
    subject,
    ageGroup,
    description,
    eventDate: getRandomFutureDate(),
    imageUrl: getRandomItem(sampleImages),
  };
};

// Function to add resources using the standard endpoint
const addResource = async (resource) => {
  try {
    console.log(`Sending resource: ${JSON.stringify(resource, null, 2)}`);

    // Using the superadmin clerkId from create-superadmin.ts
    const authToken =
      process.env.AUTH_TOKEN || "user_2tiozNdnW17gxlC8uNuzsyQdCwS";

    const response = await fetch(`${API_URL}/resources`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`, // Using the superadmin clerkId
      },
      body: JSON.stringify(resource),
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response body:", errorText);
      throw new Error(`Failed to add resource: ${errorText}`);
    }

    const data = await response.json();
    console.log(`✅ Resource added: "${resource.title}"`);
    return data;
  } catch (error) {
    console.error(`❌ Error adding resource "${resource.title}":`, error);
    return null;
  }
};

// Main function to add all resources
const addSampleResources = async () => {
  console.log(`🚀 Starting to add ${NUM_RESOURCES} sample resources...`);

  // Generate and add resources
  const resources = Array.from({ length: NUM_RESOURCES }, generateResource);

  let successCount = 0;
  for (const [index, resource] of resources.entries()) {
    console.log(
      `📦 Adding resource ${index + 1}/${NUM_RESOURCES}: "${resource.title}"`
    );
    const result = await addResource(resource);
    if (result) successCount++;

    // Small delay to avoid overwhelming the server
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log(`\n✨ Finished adding sample resources!`);
  console.log(
    `📊 Summary: ${successCount}/${NUM_RESOURCES} resources added successfully.`
  );
};

// Run the script
addSampleResources().catch(console.error);
