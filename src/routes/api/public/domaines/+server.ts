import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { domaine } from '$lib/server/db/schema';

export const GET: RequestHandler = async () => {
	try {
		const domaines = await db.select().from(domaine);
		return json(domaines.map(dom => ({ domaine: dom }))); // Format to match admin API
	} catch (error) {
		console.error('Error fetching domaines:', error);
		return json({ error: 'Failed to fetch domaines' }, { status: 500 });
	}
};