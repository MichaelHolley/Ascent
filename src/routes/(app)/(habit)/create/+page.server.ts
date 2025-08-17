import { createHabit } from '$lib/server/habit';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		presetOptions: [
			{ title: 'Workout', description: 'Do at least 15 minutes of exercise a day' },
			{ title: 'Meditation', description: '5 Minutes of deep breathing' },
			{ title: 'Reading', description: 'Read at least 10 pages a day' },
			{ title: '10K Steps', description: 'Achieve 10K Steps a day' },
			{ title: 'Water', description: 'Drink at least 8 cups of water a day' },
			{ title: 'Sleep', description: 'Get 7 hours of sleep a night' },
			{
				title: 'Plan Your Day',
				description: 'Write down your priorities or goals for the day'
			},
			{
				title: 'Get Outside',
				description: 'Spend at least 15 minutes outdoors or in nature'
			},
			{
				title: 'Journaling',
				description: 'Write about your thoughts, ideas, or experiences'
			}
		]
	};
};

export const actions: Actions = {
	createHabit: async (event) => {
		const formData = await event.request.formData();
		const title = formData.get('title');
		const description = formData.get('description');

		if (!event.locals.user) {
			return redirect(303, '/');
		}

		const habit = await createHabit(title as string, event.locals.user.id, description as string);

		return redirect(303, `/${habit.id}`);
	}
};
