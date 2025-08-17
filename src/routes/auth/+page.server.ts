import * as auth from '$lib/server/auth';
import { createUser, findUser } from '$lib/server/user';
import { verify } from '@node-rs/argon2';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(303, '/');
	}
	return {};
};

export const actions: Actions = {
	login: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		const usernameValidation = validateUsername(username);
		if (!usernameValidation.valid) {
			return fail(400, { message: usernameValidation.error });
		}

		if (!validatePassword(password)) {
			return fail(400, { message: 'Invalid password' });
		}

		const existingUser = await findUser(username as string);

		if (!existingUser) {
			return fail(400, { message: 'Incorrect credentials' });
		}

		const validPassword = await verify(existingUser.passwordHash, password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		if (!validPassword) {
			return fail(400, { message: 'Incorrect credentials' });
		}

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, existingUser.id);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		return redirect(303, '/');
	},
	register: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		const usernameValidation = validateUsername(username);
		if (!usernameValidation.valid) {
			return fail(400, { message: usernameValidation.error });
		}

		if (!validatePassword(password)) {
			return fail(400, { message: 'Invalid password' });
		}

		try {
			const user = await createUser(username as string, password as string);

			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, user.id);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} catch {
			return fail(500, { message: 'An error has occurred' });
		}
		return redirect(303, '/');
	}
};

function validateUsername(username: unknown): { valid: boolean; error?: string } {
	if (typeof username !== 'string') {
		return { valid: false, error: 'Username must be a string' };
	}
	if (username.length < 3) {
		return { valid: false, error: 'Username must be at least 3 characters long' };
	}
	if (username.length > 31) {
		return { valid: false, error: 'Username must be at most 31 characters long' };
	}
	if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
		return {
			valid: false,
			error: 'Username can only contain letters, numbers, underscores and hyphens'
		};
	}
	return { valid: true };
}

function validatePassword(password: unknown): password is string {
	return typeof password === 'string' && password.length >= 6 && password.length <= 255;
}
