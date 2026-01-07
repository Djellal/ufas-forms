import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { getAllDomaines, createDomaine } from '$lib/server/db/domaine';
import { isAdmin } from '$lib/server/authorization';
import { and, ilike, eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { domaine } from '$lib/server/db/schema';

export const GET: RequestHandler = async ({ url, locals }) => {
	// Check if user is admin
	if (!isAdmin(locals.user)) {
		return json({ error: 'Access denied. Admin role required.' }, { status: 403 });
	}

	try {
		// Extract query parameters for filtering
		const searchTerm = url.searchParams.get('search') || '';
		const levelFilter = url.searchParams.get('level') || '';

		// Build the query with optional filters
		let query = db.select().from(domaine);

		if (searchTerm) {
			query = query.where(
				ilike(domaine.name, `%${searchTerm}%`)
			);
		}

		if (levelFilter && levelFilter !== 'all') {
			if (searchTerm) {
				// If we already have a where clause, we need to use and()
				query = query.where(and(ilike(domaine.name, `%${searchTerm}%`), eq(domaine.level, levelFilter)));
			} else {
				query = query.where(eq(domaine.level, levelFilter));
			}
		} else if (searchTerm) {
			// Just the search term
			query = query.where(ilike(domaine.name, `%${searchTerm}%`));
		}

		const domaines = await query;
		return json(domaines);
	} catch (error) {
		console.error('Error fetching domaines:', error);
		return json({ error: 'Failed to fetch domaines' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request, locals }) => {
	// Check if user is admin
	if (!isAdmin(locals.user)) {
		return json({ error: 'Access denied. Admin role required.' }, { status: 403 });
	}

	try {
		const { name, level } = await request.json();

		if (!name || !level) {
			return json({ error: 'Name and level are required' }, { status: 400 });
		}

		const newDomaine = await createDomaine(name, level);
		return json(newDomaine, { status: 201 });
	} catch (error) {
		console.error('Error creating domaine:', error);
		return json({ error: 'Failed to create domaine' }, { status: 500 });
	}
};