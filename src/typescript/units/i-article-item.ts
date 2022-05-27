import { MeasureType, VendorType } from "../types";

export interface IArticleItem {
	id: string;
	title: string;
	price: number;
	amount: number;
	measureType: MeasureType;
	vendorType: VendorType;
}