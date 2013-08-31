require.config({
    baseUrl: 'js',
    urlArgs: "",
    paths: {
        jquery: 'jquery',
        iphone: 'lumia'
    }
});



require(['lumia'], function (Lumia) {
    Lumia();
});