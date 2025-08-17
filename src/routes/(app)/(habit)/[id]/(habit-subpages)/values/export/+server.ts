import { redirect } from '@sveltejs/kit';
import { getHabitForUser } from '$lib/server/habit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	if (!event.locals.user) {
		return redirect(303, '/');
	}

	const habit = await getHabitForUser(event.params.id, event.locals.user.id);

	if (habit === null) {
		return redirect(303, '/');
	}

	const dates = habit.dates || [];

	return new Response(JSON.stringify(dates), {
		headers: {
			'Content-Type': 'application/json',
			'Content-Disposition': `attachment; filename=${event.params.id}_values.json`
		}
	});
};
