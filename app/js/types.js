"use strict";

// виды распостранения товара (на развес, фасованный, штучно, etc...).
const vendorType_packed  = Symbol.for("vendorType_packed");
const vendorType_weighed = Symbol.for("vendorType_weighed");
const vendorType_unit    = Symbol.for("vendorType_unit");

// виды единиц измерения/меры веса.
const measureType_milliliter = Symbol.for("measureType_milliter");
const measureType_gramm      = Symbol.for("measureType_gramm");
const measureType_unit       = Symbol.for("measureType_unit");
