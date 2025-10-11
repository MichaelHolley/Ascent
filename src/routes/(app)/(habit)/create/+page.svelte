<script lang="ts">
	import { enhance } from '$app/forms';
	import { defaultHandleSubmit } from '$lib/utils/form';

	const { data } = $props();

	let title = $state('');
	let description = $state('');
	let presetModal: HTMLDialogElement;

	function selectPreset(preset: { title: string; description?: string }) {
		title = preset.title;

		if (preset.description) {
			description = preset.description;
		}

		presetModal.close();
	}
</script>

<div class="max-w-md">
	<div class="mb-4 flex flex-row items-end justify-between gap-3">
		<h3 class="text-3xl">Create Habit</h3>
		<p>
			or <button
				class="link link-secondary"
				onclick={() => {
					presetModal.showModal();
				}}>use a Preset</button
			>
		</p>
	</div>
	<form
		method="POST"
		action="?/createHabit"
		use:enhance={defaultHandleSubmit}
		class="flex flex-col items-end gap-3"
	>
		<fieldset class="fieldset w-full">
			<legend class="fieldset-legend">Title</legend>
			<input
				type="text"
				class="input w-full"
				name="title"
				bind:value={title}
				required
				placeholder="Enter title..."
			/>
		</fieldset>
		<fieldset class="fieldset w-full">
			<legend class="fieldset-legend">Description</legend>
			<input
				type="text"
				class="input w-full"
				name="description"
				bind:value={description}
				placeholder="Enter description..."
			/>
			<p class="fieldset-label">Optional</p>
		</fieldset>
		<button class="btn btn-primary w-fit">+ Create</button>
	</form>
</div>

<dialog id="preset_modal" bind:this={presetModal} class="modal modal-bottom sm:modal-middle">
	<div class="modal-box">
		<form method="dialog">
			<button class="btn btn-circle btn-ghost btn-sm absolute top-2 right-2">✕</button>
		</form>
		<h3 class="text-lg font-bold">Select a Preset</h3>
		<p class="mb-3 py-1">Choose a preset to get started quickly and customize later.</p>
		<div class="-mr-4 flex max-h-80 grow flex-col gap-1 self-stretch overflow-y-scroll pr-4">
			{#each data.presetOptions as preset}
				<button
					class="border-base-300 bg-base-200 hover:bg-base-300 rounded-box border px-4 py-2 text-left hover:cursor-pointer"
					onclick={() => selectPreset(preset)}
				>
					<div>{preset.title}</div>
					{#if preset.description}
						<div class="text-base-content/60 text-xs">{preset.description}</div>
					{/if}
				</button>
			{/each}
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
