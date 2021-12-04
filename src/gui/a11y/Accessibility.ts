import RJS from '../../core/RJS';
import { tokenizeTextStyle } from '../../utils/textStyle';

interface Bounds {
	x: number;
	y: number;
	width: number;
	height: number;
}

interface Button {
	label?: string;
	isActive: () => boolean;
	onclick: HTMLButtonElement['onclick'];
	onfocus?: HTMLButtonElement['onfocus'];
	onblur?: HTMLButtonElement['onblur'];
	getBounds: () => Bounds;
}

interface Slider {
	label?: string;
	isActive: () => boolean;
	min: number;
	max: number;
	step: number | 'any';
	set: (value: number) => void;
	get: () => number;
	getBounds: () => Bounds;
}

/** sanitize strings for better screen-reading */
function sanitize(str: string) {
	return str.replace(/\s+/g, ' ').trim();
}

/** converts RenJS formatted text to an HTML markup string */
function textToHtml(text: string) {
	const tokens = tokenizeTextStyle(text);
	const tags = [];
	let result = '';
	while (tokens.length) {
		const token = tokens.shift();
		if (token.tag) {
			if (token.tag === 'end' && tags.length) {
				result += `</${tags.pop()}>`;
			} else if (token.tag.startsWith('color')) {
				tags.push('mark');
				result += '<mark>';
			} else if (token.tag === 'bold') {
				tags.push('strong');
				result += '<strong>';
			} else if (token.tag === 'italic') {
				tags.push('em');
				result += '<em>';
			}
		} else {
			result += token.text;
		}
	}
	return result.replace(/\n/g, '<br />');
}

/**
 * Adds an accessible DOM layer on top of the game canvas
 * in order to support keyboard navigation and screen-reading
 */
export default class Accessibility {
	/** if debug is true, accessibility elements will be visible */
	debug = false;

	elContainer: HTMLDivElement;
	elProgress: HTMLProgressElement;
	elText: HTMLDivElement;
	elChoices: HTMLOListElement;
	elButtons: HTMLUListElement;
	elSliders: HTMLUListElement;

	state: {
		name: string;
		text: string;
		choices: Button[];
		buttons: Button[];
		sliders: Slider[];
	} = {
		name: '',
		text: '',
		choices: [],
		buttons: [],
		sliders: [],
	};

	constructor(public game: RJS) {
		this.elContainer = document.createElement('div');
		this.elContainer.style.position = 'fixed';
		this.elContainer.style.pointerEvents = 'none';
		if (this.debug) {
			this.elContainer.style.border = 'solid 1px red';
		}

		this.elProgress = document.createElement('progress');
		this.elProgress.max = 100;
		this.elProgress.value = 0;
		if (!this.debug) {
			this.elProgress.style.opacity = '0';
		}

		this.elChoices = document.createElement('ol');
		this.elChoices.style.listStyle = 'none';

		this.elButtons = document.createElement('ul');
		this.elButtons.style.listStyle = 'none';

		this.elSliders = document.createElement('ul');
		this.elSliders.style.listStyle = 'none';

		this.elText = document.createElement('div');
		this.elText.setAttribute('aria-live', 'polite');
		this.elText.setAttribute('aria-atomic', 'true');
		this.elText.setAttribute('aria-relevant', 'text');
		this.elText.setAttribute('role', 'main');
		this.elText.setAttribute('aria-roledescription', 'text');
		this.elText.tabIndex = 0;
		this.elText.onclick = () => {
			this.game.onTap(null);
		};
		this.elText.style.position = 'absolute';
		if (this.debug) {
			this.elText.style.color = 'red';
			this.elText.style.top = '1rem';
			this.elText.style.left = '1rem';
			this.elText.style.right = '1rem';
			this.elText.style.bottom = '1rem';
		} else {
			this.elText.style.color = 'transparent';
			this.elText.style.fontSize = '0';
			this.elText.style.outline = 'none';
			this.elText.style.top = '0';
			this.elText.style.left = '0';
			this.elText.style.right = '0';
			this.elText.style.bottom = '0';
		}

		this.elContainer.appendChild(this.elProgress);
		this.elContainer.appendChild(this.elText);
		this.elContainer.appendChild(this.elChoices);
		this.elContainer.appendChild(this.elSliders);
		this.elContainer.appendChild(this.elButtons);
	}

	boot() {
		this.game.scale.onSizeChange.add(this.updateLayout);
		this.updateLayout();
		this.game.load.onLoadStart.add(() => {
			this.updateLayout();
			this.busy();
			this.progress(0);
		});
		this.game.load.onLoadComplete.add(() => {
			this.progress(100);
			this.ready();
		});
		this.game.load.onFileComplete.add(progress => {
			this.progress(progress);
		});

		document.body.appendChild(this.elContainer);
	}

	progress(progress) {
		if (progress === undefined) {
			delete this.elProgress.value;
		} else {
			this.elProgress.value = Math.floor(progress);
		}
	}

	busy() {
		this.elText.setAttribute('aria-busy', 'true');
	}

	ready() {
		this.elText.setAttribute('aria-busy', 'false');
	}

	updateLayoutText() {
		let text = textToHtml(
			this.game.gui?.currentMenu !== 'hud'
				? ''
				: sanitize(this.state.text)
						.split('\n')
						.map(i => i.trim())
						.filter(i => i)
						.join('\n')
		);

		if (text.length > 0 && this.state.name) {
			text = `${sanitize(this.state.name)}: ${text}`;
		}
		this.elText.innerHTML = text;
	}

