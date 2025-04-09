<script lang="ts">
	import { fromEvent } from 'file-selector';
	import {
		fileAccepted,
		fileMatchSize,
		isEvtWithFiles,
		isIeOrEdge,
		isPropagationStopped,
		TOO_MANY_FILES_REJECTION
	} from '../utils/index';
	import { onDestroy, createEventDispatcher } from 'svelte';
	import type { DropzoneProps, DropzoneStateProps, RejectedFile } from './types';
	//props
	/**
	 * Set accepted file types.
	 * See https://github.com/okonet/attr-accept for more information.
	 */
	/**
	 * @type {string | Array<string>}
	 */

	let {
		accept,
		disabled = false,
		getFilesFromEvent = fromEvent as (event: Event) => Promise<File[]>,
		maxSize = Infinity,
		minSize = 0,
		multiple = true,
		preventDropOnDocument = true,
		noClick = false,
		noKeyboard = false,
		noDrag = false,
		noDragEventsBubbling = false,
		containerClasses = '',
		containerStyles = '',
		disableDefaultStyles = false,
		name = '',
		inputElement,
		required = false,
		children
	}: DropzoneProps = $props();
	let dragTargetsRef: HTMLElement[] = $state([]);

	const dispatch = createEventDispatcher();

	//state

	let dropzoneState: DropzoneStateProps = $state({
		isFocused: false,
		isFileDialogActive: false,
		isDragActive: false,
		isDragAccept: false,
		isDragReject: false,
		draggedFiles: [],
		acceptedFiles: [],
		fileRejections: []
	});

	let rootRef: HTMLElement | null = $state(null);

	function resetState() {
		dropzoneState.isFileDialogActive = false;
		dropzoneState.isDragActive = false;
		dropzoneState.draggedFiles = [];
		dropzoneState.acceptedFiles = [];
		dropzoneState.fileRejections = [];
	}

	// Fn for opening the file dialog programmatically
	function openFileDialog() {
		if (inputElement) {
			dropzoneState.isFileDialogActive = true;
			inputElement.click();
		}
	}

	// Cb to open the file dialog when SPACE/ENTER occurs on the dropzone
	function onKeyDownCb(event: KeyboardEvent) {
		const target = event.target as HTMLElement;
		// Ignore keyboard events bubbling up the DOM tree
		if (!rootRef?.isEqualNode(target)) {
			return;
		}

		if (event.keyCode === 32 || event.keyCode === 13) {
			event.preventDefault();
			openFileDialog();
		}
	}

	// Update focus state for the dropzone
	function onFocusCb() {
		dropzoneState.isFocused = true;
	}
	function onBlurCb() {
		dropzoneState.isFocused = false;
	}

	// Cb to open the file dialog when click occurs on the dropzone
	function onClickCb() {
		if (noClick) {
			return;
		}

		// In IE11/Edge the file-browser dialog is blocking, therefore, use setTimeout()
		// to ensure React can handle state changes
		// See: https://github.com/react-dropzone/react-dropzone/issues/450
		if (isIeOrEdge()) {
			setTimeout(openFileDialog, 0);
		} else {
			openFileDialog();
		}
	}

	function onDragEnterCb(event: DragEvent) {
		event.preventDefault();
		stopPropagation(event);
		const target = event.target as HTMLElement;
		dragTargetsRef = [...dragTargetsRef, target];

		if (isEvtWithFiles(event)) {
			Promise.resolve(getFilesFromEvent(event) as Promise<File[]>).then((draggedFiles) => {
				if (isPropagationStopped(event) && !noDragEventsBubbling) {
					return;
				}

				dropzoneState.draggedFiles = draggedFiles;
				dropzoneState.isDragActive = true;

				dispatch('dragenter', {
					dragEvent: event
				});
			});
		}
	}

	function onDragOverCb(event: DragEvent) {
		event.preventDefault();
		stopPropagation(event);

		if (event.dataTransfer) {
			try {
				event.dataTransfer.dropEffect = 'copy';
			} catch {} /* eslint-disable-line no-empty */
		}

		if (isEvtWithFiles(event)) {
			dispatch('dragover', {
				dragEvent: event
			});
		}

		return false;
	}

	function onDragLeaveCb(event: DragEvent) {
		event.preventDefault();
		stopPropagation(event);

		// Only deactivate once the dropzone and all children have been left
		const targets = dragTargetsRef.filter((target) => rootRef && rootRef.contains(target));
		// Make sure to remove a target present multiple times only once
		// (Firefox may fire dragenter/dragleave multiple times on the same element)
		const target = event.target as HTMLElement;
		const targetIdx = targets.indexOf(target);
		if (targetIdx !== -1) {
			targets.splice(targetIdx, 1);
		}
		dragTargetsRef = targets;
		if (targets.length > 0) {
			return;
		}

		dropzoneState.isDragActive = false;
		dropzoneState.draggedFiles = [];

		if (isEvtWithFiles(event)) {
			dispatch('dragleave', {
				dragEvent: event
			});
		}
	}

	function onDropCb(event: (Event & { currentTarget: HTMLInputElement }) | DragEvent) {
		event?.preventDefault();
		stopPropagation(event);

		dragTargetsRef = [];

		if (isEvtWithFiles(event)) {
			dispatch('filedropped', {
				event
			});

			Promise.resolve(getFilesFromEvent(event) as Promise<File[]>).then((files) => {
				if (isPropagationStopped(event) && !noDragEventsBubbling) {
					return;
				}
				const acceptedFiles: File[] = [];
				const fileRejections: RejectedFile[] = [];

				files.forEach((file) => {
					const [accepted, acceptError] = fileAccepted(file, accept);
					const [sizeMatch, sizeError] = fileMatchSize(file, minSize, maxSize);
					if (accepted && sizeMatch) {
						acceptedFiles.push(file);
					} else {
						const errors = [acceptError, sizeError].filter((e) => e);
						fileRejections.push({ file, errors });
					}
				});

				if (!multiple && acceptedFiles.length > 1) {
					// Reject everything and empty accepted files
					acceptedFiles.forEach((file) => {
						fileRejections.push({ file, errors: [TOO_MANY_FILES_REJECTION] });
					});
					acceptedFiles.splice(0);
				}

				// Files dropped keep input in sync
				if ('dataTransfer' in event && event.dataTransfer && inputElement) {
					inputElement.files = event.dataTransfer.files;
				}

				dropzoneState.acceptedFiles = acceptedFiles;
				dropzoneState.fileRejections = fileRejections;

				dispatch('drop', {
					acceptedFiles,
					fileRejections,
					event
				});

				if (fileRejections.length > 0) {
					dispatch('droprejected', {
						fileRejections,
						event
					});
				}

				if (acceptedFiles.length > 0) {
					dispatch('dropaccepted', {
						acceptedFiles,
						event
					});
				}
			});
		}
		resetState();
	}

	let composeHandler = $derived(<T extends Event>(fn: (event: T) => void) =>
		disabled ? null : fn
	);
	let composeKeyboardHandler = $derived(<T extends Event>(fn: (event: T) => void) =>
		noKeyboard ? null : composeHandler(fn)
	);
	let composeDragHandler = $derived((fn: (event: DragEvent) => void) =>
		noDrag ? null : composeHandler(fn)
	);

	let defaultPlaceholderString = $derived(
		multiple
			? "Drag 'n' drop some files here, or click to select files"
			: "Drag 'n' drop a file here, or click to select a file"
	);

	function stopPropagation(event: Event) {
		if (noDragEventsBubbling) {
			event.stopPropagation();
		}
	}

	// allow the entire document to be a drag target
	function onDocumentDragOver(event: DragEvent) {
		if (preventDropOnDocument) {
			event.preventDefault();
		}
	}

	function onDocumentDrop(event: DragEvent) {
		const target = event.target as HTMLElement;
		if (!preventDropOnDocument) {
			return;
		}
		if (rootRef && rootRef.contains(target)) {
			// If we intercepted an event for our instance, let it propagate down to the instance's onDrop handler
			return;
		}
		event.preventDefault();
		dragTargetsRef = [];
	}

	// Update file dialog active state when the window is focused on
	function onWindowFocus() {
		// Execute the timeout only if the file dialog is opened in the browser
		if (dropzoneState.isFileDialogActive) {
			setTimeout(() => {
				if (inputElement) {
					const { files } = inputElement;

					if (!files?.length) {
						dropzoneState.isFileDialogActive = false;
						dispatch('filedialogcancel');
					}
				}
			}, 300);
		}
	}

	onDestroy(() => {
		// This is critical for canceling the timeout behaviour on `onWindowFocus()`
		inputElement = undefined;
	});

	function onInputElementClick(event: MouseEvent) {
		event.stopPropagation();
	}
