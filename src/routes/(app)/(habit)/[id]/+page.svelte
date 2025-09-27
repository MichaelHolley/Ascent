<script lang="ts">
	import { enhance } from '$app/forms';
	import CardComponent from '$lib/components/CardComponent.svelte';
	import DropDownComponent from '$lib/components/DropDownComponent.svelte';
	import EngagementComponent from '$lib/components/Habit/EngagementComponent.svelte';
	import HabitHistory from '$lib/components/Habit/HistoryComponent.svelte';
	import StatComponent from '$lib/components/Habit/StatComponent.svelte';
	import { ICON_MAP } from '$lib/components/icons';
	import NavigateBackButton from '$lib/components/NavigateBackButtonComponent.svelte';
	import {
		createFlashHandler,
		defaultHandleDeleteSubmit,
		defaultHandleSubmit
	} from '$lib/utils/form';
	import { getHabitStats, type StatItem } from '$lib/utils/stats';
	import Icon from '@iconify/svelte';
	import dayjs from 'dayjs';
	import type { PageData } from './$types';
	import { downloadBlob } from '$lib/utils/file';

	const { data } = $props<{ data: PageData }>();
	let deleteHabitModal: HTMLDialogElement | null;

	const today = dayjs().format('YYYY-MM-DD');

	let statsLoading = $state(true);
	let stats = $state<StatItem[]>([]);

	$effect(() => {
		if (data.habit.dates.length > 0) {
			getHabitStats(data.habit)
				.then((statsRes) => {
					stats = statsRes;
				})
				.finally(() => {
					statsLoading = false;
				});
		}
	});

	const todaySelected = $derived(data.habit.dates.includes(dayjs().format('YYYY-MM-DD')));

	const completionRate = $derived.by(() => {
		if (stats.length === 0) {
			return 0;
		}

		const completionStatValue = stats.find((stat) => stat.title === 'Completion Rate')?.value;
		if (!completionStatValue) {
			return 0;
		}

		if (typeof completionStatValue === 'string') {
			return parseFloat(completionStatValue.replace('%', '')) / 100;
		}

		if (typeof completionStatValue === 'number') {
			return completionStatValue / 100;
		}

		return 0;
	});

	let isFlashing = $state(false);
	const handleAddTodaySubmit = createFlashHandler(
		(value) => {
			isFlashing = value;
		},
		600,
		{
			successMessage: `${data.habit.title}: Today added`
		}
	);

	const exportHabit = async () => {
		if (!data.habit?.id) {
			return;
		}

		const resp = await fetch(`/${data.habit.id}/export`, { method: 'GET' });
		const blob = await resp.blob();

		const filename = `${data.habit.title}_${data.habit.id}.json`;
		downloadBlob(blob, filename);
	};
</script>

<div>
	<div class="mb-3"><NavigateBackButton backUrl="/" /></div>
	<div class="mb-1 grid gap-2" style="grid-template-columns: 1fr auto;">
		<div>
			<h2 class="text-3xl">{data.habit?.title}</h2>
		</div>
		<div class="items-center gap-x-3 text-right text-xs">
			<p class="text-2xs text-base-content/60 sm:text-xs">Modified at</p>
			<p>
				{dayjs(data.habit.updatedAt).format('DD MMM YYYY - HH:mm')}
			</p>
		</div>
	</div>
	<p class="text-base-content/60 text-xs">{data.habit?.description}</p>
</div>

<div class="mt-6 mb-4 flex flex-row flex-wrap justify-between gap-2">
	<div class="flex flex-row gap-2">
		<form
			method="POST"
			action="?/addToday"
			use:enhance={handleAddTodaySubmit}
			class="flex flex-col justify-start"
		>
			<button
				class="btn btn-secondary btn-xs gap-0 {isFlashing ? 'btn-success scale-110' : ''}"
				title="Add Today"
				disabled={data.habit.dates.includes(dayjs().format('YYYY-MM-DD'))}
			>
				<Icon icon={todaySelected ? ICON_MAP.check : ICON_MAP.plus} class="me-1 text-base" />
				Today
			</button>
		</form>
		<a href="/{data.habit.id}/values" class="btn btn-outline btn-accent btn-xs gap-1">
			<Icon icon={ICON_MAP.eye} class="text-base" />
			Show Values
		</a>
	</div>
	<DropDownComponent class="dropdown-end">
		<li>
			<button class="btn btn-ghost btn-sm btn-block" onclick={exportHabit}>
				<div class="flex w-full flex-row items-center gap-1 text-start">
					<Icon icon={ICON_MAP.exportFile} class="text-base" />
					Export
				</div>
			</button>
		</li>
		<li>
			<a href="/{data.habit.id}/edit" class="btn btn-ghost btn-sm btn-block">
				<div class="flex w-full flex-row items-center gap-1 text-start">
					<Icon icon={ICON_MAP.edit} class="text-base" />
					Edit
				</div>
			</a>
		</li>
		<li>
			<button class="btn btn-ghost btn-sm btn-block" onclick={() => deleteHabitModal?.showModal()}>
				<div class="flex w-full flex-row items-center gap-1 text-start">
					<Icon icon={ICON_MAP.delete} class="text-base" />
					Delete
				</div>
			</button>
		</li>
	</DropDownComponent>
</div>

<HabitHistory dates={data.habit?.dates} bubbleDelay={2} />

<div class="my-6 mt-3 flex flex-row flex-wrap items-center justify-end gap-8">
	<form
		method="POST"
		action="?/addDate"
		use:enhance={defaultHandleSubmit}
		class="flex flex-row items-end gap-2"
	>
		<div class="join">
			<label class="input input-sm join-item w-full">
				<span class="label">Date</span>
				<input type="date" name="date" max={today} required />
			</label>
			<button class="btn btn-sm btn-primary join-item gap-0">
				<Icon icon={ICON_MAP.plus} class="text-base" />
				Date
			</button>
		</div>
	</form>
</div>

{#if data.habit.dates.length > 0 && !!stats && stats.length > 0}
	<CardComponent class="p-4">
		<div class="flex flex-row flex-wrap items-start justify-center gap-4">
			{#each stats as stat}
				<StatComponent
					title={stat.title}
					description={stat.description}
					value={stat.value}
					trend={stat.trend}
					loading={statsLoading}
				/>
			{/each}
			<StatComponent
				title="Engagement"
				description="based on completion-rate"
				loading={statsLoading}
			>
				<EngagementComponent {completionRate} />
			</StatComponent>
		</div>
	</CardComponent>
{/if}

<dialog
	id="delete_habit_modal"
	bind:this={deleteHabitModal}
	class="modal modal-bottom sm:modal-middle"
>
	<div class="modal-box">
		<form method="dialog">
			<button class="btn btn-circle btn-ghost btn-sm absolute top-2 right-2">✕</button>
		</form>
		<h3 class="text-lg font-bold">Confirmation</h3>
		<p class="py-4">
			Are you sure you want to delete the habit <span class="italic">{data.habit.title}</span>?
		</p>
		<p>This action can not be undone.</p>
		<div class="modal-action">
			<form method="POST" action="?/delete" use:enhance={defaultHandleDeleteSubmit}>
				<button class="btn btn-error">Delete</button>
			</form>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
