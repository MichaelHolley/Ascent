import { completeGoal, deleteGoal, nextStage, previousStage, updateGoal } from '$lib/server/goal';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	nextStage: async (event) => {
		if (!event.locals.user) {
			return redirect(303, '/');
		}

		await nextStage(event.params.id, event.locals.user.id);
	},
	previousStage: async (event) => {
		if (!event.locals.user) {
			return redirect(303, '/');
		}

		await previousStage(event.params.id, event.locals.user.id);
	},
	delete: async (event) => {
		if (!event.locals.user) {
			return redirect(303, '/');
		}

		await deleteGoal(event.params.id, event.locals.user.id);
	},
	complete: async (event) => {
		if (!event.locals.user) {
			return redirect(303, '/');
		}

		await completeGoal(event.params.id, event.locals.user.id);
	},
	update: async (event) => {
		const formData = await event.request.formData();
		const title = formData.get('title');
		const description = formData.get('description');
		const target = parseInt(formData.get('target') as string);

		if (!event.locals.user) {
			return redirect(303, '/');
		}

		return await updateGoal(
			event.params.id,
			event.locals.user.id,
			title as string,
			description as string,
			target
		);
	}
};
