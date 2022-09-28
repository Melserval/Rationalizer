export default interface IArticleItem {
	remove(): void;
	removeClassName(name: string): void;
	setClassName(name: string): void;
	dataItem(): unknown;
	element(): HTMLElement;
};