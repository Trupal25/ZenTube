import { relations } from "drizzle-orm";
import { pgTable , uuid ,text ,uniqueIndex ,timestamp } from "drizzle-orm/pg-core";


export const users = pgTable("users",{
    id: uuid("id").primaryKey().defaultRandom(),
    clerkId:text("clerk_id").unique().notNull(),
    name: text("name").notNull(),
    // Todo: add banner fields
    imageUrl: text("image_url").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
},(t) => [uniqueIndex("clerk_id_idx").on(t.clerkId)]);

export const UserRelations = relations(users,({ many }) => ({
    videos: many(videos),
}))

export const categories = pgTable("categories",{
    id:uuid("id").primaryKey().defaultRandom(),
    name:text("name").notNull().unique(),
    description:text("description"),
    createdAt:timestamp("created_at").defaultNow().notNull(),
    updatedAt:timestamp("updated_at").defaultNow().notNull(),
},(t)=> [uniqueIndex("name_idx").on(t.name)]);

export const CategoriesRelation = relations(categories,({ many })=>({
    videos:many(videos)
}))

export const videos = pgTable("videos",{
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description"),
    categoryId: uuid("category_id").references(() => categories.id,{
        onDelete:"set null"
    }),
    userId: uuid("user_id").references(()=> users.id,{
        onDelete:"cascade",
    }).notNull(),

    createdAt:timestamp("created_at").defaultNow().notNull(),
    updatedAt:timestamp("updated_at").defaultNow().notNull(),
})

export const VideoRelations = relations(videos,({ one })=>({
    user: one(users,{
        fields:[videos.userId],
        references:[users.id]
    }),
    category:one(categories,{
        fields:[videos.categoryId],
        references:[categories.id]
    })
}));