<script lang="ts">
	import Dropzone from '$lib/components/Dropzone.svelte';
	import type { FileDropResult } from '$lib/components/types';

	let files = $state({
		accepted: [] as any[],
		rejected: [] as any[]
	});

	function handleFilesSelect(e: FileDropResult) {
		console.log(e);
		const { acceptedFiles, fileRejections } = e;
		files.accepted = [...files.accepted, ...acceptedFiles];
		files.rejected = [...files.rejected, ...fileRejections];
	}

	let disabled = $state(false);
	let dropAddedStyles = $derived(
		disabled ? 'border-color: lightgray; cursor: not-allowed;' : 'border-color: blue'
	);
</script>

<section>
	<label>Disable dropzone <input type="checkbox" bind:checked={disabled} /></label>
	<Dropzone {disabled} onDrop={handleFilesSelect} containerStyles={dropAddedStyles} />

	<ol>
		{#each files.accepted as item}
			<li>{item.name}</li>
		{/each}
	</ol>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}
</style>
