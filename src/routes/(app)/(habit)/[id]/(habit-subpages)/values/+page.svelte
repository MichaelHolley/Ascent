<script lang="ts">
	import { enhance } from '$app/forms';
	import { ICON_MAP } from '$lib/components/icons';
	import NavigateBackButtonComponent from '$lib/components/NavigateBackButtonComponent.svelte';
	import { downloadBlob } from '$lib/utils/file';
	import { defaultHandleDeleteSubmit } from '$lib/utils/form';
	import Icon from '@iconify/svelte';
	import dayjs from 'dayjs';

	const { data, params } = $props();

	let currentMonth = $state<dayjs.Dayjs>(dayjs().startOf('month'));

	const displayedDates = $derived.by<dayjs.Dayjs[]>(() => {
		return data.habit.dates
			.map((date: string) => dayjs(date))
			.filter((date: dayjs.Dayjs) => date.isSame(currentMonth, 'month'))
			.sort((a: dayjs.Dayjs, b: dayjs.Dayjs) => b.diff(a));
	});

	const previousMonth = () => {
		currentMonth = currentMonth.subtract(1, 'month');
	};

	const nextMonth = () => {
		currentMonth = currentMonth.add(1, 'month');
	};

	const downloadValues = async () => {
		if (!data.habit?.id) {
			return;
		}

		const resp = await fetch(`/${data.habit.id}/values/export`, { method: 'GET' });
		const blob = await resp.blob();

		const filename = `${data.habit.title}_${data.habit.id}_values.json`;
		downloadBlob(blob, filename);
	};
</script>

<div class="mb-3">
	<NavigateBackButtonComponent backUrl="/{params.id}" />
</div>

<div class="mb-3 flex flex-row items-center justify-between gap-4">
	<h2 class="text-3xl">{data.habit?.title}</h2>
	<div class="flex flex-row gap-2">
		<button class="btn btn-outline btn-sm btn-secondary" onclick={downloadValues}>
			<Icon icon={ICON_MAP.exportFile} class="text-base" />Export
		</button>
		<a href="values/import" class="btn btn-secondary btn-sm">
			<Icon icon={ICON_MAP.importFile} class="text-base" />Import
		</a>
	</div>
</div>

<div class="my-4 max-w-lg overflow-x-auto">
	<div class="flex flex-row justify-between">
		<button class="btn btn-soft btn-accent btn-xs" onclick={previousMonth}>Previous</button>
		<p>{currentMonth.format('MMMM YYYY')}</p>
		<button class="btn btn-soft btn-accent btn-xs" onclick={nextMonth}>Next</button>
	</div>

	<table class="table-xs mt-6 table table-auto">
		<thead>
			<tr>
				<th></th>
				<th>Date</th>
				<th>Weekday</th>
				<th></th>
			</tr>
		</thead>
		{#each displayedDates as date, i}
			<tbody>
				<tr>
					<td class="text-base-content/25">{i + 1}</td>
					<td>{date.format('DD MMM YYYY')}</td>
					<td>{date.format('dddd')}</td>
					<td class="pr-0">
						<form
							method="POST"
							action="?/delete"
							use:enhance={defaultHandleDeleteSubmit}
							class="flex flex-row justify-end"
						>
							<input type="hidden" name="date" value={date.format('YYYY-MM-DD')} />
							<button class="btn btn-error btn-xs" type="submit">Delete</button>
						</form>
					</td>
				</tr>
			</tbody>
		{/each}
	</table>
</div>
