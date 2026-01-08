import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { speciality, domaine } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async () => {
	try {
		// Join speciality with domaine to get the full information
		const specialities = await db
			.select({
				speciality: speciality,
				domaine: { id: domaine.id, name: domaine.name, level: domaine.level }
			})
			.from(speciality)
			.leftJoin(domaine, eq(speciality.domaineId, domaine.id));

		return json(specialities);
	} catch (error) {
		console.error('Error fetching specialities:', error);
		return json({ error: 'Failed to fetch specialities' }, { status: 500 });
	}
};