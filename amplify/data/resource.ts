import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/*== BASKETBALL COACH PLATFORM SCHEMA ===============================
Multi-Team Coaching Platform Schema:
- Teams: Organized groups within a coach's account
- Players: Belong to specific teams
- Games: Associated with teams  
- Markers: Timestamped feedback on game footage
====================================================================*/
const schema = a.schema({
  Team: a
    .model({
      name: a.string().required(),
      description: a.string(),
      sport: a.string().default('Basketball'),
      season: a.string(), // "2023-24", "Spring 2024", etc.
      ageGroup: a.string(), // "U-16", "Varsity", "JV", etc.
      isActive: a.boolean().default(true),
      createdAt: a.datetime(),
      
      // Relationships
      players: a.hasMany('Player', 'teamId'),
      games: a.hasMany('Game', 'teamId'),
      markers: a.hasMany('Marker', 'teamId'),
    })
    .authorization((allow) => [
      allow.owner()
    ]),

  Player: a
    .model({
      name: a.string().required(),
      number: a.integer().required(),
      position: a.string().required(),
      active: a.boolean().default(true),
      createdAt: a.datetime(),
      
      // Team relationship
      teamId: a.id().required(),
      
      // Optional player details
      height: a.string(), // "6'2\""
      weight: a.integer(), // pounds
      grade: a.string(), // "12th", "Sophomore", etc.
      
      // Relationships
      team: a.belongsTo('Team', 'teamId'),
      markers: a.hasMany('Marker', 'playerId'),
    })
    .authorization((allow) => [
      allow.owner()
    ]),

  Game: a
    .model({
      opponent: a.string().required(),
      date: a.date().required(),
      gameType: a.string().default('Regular'), // "Regular", "Playoff", "Practice", "Scrimmage"
      location: a.string(), // "Home", "Away", or venue name
      
      // Video and file management
      videoUrl: a.string(),
      videoFileName: a.string(),
      videoS3Key: a.string(), // S3 storage path for the video
      videoFileSize: a.integer(), // File size in bytes
      uploadStatus: a.string().default("pending"), // "pending", "uploading", "completed", "failed"
      thumbnailUrl: a.string(), // Thumbnail image URL
      thumbnailS3Key: a.string(), // S3 storage path for thumbnail
      duration: a.integer(), // Duration in seconds
      
      // Game details
      score: a.string(), // "120-115" format
      ourScore: a.integer(), // Our team's score
      opponentScore: a.integer(), // Opponent's score
      notes: a.string(),
      createdAt: a.datetime(),
      
      // Team relationship
      teamId: a.id().required(),
      
      // Relationships  
      team: a.belongsTo('Team', 'teamId'),
      markers: a.hasMany('Marker', 'gameId'),
    })
    .authorization((allow) => [
      allow.owner()
    ]),

  Marker: a
    .model({
      timestamp: a.float().required(), // Time in seconds
      description: a.string().required(),
      type: a.string().required(), // "positive", "improvement", "neutral"
      category: a.string().default('general'), // "offense", "defense", "teamwork", etc.
      priority: a.string().default("medium"), // "low", "medium", "high"
      createdAt: a.datetime(),
      
      // Relationships
      playerId: a.id().required(),
      gameId: a.id().required(),
      teamId: a.id().required(), // Denormalized for easier querying
      
      // Relationships
      player: a.belongsTo('Player', 'playerId'),
      game: a.belongsTo('Game', 'gameId'),
      team: a.belongsTo('Team', 'teamId'),
    })
    .authorization((allow) => [
      allow.owner()
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});

/*== BASKETBALL PLATFORM DATA CLIENT =====================================
Use this client in your React components to interact with the database:

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

// Example usage:
// const { data: players } = await client.models.Player.list();
// const { data: games } = await client.models.Game.list();
// const { data: markers } = await client.models.Marker.list();
========================================================================*/

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
