import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { isAdmin } from '$lib/server/authorization';

export const load: LayoutServerLoad = async ({ locals }) => {
	// Check if user is admin
	if (!isAdmin(locals.user)) {
		// Redirect to login if not authenticated
		if (!locals.user) {
			throw redirect(302, '/login');
		}
		// Otherwise, show access denied
		throw redirect(302, '/'); // or another appropriate page
	}

	return {
		user: locals.user
	};
};