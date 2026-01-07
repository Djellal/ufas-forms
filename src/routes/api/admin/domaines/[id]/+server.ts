import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { getDomaineById, updateDomaine, deleteDomaine } from '$lib/server/db/domaine';
import { isAdmin } from '$lib/server/authorization';

export const GET: RequestHandler = async ({ params, locals }) => {
	// Check if user is admin
	if (!isAdmin(locals.user)) {
		return json({ error: 'Access denied. Admin role required.' }, { status: 403 });
	}

	const id = parseInt(params.id);
	if (isNaN(id)) {
		return json({ error: 'Invalid domaine ID' }, { status: 400 });
	}

	try {
		const domaine = await getDomaineById(id);
		if (!domaine) {
			return json({ error: 'Domaine not found' }, { status: 404 });
		}
		return json(domaine);
	} catch (error) {
		console.error('Error fetching domaine:', error);
		return json({ error: 'Failed to fetch domaine' }, { status: 500 });
	}
};

export const PUT: RequestHandler = async ({ params, request, locals }) => {
	// Check if user is admin
	if (!isAdmin(locals.user)) {
		return json({ error: 'Access denied. Admin role required.' }, { status: 403 });
	}

	const id = parseInt(params.id);
	if (isNaN(id)) {
		return json({ error: 'Invalid domaine ID' }, { status: 400 });
	}

	try {
		const { name, level } = await request.json();
		
		if (!name || !level) {
			return json({ error: 'Name and level are required' }, { status: 400 });
		}

		const updatedDomaine = await updateDomaine(id, name, level);
		if (!updatedDomaine) {
			return json({ error: 'Domaine not found' }, { status: 404 });
		}
		return json(updatedDomaine);
	} catch (error) {
		console.error('Error updating domaine:', error);
		return json({ error: 'Failed to update domaine' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	// Check if user is admin
	if (!isAdmin(locals.user)) {
		return json({ error: 'Access denied. Admin role required.' }, { status: 403 });
	}

	const id = parseInt(params.id);
	if (isNaN(id)) {
		return json({ error: 'Invalid domaine ID' }, { status: 400 });
	}

	try {
		const success = await deleteDomaine(id);
		if (!success) {
			return json({ error: 'Domaine not found' }, { status: 404 });
		}
		return json({ message: 'Domaine deleted successfully' }, { status: 200 });
	} catch (error) {
		console.error('Error deleting domaine:', error);
		return json({ error: 'Failed to delete domaine' }, { status: 500 });
	}
};