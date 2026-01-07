import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getEstablishmentById } from '$lib/server/db/establishment';
import { isAdmin } from '$lib/server/authorization';

export const load: PageServerLoad = async ({ params, locals }) => {
	// Check if user is admin
	if (!isAdmin(locals.user)) {
		throw error(403, 'Access denied. Admin role required.');
	}

	const id = parseInt(params.id);
	if (isNaN(id)) {
		throw error(400, 'Invalid establishment ID');
	}

	const establishment = await getEstablishmentById(id);
	if (!establishment) {
		throw error(404, 'Establishment not found');
	}

	return {
		establishment
	};
};