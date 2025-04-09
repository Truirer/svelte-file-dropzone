<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import Dropzone from '$lib/components/Dropzone.svelte';
	import type { FileDropResult } from '$lib/components/types';

	let files: { name: string }[] = $state([]);

	function handleFilesSelect(e: FileDropResult) {
		const { acceptedFiles } = e;
		files = [...acceptedFiles];
	}
</script>

<form method="POST" action="?/postFiles" use:enhance enctype="multipart/form-data">
	<Dropzone onDrop={handleFilesSelect} name="files" />

	<button>Go</button>
</form>

Files about to upload:
<ul>
	{#each files as file}
		<li>{file.name}</li>
	{/each}
</ul>

<hr />

Files posted to form action:
<ul>
	{#each $page.form?.files ?? [] as file}
		<li>{file}</li>
	{/each}
</ul>
