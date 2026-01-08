import { eq, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { speciality, domaine } from './schema';

/**
 * Create a new speciality
 * @param name - The name of the speciality
 * @param domaineId - The ID of the associated domaine
 * @returns The created speciality
 */
export async function createSpeciality(name: string, domaineId: number) {
	const [newSpeciality] = await db
		.insert(speciality)
		.values({ name, domaineId })
		.returning();

	return newSpeciality;
}

/**
 * Get all specialities with their associated domaines
 * @returns Array of all specialities with domaine information
 */
export async function getAllSpecialities() {
	return await db
		.select({
			speciality: speciality,
			domaine: domaine
		})
		.from(speciality)
		.innerJoin(domaine, eq(speciality.domaineId, domaine.id));
}

/**
 * Get speciality by ID with associated domaine
 * @param id - The ID of the speciality
 * @returns The speciality with domaine information or null if not found
 */
export async function getSpecialityById(id: number) {
	const result = await db
		.select({
			speciality: speciality,
			domaine: domaine
		})
		.from(speciality)
		.innerJoin(domaine, eq(speciality.domaineId, domaine.id))
		.where(eq(speciality.id, id));

	return result[0] || null;
}

/**
 * Update a speciality
 * @param id - The ID of the speciality to update
 * @param name - The new name of the speciality
 * @param domaineId - The new ID of the associated domaine
 * @returns The updated speciality
 */
export async function updateSpeciality(id: number, name: string, domaineId: number) {
	const [updatedSpeciality] = await db
		.update(speciality)
		.set({ name, domaineId })
		.where(eq(speciality.id, id))
		.returning();

	return updatedSpeciality;
}

/**
 * Delete a speciality
 * @param id - The ID of the speciality to delete
 * @returns Boolean indicating success
 */
export async function deleteSpeciality(id: number) {
	const result = await db.delete(speciality).where(eq(speciality.id, id)).returning();
	return result.length > 0;
}