// Game queries placeholder
// Will be implemented in next phase with actual game logic

import { query } from '../_generated/server'

export const placeholderQuery = query({
  args: {},
  handler: async () => {
    return { status: 'not implemented' }
  }
})
