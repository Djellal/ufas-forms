import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { getAllEstablishments, createEstablishment } from '$lib/server/db/establishment';
import { isAdmin } from '$lib/server/authorization';

export const GET: RequestHandler = async ({ locals }) => {
	// Check if user is admin
	if (!isAdmin(locals.user)) {
		return json({ error: 'Access denied. Admin role required.' }, { status: 403 });
	}

	try {
		const establishments = await getAllEstablishments();
		return json(establishments);
	} catch (error) {
		console.error('Error fetching establishments:', error);
		return json({ error: 'Failed to fetch establishments' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request, locals }) => {
	// Check if user is admin
	if (!isAdmin(locals.user)) {
		return json({ error: 'Access denied. Admin role required.' }, { status: 403 });
	}

	try {
		const { name, name_ar } = await request.json();

		if (!name || !name_ar) {
			return json({ error: 'Name and name_ar are required' }, { status: 400 });
		}

		const newEstablishment = await createEstablishment(name, name_ar);
		return json(newEstablishment, { status: 201 });
	} catch (error) {
		console.error('Error creating establishment:', error);
		return json({ error: 'Failed to create establishment' }, { status: 500 });
	}
};