</script>

<svelte:window on:focus={onWindowFocus} on:dragover={onDocumentDragOver} on:drop={onDocumentDrop} />

<div
	bind:this={rootRef}
	tabindex="0"
	role="button"
	class="{disableDefaultStyles ? '' : 'dropzone'}
  {containerClasses}"
	style={containerStyles}
	onkeydown={composeKeyboardHandler(onKeyDownCb)}
	onfocus={composeKeyboardHandler(onFocusCb)}
	onblur={composeKeyboardHandler(onBlurCb)}
	onclick={composeHandler(onClickCb)}
	ondragenter={composeDragHandler(onDragEnterCb)}
	ondragover={composeDragHandler(onDragOverCb)}
	ondragleave={composeDragHandler(onDragLeaveCb)}
	ondrop={composeDragHandler(onDropCb)}
>
	<input
		accept={accept?.join(',')}
		{multiple}
		{required}
		type="file"
		{name}
		autocomplete="off"
		tabindex="-1"
		onchange={onDropCb}
		onclick={onInputElementClick}
		bind:this={inputElement}
		style="display: none;"
	/>
	{#if children}
		{@render children()}
	{:else}
		<p>{defaultPlaceholderString}</p>
	{/if}
</div>

<style>
	.dropzone {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20px;
		border-width: 2px;
		border-radius: 2px;
		border-color: #eeeeee;
		border-style: dashed;
		background-color: #fafafa;
		color: #bdbdbd;
		outline: none;
		transition: border 0.24s ease-in-out;
	}
	.dropzone:focus {
		border-color: #2196f3;
	}
</style>
