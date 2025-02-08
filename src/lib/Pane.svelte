<script lang="ts">
	import {
		Checkbox,
		Pane,
		Slider,
		Textarea,
		Folder,
		Color,
		ThemeUtils,
		Button
	} from 'svelte-tweakpane-ui';
	import { eyebrowLeft, eyebrowRight, furMouth, mouth } from './face/face';
	import { colors } from './state.svelte';

	const options = $state({
		leftEyebrow: {
			x: 75 / 2,
			y: 40,
			width: 50,
			curve: 10,
			stroke: 10
		},
		rightEyebrow: {
			x: -75 / 2,
			y: 40,
			width: 50,
			curve: 10,
			stroke: 10
		},
		mouth: {
	x: 0,
	y: -130,
	stroke: 20,
	color: 0,
	width: 100,
	curve: -40
}
	});

	function change() {
		console.log(eyebrowLeft);
		eyebrowLeft?.options.set('curve', options.leftEyebrow.curve);
		eyebrowLeft?.options.set('stroke', options.leftEyebrow.stroke);
		eyebrowLeft?.options.set('width', options.leftEyebrow.width);
		eyebrowLeft?.options.set('x', options.leftEyebrow.x);
		eyebrowLeft?.options.set('y', options.leftEyebrow.y);

		eyebrowRight?.options.set('curve', options.rightEyebrow.curve);
		eyebrowRight?.options.set('stroke', options.rightEyebrow.stroke);
		eyebrowRight?.options.set('width', options.rightEyebrow.width);
		eyebrowRight?.options.set('x', options.rightEyebrow.x);
		eyebrowRight?.options.set('y', options.rightEyebrow.y);

		mouth?.options.set('curve', options.mouth.curve);
		mouth?.options.set('stroke', options.mouth.stroke);
		mouth?.options.set('width', options.mouth.width);
		mouth?.options.set('x', options.mouth.x);
		mouth?.options.set('y', options.mouth.y);

		furMouth?.options.set('curve', options.mouth.curve);
		furMouth?.options.set('stroke', options.mouth.stroke);
		furMouth?.options.set('width', options.mouth.width);
		furMouth?.options.set('x', options.mouth.x);
		furMouth?.options.set('y', options.mouth.y);
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
			<Slider
				label="width"
				bind:value={options.mouth.width}
				min={1}
				max={200}
				on:change={change}
			/>
			<Slider
				label="x"
				bind:value={options.mouth.x}
				min={-100}
				max={100}
				on:change={change}
			/>
			<Slider
				label="y"
				bind:value={options.mouth.y}
				min={-200}
				max={100}
				on:change={change}
			/>
		</Folder>

		<Folder expanded={false} title="Colors">
			<Color
				label="Primary"
				bind:value={colors.primary}
			/>
			<Color
				label="Secondary"
				bind:value={colors.secondary}
			/>
		</Folder>

		<!-- <Button
			on:click={() => {
				console.log(JSON.stringify(options, null, 2));
			}}
			title="Log"
		/> -->
	</Pane>
</div>