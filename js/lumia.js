define( [
	'jquery',
	'text!../tpl/lumia.html'
], function ( $, tpl_lumia ){

	var animation_time = 400,
		identify = 'data-lumia',
		container = '.lumia-container',
		lock_zone = -400,
		week_days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
		year_month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		lock_class = "lumia-locked",
		on_class = "lumia-on",
		off_class = "lumia-off";


	var Lumia = function (){
		if ( !(this instanceof Lumia) ) {
			return new Lumia();
		}
		var self = this;
		self.id = 'tj' + (new Date()).getTime() + Math.floor( Math.random() * 1000 );
		self.is_mobile = (function (){
			var userAgent = navigator.userAgent.toString().toLowerCase();
			return (userAgent.indexOf( 'mobile' ) != -1) ? true : false;
		})();
		self.inited = false;
		return self.init();
	};

	var _proto = Lumia.prototype;

	_proto.init = function (){
		var self = this,
			el = '[' + identify + '="' + self.id + '"]';

		if ( self.inited ) {
			return self.destroy().init();
		}
		if ( $( el ).length == 0 ) {
			$( container ).append( $( tpl_lumia ).attr( identify, self.id ) );
		}

		var $el = $( el );
		self.$el = $el;

		self.element = {
			btn_power      : $el.find( '.lumia-power-btn' ),
			headline_time  : $el.find( '.lumia-headline-time' ),
			lockscreen     : $el.find( '.lumia-lockscreen' ),
			lockscreen_time: $el.find( '.lumia-lockscreen-time' ).find( 'span' ),
			lockscreen_date: $el.find( '.lumia-lockscreen-date' ),
			calendar_date  : $el.find( '.lumia-i-calendar' )

		};

		self.volume = 0.5; // 0 >= voice <= 1
		self.color = '#000';

		self.status = 'on'; // 'off', 'lock', 'on'

		self.element.btn_power.off( 'click' ).on( 'click', function (){
			switch ( self.status ) {
				case 'off':
					self.lock();
					break;

				case 'lock':
				case 'on':
					self.off();
					break;
			}
		} );


		self.time();

		self.unlockInitiate();

		setTimeout( function (){
			self[self.status]();
		}, 600 );

		self.inited = true;
		return self;
	};

	_proto.destroy = function (){
		var self = this;

		return self;
	};

	_proto.on = function (){
		var self = this,
			$lockscreen = $( self.element.lockscreen );
		self.$el.removeClass( lock_class ).removeClass( off_class ).addClass( on_class );
		$lockscreen.stop().animate( {
			top: lock_zone
		}, 400 );
		self.status = 'on';
		return self;
	};

	_proto.off = function (){
		var self = this,
			$lockscreen = $( self.element.lockscreen );
		self.$el.removeClass( lock_class ).removeClass( on_class ).addClass( off_class );
		$lockscreen.stop().css( {
			top: 0
		} );
		self.status = 'off';
		return self;
	};

	_proto.lock = function (){
		var self = this,
			$lockscreen = $( self.element.lockscreen );

		self.$el.removeClass( off_class ).removeClass( on_class ).addClass( lock_class );
		$lockscreen.animate( {
			top: 0
		}, 1000, 'easeOutBounce' );
		self.status = 'lock';
		return self;
	};


	_proto.time = function (){
		var self = this,
			el = self.element,
			date = new Date(),
			minutes = (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes(),
			hours = (date.getHours() < 10) ? '0' + date.getHours() : date.getHours();

		el.headline_time.html( hours + ':' + minutes );
		el.lockscreen_time.html( hours + ':' + minutes );
		el.lockscreen_date.html( week_days[date.getDay()].toLowerCase() + '<br />' + date.getDate() + ' ' + year_month[date.getMonth()].toLowerCase() );
		el.calendar_date.html( date.getDate() );

		setTimeout( function (){
			self.time();
		}, (1000 * (60 - date.getSeconds())) );
	};


	_proto.unlockInitiate = function (){
		var self = this,
			events = {
				start: 'mousedown',
				move : 'mousemove',
				end  : 'mouseup mouseleave'
			},
			events_mobile = {
				start: 'touchstart',
				move : 'touchmove',
				end  : 'touchend touchleave'
			},
			up_on_lockscreen,
			move_lockscreen,
			evnt = self.is_mobile ? events_mobile : events,
			$lockscreen = self.element.lockscreen;

		$lockscreen.off( evnt.start ).on( evnt.start, function ( e ){
			e.preventDefault();
			var $this = $( this ),
				mouse_top = self.is_mobile ? e.originalEvent.touches[0].clientY : e.clientY;

			$lockscreen.off( evnt.move, move_lockscreen ).on( evnt.move, function move_lockscreen( e ){
				var diff = (self.is_mobile ? e.originalEvent.touches[0].clientY : e.clientY) - mouse_top;
				if ( diff > 0 ) {
					diff = 0;
				}
				if ( diff < lock_zone ) {
					diff = lock_zone;
				}
				$this.css( {
					top: diff
				} );
			} );

			$lockscreen.off( evnt.end, up_on_lockscreen ).on( evnt.end, function up_on_lockscreen(){
				var $this = $( this );
				$lockscreen.off( evnt.move, move_lockscreen );
				self.endSlide();
			} );
		} );

	};

	_proto.endSlide = function (){
		var self = this,
			$lockscreen = self.element.lockscreen,
			lockscreen_top = parseInt( $lockscreen.css( 'top' ), 10 ) || 0;

		if ( lockscreen_top - 200 >= lock_zone ) {
			self.lock();
		} else {
			self.on();
		}
	};


	return Lumia;
} );