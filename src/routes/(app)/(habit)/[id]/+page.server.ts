import { deleteHabit, getHabitForUser, updateDates } from '$lib/server/habit';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import dayjs from 'dayjs';

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
	addDate: async (event) => {
		const formData = await event.request.formData();
		const date = formData.get('date') as string;

		if (!event.locals.user) {
			return redirect(303, '/');
		}

		const habit = await getHabitForUser(event.params.id, event.locals.user.id);

		if (habit && habit.dates && typeof habit.dates === 'object' && Array.isArray(habit.dates)) {
			const dates = habit.dates;
			if (!dates.includes(date)) {
				dates.push(date);
			} else {
				return fail(400, { message: 'Date already exists' });
			}

			await updateDates(event.params.id, event.locals.user.id, dates);
		}
	},
	delete: async (event) => {
		if (!event.locals.user) {
			return redirect(303, '/');
		}

		await deleteHabit(event.params.id, event.locals.user.id);

		return redirect(303, `/`);
	},
	addToday: async (event) => {
		if (!event.locals.user) {
			return redirect(303, '/');
		}

		const today = dayjs();
		const habit = await getHabitForUser(event.params.id, event.locals.user.id);

		if (habit && habit.dates && typeof habit.dates === 'object' && Array.isArray(habit.dates)) {
			const dates = habit.dates;

			if (!dates.includes(today.format('YYYY-MM-DD'))) {
				dates.push(today.format('YYYY-MM-DD'));
			}

			await updateDates(event.params.id, event.locals.user.id, dates);
		}
	}
};
