import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/*== BASKETBALL COACH PLATFORM SCHEMA ===============================
This schema defines the data models for a basketball coaching platform:
- Players: Team roster with positions and stats
- Games: Game records with opponent, date, and video
- Markers: Timestamped feedback on game footage
====================================================================*/
const schema = a.schema({
  Player: a
    .model({
      name: a.string().required(),
      number: a.integer().required(),
      position: a.string().required(),
      team: a.string(),
      active: a.boolean().default(true),
      createdAt: a.datetime(),
      
      // Relationships
      markers: a.hasMany('Marker', 'playerId'),
    })
    .authorization((allow) => [
      allow.authenticated().to(['create', 'read', 'update', 'delete'])
    ]),

  Game: a
    .model({
      opponent: a.string().required(),
      date: a.date().required(),
      gameType: a.string(), // "Regular", "Playoff", "Practice"
      videoUrl: a.string(),
      videoFileName: a.string(),
      duration: a.integer(), // Duration in seconds
      score: a.string(), // "120-115" format
      notes: a.string(),
      createdAt: a.datetime(),
      
      // Relationships  
      markers: a.hasMany('Marker', 'gameId'),
    })
    .authorization((allow) => [
      allow.authenticated().to(['create', 'read', 'update', 'delete'])
    ]),

  Marker: a
    .model({
      timestamp: a.float().required(), // Time in seconds
      playerId: a.id().required(),
      gameId: a.id().required(),
      description: a.string().required(),
      type: a.string().required(), // "positive", "improvement", "neutral"
      category: a.string(), // "offense", "defense", "teamwork", etc.
      priority: a.string().default("medium"), // "low", "medium", "high"
      createdAt: a.datetime(),
      
      // Relationships
      player: a.belongsTo('Player', 'playerId'),
      game: a.belongsTo('Game', 'gameId'),
    })
    .authorization((allow) => [
      allow.authenticated().to(['create', 'read', 'update', 'delete'])
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
