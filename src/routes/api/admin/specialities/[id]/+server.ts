import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { getSpecialityById, updateSpeciality, deleteSpeciality } from '$lib/server/db/speciality';
import { isAdmin } from '$lib/server/authorization';

export const GET: RequestHandler = async ({ params, locals }) => {
	// Check if user is admin
	if (!isAdmin(locals.user)) {
		return json({ error: 'Access denied. Admin role required.' }, { status: 403 });
	}

	try {
		const id = parseInt(params.id);
		if (isNaN(id)) {
			return json({ error: 'Invalid ID' }, { status: 400 });
		}

		const speciality = await getSpecialityById(id);
		if (!speciality) {
			return json({ error: 'Speciality not found' }, { status: 404 });
		}

		return json(speciality);
	} catch (error) {
		console.error('Error fetching speciality:', error);
		return json({ error: 'Failed to fetch speciality' }, { status: 500 });
	}
};

export const PUT: RequestHandler = async ({ params, request, locals }) => {
	// Check if user is admin
	if (!isAdmin(locals.user)) {
		return json({ error: 'Access denied. Admin role required.' }, { status: 403 });
	}

	try {
		const id = parseInt(params.id);
		if (isNaN(id)) {
			return json({ error: 'Invalid ID' }, { status: 400 });
		}

		const { name, domaineId } = await request.json();

		if (!name || !domaineId) {
			return json({ error: 'Name and domaineId are required' }, { status: 400 });
		}

		const updatedSpeciality = await updateSpeciality(id, name, domaineId);
		if (!updatedSpeciality) {
			return json({ error: 'Speciality not found' }, { status: 404 });
		}

		return json(updatedSpeciality);
	} catch (error) {
		console.error('Error updating speciality:', error);
		return json({ error: 'Failed to update speciality' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	// Check if user is admin
	if (!isAdmin(locals.user)) {
		return json({ error: 'Access denied. Admin role required.' }, { status: 403 });
	}

	try {
		const id = parseInt(params.id);
		if (isNaN(id)) {
			return json({ error: 'Invalid ID' }, { status: 400 });
		}

		const deleted = await deleteSpeciality(id);
		if (!deleted) {
			return json({ error: 'Speciality not found' }, { status: 404 });
		}

		return json({ success: true });
	} catch (error) {
		console.error('Error deleting speciality:', error);
		return json({ error: 'Failed to delete speciality' }, { status: 500 });
	}
};