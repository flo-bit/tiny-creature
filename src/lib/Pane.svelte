<script lang="ts">
	import {
		Pane,
		Slider,
		Folder,
		Color,
		ThemeUtils,
	} from 'svelte-tweakpane-ui';
	import { options } from './state.svelte';

	function change() {
		options.hasChanged = true;
	}
</script>

<div
	class="pointer-events-auto absolute right-2 top-2 z-50 w-full max-w-64 rounded-lg border border-white/10 backdrop-blur-sm"
>
	<Pane title="Settings" position="inline" theme={ThemeUtils.presets.translucent}>
		<Folder expanded={false} title="Left Eyebrow">
			<Slider
				label="curve"
				bind:value={options.leftEyebrow.curve}
				min={-40}
				max={40}
				on:change={change}
			/>
			<Slider
				label="stroke"
				bind:value={options.leftEyebrow.stroke}
				min={1}
				max={10}
				on:change={change}
			/>
			<Slider
				label="width"
				bind:value={options.leftEyebrow.width}
				min={1}
				max={200}
				on:change={change}
			/>
			<Slider
				label="x"
				bind:value={options.leftEyebrow.x}
				min={-100}
				max={100}
				on:change={change}
			/>
			<Slider
				label="y"
				bind:value={options.leftEyebrow.y}
				min={-100}
				max={100}
				on:change={change}
			/>

			<Slider
				label="angle"
				bind:value={options.leftEyebrow.angle}
				min={-100}
				max={100}
				on:change={change}
			/>
		</Folder>
		<Folder expanded={false} title="Right Eyebrow">
			<Slider
				label="curve"
				bind:value={options.rightEyebrow.curve}
				min={-40}
				max={40}
				on:change={change}
			/>
			<Slider
				label="stroke"
				bind:value={options.rightEyebrow.stroke}
				min={1}
				max={10}
				on:change={change}
			/>
			<Slider
				label="width"
				bind:value={options.rightEyebrow.width}
				min={1}
				max={200}
				on:change={change}
			/>
			<Slider
				label="x"
				bind:value={options.rightEyebrow.x}
				min={-100}
				max={100}
				on:change={change}
			/>
			<Slider
				label="y"
				bind:value={options.rightEyebrow.y}
				min={-100}
				max={100}
				on:change={change}
			/>
			<Slider
				label="angle"
				bind:value={options.rightEyebrow.angle}
				min={-100}
				max={100}
				on:change={change}
			/>
		</Folder>
		<Folder expanded={false} title="Mouth">
			<Slider
				label="curve"
				bind:value={options.mouth.curve}
				min={-100}
				max={100}
				on:change={change}
			/>
			<Slider
				label="stroke"
				bind:value={options.mouth.stroke}
				min={1}
				max={120}
				on:change={change}
			/>
			<Slider label="width" bind:value={options.mouth.width} min={1} max={200} on:change={change} />
			<Slider label="x" bind:value={options.mouth.x} min={-100} max={100} on:change={change} />
			<Slider label="y" bind:value={options.mouth.y} min={-200} max={100} on:change={change} />
		</Folder>

		<Folder expanded={false} title="Colors">
			<Color label="Primary" bind:value={options.colors.primary} on:change={change} />
			<Color label="Secondary" bind:value={options.colors.secondary} on:change={change} />
		</Folder>

		<!-- <Button
			on:click={() => {
				console.log(JSON.stringify(options, null, 2));
			}}
			title="Log"
		/> -->
	</Pane>
</div>
