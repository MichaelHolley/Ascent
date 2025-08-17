import { getHabitForUser, updateHabit } from '$lib/server/habit';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(303, '/');
	}

	const habit = await getHabitForUser(event.params.id, event.locals.user.id);

	if (habit === null) {
		return redirect(303, '/');
	}

	return { habit: habit };
};

export const actions: Actions = {
	updateHabit: async (event) => {
		const formData = await event.request.formData();
		const title = formData.get('title');
		const description = formData.get('description');

		if (!event.locals.user) {
			return redirect(303, '/');
		}

		const habit = await updateHabit(
			event.params.id,
			event.locals.user.id,
			title as string,
			description as string
		);

		return redirect(303, `/${habit.id}`);
	}
};
