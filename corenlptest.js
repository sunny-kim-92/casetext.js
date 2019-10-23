const NER = require('ner');

const ner = new NER({
	port:8080,
	host:'172.17.0.2'
})

ner.get('Wikipedia is a free-access, free-content Internet encyclopedia, supported and hosted by the non-profit Wikimedia Foundation. Those who can access the site can edit most of its articles.[5] Wikipedia is ranked among the ten most popular websites,[4] and constitutes the Internets largest and most popular general', (err, res) => {
	console.log(res.entities);
});