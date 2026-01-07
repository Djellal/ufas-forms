import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { getEstablishmentById, updateEstablishment, deleteEstablishment } from '$lib/server/db/establishment';
import { isAdmin } from '$lib/server/authorization';

export const GET: RequestHandler = async ({ params, locals }) => {
	// Check if user is admin
	if (!isAdmin(locals.user)) {
		return json({ error: 'Access denied. Admin role required.' }, { status: 403 });
	}

	const id = parseInt(params.id);
	if (isNaN(id)) {
		return json({ error: 'Invalid establishment ID' }, { status: 400 });
	}

	try {
		const establishment = await getEstablishmentById(id);
		if (!establishment) {
			return json({ error: 'Establishment not found' }, { status: 404 });
		}
		return json(establishment);
	} catch (error) {
		console.error('Error fetching establishment:', error);
		return json({ error: 'Failed to fetch establishment' }, { status: 500 });
	}
};

export const PUT: RequestHandler = async ({ params, request, locals }) => {
	// Check if user is admin
	if (!isAdmin(locals.user)) {
		return json({ error: 'Access denied. Admin role required.' }, { status: 403 });
	}

	const id = parseInt(params.id);
	if (isNaN(id)) {
		return json({ error: 'Invalid establishment ID' }, { status: 400 });
	}

	try {
		const { name, name_ar } = await request.json();
		
		if (!name || !name_ar) {
			return json({ error: 'Name and name_ar are required' }, { status: 400 });
		}

		const updatedEstablishment = await updateEstablishment(id, name, name_ar);
		if (!updatedEstablishment) {
			return json({ error: 'Establishment not found' }, { status: 404 });
		}
		return json(updatedEstablishment);
	} catch (error) {
		console.error('Error updating establishment:', error);
		return json({ error: 'Failed to update establishment' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	// Check if user is admin
	if (!isAdmin(locals.user)) {
		return json({ error: 'Access denied. Admin role required.' }, { status: 403 });
	}

	const id = parseInt(params.id);
	if (isNaN(id)) {
		return json({ error: 'Invalid establishment ID' }, { status: 400 });
	}

	try {
		const success = await deleteEstablishment(id);
		if (!success) {
			return json({ error: 'Establishment not found' }, { status: 404 });
		}
		return json({ message: 'Establishment deleted successfully' }, { status: 200 });
	} catch (error) {
		console.error('Error deleting establishment:', error);
		return json({ error: 'Failed to delete establishment' }, { status: 500 });
	}
};