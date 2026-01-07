import { eq, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { establishment } from './schema';

/**
 * Create a new establishment
 * @param name - The name of the establishment
 * @param name_ar - The Arabic name of the establishment
 * @returns The created establishment
 */
export async function createEstablishment(name: string, name_ar: string) {
	const [newEstablishment] = await db
		.insert(establishment)
		.values({ name, name_ar })
		.returning();
	
	return newEstablishment;
}

/**
 * Get all establishments
 * @returns Array of all establishments
 */
export async function getAllEstablishments() {
	return await db.select().from(establishment);
}

/**
 * Get establishment by ID
 * @param id - The ID of the establishment
 * @returns The establishment or null if not found
 */
export async function getEstablishmentById(id: number) {
	const result = await db.select().from(establishment).where(eq(establishment.id, id));
	return result[0] || null;
}

/**
 * Update an establishment
 * @param id - The ID of the establishment to update
 * @param name - The new name of the establishment
 * @param name_ar - The new Arabic name of the establishment
 * @returns The updated establishment
 */
export async function updateEstablishment(id: number, name: string, name_ar: string) {
	const [updatedEstablishment] = await db
		.update(establishment)
		.set({ name, name_ar })
		.where(eq(establishment.id, id))
		.returning();
	
	return updatedEstablishment;
}

/**
 * Delete an establishment
 * @param id - The ID of the establishment to delete
 * @returns Boolean indicating success
 */
export async function deleteEstablishment(id: number) {
	const result = await db.delete(establishment).where(eq(establishment.id, id)).returning();
	return result.length > 0;
}