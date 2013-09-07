require.config({
	baseUrl: 'js',
	urlArgs: "",
	paths: {
		'jquery.easing': 'jquery.easing',
		jquery: 'jquery',
		lumia: 'lumia'
	},
	shim: {
		lumia: ['jquery.easing'],
		'jquery.easing': ['jquery']
	}
});



require(['lumia'], function(Lumia) {
	Lumia();
});