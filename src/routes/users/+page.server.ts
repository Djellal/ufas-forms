import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
	// Check if user is authenticated
	if (!event.locals.user) {
		throw redirect(302, '/login');
	}

	// Check if user has admin role
	if (event.locals.user.role !== 'admin') {
		throw error(403, 'Access denied. Admin role required.');
	}

	// Fetch all users from the database
	const users = await db.select({
		id: user.id,
		username: user.username,
		role: user.role
	}).from(user);

	return {
		users
	};
};

export const actions: Actions = {
	// Action to update user role (only available to admins)
	updateRole: async (event) => {
		// Check if user is authenticated and has admin role
		if (!event.locals.user || event.locals.user.role !== 'admin') {
			throw error(403, 'Access denied. Admin role required.');
		}

		const formData = await event.request.formData();
		const userId = formData.get('userId') as string;
		const newRole = formData.get('role') as string;

		// Validate role
		if (!['admin', 'facadmin', 'student'].includes(newRole)) {
			throw error(400, 'Invalid role');
		}

		// Update the user's role in the database
		await db.update(user).set({ role: newRole }).where(eq(user.id, userId));

		return { success: true };
	}
};