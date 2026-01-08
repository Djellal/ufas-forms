import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { getAllSpecialities, createSpeciality } from '$lib/server/db/speciality';
import { isAdmin } from '$lib/server/authorization';
import { and, ilike, eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { speciality, domaine } from '$lib/server/db/schema';

export const GET: RequestHandler = async ({ url, locals }) => {
	// Check if user is admin
	if (!isAdmin(locals.user)) {
		return json({ error: 'Access denied. Admin role required.' }, { status: 403 });
	}

	try {
		// Extract query parameters for filtering
		const searchTerm = url.searchParams.get('search') || '';
		const domaineFilter = url.searchParams.get('domaine') || '';

		// Build the query with optional filters
		let query = db
			.select({
				speciality: speciality,
				domaine: domaine
			})
			.from(speciality)
			.innerJoin(domaine, eq(speciality.domaineId, domaine.id));

		if (searchTerm) {
			query = query.where(
				ilike(speciality.name, `%${searchTerm}%`)
			);
		}

		if (domaineFilter && domaineFilter !== 'all') {
			const domaineId = parseInt(domaineFilter);
			if (!isNaN(domaineId)) {
				if (searchTerm) {
					// If we already have a where clause, we need to use and()
					query = query.where(and(ilike(speciality.name, `%${searchTerm}%`), eq(speciality.domaineId, domaineId)));
				} else {
					query = query.where(eq(speciality.domaineId, domaineId));
				}
			}
		} else if (searchTerm) {
			// Just the search term
			query = query.where(ilike(speciality.name, `%${searchTerm}%`));
		}

		const specialities = await query;
		return json(specialities);
	} catch (error) {
		console.error('Error fetching specialities:', error);
		return json({ error: 'Failed to fetch specialities' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request, locals }) => {
	// Check if user is admin
	if (!isAdmin(locals.user)) {
		return json({ error: 'Access denied. Admin role required.' }, { status: 403 });
	}

	try {
		const { name, domaineId } = await request.json();

		if (!name || !domaineId) {
			return json({ error: 'Name and domaineId are required' }, { status: 400 });
		}

		const newSpeciality = await createSpeciality(name, domaineId);
		return json(newSpeciality, { status: 201 });
	} catch (error) {
		console.error('Error creating speciality:', error);
		return json({ error: 'Failed to create speciality' }, { status: 500 });
	}
};