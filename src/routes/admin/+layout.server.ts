import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
  // Check if user is authenticated and has admin role
  if (!event.locals.user || event.locals.user.role !== 'admin') {
    // Redirect to login if not authenticated or not an admin
    throw redirect(302, '/login');
  }

  return {
    user: event.locals.user
  };
};