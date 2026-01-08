import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { getAllEstablishments } from '$lib/server/db/establishment';
import { db } from '$lib/server/db';
import { establishment } from '$lib/server/db/schema';

export const GET: RequestHandler = async () => {
	try {
		const establishments = await getAllEstablishments();
		return json(establishments.map(est => ({ establishment: est }))); // Format to match admin API
	} catch (error) {
		console.error('Error fetching establishments:', error);
		return json({ error: 'Failed to fetch establishments' }, { status: 500 });
	}
};