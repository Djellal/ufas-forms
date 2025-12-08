import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { invalidateSession, sessionCookieName, deleteSessionTokenCookie, validateSessionToken } from '$lib/server/auth';

export async function POST(event: RequestEvent) {
	// Get the session token from the cookie
	const sessionToken = event.cookies.get(sessionCookieName);

	if (sessionToken) {
		// Validate the token to get the session ID
		const { session } = await validateSessionToken(sessionToken);
		if (session) {
			// Invalidate the session in the database
			await invalidateSession(session.id);
		}
	}

	// Delete the session cookie
	deleteSessionTokenCookie(event);

	// Redirect to the home page after logout
	throw redirect(302, '/');
}