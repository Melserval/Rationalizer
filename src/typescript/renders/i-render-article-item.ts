
/**
 * Рендеринг элемента представляющего продукт в списках ассортимента/покупок/заказов.
 */
interface IRenderArticleItem<T> {
	remove(): void;
	setClassName(arg: string): void;
	removeClassName(arg: string): void;
	render(destination: HTMLElement): void;
	dataItem: T;
	element: HTMLLIElement;
}