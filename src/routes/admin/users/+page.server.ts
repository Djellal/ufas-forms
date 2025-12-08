import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { hashPassword, createUser } from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { isFacAdminOrStudent } from '$lib/server/authorization';

export const actions: Actions = {
	default: async (event) => {
		// Check if the user is an admin
		if (!event.locals.user || event.locals.user.role !== 'admin') {
			throw redirect(302, '/login');
		}
		
		const formData = await event.request.formData();
		const username = formData.get('username') as string;
		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirmPassword') as string;
		const role = formData.get('role') as string;
		
		// Validate input
		if (!username || !password || !confirmPassword) {
			return fail(400, { error: 'All fields are required' });
		}
		
		if (password !== confirmPassword) {
			return fail(400, { error: 'Passwords do not match' });
		}
		
		if (password.length < 6) {
			return fail(400, { error: 'Password must be at least 6 characters long' });
		}
		
		// Validate role
		const validRoles = ['student', 'facadmin', 'admin'];
		if (!validRoles.includes(role)) {
			return fail(400, { error: 'Invalid role selected' });
		}
		
		// Check if user already exists
		const existingUser = await db.select()
			.from(schema.user)
			.where(eq(schema.user.username, username))
			.limit(1);
		
		if (existingUser.length > 0) {
			return fail(400, { error: 'Username already taken' });
		}
		
		try {
			// Create the new user
			const hashedPassword = await hashPassword(password);
			const id = crypto.randomUUID();
			
			await db.insert(schema.user).values({
				id,
				username,
				password: hashedPassword,
				role
			});
			
			return { success: true };
		} catch (error) {
			console.error('Error creating user:', error);
			return fail(500, { error: 'An error occurred while creating the user' });
		}
	}
};