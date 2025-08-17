import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { getHabitForUser, updateDates } from '$lib/server/habit';

export const actions: Actions = {
	import: async (event) => {
		if (!event.locals.user) {
			return redirect(303, '/');
		}

		const habit = await getHabitForUser(event.params.id, event.locals.user.id);

		if (habit === null) {
			return redirect(303, '/');
		}

		const formData = await event.request.formData();

		const file = formData.get('valuesFile') as File | null;
		if (!file) {
			return redirect(303, `/${event.params.id}/values`);
		}

		const fileContent = await file.text();
		const parsed = JSON.parse(fileContent);

		const uniqueDates = [...new Set([...habit.dates, ...parsed])];

		await updateDates(event.params.id, event.locals.user.id, uniqueDates);

		return redirect(303, `/${event.params.id}/values`);
	}
};
