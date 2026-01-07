import { eq, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { domaine } from './schema';

export type DomaineLevel = 'licence' | 'master1' | 'master2';

/**
 * Create a new domaine
 * @param name - The name of the domaine
 * @param level - The level of the domaine (licence, master1, master2)
 * @returns The created domaine
 */
export async function createDomaine(name: string, level: DomaineLevel) {
	const [newDomaine] = await db
		.insert(domaine)
		.values({ name, level })
		.returning();
	
	return newDomaine;
}

/**
 * Get all domaines
 * @returns Array of all domaines
 */
export async function getAllDomaines() {
	return await db.select().from(domaine);
}

/**
 * Get domaine by ID
 * @param id - The ID of the domaine
 * @returns The domaine or null if not found
 */
export async function getDomaineById(id: number) {
	const result = await db.select().from(domaine).where(eq(domaine.id, id));
	return result[0] || null;
}

/**
 * Update a domaine
 * @param id - The ID of the domaine to update
 * @param name - The new name of the domaine
 * @param level - The new level of the domaine
 * @returns The updated domaine
 */
export async function updateDomaine(id: number, name: string, level: DomaineLevel) {
	const [updatedDomaine] = await db
		.update(domaine)
		.set({ name, level })
		.where(eq(domaine.id, id))
		.returning();
	
	return updatedDomaine;
}

/**
 * Delete a domaine
 * @param id - The ID of the domaine to delete
 * @returns Boolean indicating success
 */
export async function deleteDomaine(id: number) {
	const result = await db.delete(domaine).where(eq(domaine.id, id)).returning();
	return result.length > 0;
}