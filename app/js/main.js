"use strict";

const formItemCreate = document.getElementById("form-create-item");
const btnItemCreateApply = document.getElementById("item-create-apply");
const btnItemCreateDone = document.getElementById("item-create-done");

btnItemCreateDone.addEventListener("click", function (e) {
    formItemCreate.parentElement.style.height = 0;
});