import { db } from "@/db";
import { categories } from "@/db/schema";

const categoryNames = [
  "Comedy",
  "Games",
  "Music",
  "News",
  "Travel",
  "Sports",
  "Science & Technology",
  "Film & Animation",
  "Autos & Vehicles",
  "Pets & Animals",
  "How to & Style",
  "Education",
];

async function main() {
  console.log("seeding categories....");

  try {
    const values = categoryNames.map((name) => {
      return {
        name,
        description: `Videos related to ${name.toLowerCase()}`,
      };
    });
    await db.insert(categories).values(values);
    console.log("categories seeded sucessfully!!");
  } catch (err) {
    console.error("Error seeding categories", err);
    process.exit(1);
  }
}

main();
