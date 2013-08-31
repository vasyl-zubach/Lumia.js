define([
 'jquery',
 'text!../tpl/lumia.html'
], function ($, tpl_lumia) {

    var animation_time = 400,
        identify = 'data-lumia',
        container = 'body';


    var Lumia = function () {
        if (!(this instanceof Lumia)) {
            return new Lumia();
        }

        var self = this;

        self.id = 'tj' + (new Date()).getTime() + Math.floor(Math.random() * 1000);

        self.is_mobile = (function () {
            var userAgent = navigator.userAgent.toString().toLowerCase();
            return (userAgent.indexOf('mobile') != -1) ? true : false;
        })();

        self.inited = false;

        return self.init();
    };

    var _proto = Lumia.prototype;

    _proto.init = function () {
        var self = this,
            el = '[' + identify + '="' + self.id + '"]';

        if (self.inited) {
            return self.destroy().init();
        }
        if ($(el).length == 0) {
            $(container).append($(tpl_lumia).attr(identify, self.id));
        }

        self.$el = $(el);

        self.element = {
            btn_power: self.$el.find('.iphone-power-button')
        };

        self.volume = 0.5; // 0 >= voice <= 1
        self.color = '#000';

        self.status = 'lock'; // 'off', 'lock', 'on'

        
        setTimeout(function(){
//            window.location.reload();
        },1000);
        
        
        self.inited = true;
        return self;
    };

    _proto.destroy = function () {
        var self = this;

        return self;
    };

    return Lumia;
});