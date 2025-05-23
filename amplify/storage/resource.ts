import { defineStorage } from '@aws-amplify/backend';

/**
 * Define and configure your storage resource for video uploads
 * Multi-team support with coach identity and team organization
 * @see https://docs.amplify.aws/gen2/build-a-backend/storage/
 */
export const storage = defineStorage({
  name: 'basketballVideos',
  access: (allow) => ({
    'videos/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
    ],
    'thumbnails/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
    ],
    'exports/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
    ],
  }),
}); 