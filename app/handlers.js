
// страница подбора ассортимента.
exports.main = (req, res) => {
	res.status(200).render('assortiment');
}

// страница о программе.
exports.about = (req, res) => {
	res.status(200).render('about');
}