export abstract class FormView<T> {
	protected form: HTMLFormElement;
	protected submitButton: HTMLButtonElement;
	protected element: HTMLElement;
	protected data: Partial<T> = {};

	constructor(templateId: string, onSubmit: (data: T) => void) {
		const template = document.getElementById(templateId) as HTMLTemplateElement;
		this.element = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
		this.form = this.element as HTMLFormElement;
		this.submitButton = this.form.querySelector('button[type="submit"]') as HTMLButtonElement;

		this.form.addEventListener('submit', (e) => {
			e.preventDefault();
			onSubmit(this.getData());
		});
	}

	protected abstract validate(): void;
	protected abstract getData(): T;

	public getElement(): HTMLElement {
		return this.element;
	}
}
