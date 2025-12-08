import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { verifyPassword, getUserByUsername, generateSessionToken, createSession, setSessionTokenCookie } from '$lib/server/auth';

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username') as string;
		const password = formData.get('password') as string;

		// Validate input
		if (!username || !password) {
			return fail(400, { error: 'Username and password are required' });
		}

		// Get user from database
		const user = await getUserByUsername(username);
		if (!user) {
			return fail(400, { error: 'Invalid username or password' });
		}

		// Verify password
		const validPassword = await verifyPassword(password, user.password);
		if (!validPassword) {
			return fail(400, { error: 'Invalid username or password' });
		}

		// Create session
		const token = generateSessionToken();
		await createSession(token, user.id);

		// Set session cookie
		const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
		setSessionTokenCookie(event, token, expiresAt);

		// Redirect to home page after successful login
		throw redirect(302, '/');
	}
};