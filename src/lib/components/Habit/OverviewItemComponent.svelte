<script lang="ts">
	import { enhance } from '$app/forms';
	import Icon from '@iconify/svelte';
	import dayjs from 'dayjs';
	import CardComponent from '../CardComponent.svelte';
	import { ICON_MAP } from '../icons';
	import HabitActivityHistory from './HistoryComponent.svelte';
	import { defaultHandleSubmit } from '$lib/utils/form';

	const { habit } = $props();
	const todaySelected = $derived(habit.dates.includes(dayjs().format('YYYY-MM-DD')));
</script>

<CardComponent class="group flex flex-col p-4">
	<div class="flex flex-row justify-between">
		<a href="/{habit.id}">
			<span class="link-hover link group-hover:text-secondary text-lg">{habit.title}</span>
		</a>
		<form method="POST" action="/{habit.id}?/addToday" use:enhance={defaultHandleSubmit}>
			<button
				class="btn btn-outline btn-secondary btn-xs px-0.5"
				title="Add Today"
				disabled={todaySelected}
			>
				<Icon icon={todaySelected ? ICON_MAP.check : ICON_MAP.plus} class="text-lg" />
			</button>
		</form>
	</div>
	<a href="/{habit.id}">
		<p class="text-base-content/60 mb-1 line-clamp-2 text-xs">{habit.description}</p>
		<HabitActivityHistory dates={habit.dates} />
	</a>
</CardComponent>