	updateLayoutContainer() {
		this.elContainer.style.width = `${this.game.scale.width}px`;
		this.elContainer.style.height = `${this.game.scale.height}px`;
		this.elContainer.style.top = `${this.game.scale.margin.top}px`;
		this.elContainer.style.left = `${this.game.scale.margin.left}px`;
	}

	updateLayoutBounds(el: HTMLElement, rect: Bounds) {
		el.style.width = `${rect.width * this.game.scale.scaleFactorInversed.x}px`;
		el.style.height = `${rect.height * this.game.scale.scaleFactorInversed.y}px`;
		el.style.top = `${rect.y * this.game.scale.scaleFactorInversed.y}px`;
		el.style.left = `${rect.x * this.game.scale.scaleFactorInversed.x}px`;
	}

	updateLayoutList(elList: HTMLUListElement | HTMLOListElement, list: Pick<Button, 'isActive' | 'getBounds'>[]) {
		this.rescueFocus(elList);
		list.forEach((choice, index) => {
			const elChoice = elList.children[index] as HTMLLIElement;
			elChoice.style.display = choice.isActive() ? null : 'none';
			this.updateLayoutBounds(elChoice, choice.getBounds());
		});
	}

	updateLayoutChoices() {
		this.updateLayoutList(this.elChoices, this.state.choices);
	}

	updateLayoutButtons() {
		this.updateLayoutList(this.elButtons, this.state.buttons);
	}

	updateLayoutSliders() {
		this.updateLayoutList(this.elSliders, this.state.sliders);
	}

	rescueFocus(elContainer: HTMLElement) {
		const elActive = document.activeElement;
		if (elContainer === elActive) return;
		if (!elActive || elContainer.contains(elActive)) {
			this.elText.focus();
		}
	}

	updateLayout = () => {
		this.updateLayoutContainer();
		this.updateLayoutText();
		this.updateLayoutChoices();
		this.updateLayoutButtons();
		this.updateLayoutSliders();
	};

	text(text = '') {
		this.state.text = text;
		this.updateLayoutText();
	}

	name(name = '') {
		this.state.name = name;
		this.updateLayoutText();
	}

	button(button: Button) {
		this.state.buttons.push(button);
		const li = document.createElement('li');
		li.style.position = 'absolute';
		const btn = document.createElement('button');
		btn.style.position = 'absolute';
		btn.style.top = '0';
		btn.style.left = '0';
		btn.style.width = '100%';
		btn.style.height = '100%';
		btn.style.background = 'transparent';
		if (this.debug) {
			btn.style.border = 'solid 1px red';
			btn.style.color = 'red';
		} else {
			btn.style.border = 'none';
			btn.style.color = 'transparent';
			btn.style.fontSize = '0';
		}
		btn.textContent = button.label || `Button ${this.state.buttons.length}`;
		btn.onclick = button.onclick;
		btn.onfocus = button.onfocus;
		btn.onblur = button.onblur;
		li.appendChild(btn);
		this.elButtons.appendChild(li);
		this.updateLayoutButtons();
	}

	slider(slider: Slider) {
		this.state.sliders.push(slider);
		const li = document.createElement('li');
		li.style.position = 'absolute';
		const input = document.createElement('input');
		input.type = 'number';
		input.setAttribute('aria-label', slider.label || `Slider ${this.state.buttons.length}`);
		input.min = slider.min.toString(10);
		input.max = slider.max.toString(10);
		input.step = slider.step.toString(10);
		input.value = slider.get().toString(10);
		input.style.position = 'absolute';
		input.style.top = '0';
		input.style.left = '0';
		input.style.width = '100%';
		input.style.height = '100%';
		// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
		// @ts-ignore
		input.style.appearance = 'textfield';
		input.style.background = 'transparent';
		if (this.debug) {
			input.style.border = 'solid 1px red';
			input.style.color = 'red';
		} else {
			input.style.border = 'none';
			input.style.color = 'transparent';
			input.style.fontSize = '0';
		}
		input.onchange = event => slider.set(Number((event.currentTarget as HTMLInputElement).value));
		input.onfocus = () => (input.value = slider.get().toString(10));
		li.appendChild(input);
		this.elSliders.appendChild(li);
		this.updateLayoutSliders();
	}

	choices(choices: Button[] = []) {
		this.state.choices = choices;
		this.rescueFocus(this.elChoices);
		this.elChoices.innerHTML = '';
		choices.forEach(i => {
			const li = document.createElement('li');
			li.style.position = 'absolute';
			const btn = document.createElement('button');
			btn.style.position = 'absolute';
			btn.style.top = '0';
			btn.style.left = '0';
			btn.style.width = '100%';
			btn.style.height = '100%';
			btn.style.background = 'transparent';
			if (this.debug) {
				btn.style.border = 'solid 1px red';
				btn.style.color = 'red';
			} else {
				btn.style.border = 'none';
				btn.style.color = 'transparent';
				btn.style.fontSize = '0';
			}
			btn.innerHTML = textToHtml(i.label);
			btn.onclick = i.onclick;
			btn.onfocus = i.onfocus;
			btn.onblur = i.onblur;
			li.appendChild(btn);
			this.elChoices.appendChild(li);
		});
		this.updateLayoutChoices();
	}
}
