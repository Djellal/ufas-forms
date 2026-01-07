import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDomaineById } from '$lib/server/db/domaine';
import { isAdmin } from '$lib/server/authorization';

export const load: PageServerLoad = async ({ params, locals }) => {
	// Check if user is admin
	if (!isAdmin(locals.user)) {
		throw error(403, 'Access denied. Admin role required.');
	}

	const id = parseInt(params.id);
	if (isNaN(id)) {
		throw error(400, 'Invalid domaine ID');
	}

	const domaine = await getDomaineById(id);
	if (!domaine) {
		throw error(404, 'Domaine not found');
	}

	return {
		domaine
	};
};