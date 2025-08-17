import { getHabitForUser, updateDates } from '$lib/server/habit';
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

	return { habit: { ...habit, dates: habit.dates.reverse() } };
};

export const actions: Actions = {
	delete: async (event) => {
		if (!event.locals.user) {
			return redirect(303, '/');
		}

		let habit = await getHabitForUser(event.params.id, event.locals.user.id);

		if (habit === null) {
			return redirect(303, '/');
		}

		const formData = await event.request.formData();
		const date = formData.get('date') as string;

		if (!date) {
			return redirect(303, `/${event.params.id}/values`);
		}

		if (habit && habit.dates && typeof habit.dates === 'object' && Array.isArray(habit.dates)) {
			const dates = habit.dates;
			const indexOfDate = dates.indexOf(date);

			if (indexOfDate !== -1) {
				dates.splice(indexOfDate, 1);
				habit = await updateDates(event.params.id, event.locals.user.id, dates);
			}
		}

		redirect(303, `/${event.params.id}/values`);
	}
};
