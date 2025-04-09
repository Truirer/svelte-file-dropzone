<script lang="ts">
	import Dropzone from '$lib/components/Dropzone.svelte';

	let files = $state({
		accepted: [] as any[],
		rejected: [] as any[]
	});

	function handleFilesSelect(e: any) {
		const { acceptedFiles, fileRejections } = e.detail;
		files.accepted = [...files.accepted, ...acceptedFiles];
		files.rejected = [...files.rejected, ...fileRejections];
	}

	function clickToUpload() {
		document.getElementById('xyz')!.click();
	}
</script>

<section>
	<button onclick={clickToUpload}>Click to upload</button>
	<Dropzone on:drop={handleFilesSelect} />

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
