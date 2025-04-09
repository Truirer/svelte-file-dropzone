<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Dropzone from '$lib/components/Dropzone.svelte';
	import { fn } from '@storybook/test';
	let acceptedFiles: string[] = $state([]);
	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	const { Story } = defineMeta({
		title: 'Example',
		component: Dropzone,
		tags: ['autodocs'],
		argTypes: {
			accept: { control: 'object' },
			onFiledropped: { type: 'function' }
		},
		args: {
			onDragenter: fn(),
			onDragleave: fn(),
			onDragover: fn(),
			onDrop: fn(),
			onDropaccepted: fn(),
			onDroprejected: fn(),
			onFiledialogcancel: fn(),
			onFiledropped: fn()
		}
	});
</script>

{#snippet preview()}
	<ol style="display: flex;gap:10px;flex-direction:row">
		{#each acceptedFiles as item}
			<img width="100" height="100" src={item} />
		{/each}
	</ol>
{/snippet}
<!-- More on writing stories with args: https://storybook.js.org/docs/writing-stories/args -->
<Story
	name="Basic"
	args={{
		accept: ['image/png'],
		multiple: true,
		onDropaccepted: (e) => {
			acceptedFiles = e.acceptedFiles.map((file) => URL.createObjectURL(file));
		},
		children: preview
	}}
/>
