import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  // Check if user is authenticated
  if (!locals.user) {
    // If not authenticated, redirect to login (this will be handled by hooks)
    throw new Error('Authentication required');
  }

  // Return user data to the page
  return {
    user: {
      userId: locals.user.id,
      username: locals.user.username,
      role: locals.user.role
    }
  };
};