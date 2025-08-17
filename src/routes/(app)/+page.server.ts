import * as auth from '$lib/server/auth';
import { getUserGoals } from '$lib/server/goal';
import { getUserHabits } from '$lib/server/habit';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(303, '/auth');
	}

	const habits = await getUserHabits(event.locals.user.id);
	const goals = await getUserGoals(event.locals.user.id);

	return { habits, goals };
};

export const actions: Actions = {
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		await auth.invalidateSession(event.locals.session.id);
		auth.deleteSessionTokenCookie(event);

		return redirect(303, '/auth');
	}
};
