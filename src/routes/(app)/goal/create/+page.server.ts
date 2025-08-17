import { createGoal } from '$lib/server/goal';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import dayjs from 'dayjs';

export const load: PageServerLoad = async () => {
	return {
		presetOptions: [
			{
				title: 'Read 12 Books',
				description: 'Read at least 12 books in a year',
				target: 12
			},
			{
				title: 'Write 6 Blog Posts',
				description: 'Write at least 6 blog posts in a year',
				target: 6
			},
			{
				title: 'Run a marathon',
				description: 'Run a marathon in a year',
				target: 1
			},
			{
				title: `Weekly Chores - ${dayjs().format('YYYY')}`,
				description: 'Finish your weekly chores',
				target: 52
			},
			{
				title: 'Meditate 100 Times',
				description: 'Meditate at least 100 times this year',
				target: 100
			},
			{
				title: 'Cook 50 New Recipes',
				description: 'Try cooking 50 new recipes',
				target: 50
			},
			{
				title: 'Complete 12 Online Courses',
				description: 'Finish at least 12 online courses in a year',
				target: 12
			},
			{
				title: 'Do 365 Workouts',
				description: 'Exercise every day for a year',
				target: 365
			},
			{
				title: 'Write 200 Journal Entries',
				description: 'Write in your journal 200 times this year',
				target: 200
			}
		]
	};
};

export const actions: Actions = {
	createGoal: async (event) => {
		const formData = await event.request.formData();
		const title = formData.get('title');
		const description = formData.get('description');
		const target = parseInt(formData.get('target') as string);

		if (!event.locals.user) {
			return redirect(303, '/');
		}

		const goal = await createGoal(
			title as string,
			target,
			event.locals.user.id,
			description as string
		);

		return redirect(303, `/${goal.id}`);
	}
};
