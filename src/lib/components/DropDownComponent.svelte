<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { Snippet } from 'svelte';
	import { ICON_MAP } from './icons';

	const { children, class: className } = $props<{ children: Snippet; class?: string }>();
	const id = Math.random().toString(36).substring(2, 15);

	const popoverId = `popover-${id}`;
</script>

<button
	class="btn btn-xs px-1"
	aria-label="Options"
	style="anchor-name:--anchor-{id}"
	popovertarget={popoverId}
>
	<Icon icon={ICON_MAP.more} class="text-xl" />
</button>

<ul
	id={popoverId}
	class="menu dropdown menu-sm rounded-box bg-base-100 border-base-300 w-56 gap-1 border {className}"
	style="position-anchor:--anchor-{id}"
	popover
>
	{@render children()}
</ul>
