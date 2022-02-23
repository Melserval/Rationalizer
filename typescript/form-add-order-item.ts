import { IArticleUnit } from "./renders/i-article-unit";

// Форма коррекции цены и/или количества 
// добавляемого в список закупок ассортимента.
const form_AddOrderItem = document.getElementById("form-add-article-to-order") as HTMLFormElement;
const p_ArticleInfoText = form_AddOrderItem.querySelector('#text-add-article-info') as HTMLParagraphElement;
const input_AtricleQuantity = form_AddOrderItem.querySelector("#input-add-article-quantity") as HTMLInputElement;
const input_AtriclePrice = form_AddOrderItem.querySelector("#input-add-article-total") as HTMLInputElement;

function reset(au: IArticleUnit) {
	p_ArticleInfoText.textContent = au.title;
	input_AtriclePrice.value = au.price.toString();
	input_AtricleQuantity.value = au.amount.toString();
}

function clear() {
	p_ArticleInfoText.textContent = "";
	input_AtriclePrice.value = "";
	input_AtricleQuantity.value = "";
}
/** скрывает форму */
function hide() {
	form_AddOrderItem.style.display = "none";
	clear();

}
/** Отображает форму */
function show(au: IArticleUnit) {
	form_AddOrderItem.style.display = "block";
	reset(au);
}


form_AddOrderItem.addEventListener('submit', function(e) {
	e.preventDefault();
	hide();
});

form_AddOrderItem.addEventListener('reset', clear);


/** 
 * Форма коррекции цены и/или количества 
 * добавляемого в список закупок ассортимента.
*/
export default  {
	show,
	hide
}
