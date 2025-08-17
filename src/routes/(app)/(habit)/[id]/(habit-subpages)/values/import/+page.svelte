<script lang="ts">
	import { enhance } from '$app/forms';
	import NavigateBackButtonComponent from '$lib/components/NavigateBackButtonComponent.svelte';
	import { defaultHandleSubmit } from '$lib/utils/form';

	const { params } = $props();

	let files = $state<FileList | null | undefined>(null);

	const noFileSelected = $derived(!files || files.length === 0);
</script>

<div class="mb-3">
	<NavigateBackButtonComponent backUrl="/{params.id}/values" />
</div>

<div class="mb-3 flex flex-row items-center justify-start gap-4">
	<h2 class="text-3xl">Import Values</h2>
</div>

<div class="my-4 max-w-lg overflow-x-auto">
	<form
		method="POST"
		action="?/import"
		use:enhance={defaultHandleSubmit}
		enctype="multipart/form-data"
	>
		<div class="flex flex-row items-center gap-2">
			<input
				type="file"
				bind:files
				class="file-input file-input-sm"
				name="valuesFile"
				accept=".json"
				required
			/>
			<button class="btn btn-secondary btn-sm" type="submit" disabled={noFileSelected}
				>Upload</button
			>
		</div>
		{#if !noFileSelected}
			<p class="text-success my-1 text-xs">File uploaded successfully</p>

			<!-- {#if files!.length === 1}
				<div>
					{#await files![0].text()}
						<p class="mt-4">...Loading file content</p>
					{:then text}
						<div>
							{#await JSON.parse(text)}
								<p class="mt-4">... Parsing</p>
							{:then parsed}
								<p class="text-success mb-1 text-xs">
									Parsed {Object.entries(parsed).length} Dates
								</p>
							{/await}
						</div>
					{/await}
				</div>
			{/if} -->
		{/if}
	</form>
</div>
