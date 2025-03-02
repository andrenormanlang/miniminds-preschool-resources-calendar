#!/usr/bin/env node

import fetch from "node-fetch";
import chalk from "chalk";

// Configuration
const API_URL = "http://localhost:4000/api";
const NUM_RESOURCES = 5; // We'll add 5 activities
const ADMIN_AUTH_TOKEN = "user_2tjNR2Qm3u18SFWZKFZbefomThM"; // Admin user Clerk ID

// Swedish holidays for April 2025
const swedishHolidays2025 = [
  "2025-04-18", // Good Friday
  "2025-04-20", // Easter Sunday
  "2025-04-21", // Easter Monday
];

// Activity options
const activityTypes = [
  "Activity", // Only activities as requested
];

const subjectOptions = [
  "Math",
  "Science",
  "Reading",
  "Writing",
  "Arts",
  "Music",
  "Movement",
  "SensoryPlay",
  "NatureOutdoors",
  "STEM",
  "SocialEmotional",
  "LanguageDevelopment",
];

const ageGroupOptions = [
  "0-1 years",
  "1-2 years",
  "2-3 years",
  "3-4 years",
  "4-5 years",
  "5-6 years",
];

// Swedish locations
const swedishLocations = [
  "Stockholm",
  "Gothenburg",
  "Malmö",
  "Uppsala",
  "Lund",
  "Umeå",
  "Linköping",
  "Örebro",
  "Västerås",
  "Helsingborg",
];

// Title templates for activities
const titleTemplates = {
  Activity: [
    "Swedish {subject} Workshop in {location}",
    "Learn {subject} in {location}",
    "Interactive {subject} Session in {location}",
    "{subject} Exploration Day in {location}",
    "Hands-on {subject} Discovery in {location}",
  ],
};

// Description templates for activities
const descriptionTemplates = {
  Activity: [
    "A fun interactive activity in {location}, Sweden that introduces basic {subject} concepts. Children will love the colorful materials and engaging process.",
    "This hands-on workshop in {location}, Sweden lets children discover {subject} through play and exploration. Perfect for developing early learning skills.",
    "Join us for this engaging {subject} activity in {location}, Sweden designed specifically for young learners. Features age-appropriate challenges and playful learning.",
    "Explore the world of {subject} in this special event in {location}, Sweden. Children will participate in guided activities designed to spark curiosity and joy of learning.",
    "A collaborative {subject} activity in {location}, Sweden where children can learn together through creativity and play. Includes take-home materials to continue learning.",
  ],
};

// Helper function to get random item from array
const getRandomItem = (array) =>
  array[Math.floor(Math.random() * array.length)];

// Helper function to get April 2025 weekday date in Sweden, excluding holidays
const getAprilWeekdayDate = () => {
  // April 2025
  const aprilStart = new Date("2025-04-01");
  const aprilEnd = new Date("2025-04-30");

  let validDate = false;
  let dateStr = "";

  while (!validDate) {
    // Generate a random date within April 2025
    const randomDay = Math.floor(
      Math.random() * (aprilEnd.getTime() - aprilStart.getTime())
    );
    const date = new Date(aprilStart.getTime() + randomDay);

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

// Generate a random activity resource for Sweden
const generateResource = () => {
  // For this script, we're only generating activities as requested
  const type = "Activity";
  const subject = getRandomItem(subjectOptions);
  const ageGroup = getRandomItem(ageGroupOptions);
  const location = getRandomItem(swedishLocations);

  // Get title template and fill it
  const titleTemplate = getRandomItem(titleTemplates[type]);
  const title = titleTemplate
    .replace("{subject}", subject)
    .replace("{location}", location);

  // Get description template and fill it
  const descTemplate = getRandomItem(descriptionTemplates[type]);
  const description = descTemplate
    .replace("{subject}", subject.toLowerCase())
    .replace("{location}", location);

  // Get a weekday date in April 2025, excluding holidays
  const eventDate = getAprilWeekdayDate();

  // Random image URL
  const imageUrl = `https://source.unsplash.com/featured/?${subject.toLowerCase()},children`;

  return {
    title,
    type,
    subject,
    ageGroup,
    description,
    eventDate,
    imageUrl,
  };
};

// Add a resource to the API
const addResource = async (resource) => {
  try {
    console.log(`Sending resource: ${JSON.stringify(resource, null, 2)}`);

    const response = await fetch(`${API_URL}/resources`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ADMIN_AUTH_TOKEN}`,
      },
      body: JSON.stringify(resource),
    });

    console.log(`Response status: ${response.status}`);

    if (response.ok) {
      console.log(chalk.green(`✅ Resource added: "${resource.title}"`));
      return true;
    } else {
      const errorData = await response.json();
      console.log(
        chalk.red(`Error response body: ${JSON.stringify(errorData)}`)
      );
      throw new Error(`Failed to add resource: ${JSON.stringify(errorData)}`);
    }
  } catch (error) {
    console.log(
      chalk.red(
        `❌ Error adding resource "${resource.title}": ${error.message}`
      )
    );
    return false;
  }
};

// Main function to add sample resources
const addAdminResources = async () => {
  console.log(
    chalk.blue(
      `🚀 Starting to add ${NUM_RESOURCES} sample resources for admin...`
    )
  );

  let successCount = 0;

  for (let i = 0; i < NUM_RESOURCES; i++) {
    const resource = generateResource();
    console.log(
      chalk.yellow(
        `📝 Adding resource ${i + 1}/${NUM_RESOURCES}: "${resource.title}"`
      )
    );

    const success = await addResource(resource);
    if (success) successCount++;
  }

  console.log(chalk.blue("\n✨ Finished adding sample resources!"));
  console.log(
    chalk.yellow(
      `📊 Summary: ${successCount}/${NUM_RESOURCES} resources added successfully.`
    )
  );
};

// Run the main function
addAdminResources().catch((error) => {
  console.error(chalk.red(`Fatal error: ${error.message}`));
  process.exit(1);
});
