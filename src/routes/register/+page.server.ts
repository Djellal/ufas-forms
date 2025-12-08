import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { getUserByUsername, createUser, generateSessionToken, createSession, setSessionTokenCookie } from '$lib/server/auth';

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username') as string;
		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirmPassword') as string;

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

		// Check if user already exists
		const existingUser = await getUserByUsername(username);
		if (existingUser) {
			return fail(400, { error: 'Username already taken' });
		}

		// Create new user with student role by default
		try {
			const user = await createUser(username, password);
			
			// Create session for the newly registered user
			const token = generateSessionToken();
			await createSession(token, user.id);

			// Set session cookie
			const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
			setSessionTokenCookie(event, token, expiresAt);

			// Redirect to home page after successful registration
			throw redirect(302, '/');
		} catch (error) {
			console.error('Registration error:', error);
			return fail(500, { error: 'An error occurred during registration' });
		}
	}
};