<script lang="ts">
	import {
		Pane,
		Slider,
		Folder,
		Color,
		ThemeUtils,
		Button,
		Text,
		Separator
	} from 'svelte-tweakpane-ui';
	import { options } from './state.svelte';
	import { onMount } from 'svelte';

	function change() {
		options.hasChanged = true;
	}

	function saveEmotions() {
		localStorage.setItem('emotions', JSON.stringify(options.emotions));
	}

	onMount(() => {
		const emotions = localStorage.getItem('emotions');
		if (emotions) {
			options.emotions = {
				...options.emotions,
				...JSON.parse(emotions)
			};

			console.log(emotions)
		}
	});

	let newEmotion = '';
</script>

<div
	class="pointer-events-auto absolute right-2 top-2 z-50 w-full max-w-64 rounded-lg border border-white/10 backdrop-blur-sm"
>
	<Pane title="Settings" position="inline" theme={ThemeUtils.presets.translucent}>
		<Folder expanded={false} title="Left Eyebrow">
			<Slider
				label="curve"
				bind:value={options.leftEyebrow.curve}
				min={-100}
				max={100}
				on:change={change}
			/>
			<Slider
				label="stroke"
				bind:value={options.leftEyebrow.stroke}
				min={1}
				max={30}
				on:change={change}
			/>
			<Slider
				label="width"
				bind:value={options.leftEyebrow.width}
				min={1}
				max={200}
				on:change={change}
			/>
			<Slider label="x" bind:value={options.leftEyebrow.x} min={0} max={200} on:change={change} />
			<Slider
				label="y"
				bind:value={options.leftEyebrow.y}
				min={-100}
				max={200}
				on:change={change}
			/>

			<Slider
				label="angle"
				bind:value={options.leftEyebrow.angle}
				min={-100}
				max={100}
				on:change={change}
			/>

			<Slider
				label="sharpness"
				bind:value={options.leftEyebrow.sharpness}
				min={0}
				max={1}
				step={1}
				on:change={change}
			/>
			<Color label="color" bind:value={options.leftEyebrow.color} on:change={change} />
		</Folder>
		<Folder expanded={false} title="Right Eyebrow">
			<Slider
				label="curve"
				bind:value={options.rightEyebrow.curve}
				min={-100}
				max={100}
				on:change={change}
			/>
			<Slider
				label="stroke"
				bind:value={options.rightEyebrow.stroke}
				min={1}
				max={30}
				on:change={change}
			/>
			<Slider
				label="width"
				bind:value={options.rightEyebrow.width}
				min={1}
				max={200}
				on:change={change}
			/>
			<Slider label="x" bind:value={options.rightEyebrow.x} min={-200} max={0} on:change={change} />
			<Slider
				label="y"
				bind:value={options.rightEyebrow.y}
				min={-100}
				max={200}
				on:change={change}
			/>
			<Slider
				label="angle"
				bind:value={options.rightEyebrow.angle}
				min={-100}
				max={100}
				on:change={change}
			/>
			<Slider
				label="sharpness"
				bind:value={options.rightEyebrow.sharpness}
				min={0}
				max={1}
				step={1}
				on:change={change}
			/>
			<Color label="color" bind:value={options.rightEyebrow.color} on:change={change} />
		</Folder>

		<Folder expanded={false} title="Left Eye">
			<Slider label="x" bind:value={options.leftEye.x} min={0} max={200} on:change={change} />
			<Slider label="y" bind:value={options.leftEye.y} min={-100} max={100} on:change={change} />
			<Slider
				label="sizeX"
				bind:value={options.leftEye.sizeX}
				min={1}
				max={100}
				on:change={change}
			/>
			<Slider
				label="sizeY"
				bind:value={options.leftEye.sizeY}
				min={1}
				max={100}
				on:change={change}
			/>
			<Slider
				label="pupilSizeX"
				bind:value={options.leftEye.pupilSizeX}
				min={1}
				max={100}
				on:change={change}
			/>
			<Slider
				label="pupilSizeY"
				bind:value={options.leftEye.pupilSizeY}
				min={1}
				max={100}
				on:change={change}
			/>
		</Folder>
		<Folder expanded={false} title="Right Eye">
			<Slider label="x" bind:value={options.rightEye.x} min={-200} max={0} on:change={change} />
			<Slider label="y" bind:value={options.rightEye.y} min={-100} max={100} on:change={change} />
			<Slider
				label="sizeX"
				bind:value={options.rightEye.sizeX}
				min={1}
				max={100}
				on:change={change}
			/>
			<Slider
				label="sizeY"
				bind:value={options.rightEye.sizeY}
				min={1}
				max={100}
				on:change={change}
			/>
			<Slider
				label="pupilSizeX"
				bind:value={options.rightEye.pupilSizeX}
				min={1}
				max={100}
				on:change={change}
			/>
			<Slider
				label="pupilSizeY"
				bind:value={options.rightEye.pupilSizeY}
				min={1}
				max={100}
				on:change={change}
			/>
		</Folder>
		<Folder expanded={false} title="Mouth">
			<Slider
				label="lowerLipCx1"
				bind:value={options.mouth.lowerLipCx1}
				min={-100}
				max={100}
				on:change={change}
			/>
			<Slider
				label="lowerLipCy1"
				bind:value={options.mouth.lowerLipCy1}
				min={-100}
				max={100}
				on:change={change}
			/>
			<Slider
				label="lowerLipCx2"
				bind:value={options.mouth.lowerLipCx2}
				min={-100}
				max={100}
				on:change={change}
			/>
			<Slider
				label="lowerLipCy2"
				bind:value={options.mouth.lowerLipCy2}
				min={-100}
				max={100}
				on:change={change}
			/>
			<Slider
				label="lowerLipStroke"
				bind:value={options.mouth.lowerLipStroke}
				min={1}
				max={200}
				on:change={change}
			/>
			<Slider
				label="upperLipCx1"
				bind:value={options.mouth.upperLipCx1}
				min={-100}
				max={100}
				on:change={change}
			/>
			<Slider
				label="upperLipCy1"
				bind:value={options.mouth.upperLipCy1}
				min={-100}
				max={100}
				on:change={change}
			/>
			<Slider
				label="upperLipCx2"
				bind:value={options.mouth.upperLipCx2}
				min={-100}
				max={100}
				on:change={change}
			/>
			<Slider
				label="upperLipCy2"
				bind:value={options.mouth.upperLipCy2}
				min={-100}
				max={100}
				on:change={change}
			/>
			<Slider
				label="upperLipStroke"
				bind:value={options.mouth.upperLipStroke}
				min={1}
				max={200}
				on:change={change}
			/>
			
			<Slider label="width" bind:value={options.mouth.width} min={1} max={200} on:change={change} />
			<Slider label="x" bind:value={options.mouth.x} min={-100} max={100} on:change={change} />
			<Slider label="y" bind:value={options.mouth.y} min={-200} max={100} on:change={change} />

			<Color label="color" bind:value={options.mouth.color} on:change={change} />
		</Folder>

		<Folder expanded={false} title="Colors">
			<Color label="Primary" bind:value={options.colors.primary} on:change={change} />
			<Color label="Secondary" bind:value={options.colors.secondary} on:change={change} />
		</Folder>

		<Folder expanded={false} title="Emotions">
			{#each Object.keys(options.emotions) as emotion}
				<Button
					on:click={() => {
						options.currentEmotion = emotion;
						options.hasChanged = true;
					}}
					title={emotion}
				/>
			{/each}

			<Separator />

			<Text label="Emotion name" bind:value={newEmotion} />
			<Button
				on:click={() => {
					options.emotions[newEmotion] = {
						leftEyebrow: { ...options.leftEyebrow },
						rightEyebrow: { ...options.rightEyebrow },
						mouth: { ...options.mouth },
						leftEye: { ...options.leftEye },
						rightEye: { ...options.rightEye }
					};

					saveEmotions();

					newEmotion = '';
				}}
				title="Save"
			/>
		</Folder>
	</Pane>
</div>
