//-------------------------------------------------------------
//JSAPIの動作確認
//-------------------------------------------------------------
if (ZDC._LOAD_ERR_MSG) {
	location.href = '/map-smart/';
};

<?php
// スマートフォン完全版地図
require_once '../../itsmo.js';
require_once '../../itsmo.lib.js';
//header("Content-type: text/javascript");
// スマートフォン完全版
require_once(dirname(__FILE__).'/../../../../inc/d_serv.inc');
?>
var tile_map = '<?php echo TILE_MAP; ?>';
var D_DEF_LAT = '<?php echo D_DEF_LAT; ?>';
var D_DEF_LON = '<?php echo D_DEF_LON; ?>';
var D_DEF_LVL = '<?php echo D_DEF_LVL; ?>';
var debuglog = function(msg){
	console && console.log && console.log(msg);
};
/** 追加機能 */
itsmo.vars.addon_smartphone = {};
itsmo.vars.addon_smartphone.onload = [];
itsmo.vars.addon_smartphone.onload_end = [];
itsmo.vars.addon_smartphone.onClickFreeword = [];



itsmo.map = {};
/** ミリ秒から十進度形式へ */
itsmo.map.toLatLon = function(lat, lon) {
	lat /= 60 * 60 * 1000;
	lon /= 60 * 60 * 1000;
	return new ZDC.LatLon(lat, lon);
};
/** 十進度形式からミリ秒へ */
itsmo.map.toMilliSec = function(latlon) {
	return {
		lat: Math.floor(latlon.lat * 60 * 60 * 1000),
		lon: Math.floor(latlon.lon * 60 * 60 * 1000)
	};
};
itsmo.range = {};
itsmo.range.range = function(n) {
};
itsmo.spot_range = {
	detail_spot: function() {}
};
itsmo.near_season = {};
itsmo.near_season.start = function(n) {
};
itsmo.map.dummyWidget = function() {};
itsmo.map.dummyWidget.prototype.open = function() {};
itsmo.map.dummyWidget.prototype.close = function() {};
itsmo.map.dummyWidget.prototype.movePosition = function() {};
itsmo.map.dummyWidget.prototype.setHtml = function() {};

// グローバル変数 --------------------------------
itsmo.vars.g_map_obj	= null;	//地図オブジェクト
itsmo.vars.g_width		= 0;
itsmo.vars.g_height		= 0;
itsmo.vars.g_latlon_mousedown			= null;	//マウスダウン時の位置
itsmo.vars.g_timeoutid_point_address	= null;	//マウスダウン時の位置
itsmo.vars.g_mousedown_timeout			= 1500;
itsmo.vars.g_ajax_point_address			= null;
itsmo.vars.g_tm_drag_start				= 0;
itsmo.vars.g_sec_drag					= 0;
itsmo.vars.g_search_pos					= 0;
itsmo.vars.g_search_data				= [];
itsmo.vars.g_search_widget				= [];
itsmo.vars.g_msg_window_widget			= null;
itsmo.vars.g_search_rows				= 20;	// 画面に表示する件数
itsmo.vars.g_search_page_rows			= 20;	// 検索１ページ分に含まれる件数
itsmo.vars.g_search_allcnt				= 0;

itsmo.vars.g_widget_point_address		= null;
itsmo.vars.g_widget_traffic				= null;
itsmo.vars.g_widget_traffic_onoff		= false;
itsmo.vars.g_widget_static_plus			= new itsmo.map.dummyWidget();
itsmo.vars.g_widget_static_minus		= new itsmo.map.dummyWidget();
itsmo.vars.g_widget_static_map_menu		= new itsmo.map.dummyWidget();
itsmo.vars.g_widget_static_map_menu_searchmode			= new itsmo.map.dummyWidget();
itsmo.vars.g_widget_static_map_menu_searchmode_other	= new itsmo.map.dummyWidget();
itsmo.vars.g_widget_static_map_menu_myhomemode			= new itsmo.map.dummyWidget();
itsmo.vars.g_widget_static_map_other_menu				= new itsmo.map.dummyWidget();
itsmo.vars.g_widget_static_div_route_kekka				= new itsmo.map.dummyWidget();


itsmo.vars.g_widget_point_myhome		= null;
itsmo.vars.g_myhome_data				= [];
itsmo.vars.g_myspot_data				= [];
itsmo.vars.g_maplink					= null;

itsmo.vars.g_pointData					= null;
itsmo.vars.g_keyLastLatLon				= 'mapLastLatLon';	// 最後に表示していた中心点

itsmo.vars.g_poihistoryFlag				= 0;

itsmo.vars.is_hide_balloon				= true;
itsmo.vars.onClickResearchFlag		    = false;

itsmo.vars.g_keyLastLatLon

// ローカルストレージのキー。
itsmo.vars.g_key_home_pos = 'homepos';

// var extend
itsmo.vars.largeWidget = null;

//2015/11/30 Doan Du add [
//
itsmo.vars.detailBalloon = null;
itsmo.vars.detailBalloon_small = null;
var balloon = localStorage.getItem("mapBalloon");

//2015/11/30 Doan Du add ]

itsmo.vars.widgetMyData = [];

window.onorientationchange = function()
{
<?php /*
	//alert( screen.availWidth + "," + screen.availHeight ); -> i-phone では、常に固定 320, 396
	//alert( window.innerWidth  + "," + window.innerHeight ); //-> これが一番まとも
	//alert( document.body.clientWidth + "," + document.body.clientHeight ); -> おかしい

	// i-phone 3GS iOS 3.1.3(7E18) & 4.0.1(8A306) viewport width=device-width
	// portlait
	// window.innerWidth    = 320
	// window.innerHeight   = 356
	// landscape
	// window.innerWidth    = 480
	// window.innerHeight   = 208

	// i-phone 4 iOS 4.0.2 (8A400) viewport width=device-width
	// portlait
	// window.innerWidth    = 320
	// window.innerHeight   = 356
	// landscape
	// window.innerWidth    = 480
	// window.innerHeight   = 208
*/ ?>

	itsmo.vars.g_width  = $(window).width();
	itsmo.vars.g_height = $(window).height();

	itsmo.map.set_screen();
};


<?php /*
//---------------------------------------------------------------------------
// 端末を横向きや縦向きに変更したとき
// X06HT で落ちることがあるため、コメントアウト
//---------------------------------------------------------------------------
*/ ?>
window.onresize = function()
{
	//console.log( window.innerWidth + ',' + window.innerWidth );

	//if ( g_firedResizeEvent == false )
	{

//		g_firedResizeEvent = true;

//		var orientation = window.orientation;

//		if ( g_orientation != orientation )
		{
//			g_orientation = orientation;
			itsmo.vars.g_width  = $(window).width();
			itsmo.vars.g_height = $(window).height();
//alert( g_width + "," + g_height );
			itsmo.map.set_screen();
		}

//		g_firedResizeEvent = false;

	}
};


itsmo.map.map_onload = function(lat, lon, lvl) {
	if(balloon != null && balloon !=""){
		var mapBalloon = JSON.parse(balloon);
		var pathArray = mapBalloon.c_detail.split( '/' );
		pathArray = pathArray.map(function(i){
			return window.decodeURIComponent(i)
		})
		// get latlon.
		latlon_detail = pathArray[3].split('_');
		if(mapBalloon.flag == true){
			lat = latlon_detail[0];
			lon = latlon_detail[1];
		}
	}

	var latlon = itsmo.map.toLatLon(lat, lon);
	if ('' == action || action == 'tourist' || action == 'landmark' || action == 'lasttrain' || action == 'transit') {
		var s = itsmo.util.getLocalStorage().getItem(itsmo.vars.g_keyLastLatLon);
		if (null != s) {
			s = s.split(',');
			if (s.length == 3) {
				latlon = new ZDC.LatLon(parseFloat(s[0]), parseFloat(s[1]));
				lvl = parseInt(s[2], 10);
			}
		}
	}

	var maptype = ZDC.MAPTYPE_COLOR;
	if (typeof window.devicePixelRatio === 'undefined') {
	} else if (window.devicePixelRatio >= 2) {
		maptype = ZDC.MAPTYPE_HIGHRESOLUTION;
	}
	
	// ZDC._TILE_PATHS["4"] = ZDC._TILE_PATHS["24"];
	if(action == 'transit') {
		//ZDC._TILE_PATHS["map11"]="ond/43/20150722/";
		ZDC._TILE_PATHS["22"] = ZDC._TILE_PATHS["ond/43"];
	    // ZDC._TILE_PATHS["22"] = "ond/43/20150901/";
	    //ZDC._TILE_SERVERS = "test.map.e-map.ne.jp,210.133.109.147";
	    ZDC._TILE_SERVERS = tile_map;
	    maptype = ZDC.MAPTYPE_HIGHRESOLUTION;
	} else if(action == 'lasttrain') {
		//ZDC._TILE_PATHS["map11"]="ond/43/20150722/";
		ZDC._TILE_PATHS["22"] = ZDC._TILE_PATHS["ond/43"];
	    // ZDC._TILE_PATHS["22"] = "ond/43/20150901/";
	    //ZDC._TILE_SERVERS = "test.map.e-map.ne.jp,210.133.109.147";
	    ZDC._TILE_SERVERS = tile_map;
	    maptype = ZDC.MAPTYPE_HIGHRESOLUTION;
	} else if(action == 'landmark'){
		//ZDC._TILE_PATHS["map11"]="ond/44/20150722/";
		ZDC._TILE_PATHS["22"] = ZDC._TILE_PATHS["ond/44"];
		//ZDC._TILE_SERVERS = "test.map.e-map.ne.jp,210.133.109.147";
    	ZDC._TILE_SERVERS = tile_map;
    	maptype = ZDC.MAPTYPE_HIGHRESOLUTION;
	} else if(action == 'tourist'){
		//ZDC._TILE_PATHS["map11"]="ond/45/20150626/";
		ZDC._TILE_PATHS["22"] = ZDC._TILE_PATHS["ond/45"];
		//ZDC._TILE_SERVERS = "test.map.e-map.ne.jp,210.133.109.147";
    	ZDC._TILE_SERVERS = tile_map;
    	maptype = ZDC.MAPTYPE_HIGHRESOLUTION;

	}
	if (ZDC.MAPTYPE_HIGHRESOLUTION == maptype) {
		if (lvl > 13) {
			lvl = 13;
		}
	} else {
		if (lvl >= 18) {
			lvl = 17;
		}
	}

	itsmo.vars.g_map_obj = new ZDC.Map(
		$('#id_zmap').get(0),
		{
			mapType: maptype,
			latlon: latlon,
			zoom: lvl
		}
	);
	// set resolution.
	var mobile = itsmo.vars.g_map_obj.getMapType();
	if(mobile.layer =='NORMAL' && action == 'transit'){
		ZDC._TILE_PATHS["4"] = ZDC._TILE_PATHS["ond/40"]; // Transfer
		// ZDC._TILE_PATHS["4"] = "ond/40/20150901/";
	}else if(mobile.layer =='NORMAL' && action == 'landmark'){
		ZDC._TILE_PATHS["4"] = ZDC._TILE_PATHS["ond/41"]; // Landmark
	}else if(mobile.layer =='NORMAL' && action == 'tourist'){
		ZDC._TILE_PATHS["4"] = ZDC._TILE_PATHS["ond/42"]; // Tourist
	}
	// M100 : get current location
	var geolocation = localStorage.getItem('map_location');
	var _temp,_ll;
	if(geolocation ===null || geolocation ===''){
		_temp = itsmo.util.getLocalStorage().getItem('mapLastLatLon');
		if(_temp != null) {
			_ll = _temp.split(',');
		}
	}
	if(action == 'transit') {
   		itsmo.transit.init();
   		itsmo.map.move_now_location();
	  	if((geolocation ===null || geolocation ==='') && _temp != null){
	   		// var isGPS = itsmo.util.getLocalStorage().getItem('isGPS');
			itsmo.vars.g_map_obj.moveLatLon(new ZDC.LatLon(_ll[0],_ll[1]));
			//itsmo.vars.g_map_obj.setZoom(_ll[2]);
			// setTimeout(function() { 
			// 	if(isGPS == null) {
			// 		isGPS = false;
			// 	}
			// 	itsmo.transit.afterGetCurrentLocation(isGPS); 
			// }, 300);
	  	}else{
   		}
	}else if(action == 'lasttrain'){
   		itsmo.lastTrain.init();
   		if((geolocation === null || geolocation === '') && _temp != null){
	   		var isGPS = itsmo.util.getLocalStorage().getItem('isGPS');
			itsmo.vars.g_map_obj.moveLatLon(new ZDC.LatLon(_ll[0], _ll[1]));
			//itsmo.vars.g_map_obj.setZoom(_ll[2]);
			setTimeout(function(){ 
				if(isGPS == null)
					isGPS = false;
				itsmo.lastTrain.afterGetCurrentLocation(isGPS); 
			}, 0);
	  	}else{
   			itsmo.map.move_now_location();
   		}
	} else if(action == 'landmark') {
		if((geolocation ===null || geolocation ==='') && _temp != null){
			itsmo.vars.g_map_obj.moveLatLon(new ZDC.LatLon(_ll[0],_ll[1]));
			////itsmo.vars.g_map_obj.setZoom(_ll[2]);
		}else{
			itsmo.map.move_now_location();
		}
		itsmo.landmark.initLoad();
	}
	else if(action == 'tourist') {
		if((geolocation ===null || geolocation ==='') && _temp != null){
			itsmo.vars.g_map_obj.moveLatLon(new ZDC.LatLon(_ll[0],_ll[1]));
			//itsmo.vars.g_map_obj.setZoom(_ll[2]);
		}else{
			itsmo.map.move_now_location();
		}
		itsmo.landmark.initLoad();
	}else if(action ==''){
		if((geolocation ===null || geolocation ==='') && _temp != null){
			itsmo.vars.g_map_obj.moveLatLon(new ZDC.LatLon(_ll[0],_ll[1]));
			//itsmo.vars.g_map_obj.setZoom(_ll[2]);
		}else{
			itsmo.map.move_now_location();
		}
	}

	var rLat = itsmo.map.getParameterByName('lat');
	var rLon = itsmo.map.getParameterByName('lon');
	var rZoom = itsmo.map.getParameterByName('zoom');
	// itsmo.map.initMapCenter();
	if(rLat != null && rLat != ''
		&& rLon != null && rLon != ''
		&& rZoom != null && rZoom != '') {
		itsmo.vars.g_map_obj.moveLatLon(new ZDC.LatLon(rLat, rLon));
		itsmo.vars.g_map_obj.setZoom(rZoom);
		//return;
	}

	/**
	 * convert lat lon the world to Japan and vice versa.
	 * @param  {String} geo_Location ! : geo = 1 and geo = 0,
	 * @return {[type]}              [description]
	 */
	if(geo_Location != '' && geoLat != '' && geoLon != ''){
		// case 1: JP datum
		if(geo_Location == 'wgstky'){
			var ll = new ZDC.LatLon(geoLat / 3600000,geoLon / 3600000);
			itsmo.vars.g_map_obj.moveLatLon(ll);
		}else if(geo_Location == 'tkywgs'){
			// world datum
			var ll = new ZDC.LatLon(geoLat / 3600000,geoLon / 3600000);
			var cnvll = ZDC.wgsTotky(ll);
			itsmo.vars.g_map_obj.moveLatLon(cnvll);
		}
	}
	var rOpen = itsmo.map.getParameterByName('open');
	if(rOpen != null && rOpen != '') {
		if(rOpen == 'true') {
			itsmo.vars.is_hide_balloon = true;
		} else {
			itsmo.vars.is_hide_balloon = false;
		}
	}
	$('#id_zmap').bind('gesturestart', itsmo.map.onMouseUp).bind('gesturechange', itsmo.map.onMouseUp)
		.bind('touchstart touchmove', function(ev) {
			if (null != ev.originalEvent
				&& undefined != ev.originalEvent
				&& ev.originalEvent.touches.length >= 2
				&& null != ev.originalEvent.touches[0]
				&& undefined != ev.originalEvent.touches[0]) {
				itsmo.map.onMouseUp();
			}
		});

	// 中心のクロスを描画しないよう変更
	// http://10.47.50.14/issues/3674
	// changed by konishi 2013/08/2
//	itsmo.vars.g_map_obj.addWidget(new ZDC.MapCenter());
//2015/11/30 Doan Du add [
itsmo.map.detailBalloonSmall = function(){
		if(mapBalloon != null && mapBalloon !=""){
			mapBalloon = JSON.parse(balloon);
			var pathArray = mapBalloon.c_detail.split( '/' );
			pathArray = pathArray.map(function(i){
				return window.decodeURIComponent(i)
			})
		// get balloon small.
		var _latlon = pathArray[3].split('_');
		var _c_ll = itsmo.map.toLatLon(_latlon[0],_latlon[1]);
		var html = '<div class="map-balloon-s" id="id_div_calc_size_small">'+
						'<a href="javascript:void(0);" onclick="">'+
						'<span class="ico-default"> </span>'+
						'</a>'+
					'</div>';
			var elm = $('#id_div_calc_size_small');
			if(elm.length==0){
				$('body').append(html);
				elm = $('#id_div_calc_size_small');
			}
			var w = elm.innerWidth() + 4;
			var h = elm.innerWidth() + 2;
			elm.remove();
		 	var widgetlabel = {
	            html: html,
	            size: new ZDC.WH(w,36),
	            offset : new ZDC.Pixel(-w /2, -h - 8),
	        };
	        if(itsmo.vars.detailBalloon_small){
	        	itsmo.vars.g_map_obj.removeWidget(itsmo.vars.detailBalloon_small);
	        }
    		itsmo.vars.detailBalloon_small = new ZDC.UserWidget(new ZDC.LatLon(_c_ll.lat,_c_ll.lon), widgetlabel);
    		itsmo.vars.g_map_obj.addWidget(itsmo.vars.detailBalloon_small);
    		itsmo.vars.detailBalloon_small.open();
    		ZDC.addListener(itsmo.vars.detailBalloon_small,ZDC.USERWIDGET_MOUSEUP,function(){
    			event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    			if(itsmo.vars.detailBalloon){
    				itsmo.vars.detailBalloon_small.close();
    				itsmo.vars.g_map_obj.moveLatLon(new ZDC.LatLon(_c_ll.lat,_c_ll.lon));
    				itsmo.vars.detailBalloon.open();
    			}
    		});
	}
	
}
//2015/11/30 Doan Du add ]
	itsmo.vars.g_map_obj.dragOn();
	itsmo.vars.g_map_obj.zoomOn();
	ZDC.addListener(itsmo.vars.g_map_obj, ZDC.MAP_MOUSEDOWN,	itsmo.map.onMouseDown);
	ZDC.addListener(itsmo.vars.g_map_obj, ZDC.MAP_MOUSEUP,		itsmo.map.onMouseUp);
	ZDC.addListener(itsmo.vars.g_map_obj, ZDC.MAP_DRAG_START,	itsmo.map.onDragStart);
	ZDC.addListener(itsmo.vars.g_map_obj, ZDC.MAP_DRAG_END,		itsmo.map.onDragEnd);
	ZDC.addListener(itsmo.vars.g_map_obj, ZDC.MAP_CHG_LATLON,	itsmo.map.onChangeLatLon);
	ZDC.addListener(itsmo.vars.g_map_obj, ZDC.MAP_CHG_ZOOM,		itsmo.map.onChangeZoom);
	itsmo.util.set_hover();
	itsmo.util.setFreewordInputBox();

	// 静的ウィジェット
	// 拡縮ボタン
	itsmo.vars.g_widget_static_plus  = new ZDC.StaticUserWidget({ bottom: 160, right: 12 }, {
		html: $('#id_map_widgets_static_plus').html()
	});
	itsmo.vars.g_widget_static_minus = new ZDC.StaticUserWidget({ bottom: 105, right: 12 }, {
		html: $('#id_map_widgets_static_minus').html()
	});
	itsmo.vars.g_map_obj.addWidget(itsmo.vars.g_widget_static_plus);
	itsmo.vars.g_map_obj.addWidget(itsmo.vars.g_widget_static_minus);
	itsmo.vars.g_widget_static_plus.open();
	itsmo.vars.g_widget_static_minus.open();
	// 通常メニュー
	itsmo.vars.g_widget_static_map_menu = new ZDC.StaticUserWidget({ bottom: 0, left: 0 }, {
		html: $('#id_map_widgets_static_map_menu').html()
	});
	itsmo.vars.g_map_obj.addWidget(itsmo.vars.g_widget_static_map_menu);
	itsmo.vars.g_widget_static_map_menu.open();
	itsmo.vars.g_widget_static_map_menu.setZindex(100 + 99);
	// 施設検索時メニュー
	itsmo.vars.g_widget_static_map_menu_searchmode = new ZDC.StaticUserWidget({ bottom: 0, left: 0 }, {
		html: $('#id_nav_searchmode').parent().html()
	});
	itsmo.vars.g_map_obj.addWidget(itsmo.vars.g_widget_static_map_menu_searchmode);
	itsmo.vars.g_widget_static_map_menu_searchmode.close();
	itsmo.vars.g_widget_static_map_menu_searchmode.setZindex(100 + 98);
	// 施設検索時メニュー（その他）
	itsmo.vars.g_widget_static_map_menu_searchmode_other = new ZDC.StaticUserWidget({ bottom: 46, right: 6 }, {
		html: $('#id_map_widgets_static_map_menu_searchmode_other').html()
	});
	itsmo.vars.g_map_obj.addWidget(itsmo.vars.g_widget_static_map_menu_searchmode_other);
	itsmo.vars.g_widget_static_map_menu_searchmode_other.close();
	itsmo.vars.g_widget_static_map_menu_searchmode_other.blShow = false;
	itsmo.vars.g_widget_static_map_menu_searchmode_other.setZindex(100 + 10)
	// 自宅
	itsmo.vars.g_widget_static_map_menu_myhomemode = new ZDC.StaticUserWidget({ bottom: 0, left: 0 }, {
		html: $('#id_div_myhomemode').parent().html()
	});
	itsmo.vars.g_map_obj.addWidget(itsmo.vars.g_widget_static_map_menu_myhomemode);
	itsmo.vars.g_widget_static_map_menu_myhomemode.open();
	itsmo.vars.g_widget_static_map_menu_myhomemode.setZindex(100 + 97);
	$('#id_div_myhomemode').hide();
	// ルート時のJCT等選択用の<>ボタン
	var i;
	i = new ZDC.StaticUserWidget({ bottom: 12, left: 12 }, {
		html: $('#div_route_prev').parent().html()
	});
	itsmo.vars.g_map_obj.addWidget(i);
	i.open();
	i.setZindex(100 + 10);
	$('#div_route_prev').hide();

	i = new ZDC.StaticUserWidget({ bottom: 12, left: 67 }, {
		html: $('#div_route_next').parent().html()
	});
	itsmo.vars.g_map_obj.addWidget(i);
	i.open();
	i.setZindex(100 + 10);
	$('#div_route_next').hide();
	// ルート結果表示の上部タブ
	itsmo.vars.g_widget_static_div_route_kekka = new ZDC.StaticUserWidget({ top: 0, left: 0 }, {
		html: $('#div_route_kekka').parent().html()
	});
	itsmo.vars.g_map_obj.addWidget(itsmo.vars.g_widget_static_div_route_kekka);
	itsmo.vars.g_widget_static_div_route_kekka.open();
	$('#div_route_kekka').hide();
	// 通常メニュー（その他）
	itsmo.vars.g_widget_static_map_other_menu = new ZDC.StaticUserWidget({ bottom: 49, right: 6 }, {
		html: $('#id_other_menu').html()
	});
	itsmo.vars.g_map_obj.addWidget(itsmo.vars.g_widget_static_map_other_menu);
	itsmo.vars.g_widget_static_map_other_menu.close();
	itsmo.vars.g_widget_static_map_other_menu.blShow = false;
	itsmo.vars.g_widget_static_map_other_menu.setZindex(100 + 10);

	itsmo.map.setSearchMode();

	switch(action) {
		case '':
			if (loginFlag == '1') {
				itsmo.map.mydata();
			}
			// m441 get location in the map. [
			itsmo.map.balloonDetail();
			// m441 get location in the map. ]
			break;

		case 'myhome':
			if (mode=='add') {
				itsmo.map.myhome_add(lat,lon,lvl);
			} else if (mode=='view') {
				itsmo.map.mydata();
			}
			break;

		case 'addr':
                //Start Tri Nguyen add 5-1-2016
                case 'top_z':
                //End Tri Nguyen add 5-1-2016
		case 'poihistory':
			itsmo.map.showPointAddress();
			break;
		case 'detail':
		case 'landmark':
		case 'tourist':
		case 'transit':
		case 'lasttrain':
		case 'detail_beauty':
			if (null != detailLink && undefined != detailLink) {
			} else {
				detailLink = false;
			}
			var placenm = place.split('_');
			var placetype = placenm.length >= 2 ? placenm.pop() : '';
			placenm = placenm.length >= 1 ? placenm[0] : '';
			// m441 get location in the map. [
			itsmo.map.balloonDetail();
			// m441 get location in the map. ]
			itsmo.map.clearSearchResultWidget();

			var html = '<div class="wapper-large" id="id_div_calc_size_ballon">'
						+ (!detailLink ? '' : ('<a href="' + detailLink + '" class="fuki-a">'))
						+ '<div class="smartmap-fuki">'
						+ '<article class="shop-detail-map">'
						+ '<h1>' + placenm + '</h1>'
						+ '<p>' + placetype + '</p></article>'
						+ '</div>'
						+ '<span class="fuki-arrow"></span>'
						+ (!detailLink ? '' : '</a>')
				+ '</div>'
			;
			var marker = itsmo.map.makeSearchResultMarker(0, {
				lat:	lat,
				lon:	lon,
				html:	html
			}, true);
			itsmo.vars.g_search_widget.push(marker);
			break;
	}
	
	$('header:first input').bind('focus', function() {
		$('#a_location').hide();
		$('#a_cancel').show();
	});
	$('#a_cancel').click(function() {
		$('#a_cancel').hide();
		$('#a_location').show();
	});

	itsmo.util.searchFreewordCallback = function() {
		var latlngSearch = itsmo.vars.g_map_obj.getLatLon();

		var box = itsmo.util.getLatLonBounds({'lat':latlngSearch.h,
			'lon': latlngSearch.f}, 10);
		var minlatlon = {lat: box.minlat, lon: box.minlon};
		var maxlatlon = {lat: box.maxlat, lon: box.maxlon};

		// var box = itsmo.vars.g_map_obj.getLatLonBox();
		// var minlatlon = itsmo.map.toMilliSec(box.getMin());
		// var maxlatlon = itsmo.map.toMilliSec(box.getMax());


		var mapTypeSearch = 'normal'; 
		if(action != 'transit' && action != 'lasttrain' 
			&& action != 'landmark' && action != 'tourist' ) {
			mapTypeSearch = 'normal';
		} else {
			mapTypeSearch = action;
		}

		return 'lat=' + latlngSearch.lat + '&lon=' + latlngSearch.lon 
			+ '&map_type=' + mapTypeSearch;
			// + '&box=' + minlatlon.lat + ',' + maxlatlon.lat + ',' + minlatlon.lon + ',' + maxlatlon.lon;
	};

	window.onorientationchange();
	$.each(itsmo.vars.addon_smartphone.onload, function(i, v) {
		v();
	});
	itsmo.map.initMapCenter();
	// Listen for orientation changes
	window.addEventListener("resize", function() {
		// Announce the new orientation number
		itsmo.map.initMapCenter();
	}, true);
};

// M441 get facility detail location
itsmo.map.balloonDetail = function(){
	if(balloon != null && balloon !=""){
		mapBalloon = JSON.parse(balloon);
		var pathArray = mapBalloon.c_detail.split( '/' );
		pathArray = pathArray.map(function(i){
			return window.decodeURIComponent(i)
		})
		// get latlon link 
		var _latlon = pathArray[3].split('_');
		var _c_ll = itsmo.map.toLatLon(_latlon[0],_latlon[1]);

		// get link text.
		var c_link = pathArray[6].split( '/' );
		detail_Link = "/" + c_link[1] + "/" + c_link[2] + "/" + c_link[3];
		place_nm = pathArray[5].split('_');
		place_type = place_nm.length >= 2 ? place_nm.pop() : '';
		place_nm = place_nm.length >= 1 ? place_nm[0] : '';

		var html = '<div class="wapper-large">'
			+ (!detail_Link ? '' : ('<a href="' + detail_Link + '" class="fuki-a">'))
			+ '<div class="smartmap-fuki">'
			+ '<article class="shop-detail-map">'
			+ '<h1>' + place_nm + '</h1>'
			+ '<p>' + place_type + '</p></article>'
			+ '</div>'
			+ '<span class="fuki-arrow"></span>'
			+ (!detail_Link ? '' : '</a>')
		+ '</div>';
		var d = document.createElement('div');
		d.style.float="left";
		d.innerHTML = html;
		document.body.appendChild(d);
		var _w = d.clientWidth;
		var _h = d.clientHeight;
		document.body.removeChild(d);
	 	var widgetlabel = {
            html: html,
            size: new ZDC.WH(_w, _h),
            offset : new ZDC.Pixel(-_w / 2, -_h),
        };
        if(itsmo.vars.detailBalloon){
    		itsmo.vars.g_map_obj.removeWidget(itsmo.vars.detailBalloon);
   	 	}
		itsmo.vars.detailBalloon = new ZDC.UserWidget(new ZDC.LatLon(_c_ll.lat,_c_ll.lon), widgetlabel);
		itsmo.vars.g_map_obj.addWidget(itsmo.vars.detailBalloon);
		if(mapBalloon.flag == true){
			itsmo.vars.g_map_obj.moveLatLon(new ZDC.LatLon(_c_ll.lat,_c_ll.lon));
			itsmo.vars.detailBalloon.open();
		}else{
			itsmo.vars.detailBalloon.close();
			itsmo.map.detailBalloonSmall();
		}
	}
}
var widget;
itsmo.map.initMapCenter = function() {
		if (null != itsmo.vars.g_map_obj) {
			var latlon = itsmo.vars.g_map_obj.getLatLon();
			var pos = itsmo.vars.g_map_obj.getMapSize();
			var html = '<span class="map-center"></span>';
			
			var widgetlabel = 
	        {
	            html: html,
	            size: new ZDC.WH(10, 10),
	            propagation: true
	        };
	        if(widget){
	        	itsmo.vars.g_map_obj.removeWidget(widget);
	        }
	        widget = new ZDC.StaticUserWidget({ 
	        	left: (pos.width - 10) / 2,
	        	top: (pos.height - 10) / 2
	        }, widgetlabel);

			itsmo.vars.g_map_obj.addWidget(widget);
			widget.open();
		}
};
itsmo.map.map_onload_end = function() {
	// api hack
	$('#id_zmap p:contains("ZENRIN DataCom")').parent().css('z-index', 350);
	if(action == 'showroute'){
		itsmo.map.route.show();
	}
	if ('detail' == action || 'detail_beauty' == action || 'landmark' == action 
		|| 'tourist' == action || 'transit' == action || 'lasttrain' == action) {
		if (null != detailLink && undefined != detailLink && detailLink != '' && balloon == null) {
			var marker = itsmo.vars.g_search_widget[0];
			itsmo.vars.g_map_obj.addWidget(marker);
			marker.open();
			itsmo.map.onClickSearchResultMarker(0, true, 0);
		}
	}

	if (null != baseurl && baseurl.length >= 1) {
		baseurlArr = baseurl.split("/");
		if (baseurlArr[1] == 'c'
			|| 'search' == baseurlArr[1]) {
			itsmo.map.search(itsmo.map.getParameterByName('fixzoom') === '', true);
		}
	}
	itsmo.map.onChangeLatLon();
	itsmo.map.toggleOtherMenu(false);
	$.each(itsmo.vars.addon_smartphone.onload_end, function(i, v) {
		v();
	});

	if(typeof(map_classic) != 'undefined') {
		map_classic.init();
	}
};
itsmo.map.set_screen = function() {
	itsmo.vars.g_height = window.innerHeight;
	var header = $('header').height();
	if(action == 'showroute'){
		header += itsmo.map.route.navHeight;
		//header += itsmo.map.route.kekkaHeight;
	}
	var e = $('div.adnw-map_320_50');
	if (e.length >= 1) {
		header += e.height();
	}

	$('#id_zmap').css({
		marginTop : 0,
		height : itsmo.vars.g_height - header-0,
		width : itsmo.vars.g_width
	});
	//$('#id_zmap').height(itsmo.vars.g_height - 50).width(itsmo.vars.g_width);
	if (null != itsmo.vars.g_map_obj) {
		itsmo.vars.g_map_obj.refresh();
	}
	// 拡縮ボタンの配置を調整。
	if (null != itsmo.vars.g_widget_static_plus) {
		itsmo.vars.g_widget_static_plus.movePosition(itsmo.vars.g_height > itsmo.vars.g_width ?
			{ bottom: 160, right: 12 } : { bottom: 62, right: 67 });
	}
	if (null != itsmo.vars.g_widget_static_minus) {
		itsmo.vars.g_widget_static_minus.movePosition(itsmo.vars.g_height > itsmo.vars.g_width ?
			{ bottom: 105, right: 12 } : { bottom: 62, right: 12 });
	}
	e = $('#id_map_widgets_static_map_menu');
	if (null != itsmo.vars.g_widget_static_map_menu) {
		itsmo.vars.g_widget_static_map_menu.setHtml(e.html(),
			new ZDC.WH(itsmo.vars.g_width, itsmo.map.getHeight(e)));
	}
	e = $('#div_route_kekka').parent();
	if (null != itsmo.vars.g_widget_static_div_route_kekka) {
		itsmo.vars.g_widget_static_div_route_kekka.setHtml(e.html(),
			new ZDC.WH(itsmo.vars.g_width, itsmo.map.getHeight(e)));
	}
	e = $('#id_nav_searchmode').parent();
	if (null != itsmo.vars.g_widget_static_map_menu_searchmode) {
		itsmo.vars.g_widget_static_map_menu_searchmode.setHtml(e.html(),
			new ZDC.WH(itsmo.vars.g_width, itsmo.map.getHeight(e)));
	}
	e = $('#id_div_myhomemode').parent();
	if (null != itsmo.vars.g_widget_static_map_menu_myhomemode) {
		itsmo.vars.g_widget_static_map_menu_myhomemode.setHtml(e.html(),
			new ZDC.WH(itsmo.vars.g_width, itsmo.map.getHeight(e)));
	}
};
itsmo.map.getHeight = function(e) {
	var h = e.outerHeight({margin: true});
	e.children().each(function() {
		h = Math.max(h, itsmo.map.getHeight($(this)));
	});
	return h;
};
itsmo.map.onClickZoomIn = function() {
	if (null != itsmo.vars.g_map_obj) {
		itsmo.vars.g_map_obj.zoomIn();
	}
	return false;
};
itsmo.map.onClickZoomOut = function() {
	if (null != itsmo.vars.g_map_obj) {
		itsmo.vars.g_map_obj.zoomOut();
	}
	return false;
};
itsmo.map.onChangeZoom = function() {
	itsmo.map.onMouseUp();
	itsmo.map.onChangeLatLon();

	var afterZoom = itsmo.vars.g_map_obj.getZoom();
	var mapType = itsmo.vars.g_map_obj.getMapType();
	var zoomRange = mapType.zoomRange;

	$('.position-zoom .zup').removeClass('btn-disable');
	$('.position-zoom .zdown').removeClass('btn-disable');
	
	if(afterZoom == zoomRange.length - 1) {
		$('.position-zoom .zup').addClass('btn-disable');
		$('.position-zoom .zdown').removeClass('btn-disable');
	}

	if(afterZoom == 0) {
		$('.position-zoom .zup').removeClass('btn-disable');
		$('.position-zoom .zdown').addClass('btn-disable');
	}
	if(action == 'transit' && typeof(itsmo.transit.getGoalStation) == 'function') {
		itsmo.transit.getGoalStation();
	}
	if(action == 'lasttrain' && typeof(itsmo.lastTrain.initStartStations) == 'function'){
		itsmo.lastTrain.initStartStations();
		itsmo.lastTrain.mapChangeZoom();
	}

};
itsmo.map.onChangeLatLon = function() {
	var latlon = itsmo.vars.g_map_obj.getLatLon();
	itsmo.util.getLocalStorage().setItem(itsmo.vars.g_keyLastLatLon,
		latlon.lat + ',' + latlon.lon + ',' + itsmo.vars.g_map_obj.getZoom());
	// 施設検索リンクを調整。
	var box = itsmo.vars.g_map_obj.getLatLonBox();
	box.min = itsmo.map.toMilliSec(box.min);
	box.max = itsmo.map.toMilliSec(box.max);
	box = '/c/?box=' + encodeURIComponent(box.min.lat + ',' + box.max.lat + ',' + box.min.lon + ',' + box.max.lon);
	$('#id_to_c').attr('href', box);

	if(action == 'lasttrain' && typeof(itsmo.lastTrain.initStartStations) == 'function')
		itsmo.lastTrain.initStartStations();
};

itsmo.vars.dialog_location = null;
itsmo.vars.dialog_no_location = null;
itsmo.vars.timeout_gps = null;

itsmo.map.move_now_location = function() {
	// check case click page detail get location
	// if (itsmo.vars.dialog_location == null) {
	// 	itsmo.vars.dialog_location = $( "#dialog-confirm-location" ).dialog({
	// 	  autoOpen: false,
	//       resizable: false,
	//       modal: true,
	//       buttons: [
	//       	{
	// 	      text: "キャンセル",
	// 	      'class' : 'btn-dialog-cancel',
	// 	      click: function() {
	// 	        $( this ).dialog( "close" );
		        
	// 	        if (itsmo.vars.dialog_no_location != null) {
	// 	        	itsmo.vars.dialog_no_location.dialog("open");
	// 	        } else {
	// 	        	itsmo.vars.dialog_no_location = $( "#dialog-cannot-location" ).dialog({
	// 	        	  autoOpen: false,
	// 			      resizable: false,
	// 			      modal: true,
	// 			      buttons: [
	// 				    {
	// 				      text: "ＯＫ",
	// 				      'class' : 'btn-dialog-ok',
	// 				      click: function() {
	// 				        $( this ).dialog( "close" );
	// 				      }
	// 				    }
	// 			      ]
	// 			    });
	// 	        	itsmo.vars.dialog_no_location.dialog("open");
	// 	        }

	// 	      }
	// 	    },
	// 	    {
	// 	      text: "ＯＫ",
	// 	      'class' : 'btn-dialog-ok',
	// 	      click: function() {
	// 	        $( this ).dialog( "close" );
	// 	      }
	// 	    }
	//       ]
	//     });
	// }

	$('.toast-gps').show();

	if(itsmo.vars.timeout_gps != null) {
		clearTimeout(itsmo.vars.timeout_gps);
	}
	itsmo.vars.timeout_gps = setTimeout(function() {
		if (navigator.geolocation) {
		} else {
			$('.toast-gps').hide();
			alert('位置取得機能がありません。');
			// if (itsmo.vars.dialog_location != null) {
			// 	itsmo.vars.dialog_location.dialog("open");
			// }
			// localStorage.removeItem('isGPS');
			// localStorage.removeItem('currentLocationTransit');
			return false;
		}
		navigator.geolocation.getCurrentPosition(
			itsmo.map.on_move_now_location_success
			, itsmo.map.on_move_now_location_error
			,{ enableHighAccuracy: true, timeout: 10 * 1000, maximumAge: 20 * 1000 }
		);
	}, 500);
	
};

itsmo.vars.moveCurrentLocation = true;
itsmo.map.on_move_now_location_success = function(position) {
	$('.toast-gps').hide();
	// 世界測地系を変換。
	// // check page location detail.
	var me;
	var _balloon = localStorage.getItem("mapBalloon");
	if(_balloon !=null && _balloon !=""){
		me  = JSON.parse(_balloon);
		if(me.flag == true && me.location == false){
			// get latlon.
			var pathArray = me.c_detail.split( '/' );
			pathArray = pathArray.map(function(i){
				return window.decodeURIComponent(i)
			})
			latlon_detail = pathArray[3].split('_');
			var lat = latlon_detail[0];
			var lon = latlon_detail[1];
			var latlon = itsmo.map.toLatLon(lat,lon);
			itsmo.vars.g_map_obj.moveLatLon(latlon);
			return;
		}
	}
	//if(action != 'detail') {
		var pLat = itsmo.map.getParameterByName('lat');
		var pLon = itsmo.map.getParameterByName('lon');
		var pBaseurl = ''; //itsmo.map.getParameterByName('baseurl');
		if((pLat == '' && pLon == '') || itsmo.vars.moveCurrentLocation) {
			if(pBaseurl == '') {
				var latlon = new ZDC.LatLon(position.coords.latitude, position.coords.longitude);
				latlon = ZDC.wgsTotky(latlon);

				var isCenterPosition = itsmo.util.getLocalStorage().getItem(itsmo.vars.g_keyLastLatLon) != null;
				var isTransitMoveCurrentLocation = itsmo.util.getLocalStorage().getItem('transitMoveCurrentLocation') != null;
				console.log("isCenterPosition", isCenterPosition);
				if (action == 'transit') {
					if (!isCenterPosition || !isTransitMoveCurrentLocation) {
						itsmo.vars.g_map_obj.moveLatLon(latlon);
						localStorage.setItem('transitMoveCurrentLocation', true);
					}
				} else {
					itsmo.vars.g_map_obj.moveLatLon(latlon);
					localStorage.setItem('transitMoveCurrentLocation', true);
				}

				// itsmo.vars.g_map_obj.moveLatLon(latlon);
				itsmo.vars.g_map_obj.setZoom(17 - 2);
				localStorage.removeItem('map_location');

				// save current location
				// itsmo.util.getLocalStorage().setItem('currentLocationTransit', {'lat': position.coords.latitude, 'lon' : position.coords.longitude});
			}
		}
	//}
	var transit_location = itsmo.util.getLocalStorage().getItem('transit_location');
	if(transit_location != null && transit_location != '') {
		var latlon = new ZDC.LatLon(transit_location.lat, transit_location.lon);
		itsmo.vars.g_map_obj.moveLatLon(latlon);
	}
	if(action == 'transit' && typeof(itsmo.transit.afterGetCurrentLocation) == 'function') {
		itsmo.transit.afterGetCurrentLocation(true, new ZDC.LatLon(position.coords.latitude, position.coords.longitude)); 
	}else if(action == 'lasttrain' && typeof(itsmo.lastTrain.afterGetCurrentLocation) == 'function') {
		setTimeout(function() { itsmo.lastTrain.afterGetCurrentLocation(true); }, 300);
	}
	itsmo.vars.moveCurrentLocation = true;
	// localStorage.setItem('isGPS', true);
};

itsmo.map.on_move_now_location_error = function(err) {
	alert('位置が取得できません。');
	$('.toast-gps').hide();
	// if (itsmo.vars.dialog_location != null) {
	// 	itsmo.vars.dialog_location.dialog("open");
	// }
	var me;
	var _balloon = localStorage.getItem("mapBalloon");
	if(_balloon !=null && _balloon !=""){
		me  = JSON.parse(_balloon);
		if(me.flag == true && me.location == false){
			// get latlon.
			var pathArray = me.c_detail.split( '/' );
			pathArray = pathArray.map(function(i){
				return window.decodeURIComponent(i)
			})
			latlon_detail = pathArray[3].split('_');
			var lat = latlon_detail[0];
			var lon = latlon_detail[1];
			var latlon = itsmo.map.toLatLon(lat,lon);
			itsmo.vars.g_map_obj.moveLatLon(latlon);
			return;
		}
	}
	//if(action != 'detail') {
		var pLat = itsmo.map.getParameterByName('lat');
		var pLon = itsmo.map.getParameterByName('lon');
		var pBaseurl = ''; //itsmo.map.getParameterByName('baseurl');
		if((pLat == '' && pLon == '') || itsmo.vars.moveCurrentLocation == false) {
			if(pBaseurl == '') {
				var store_local = localStorage.getItem('map_location');
				if(store_local !=null && store_local !=''){
					var _ll = new ZDC.LatLon(D_DEF_LAT / 3600000,D_DEF_LON / 3600000);
					itsmo.vars.g_map_obj.moveLatLon(new ZDC.LatLon(_ll.lat,_ll.lon));
					localStorage.removeItem('map_location');
				}
				// check latlng taken from inside app.
				if(geo_Location != "" && geoLat != "" && geoLon != ""){
					/**
					 * defaul word datum : geo = 1;
					 * if geo = 1 :geo_Location == 'tkywgs' : word datum
					 * if geo = 0 :geo_Location == 'wgstky' : tokyo datum
					 * if geo = false : default is latlon tokyo.
					 */
					// case 1: JP datum
					if(geo_Location == 'wgstky'){
						var ll = new ZDC.LatLon(geoLat / 3600000,geoLon / 3600000);
						itsmo.vars.g_map_obj.moveLatLon(ll);						
					}else if(geo_Location == 'tkywgs'){
						// world datum
						// 日本->世界
						var ll = new ZDC.LatLon(geoLat / 3600000,geoLon / 3600000);
						var cnvll = ZDC.tkyTowgs(ll);
						itsmo.vars.g_map_obj.moveLatLon(cnvll);
					}else{
						var _default = new ZDC.LatLon(D_DEF_LAT / 3600000,D_DEF_LON / 3600000);
						itsmo.vars.g_map_obj.moveLatLon(new ZDC.LatLon(_default.lat,_default.lon));
					}
				}
			}
		}
	//}
	var transit_location = itsmo.util.getLocalStorage().getItem('transit_location');
	if(transit_location != null && transit_location != '') {
		itsmo.vars.g_map_obj.moveLatLon(new ZDC.LatLon(transit_location.lat, transit_location.lon));
	}
	if(action == 'transit' && typeof(itsmo.transit.afterGetCurrentLocation) == 'function') {
		itsmo.transit.afterGetCurrentLocation(false); 
	}else if(action == 'lasttrain' && typeof(itsmo.lastTrain.afterGetCurrentLocation) == 'function'){
		setTimeout(function(){
			itsmo.lastTrain.afterGetCurrentLocation(false);
		}, 300);
	}
	// localStorage.removeItem('isGPS');
	// localStorage.removeItem('currentLocationTransit');
};
itsmo.map.callbackG = function(){

};
itsmo.map.onMouseDown = function() {
//*
	itsmo.vars.g_sec_drag = itsmo.vars.g_tm_drag_start = 0;
	itsmo.vars.g_latlon_mousedown = itsmo.vars.g_map_obj.getPointerPosition();
	itsmo.map.onMouseUp();
	itsmo.vars.g_timeoutid_point_address = window.setTimeout(itsmo.map.onTimeoutPointAddress, itsmo.vars.g_mousedown_timeout);
//*/
	itsmo.map.hideMsgWindow();

	if('undefined' != typeof(map_classic)) {
		map_classic.hideMapType();
	}

	// 2015/11/30 Doan Du add [
	if(itsmo.vars.detailBalloon){
		itsmo.vars.detailBalloon.close();
		itsmo.map.detailBalloonSmall();
	}
	// 2015/11/30 Doan Du add ]
	if(action == 'transit' && typeof(itsmo.transit.getGoalStation) == 'function') {
		itsmo.transit.closeToast();
		itsmo.transit.closeDetailGoalWidget();
	}

	if(action == 'lasttrain' && typeof(itsmo.lastTrain.initStartStations) == 'function'){
		itsmo.lastTrain.closeDetailBalloon();
	}
	if(action == 'lasttrain' && typeof(itsmo.lastTrain.closeDetailBalloon) == 'function')
		itsmo.lastTrain.closeDetailBalloon();
		itsmo.lastTrain.closeAlert();
};

itsmo.map.onMouseUp = function() {
//*
	if (null != itsmo.vars.g_timeoutid_point_address) {
		window.clearTimeout(itsmo.vars.g_timeoutid_point_address);
		itsmo.vars.g_timeoutid_point_address = null;
	}
//*/
};
itsmo.map.onTimeoutPointAddress = function() {
	itsmo.map.onMouseUp();
	itsmo.map.onDragEnd();
	if (itsmo.vars.g_sec_drag >= itsmo.vars.g_mousedown_timeout * 1 / 2) {
		return;
	}
	itsmo.map.showPointAddress(itsmo.vars.g_latlon_mousedown);
	if (loginFlag == '1') {
		itsmo.vars.g_poihistoryFlag = 1;
	}
};
itsmo.map.onDragStart = function() {
	itsmo.vars.g_tm_drag_start = Date.now();
	if(balloon !=null && balloon !=""){
		var me  = JSON.parse(balloon);
        data = {flag:false,c_detail:me.c_detail};
        localStorage.setItem("mapBalloon",JSON.stringify(data));
	}
};
itsmo.map.onDragEnd = function() {
	if (itsmo.vars.g_tm_drag_start <= 0) {
		return;
	}
	var i = Math.abs(Date.now() - itsmo.vars.g_tm_drag_start);
	if (i >= 1) {
		itsmo.vars.g_sec_drag += i;
	}
	itsmo.vars.g_tm_drag_start = 0;

	if (action == 'myhome' && mode == 'add') {
		latlon =  itsmo.vars.g_map_obj.getLatLon();
		latlonarr = itsmo.map.toMilliSec(latlon);
		itsmo.vars.g_myhome_data.latlon = latlon;
		itsmo.vars.g_myhome_data.lat    = latlonarr.lat;
		itsmo.vars.g_myhome_data.lon    = latlonarr.lon;

		var callback = function(result) {
			itsmo.map.showPointAddressMyhomeCallback(result, latlon);
		};
		itsmo.map.getShowPointAddress(callback, latlon);
	}

	if(action == 'transit' && typeof(itsmo.transit.getGoalStation) == 'function') {
		itsmo.transit.getGoalStation(true);
	}

	if(action == 'lasttrain')
		itsmo.lastTrain.mapDragEnd();
};

itsmo.map.showPointAddress = function(latlon) {
	if (undefined == latlon || null == latlon) {
		latlon = itsmo.vars.g_map_obj.getLatLon();
	}
	itsmo.map.hideMsgWindow();
	var getAddr = function(result) {
		itsmo.map.showPointAddressCallback(result, latlon);
		if (itsmo.vars.g_poihistoryFlag == 1) {
			itsmo.history.addAddr(itsmo.vars.g_pointData);
			itsmo.vars.g_poihistoryFlag = 0;
		}
	};
	itsmo.map.getShowPointAddress(getAddr, latlon);
}

itsmo.map.getShowPointAddress = function(callback, latlon) {

	if(itsmo.vars.g_ajax_point_address != null) {
		itsmo.lib.XMLHttpRequest2_abort(itsmo.vars.g_ajax_point_address);
	}
	itsmo.vars.g_ajax_point_address = itsmo.lib.XMLHttpRequest2_send(
		'/map/right_click.php'
		, callback
		, 'GET'
		, {'lat': latlon.lat, 'lon': latlon.lon}
		, 'json');
};

itsmo.map.showPointAddressCallback = function(result, latlon) {
	if (result.err) {
		return false;
	}

	if (typeof(result[0]) == 'undefined') {
		return false;
	}

	if (result[0] == null) {
		return false;
	}

	var addr = result[0].address.text;
	var zip = result[0].zipcode;

	if (zip != '-' && zip != null && zip != 'null') {
		result = '〒' + zip + ' ' + addr;
	} else {
		result = addr;
	}
	if (null != itsmo.vars.g_widget_point_address) {
		itsmo.vars.g_widget_point_address.close();
		itsmo.vars.g_map_obj.removeWidget(itsmo.vars.g_widget_point_address);
	}
    if (null != map_classic.addressWidgetPopup){
        map_classic.addressWidgetPopup.close();
        itsmo.vars.g_map_obj.removeWidget(map_classic.addressWidgetPopup);
        map_classic.addressWidgetPopup = null;
    }
	itsmo.vars.g_pointData			= function(){};
	itsmo.vars.g_pointData.addr		= addr;
	itsmo.vars.g_pointData.zip		= zip;
	itsmo.vars.g_pointData.latlon	= latlon;
	itsmo.vars.g_pointData.offsetY	= 0;
    /*Mbase start deleting - update behavior for address small balloon 2015/12/29*/
//	itsmo.vars.g_pointData.result	=
//		'<div class="smartmap-fuki-waku"><div class="smartmap-fuki"><article class="shop-detail-map">'
//		+ '<a href="javascript:void(0);" onClick="itsmo.map.toggleNaviOtherMenu();return false;"><h1>'
//		+ result + '</h1></a></article></div><span class="fuki-arrow"></span></div>';
	itsmo.vars.g_pointData.onClickFunc	= function(moveTo) {
		map_classic.showAddressWidgetPopup(itsmo.vars.g_pointData.latlon, itsmo.vars.g_pointData.result, itsmo.vars.g_pointData.offsetY, 10);
	};
    /*Mbase end deleting*/
    /*Mbase start adding - update behavior for address small balloon 2015/12/29*/
    itsmo.vars.g_pointData.result = 
        '<div class="map-balloon-address-m"><a href="javascript:void(0);" style="display: block;"'
        +'onclick="itsmo.map.toggleNaviOtherMenu();return false;"><ul><li class="poi-address-name">'
        +'<span class="ico-address"> </span>'+ result +'</li></ul></a></div>';
    /*Mbase end adding*/
	itsmo.vars.g_widget_point_address = itsmo.map.makeSearchResultMarker(-9999, {
			latlon:	latlon
		,	html:	itsmo.vars.g_pointData.result
        ,   isAddressMarker: true
		,   markerhtml : '<div class="map-balloon-s"><a href="javascript:void(0);" onclick="itsmo.map.onClickSearchResultMarker(%n%);return false;"><span class="ico-address"></span></a></div>'
	});
	itsmo.vars.g_map_obj.addWidget(itsmo.vars.g_widget_point_address);
	itsmo.vars.g_widget_point_address.open();
	//itsmo.vars.g_pointData.onClickFunc();
    if(itsmo.util.getLocalStorage().getItem('searchBalloon') == 'medium'){
        map_classic.showAddressWidgetPopup(itsmo.vars.g_pointData.latlon, itsmo.vars.g_pointData.result, itsmo.vars.g_pointData.offsetY, 10);
    }
    itsmo.vars.g_map_obj.moveLatLon(latlon);
};
/*
itsmo.map.toggle_traffic = function() {
	if (null == itsmo.vars.g_widget_traffic) {
		itsmo.vars.g_widget_traffic = new ZDC.Traffic({
			date: '201101011200'
		});
		itsmo.vars.g_map_obj.addWidget(itsmo.vars.g_widget_traffic);
	}
	var e = $('#id_traffic_icon');
	e.removeClass('icon-menu03-act').removeClass('icon-menu03');
	itsmo.vars.g_widget_traffic.hidden();
	itsmo.vars.g_widget_traffic_onoff = !itsmo.vars.g_widget_traffic_onoff;
	if (!itsmo.vars.g_widget_traffic_onoff) {
		e.addClass('icon-menu03');
		return false;
	}
	e.addClass('icon-menu03-act');
	var d = new Date();
	d = d.getFullYear() + ('0' + (d.getMonth() + 1)).substring(0, 2)
		 + ('0' + d.getDate()).substring(0, 2)
		 + ('0' + d.getHours()).substring(0, 2)
		 + '00';
	itsmo.vars.g_widget_traffic.setDate(d);
	itsmo.vars.g_widget_traffic.visible();
};
*/

itsmo.map.toggleOtherMenu = function(forceShow) {
	var e = $('#id_other_menu');
	if (null == forceShow || undefined == forceShow) {
		forceShow = !itsmo.vars.g_widget_static_map_other_menu.blShow;
	}
	if (forceShow) {
		itsmo.vars.g_widget_static_map_other_menu.open();
		itsmo.vars.g_widget_static_map_other_menu.blShow = true;
	} else {
		itsmo.vars.g_widget_static_map_other_menu.close();
		itsmo.vars.g_widget_static_map_other_menu.blShow = false;
	}
};
itsmo.map.toggleOtherMenuSearchMode = function(forceShow) {
	var e = $('#id_other_menu_searchmode');
	if (null == forceShow || undefined == forceShow) {
		forceShow = !itsmo.vars.g_widget_static_map_menu_searchmode_other.blShow;
	}
	if (forceShow) {
		itsmo.vars.g_widget_static_map_menu_searchmode_other.open();
		itsmo.vars.g_widget_static_map_menu_searchmode_other.blShow = true;
	} else {
		itsmo.vars.g_widget_static_map_menu_searchmode_other.close();
		itsmo.vars.g_widget_static_map_menu_searchmode_other.blShow = false;
	}
};
itsmo.map.clearSearchMode = function() {
	var n = window.confirm('地図をクリアしてよろしいですか？');
	if (n) {
		baseurl = basequery = '';
		itsmo.vars.g_search_data = [];
		itsmo.map.clearSearchResultWidget();
		itsmo.map.hideMsgWindow();
		itsmo.map.setSearchMode();
	}
};
itsmo.map.setSearchMode = function() {
	itsmo.vars.g_widget_static_map_other_menu.close();
	itsmo.vars.g_widget_static_map_other_menu.blShow = false;
	itsmo.vars.g_widget_static_map_menu_searchmode_other.close();

	if (action == 'detail' || 'detail_beauty' == action) {
		itsmo.vars.g_widget_static_map_menu.open();
		itsmo.vars.g_widget_static_map_menu_searchmode.close();
		$('#id_div_myhomemode').hide();
	} else if (action == 'myhome' && mode == 'add') {
		$('#id_div_myhomemode').show();
		itsmo.vars.g_widget_static_map_menu.close();
		itsmo.vars.g_widget_static_map_menu_searchmode.close();
	} else if (action == 'myhome' && mode == 'view') {
		itsmo.vars.g_widget_static_map_menu.open();
		itsmo.vars.g_widget_static_map_menu_searchmode.close();
		$('#id_div_myhomemode').hide();
	} else if (null == baseurl || baseurl.length <= 0) {
		itsmo.vars.g_widget_static_map_menu.open();
		itsmo.vars.g_widget_static_map_menu_searchmode.close();
		$('#id_div_myhomemode').hide();
	} else {
		itsmo.vars.g_widget_static_map_menu_searchmode.open();
		itsmo.vars.g_widget_static_map_menu.close();
		$('#id_div_myhomemode').hide();
	}
};

itsmo.map.mydata = function() {
	prm = 'tab=mydata';
	if (action == '') {
		prm += '&myhomeFlag='+1+'&myspotFlag='+1;
	} else if ((action == 'myhome' && mode == 'view')) {
		prm += '&myhomeFlag='+1;
	}

	itsmo.lib.XMLHttpRequest2_send('/mypage/ajax.php', itsmo.map.mydataCallback, 'GET', prm, 'xml');
};

itsmo.map.mydataCallback = function (result, dataType) {
	latlon = itsmo.map.toLatLon($(result).find('home').find('lat').text(),$(result).find('home').find('lon').text());
	itsmo.vars.g_myhome_data.latlon   = latlon;
	itsmo.vars.g_myhome_data.lat      = $(result).find('home').find('lat').text();
	itsmo.vars.g_myhome_data.lon      = $(result).find('home').find('lon').text();
	itsmo.vars.g_myhome_data.addr     = $(result).find('home').find('addr').text();
	itsmo.vars.g_myhome_data.balloon  = $(result).find('home').find('balloon').text();
	itsmo.map.maplink('#id_div_myhome_marker_html', latlon);
	cnt = 0;
    var isMedium = false;
    if(itsmo.util.getLocalStorage().getItem('searchBalloon') == 'medium'){
        isMedium = true;
    }
	$(result).find('spots').each(function()
	{
		cnt++;
		latlon = itsmo.map.toLatLon($(this).find('lat').text(), $(this).find('lon').text());
		list         = function(){};
		list.id      = $(this).find('id').text();
		list.balloon = $(this).find('balloon').text();
		list.latlon  = latlon;
		list.lat     = $(this).find('lat').text();
		list.lon     = $(this).find('lon').text();
		list.url     = $(this).find('url').text();
		if (list.url) {list.flg = true;} else {list.flg = false;}
		itsmo.vars.g_myspot_data[list.id] = list;
		itsmo.map.maplink('#id_div_myspot_marker_html', list.latlon, list.id, isMedium);
	});

	if (action=='myhome' && mode=='view') {
		itsmo.map.onClickMyhomeResultMarker();
	}
};

itsmo.map.search = function(showAllPoint, openNearestPoint) {
	if (false != openNearestPoint && true != openNearestPoint) {
		openNearestPoint = false;
	}
	var q = basequery;
	if (q.length >= 1) {
		q += '&';
	}
	q += 'spmode=datajson';
	var url = baseurl;
	var page = Math.floor(itsmo.vars.g_search_pos / itsmo.vars.g_search_page_rows);
	if (page >= 1) {
		if (q.indexOf('page=') >= 0) {
			q = q.replace(/page=[0-9]+/, 'page=' + page);
		} else {
			url += page + '/';
		}
	}

	$('.position-category-search').hide();
	$('.loading-box').attr('data-type', 'loading-box');

	$('.loading-content').css('width', '176px');
	$('.loading-content').html('読み込み中...');
	$('.loading-box').css('display' , 'table');

	var $header_search = $('.header-search');
	$header_search.find('input[type="search"]').blur();

	itsmo.lib.XMLHttpRequest2_send(url, function(data, dataType) {
		itsmo.vars.g_search_allcnt = data.allcnt;
		var maxnum = Math.max(itsmo.vars.g_search_rows, data.items.length);
		while (itsmo.vars.g_search_data.length < (itsmo.vars.g_search_pos + maxnum)) {
			itsmo.vars.g_search_data.push(null);
		}
		var i;
		for (i = 0; i < maxnum; ++i) {
			itsmo.vars.g_search_data[itsmo.vars.g_search_pos + i] = i < data.items.length ? data.items[i] : null;
		}
		// 4066 : move latlon nearest.
		// 20151216 Doan Du [
		var fixzoom = itsmo.map.getParameterByName('fixzoom');
		var baseUrl = itsmo.map.getParameterByName('basequery');
		var center = itsmo.util.getLocalStorage().getItem(itsmo.vars.g_keyLastLatLon);
		var flag = localStorage.getItem("flag_search");
		//var box = itsmo.vars.g_map_obj.getLatLonBox();
		//var flag = box.isLatLonInclude(new ZDC.LatLon(35.678144444,139.769494444))
		
		var _ll;
		if(center != null && center != undefined) {
			_ll = center.split(',');
		}
		var ll = {lat:parseFloat(_ll[0]), lon: parseFloat(_ll[0])};
		var distance = [];
		var j = [];
		var temp = [];
		if (data.items.length > 0) {
			if(data.items.length > 1){
				for (i = 0; i < data.items.length; i++) {
			        distance.push([data.items[i].lat, data.items[i].lon]);
			        var dislatlon = new ZDC.LatLon(data.items[i].lat, data.items[i].lon);
			        var a = ZDC.getLatLonToLatLonDistance(center,dislatlon);
			        temp.push([data.items[i].lat, data.items[i].lon,a]);
			        j.push(a);
			    }
			}
		    var min = Math.min.apply(null,j);
		    var index = j.indexOf(min);
		    var ll = temp[index];
			if(fixzoom == "" && flag == null){
			    itsmo.vars.g_map_obj.moveLatLon(new ZDC.LatLon(ll[0] / 3600000,ll[1] / 3600000));
			}else if(fixzoom == "" && flag != null){
				if(JSON.parse(localStorage.getItem("flag_search")) == true){
					itsmo.vars.g_map_obj.moveLatLon(new ZDC.LatLon(ll[0] / 3600000,ll[1] / 3600000));
					localStorage.removeItem("flag_search");
				}
			}else if(fixzoom != "" && flag != null){
				if(JSON.parse(localStorage.getItem("flag_search")) == true){
					itsmo.vars.g_map_obj.moveLatLon(new ZDC.LatLon(ll[0] / 3600000,ll[1] / 3600000));
					localStorage.removeItem("flag_search");
				}
			}
		}
		// 20151216 Doan Du add ]
		itsmo.map.setNextBackBtn();
		itsmo.map.showSearchResultWidget(showAllPoint, openNearestPoint);
		if (data.allcnt <= 0) {
			$('.loading-content').css('width', '85%');
			$('.loading-content').html(
				'<article class="article_noresult" id="article_noresult">'
				+ '<h1>検索結果が見つかりませんでした。</h1>'
				+ '<ul>'
				+ '<li><span>検索範囲は中心から半径10km以内です。</span></li>'
				+ '<li><span>キーワードが正しく入力されているかご確認ください。</span></li>'
				+ '<li><span>別のキーワードで試してみてください。</span></li>'
				+ '<li><span>別のエリア・ジャンル・こだわり条件で検索してみてください。</span></li>'
				+ '</ul></article>');
			$('.loading-box').attr('data-type', 'data-not-found');
			$('.loading-box').css('display' , 'table');

			$('.position-show-list').hide();
			$('.position-research').hide();
			$('.mapbtn-icon-balloonsinze').hide();
			return;
		}

		$('.loading-box').css('display' , 'none');

		//console.log(baseurl);
		//console.log(baseurl.indexOf('search/freeword') != -1);

		var re = /search\/freeword\/(.*)\/(.*)/gi;
		if(res = re.exec(baseurl)) {
			$('.position-show-list').hide();
			// if (res.length >= 3 && res[2] != 'all') {
			// 	$('.position-show-list').hide();
			// } else {
			// 	$('.position-show-list').show();
			// }
		} else {
			$('.position-show-list').show();
		}

		$('.position-research').show();
		$('.mapbtn-icon-balloonsinze').show();
	}, 'GET', q, 'json');
};

itsmo.map.setNextBackBtn = function() {
	var page = Math.floor(itsmo.vars.g_search_pos / itsmo.vars.g_search_rows);
	var i = $('#id_nav_searchmode ul li');
	if (page < 10 && (itsmo.vars.g_search_pos + itsmo.vars.g_search_rows) < itsmo.vars.g_search_allcnt) {
		// 次へを使用可能に。
		i.eq(1).find('span.map-menu-off:first').hide();
		i.eq(1).find('a:first').show();
	} else {
		// 次へを使用不可に。
		i.eq(1).find('span.map-menu-off:first').show();
		i.eq(1).find('a:first').hide();
	}
	if (itsmo.vars.g_search_pos >= 1) {
		// 前へを使用可能に。
		i.eq(0).find('span.map-menu-off:first').hide();
		i.eq(0).find('a:first').show();
	} else {
		// 前へを使用不可に。
		i.eq(0).find('span.map-menu-off:first').show();
		i.eq(0).find('a:first').hide();
	}
};
itsmo.map.onClickNextSearchResult = function() {
	itsmo.map.hideMsgWindow();
	itsmo.map.toggleOtherMenuSearchMode(false);
	itsmo.vars.g_search_pos += itsmo.vars.g_search_rows;
	if (itsmo.vars.g_search_pos < itsmo.vars.g_search_data.length) {
		itsmo.map.showSearchResultWidget(true, true);
		itsmo.map.setNextBackBtn();
	} else {
		itsmo.map.search(false, true);
	}
};
itsmo.map.onClickBackSearchResult = function() {
	itsmo.map.hideMsgWindow();
	itsmo.map.toggleOtherMenuSearchMode(false);
	itsmo.vars.g_search_pos -= itsmo.vars.g_search_rows;
	if (itsmo.vars.g_search_pos < 0) {
		itsmo.vars.g_search_pos = 0;
	}
	itsmo.map.showSearchResultWidget(true, true);
	itsmo.map.setNextBackBtn();
};
itsmo.map.clearSearchResultWidget = function() {
	$.each(itsmo.vars.g_search_widget, function(i, val) {
		ZDC.clearInstanceListeners(val);
		itsmo.vars.g_map_obj.removeWidget(val);
	});
	itsmo.vars.g_search_widget = [];
};
itsmo.map.makeSearchResultMarker = function(n, data, is_detail) {
	if (null == data.latlon || undefined == data.latlon) {
		data.latlon = itsmo.map.toLatLon(data.lat, data.lon);
	}
	var default_icon = 'ico-default'; // symbol-"iconid"
	var html, offset, e, size;
	if (typeof data.markerhtml === 'undefined') {
		if(is_detail == true) {
			e = $('#id_div_detail_result');
		} else {
			e = $('#id_div_search_result_marker_html');
		}
		offset = new ZDC.Pixel(Math.floor(-e.width() / 2), -e.height() - 10);
		html = e.html();
		size = new ZDC.WH(e.width(), e.height()+10);
	} else if(typeof(data.isAddressMarker) != 'undefined' && data.isAddressMarker == true){ // Address marker case
        html = data.markerhtml;
		e = $('#id_div_calc_size');
		e.html(html);
        offset = new ZDC.Pixel(Math.floor(-e.width() / 2), -e.height() - 10);
		html = e.html();
		size = new ZDC.WH(e.width(), e.height()+10);
    }else { //other
		html = data.markerhtml;
		e = $('#id_div_calc_size');
		e.html(html);
		offset = new ZDC.Pixel(Math.floor(-e.width() / 2), -e.height());
		size = new ZDC.WH(e.width(), e.height());
	}
	html = html.replace('%n%', n);

	if(typeof(data.data) != 'undefined') {
		if(data.data.iconid != '') {
			default_icon = data.data.iconid;
		}
	}


	html = html.replace('%iconid%', default_icon);


	var marker = new ZDC.UserWidget(data.latlon,  {
			html:	html
		,	offset:	offset
		,   size:   size
	});
	marker._data = data;
	e = itsmo.map.onClickSearchResultMarker;
	if (typeof data.onClickFunc !== 'undefined') {
		e = data.onClickFunc;
	}
	ZDC.addListener(marker, ZDC.MARKER_MOUSEUP, e);
	return marker;
};
itsmo.map.showSearchResultWidget = function(showAllPoint, openNearestPoint) {
	if (false != openNearestPoint && true != openNearestPoint) {
		openNearestPoint = false;
	}
	itsmo.map.clearSearchResultWidget();
	var i;
	var cog = [];	// center of gravity
	var firstMarker = null;
	for (i = 0; i < itsmo.vars.g_search_rows; ++i) {
		var j = i + itsmo.vars.g_search_pos;
		if (itsmo.vars.g_search_data.length <= j) {
			continue;
		}
		j = itsmo.vars.g_search_data[j];
		if (null == j) {
			continue;
		}
		var marker = itsmo.map.makeSearchResultMarker(itsmo.vars.g_search_widget.length, j);
		cog.push(j.latlon);
		itsmo.vars.g_map_obj.addWidget(marker);
		marker.open();
		itsmo.vars.g_search_widget.push(marker);
		if (0 == i && openNearestPoint) {
			firstMarker = itsmo.vars.g_search_widget.length - 1;
		}
	}
	if (showAllPoint && cog.length >= 1) {
		i = itsmo.vars.g_map_obj.getAdjustZoom(cog);
		if(i !== null) {
			itsmo.vars.g_map_obj.moveLatLon(i.latlon);
			itsmo.vars.g_map_obj.setZoom(i.zoom);
		}
	}

	if(itsmo.vars.g_search_allcnt == 1) {
		itsmo.vars.g_search_widget[0].close();
		itsmo.map.largePopup(0);
		return;
	}

	if(itsmo.vars.g_search_widget != null && itsmo.vars.g_search_widget.length > 0
		&& 'undefined' != typeof(map_classic) && itsmo.util.getLocalStorage().getItem('searchBalloon') == 'medium') {

		$('.position-balloon-resize').addClass('btn-on');
	
		$.each(itsmo.vars.g_search_widget, function(i, widget) {
			var d = widget._data;
			map_classic.showUserWidgetPopup(d.latlon, d.html, 0, 10);
		});
	}

	var afterZoom = itsmo.vars.g_map_obj.getZoom();
	var mapType = itsmo.vars.g_map_obj.getMapType();
	var zoomRange = mapType.zoomRange;

	$('.position-zoom .zup').removeClass('btn-disable');
	$('.position-zoom .zdown').removeClass('btn-disable');
	
	if(afterZoom == zoomRange.length - 1) {
		$('.position-zoom .zup').addClass('btn-disable');
		$('.position-zoom .zdown').removeClass('btn-disable');
	}

	if(afterZoom == 0) {
		$('.position-zoom .zup').removeClass('btn-disable');
		$('.position-zoom .zdown').addClass('btn-disable');
	}


	if (null != firstMarker) {
		if(typeof(itsmo.vars.g_search_widget[firstMarker]) != 'undefined') {
			var d = itsmo.vars.g_search_widget[firstMarker]._data;
			// itsmo.map.onClickSearchResultMarker(firstMarker);
			// itsmo.vars.g_map_obj.moveLatLon(d.latlon);
		}
	}

	if(!itsmo.vars.is_hide_balloon) {
		itsmo.map.hideMsgWindow();
	}
};
itsmo.map.onClickSearchResultMarker = function(n , moveTo, extentHeight) {

	if(typeof(moveTo) == 'undefined') {
		moveTo = true;
	}

	if(typeof(extentHeight) == 'undefined') {
		extentHeight = 10;
	}

	if(itsmo.vars.g_pointData != null) {
		if (-9999 == n && typeof(itsmo.vars.g_pointData.onClickFunc) == 'function') {
			itsmo.vars.g_pointData.onClickFunc(moveTo);
			return;
		}
	}
	
	if (n < 0 || n >= itsmo.vars.g_search_widget.length) {
		itsmo.map.hideMsgWindow();
		return;
	}

	var d = itsmo.vars.g_search_widget[n]._data;
	if(moveTo) {
		itsmo.vars.g_map_obj.moveLatLon(d.latlon);
	}
	itsmo.map.showMsgWindow(d.latlon, d.html, 0, extentHeight);

	if(typeof(itsmo.vars.g_search_widget[n]) != 'undefined') {
		itsmo.vars.g_search_widget[n].close();
	}
};

itsmo.map.showMsgWindow = function(latlon, html, offset_y, h_extend, moveToPoint) {
	itsmo.map.hideMsgWindow();
	if (null == offset_y || undefined == offset_y) {
		offset_y = 0;
	}

	if (null == h_extend || undefined == h_extend) {
		h_extend = 0;
	}

	if (null == moveToPoint || undefined == moveToPoint) {
		moveToPoint = true;
	}

	var e = $('#id_div_calc_size');
	e.html(html);
	var w = e.width();
	var h = e.height() + h_extend;
	var offset = new ZDC.Pixel(Math.floor(-w / 2), -h + offset_y);
	itsmo.vars.g_msg_window_widget = new ZDC.UserWidget(latlon, {
			html:	html
		,	size:	new ZDC.WH(w, h)
		,	offset:	offset
	});
	
	if(moveToPoint) {
		itsmo.vars.g_map_obj.moveLatLon(latlon);
	}

	itsmo.vars.g_map_obj.addWidget(itsmo.vars.g_msg_window_widget);
	itsmo.vars.g_msg_window_widget.open();
};
itsmo.map.hideMsgWindow = function() {
	if (null != itsmo.vars.g_msg_window_widget) {
		itsmo.vars.g_msg_window_widget.close();
		itsmo.vars.g_map_obj.removeWidget(itsmo.vars.g_msg_window_widget);
	}

	if (null != itsmo.vars.largeWidget) {
		itsmo.vars.largeWidget.close();
		itsmo.vars.g_map_obj.removeWidget(itsmo.vars.largeWidget);
	}	

	if('undefined' != typeof(map_classic)) {
		// map_classic.hideUserWidgetPopup();
	}

	if(itsmo.vars.g_search_widget != null && itsmo.vars.g_search_widget.length > 0) {
		$.each(itsmo.vars.g_search_widget, function(i, widget) {
			widget.open();
		});
	}

/*
	if (null != itsmo.vars.g_widget_point_address) {
		itsmo.vars.g_widget_point_address.close();
		itsmo.vars.g_map_obj.removeWidget(itsmo.vars.g_widget_point_address);
	}
	itsmo.vars.g_widget_point_address = null;
*/
};
// 見えている範囲で再検索
itsmo.map.onClickResearch = function() {
	if(baseurl == null || baseurl == '') {
		return;
	}

	itsmo.map.hideMsgWindow();
	if('undefined' != typeof(map_classic)) {
		map_classic.hideUserWidgetPopup();
	}
	
	$('.position-show-list').hide();
	$('.position-research').hide();

	var i, j;

	var word = $('#map-search-box').val();
	if (word != '' && basequery !== '' && basequery.indexOf('freewd=') == -1) {
		basequery += '&freewd=' + encodeURIComponent(word);
	}
	
	basequery = basequery.split('&');
	j = [];
	for (i = 0; i < basequery.length; ++i) {
		if (
			// 0 != basequery[i].indexOf('box=') 
			0 != basequery[i].indexOf('lat=') 
			&& 0 != basequery[i].indexOf('lon=') 
			&& 0 != basequery[i].indexOf('map_type=') 
			&& basequery[i].length >= 1) {
			j.push(basequery[i]);
		}
	}
	basequery = j;

	var box = itsmo.vars.g_map_obj.getLatLonBox();
		i = itsmo.map.toMilliSec(box.getMax());
		j = itsmo.map.toMilliSec(box.getMin());
		box = 'box=' + j.lat + ',' + i.lat + ',' + j.lon + ',' + i.lon;

	var latlngSearch = itsmo.vars.g_map_obj.getLatLon();

	var mapTypeSearch = 'normal'; 
	if(action != 'transit' && action != 'lasttrain' 
		&& action != 'landmark' && action != 'tourist' ) {
		mapTypeSearch = 'normal';
	} else {
		mapTypeSearch = action;
	}

	// var re = /search\/freeword\/(.*)\/(.*)/gi;
	// if(res = re.exec(baseurl)) {
	// 	if (res.length >= 3 
	// 		&& (res[2] == 'all' || res[2] == 'addr' || res[2] == 'station' || res[2] == 'building')) {
	// 		basequery.push('map_type=' + mapTypeSearch);
	// 		basequery.push(box);
	// 		// basequery.push('lat=' + latlngSearch.lat + '&lon=' + latlngSearch.lon);
	// 	} 
	// }

	var re = /\/c\/(.*?)/gi;
	if(res = re.exec(baseurl)) {
		basequery.push('map_type=' + mapTypeSearch);
		// basequery.push(box);
		basequery.push('lat=' + latlngSearch.lat + '&lon=' + latlngSearch.lon);
	}

	basequery = basequery.join('&');
	itsmo.vars.g_search_pos = 0;
	itsmo.vars.onClickResearchFlag = true;
	itsmo.map.search(false, true);
};

itsmo.map.myhome_add = function(lat,lon,lvl) {

	itsmo.map.myhomeClear();

	$('#myhome_header').show();

	//データ格納
	var latlon = itsmo.map.toLatLon(lat,lon);
	itsmo.vars.g_myhome_data.latlon = latlon;
	itsmo.vars.g_myhome_data.lat    = lat;
	itsmo.vars.g_myhome_data.lon    = lon;

	var callback = function(result) {
		itsmo.map.showPointAddressMyhomeCallback(result, latlon);
	};
	itsmo.map.getShowPointAddress(callback, latlon);
};

itsmo.map.maplink = function (id, latlon, n, isMedium) {
	var e = $(id);
	var rawhtml = e.html();
	rawhtml = rawhtml.replace('%n%', n);
	var offset = new ZDC.Pixel(Math.floor(-e.width() / 2), -e.height());
	var marker = new ZDC.UserWidget(latlon,  {
			html:	rawhtml
		,	offset:	offset
	});
	marker._id = n;

	itsmo.map.g_maplink = marker;
	itsmo.vars.g_map_obj.addWidget(marker);
    
    //Open medium spot balloon if setting is medium
    if(isMedium == true){
        var d = itsmo.vars.g_myspot_data[n];
        map_classic.showMySpotWidgetPopup(itsmo.map.toLatLon(d.lat, d.lon), d.balloon, 0);
    } else {
        marker.open();
    }

	itsmo.vars.widgetMyData.push(marker);
};

itsmo.map.fukidashi = function (id, latlon, addr, pos_y) {
	var e = $(id);
	e.find('div.id_div_myhome_fukidashi_html p').html(addr);
	var rawhtml = e.html();
	itsmo.vars.g_map_obj.moveLatLon(latlon);
	itsmo.map.showMsgWindow(latlon, rawhtml, pos_y + 16);
};

itsmo.map.myhomeClear = function() {
	jQuery('header').each(function(i){
		jQuery(this).hide();
	});
};

itsmo.map.onClickMyhomeResultMarker = function() {
	var d = itsmo.vars.g_myhome_data;
	// itsmo.vars.g_map_obj.moveLatLon(d.latlon);
	itsmo.map.showMsgWindow(d.latlon, d.balloon, -39 + 18);
};

itsmo.map.onClickMyspotResultMarker = function(id) {
	var d = itsmo.vars.g_myspot_data[id];
	latlon = itsmo.map.toLatLon(d.lat, d.lon);
	itsmo.vars.g_map_obj.moveLatLon(latlon);
    map_classic.hideMySpotWidgetPopup();
    $.each(itsmo.vars.widgetMyData, function(i, widget) {
        if(typeof(widget._id) == 'undefined') {
            return;
        }
        //Close myspot small balloon
        if(widget._id == id){
            widget.close();
        }
    });
    map_classic.showMySpotWidgetPopup(latlon, d.balloon, 0);
	//itsmo.map.showMsgWindow(latlon, d.balloon, -39 + 18);
};

itsmo.map.showPointAddressMyhomeCallback = function(result, latlon) {
	var addr = '';
	var html_id = '';
	if (!result[0] || result[0].around == true) {
		itsmo.vars.g_myhome_data.addr = '';
		//決定リンク非表示
		$('#id_div_myhomemode span.btn-disable').show();
		$('#id_div_myhomemode a').hide();
		html_id='div#id_myhome_balloon_not';
	} else {
		addr = result[0].address.text;
		itsmo.vars.g_myhome_data.addr= addr;
		$('div.id_div_myhome_fukidashi_html p').html(addr);
		//決定リンク表示
		$('#id_div_myhomemode span.btn-disable').hide();
		$('#id_div_myhomemode a').show();
		html_id='div.id_div_myhome_fukidashi_html';
	}
	var pos_y = -18;
	if (mode != 'add') {
		pos_y = -39;
	}
	itsmo.map.fukidashi(html_id, latlon, addr, pos_y);
};

itsmo.map.toggleNaviOtherMenuOpen = function (id, m) {
	var d = itsmo.vars.g_myspot_data[id];
	callback = function(result) {
		itsmo.map.toggleNaviOtherMenuCallback(result,m);
	};
	itsmo.map.getShowPointAddress(callback, d.latlon);
};

itsmo.map.toggleNaviOtherMenuCallback = function(result,m) {
	if (result.err) {
		return false;
	}
	itsmo.map.toggleNaviOtherMenu(result[0].address.text,m);
};

itsmo.map.toggleNaviOtherMenu = function (addr, m) {
	$('#id_navi_toggle h1:first').html((addr != undefined && addr != '') ? addr : itsmo.vars.g_pointData.addr);
	if (m == 'myspot') {
		$('#id_navi_toggle_spot').hide();
		$('#id_navi_transit_app').hide();
	} else {
		$('#id_navi_toggle_spot').show();
		$('#id_navi_transit_app').show();
	}

	if (null != itsmo.vars.largeWidget) {
		itsmo.vars.largeWidget.close();
		itsmo.vars.g_map_obj.removeWidget(itsmo.vars.largeWidget);
	}

//	if('undefined' != typeof(map_classic)) {
//		map_classic.hideUserWidgetPopup();
//	}

	itsmo.map.showDialog('id_navi_toggle');
};
itsmo.map.transit_app=function(){
	var address=$('#id_navi_toggle h1').text();
	latlon = itsmo.vars.g_map_obj.getLatLon();
	if(is_iPhone == true)  {
		itsmo.map.open_app_ios(latlon.lat, latlon.lon, address);
	} else {
		itsmo.map.open_app_android(latlon.lat, latlon.lon, address);
	}
}

itsmo.map.navigateTo = function() {
	if(!itsmo.vars.g_pointData){
		latlon = itsmo.vars.g_map_obj.getLatLon();

		var callback = function(result){
			if (result.err) {
				return false;
			}
			var addr = result[0].address.text;
			var millisec = itsmo.map.toMilliSec(latlon);
			itsmo.util.startNaviTo(millisec.lat, millisec.lon, addr);
		};

		itsmo.map.getShowPointAddress(callback, latlon);
	}else{
		var millisec = itsmo.map.toMilliSec(itsmo.vars.g_pointData.latlon);
		itsmo.util.startNaviTo(millisec.lat, millisec.lon, itsmo.vars.g_pointData.addr);
	}
};

itsmo.map.townmapTo = function() {
	if (itsmo.util.vars.d_server_type == 'DEVELOP' || itsmo.util.vars.d_server_type == 'TEST') {
		var path = 'http://lab.zapl.znet-town.net/znettownm/sp/naviweb.php?cpid=0002&';
	} else {
		var path = 'http://zapl.znet-town.net/znettownm/sp/naviweb.php?cpid=0002&';
	}

	if(!itsmo.vars.g_pointData){
		latlon = itsmo.vars.g_map_obj.getLatLon();

		var callback = function(result){
			if (result.err) {
				return false;
			}
			var addr = result[0].address.text;
			var millisec = itsmo.map.toMilliSec(latlon);
			window.location.href = path + 'lon=' + millisec.lon + '&lat=' + millisec.lat;
		};

		itsmo.map.getShowPointAddress(callback, latlon);
	}else{
		var millisec = itsmo.map.toMilliSec(itsmo.vars.g_pointData.latlon);
		window.location.href = path + 'lon=' + millisec.lon + '&lat=' + millisec.lat;
	}

};

itsmo.map.hideDialog = function() {
	$('div.screen-wrap:first').hide();
};
itsmo.map.showDialog = function(id) {
	$('div.screen').height($('body').height());

	$('div.screen-wrap:first article').hide().filter('#' + id).show();
	$('div.screen-wrap:first').show();
};

itsmo.map.centerMapShowAddr = function () {
	if (loginFlag == '1') {
		itsmo.vars.g_poihistoryFlag = 1;
	}
	itsmo.map.showPointAddress();
};
//2015/12/13 task 4066 [
itsmo.map.onClickExecFreewordSearch4066 = function() {
	itsmo.map.hideMsgWindow();
	if('undefined' != typeof(map_classic)) {
		map_classic.hideUserWidgetPopup();
	}

	var cancel = false;
	$.each(itsmo.vars.addon_smartphone.onClickFreeword, function(i, v) {
		if (v()) {
			cancel = true;
		}
	});
	if (cancel) {
		return;
	}

	localStorage.setItem("flag_search", true);

	var word = $('#map-search-box').val();
	if($.trim(word) == '' || $.trim(word).length > 40) {
      	$('.loading-box').attr('data-type', 'keyword-empty');
		$('.loading-content').html('お手数ですが40文字以下で' + "\n" + '再検索してください。');
		$('.loading-box').css('display' , 'table');

		var $header_search = $('.header-search');
		$header_search.find('input[type="search"]').blur();
		return;
	}

	itsmo.util.addSearchHistory(word);
	word = word.replace('&', '%26');
	word = word.replace("\\", '%5c');
	window.history.pushState('obj', 'newtitle', itsmo.map.getSearchParamString());
	// use for commonLib
	// baseurl = '/search/freeword/'+encodeURIComponent(word)+'/common';

	// use for searchIndex
	// baseurl = '/search/freeword/'+encodeURIComponent(word)+'/all';

	// use search c
	baseurl = '/c/';

	//baseurl = '/search/freeword/'+encodeURIComponent(word)+'/all';
	// baseurl = '/search/freeword/'+encodeURIComponent(word)+'/all_common';
	// baseurl = '/c/'+encodeURIComponent(word)+'/0100000000%3A0100900000%3A010090002k/';
	var param = '';
	if (null != itsmo.util.searchFreewordCallback) {
		param = itsmo.util.searchFreewordCallback();
	}

	if (param.length >= 1) {
		basequery = param + '&getcurrentpos=1&fallbackwhole=1&sort_near=1&spmode=datajson&freewd='+encodeURIComponent(word);//+ '&sptype=list&sort_near=1&page=0';
		// basequery = param + '&getcurrentpos=1&fallbackwhole=1&sort_near=1';
	}

	itsmo.map.search(false, true);
	itsmo.vars.onClickResearchFlag = true;
};
//2015/12/13 task 4066 ]
itsmo.map.onClickExecFreewordSearch = function() {
	itsmo.map.hideMsgWindow();
	if('undefined' != typeof(map_classic)) {
		map_classic.hideUserWidgetPopup();
	}

	var cancel = false;
	$.each(itsmo.vars.addon_smartphone.onClickFreeword, function(i, v) {
		if (v()) {
			cancel = true;
		}
	});
	if (cancel) {
		return;
	}

	var word = $('#map-search-box').val();
	if($.trim(word) == '' || $.trim(word).length > 40) {
      	$('.loading-box').attr('data-type', 'keyword-empty');
		$('.loading-content').html('お手数ですが40文字以下で' + "\n" + '再検索してください。');
		$('.loading-box').css('display' , 'table');

		var $header_search = $('.header-search');
		$header_search.find('input[type="search"]').blur();
		return;
	}

	itsmo.util.addSearchHistory(word);
	word = word.replace('&', '%26');
	word = word.replace("\\", '%5c');
	window.history.pushState('obj', 'newtitle', itsmo.map.getSearchParamString());
	// use for commonLib
	// baseurl = '/search/freeword/'+encodeURIComponent(word)+'/common';

	// use for searchIndex
	// baseurl = '/search/freeword/'+encodeURIComponent(word)+'/all';

	// use search c
	baseurl = '/c/';

	//baseurl = '/search/freeword/'+encodeURIComponent(word)+'/all';
	// baseurl = '/search/freeword/'+encodeURIComponent(word)+'/all_common';
	// baseurl = '/c/'+encodeURIComponent(word)+'/0100000000%3A0100900000%3A010090002k/';
	var param = '';
	if (null != itsmo.util.searchFreewordCallback) {
		param = itsmo.util.searchFreewordCallback();
	}

	if (param.length >= 1) {
		basequery = param + '&getcurrentpos=1&fallbackwhole=1&sort_near=1&spmode=datajson&freewd='+encodeURIComponent(word);//+ '&sptype=list&sort_near=1&page=0';
		// basequery = param + '&getcurrentpos=1&fallbackwhole=1&sort_near=1';
	}

	itsmo.map.search(false, true);
	itsmo.vars.onClickResearchFlag = true;
};

itsmo.map.gotoList = function() {
	itsmo.map.hideMsgWindow();

	var cancel = false;
	$.each(itsmo.vars.addon_smartphone.onClickFreeword, function(i, v) {
		if (v()) {
			cancel = true;
		}
	});
	if (cancel) {
		return;
	}

	var re = /\/c\/(.*?)/gi;
	var res = re.exec(baseurl);
	if(baseurl != '' && res != null) {
		var mapTypeSearch = 'normal'; 
		if(action != 'transit' && action != 'lasttrain' 
			&& action != 'landmark' && action != 'tourist' ) {
			mapTypeSearch = 'normal';
		} else {
			mapTypeSearch = action;
		}

		if (itsmo.vars.onClickResearchFlag) {
			var i, j;
			basequery = basequery.split('&');
			j = [];
			for (i = 0; i < basequery.length; ++i) {
				if (
					0 != basequery[i].indexOf('spmode=') 
					&& 0 != basequery[i].indexOf('lat=') 
					&& 0 != basequery[i].indexOf('lon=') 
					&& 0 != basequery[i].indexOf('map_type=') 
					&& basequery[i].length >= 1) {
					j.push(basequery[i]);
				}
			}
			basequery = j;

			var box = itsmo.vars.g_map_obj.getLatLonBox();
				i = itsmo.map.toMilliSec(box.getMax());
				j = itsmo.map.toMilliSec(box.getMin());
				box = 'box=' + j.lat + ',' + i.lat + ',' + j.lon + ',' + i.lon;

			var latlngSearch = itsmo.vars.g_map_obj.getLatLon();

			

			// var re = /search\/freeword\/(.*)\/(.*)/gi;
			// if(res = re.exec(baseurl)) {
			// 	if (res.length >= 3 
			// 		&& (res[2] == 'all' || res[2] == 'addr' || res[2] == 'station' || res[2] == 'building')) {
			// 		basequery.push('map_type=' + mapTypeSearch);
			// 		basequery.push(box);
			// 		// basequery.push('lat=' + latlngSearch.lat + '&lon=' + latlngSearch.lon);
			// 	} 
			// }

			var re = /\/c\/(.*?)/gi;
			if(res = re.exec(baseurl)) {
				basequery.push('map_type=' + mapTypeSearch);
				// basequery.push(box);
				basequery.push('lat=' + latlngSearch.lat + '&lon=' + latlngSearch.lon);
			}
			basequery = basequery.join('&');
		} else {
			if (basequery != '') {
				basequery = basequery.replace("&spmode=datajson", "");
				basequery = basequery.replace("&map_type=normal", "");
				basequery = basequery.replace("&map_type=transit", "");
				basequery = basequery.replace("&map_type=lasttrain", "");
				basequery = basequery.replace("&map_type=landmark", "");
				basequery = basequery.replace("&map_type=tourist", "");

				basequery += '&map_type=' + mapTypeSearch;
			} else {
				basequery += 'map_type=' + mapTypeSearch;
			}
		}
		window.location.href = baseurl + '?' + basequery;
		return;
	}

	var word = $('#map-search-box').val();
	if($.trim(word) == '' || $.trim(word).length > 40) {
      	$('.loading-box').attr('data-type', 'keyword-empty');
		$('.loading-content').html('お手数ですが40文字以下で' + "\n" + '再検索してください。');
		$('.loading-box').css('display' , 'table');

		var $header_search = $('.header-search');
		$header_search.find('input[type="search"]').blur();
		return;
	}

	var param = '';
	if (null != itsmo.util.searchFreewordCallback) {
		param = itsmo.util.searchFreewordCallback();
	}
	var url = '/c/?getcurrentpos=1&fallbackwhole=1&sort_near=1';
	if (param.length >= 1) {
		url += '&' + param;
	}
	url += '&freewd=' + encodeURIComponent(word);
	
	window.location.href = url;

	// itsmo.util.execFreewordSearch('map-search-box');
};

itsmo.map.largePopup = function(i) {
	itsmo.map.hideMsgWindow();

	if(typeof(itsmo.vars.g_search_data[i].data) == 'undefined') {
		return;
	}
	
	var dt = itsmo.vars.g_search_data[i].data;
	var d = itsmo.vars.g_search_widget[i]._data;
	itsmo.vars.g_map_obj.moveLatLon(d.latlon);
	itsmo.map.showLargePopup(dt, d, 0, 10);

	if(typeof(itsmo.vars.g_search_widget[i]) != 'undefined') {
		itsmo.vars.g_search_widget[i].close();
	}
};

itsmo.map.navigator_callback = function() { return; }
itsmo.map.showLargePopup = function(dt, d, offset_y, h_extend) {	
	if (null == itsmo.vars.g_map_obj) {
		return;
	}

	var latlon = d.latlon;

	if (null != itsmo.vars.largeWidget) {
		itsmo.vars.largeWidget.close();
		itsmo.vars.g_map_obj.removeWidget(itsmo.vars.largeWidget);
	}

	var itemDistance = '';//'<li>検索地点から0m</li>';
	if(dt.distance != undefined){
		var temp = dt.distance;
		if((temp+'').length > 1) {
			if(temp >= 1000) {
				temp = temp/1000;
				temp = parseFloat(temp).toFixed(1);
				temp = temp +'km';
			} else {
				temp = temp +'m';
			}
			itemDistance = '<li>検索地点から'+temp+'</li>';
		}
	}
	var iconid = '';
	if(dt.iconid != '') {
		iconid = '<span class="'+dt.iconid+'"> </span>';

		if(dt.open_24 == 1) {
			iconid += '<span class="symbol-open24h"> </span>';
		}

		if(dt.toilet == 1) {
			iconid += '<span class="symbol-toilet"> </span>';
		}

		if(dt.alcohol == 1) {
			iconid += '<span class="symbol-beer"> </span>';
		}

		if(dt.atm == 1) {
			iconid += '<span class="symbol-atm"> </span>';
		}

		if(dt.tobacco == 1) {
			iconid += '<span class="symbol-cigarettes"> </span>';
		}
	}

	var opentime = '';
	if(dt.open_time != '' && dt.open_time != null) {
        opentime = '<li>'+dt.open_time+'</li>';
	}

	var off_day = '';
	if(dt.off_day != '' && dt.off_day != null) {
        off_day = '<li>定休日:'+dt.off_day+'</li>';
	}

	if(is_iPhone == true)  {
		itsmo.map.navigator_callback = function(lat, lon, name) {
			itsmo.map.open_app_ios(lat, lon, name);
		}
	} else {
		itsmo.map.navigator_callback = function(lat, lon, name) {
			itsmo.map.open_app_android(lat, lon, name);
		}
	}
	var html = '<div class="map-balloon-l">'
		+ '<div class="wapper-large">'
            + '<a href="#" onclick="itsmo.map.navigator_callback('+latlon.lat+', '+latlon.lon+', \''+dt.nm+'\');" class="side-btn"><span>ナビ</span></a>'
            + '<a href="'+d.url+'" class="side-ul">'
            + '<ul class="border-none">'
                + '<li class="poi-name">'+ iconid + dt.nm +'</li>'
                + opentime
                + off_day
               	+ itemDistance
            + '</ul>'
            + '</a>'
	    + '</div>'
    + '</div>';

    if (null == offset_y || undefined == offset_y) {
		offset_y = 0;
	}

	if (null == h_extend || undefined == h_extend) {
		h_extend = 0;
	}

	var e = $('#id_div_calc_size');
	e.html(html);
	var w = e.width();
	var h = e.height() + h_extend;
	var offset = new ZDC.Pixel(Math.floor(-w / 2), -h + offset_y);
	itsmo.vars.largeWidget = new ZDC.UserWidget(latlon, {
			html:	html
		,	size:	new ZDC.WH(w, h)
		,	offset:	offset
	});
	itsmo.vars.g_map_obj.addWidget(itsmo.vars.largeWidget);
	itsmo.vars.largeWidget.open();
};

itsmo.map.searchCategory = function(txt) {
	var $moreSearch = $('.position-category-search');
		$moreSearch.hide();

	$('.header-search > input[type="search"]').val(txt);

	itsmo.map.onClickExecFreewordSearch();
};

itsmo.map.hidePointAddress = function() {
	if (null != itsmo.vars.g_widget_point_address) {
		itsmo.vars.g_widget_point_address.close();
		itsmo.vars.g_map_obj.removeWidget(itsmo.vars.g_widget_point_address);
	}
};

itsmo.vars.timeout = null;
itsmo.map.preventPopup = function() {
	if(itsmo.vars.timeout != null) {
	    clearTimeout(itsmo.vars.timeout);
	    itsmo.vars.timeout = null;
	}
    window.removeEventListener('pagehide', itsmo.map.preventPopup);
};

itsmo.map.open_app_ios = function(lat, lon, name) {
	// var app = 'net.zenrindatacom.itsmonavi://navi?cpid=7508&gx='+lon+'&gy='+lat+'&acc=0';
	var app = 'net.zenrindatacom.itsmonavi://navi?cpid=7508&gx='+lon+'&gy='+lat
		+'&gpoiname='+name
		+'&geo=0'
		+'&use=walk'
		+'&acc=1';

	// net.zenrindatacom.itsmonavi://navi?cpid=255&sx=503169058&sy=128496849&sz=0&spoiname=西新宿五丁目&gx=503168899&gy=128460808&gz=0&gpoiname=初台&geo=0&acc=1&srch=0

	var store = 'http://ad.apsalar.com/api/v1/ad?re=0&a=f35djfa2da&i=net.zenrindatacom.itsmonavi&ca=itsmo-Multi+iOS&an=NaviButton&p=iOS&pl=ItsumoWeb&h=2f4bcd1a31494ca45864153dc0f2194b6718cfe0&murl=https%3a%2f%2fitunes%2eapple%2ecom%2fjp%2fapp%2fapple%2dstore%2fid921122862%3fpt%3d12931%26ct%3ditsmoSite_NaviButton%26mt%3d8';

	var timing = 500;
    if(itsmo.vars.d_ios_9) {
        timing = 1500;
        window.location = app;
    } else {
        $('<iframe />')
                .attr('src', app)
                .attr('style', 'display:none;')
                .appendTo('body');
    }
    itsmo.vars.timeout = setTimeout(function () {
        window.location = store;
    }, timing);
    window.addEventListener('pagehide', itsmo.map.preventPopup);
};

itsmo.map.open_app_android = function(lat, lon, name){
	var app = 'intent://mdp.its-mo.net/app/navi?cpid=7508&gx='+lon+'&gy='+lat
		+'&gpoiname='+name
		+'&geo=0'
		+'&use=walk&acc=1#Intent;scheme=http;package=' + itsmo.vars.d_android_package_name + ';end';
	if(is_chrome_v35) {
		window.location = app;
	} else {
		var ifr = document.createElement('iframe');
	    ifr.src = app ;
	    ifr.onload = function() { // if app is not installed, then will go this function
	        window.location = 'http://ad.apsalar.com/api/v1/ad?re=0&a=f35djfa2da&i=net.zenrindatacom.itsmonavi&ca=itsmo-Multi+And&an=NaviButton&p=Android&pl=ItsumoWeb&h=2f4bcd1a31494ca45864153dc0f2194b6718cfe0&murl=https%3a%2f%2fplay%2egoogle%2ecom%2fstore%2fapps%2fdetails%3fid%3dnet%2ezenrindatacom%2eitsmonavi%26referrer%3dutm_source%253DitsmoSite%2526utm_medium%253Dlink%2526utm_term%253Dnone%2526utm_content%253DA%2526utm_campaign%253DNaviButton';
	    };
	    ifr.style.display = 'none';
	    document.body.appendChild(ifr);

	    setTimeout(function(){
	        document.body.removeChild(ifr); // remove the iframe element
	    }, 1000);
	}
	// var app = 'intent://mdp.its-mo.net/app/navi?cpid=7508&gx='+lon+'&gy='+lat
	// 	+'&gpoiname='+name
	// 	+'&geo=0'
	// 	+'&use=walk&acc=0#Intent;scheme=http;package=net.zenrindatacom.itsmonavi;S.browser_fallback_url=https://play.google.com/store/apps/details?id=net.zenrindatacom.itsmonavi;end';
	

	// http://mdp.its-mo.net/app/navi?cpid=255&sx=503169058&sy=128496849&sz=0&spoiname=西新宿五丁目&gx=503168899&gy=128460808&gz=0&gpoiname=初台&geo=0&acc=1&srch=0&use=car
	// window.location.href = app;
};

itsmo.map.removeParam = function (key, sourceURL){
    var rtn = sourceURL.split('?')[0],
        param, params_arr = [],
        queryString = (sourceURL.indexOf('?') !== -1) ? sourceURL.split('?')[1] : '';
    if(queryString !== ''){
        params_arr = queryString.split('&');
        for(var i = params_arr.length - 1; i >= 0; i -= 1){
            param = params_arr[i].split('=')[0];
            if(param === key){
                params_arr.splice(i, 1);
            }
        }
        rtn = rtn + '?' + params_arr.join('&');
    }
    return rtn;
}

itsmo.map.gotoOtherMap = function(type, reload) {
	var url = '/map';
	if(type == 'transit') {
		url = '/map/transit';
	} else if(type == 'landmark') {
		url = '/map/landmark';
	} else if(type == 'tourist') {
		url = '/map/tourist';
	} else if(type == 'lasttrain') {
		url = '/map/lasttrain';
	}

	var params = itsmo.map.getSearchParamString(reload);

	if (params !== '' && params.indexOf('fixzoom=1') == -1) {
		params += '&fixzoom=1';
	}
	var temp_url = url + params;
	if(type == 'lasttrain' && reload){
		temp_url = itsmo.map.removeParam('station[station_cd]', temp_url);
		temp_url = itsmo.map.removeParam('station[station_nm]', temp_url);
		temp_url = itsmo.map.removeParam('station[lttd]', temp_url);
		temp_url = itsmo.map.removeParam('station[lgtd]', temp_url);
	}

	if (itsmo.vars.onClickResearchFlag) {
		var re = /\/c\/(.*?)/gi;
		var res = re.exec(baseurl)
		if(baseurl != '' && res != null) {
			var mapTypeSearch = 'normal'; 
			if(action != 'transit' && action != 'lasttrain' 
				&& action != 'landmark' && action != 'tourist' ) {
				mapTypeSearch = 'normal';
			} else {
				mapTypeSearch = action;
			}

			var i, j;
			basequery = basequery.split('&');
			j = [];
			for (i = 0; i < basequery.length; ++i) {
				if (
					0 != basequery[i].indexOf('spmode=') 
					&& 0 != basequery[i].indexOf('lat=') 
					&& 0 != basequery[i].indexOf('lon=') 
					&& 0 != basequery[i].indexOf('map_type=') 
					&& basequery[i].length >= 1) {
					j.push(basequery[i]);
				}
			}
			basequery = j;

			var box = itsmo.vars.g_map_obj.getLatLonBox();
				i = itsmo.map.toMilliSec(box.getMax());
				j = itsmo.map.toMilliSec(box.getMin());
				box = 'box=' + j.lat + ',' + i.lat + ',' + j.lon + ',' + i.lon;

			var latlngSearch = itsmo.vars.g_map_obj.getLatLon();

			var re = /\/c\/(.*?)/gi;
			if(res = re.exec(baseurl)) {
				basequery.push('map_type=' + mapTypeSearch);
				basequery.push('lat=' + latlngSearch.lat + '&lon=' + latlngSearch.lon);
			}
			basequery = basequery.join('&');

			temp_url = url + '?baseurl=' + encodeURIComponent(baseurl) + "&basequery=" + encodeURIComponent(basequery);
			temp_url = itsmo.util.addParameter(temp_url, 'fixzoom', 1);
		}
	}

	window.location.href = temp_url;
};

itsmo.vars.earlierKeyword = '';
itsmo.map.getSearchParamString = function(reload) {
	var query = location.search;
	var q_baseurl = itsmo.map.getParameterByName('baseurl');
	var url = '';

	var stationCode = itsmo.map.getParameterByName('station[station_cd]');

	if(stationCode != '' && action == 'lasttrain' && reload != true){
		var stationName = itsmo.map.getParameterByName('station[station_nm]');
		var stationLat = itsmo.map.getParameterByName('station[lttd]');
		var stationLon = itsmo.map.getParameterByName('station[lgtd]');
		url = itsmo.util.addParameter(url, 'station[station_cd]', stationCode);
		url = itsmo.util.addParameter(url, 'station[station_nm]', stationName);
		url = itsmo.util.addParameter(url, 'station[lttd]', stationLat);
		url = itsmo.util.addParameter(url, 'station[lgtd]', stationLon);
	}

	var val = $('.header-search > input[type="search"]').val();
	var zoomLvl = itsmo.vars.g_map_obj.getZoom();
	var latLon = itsmo.vars.g_map_obj.getLatLon();

	var resize = $('.position-balloon-resize').attr('class');
	var isOpen = resize.indexOf('btn-on') != -1;
	isOpen = isOpen.toString();

	if(query != '' && q_baseurl == '') {
		if(val != '') {
			//url += '?map_freeword=' + encodeURIComponent(val);
			//url += '&open=' + isOpen;
			url = itsmo.util.addParameter(url, 'map_freeword', encodeURIComponent(val));
			url = itsmo.util.addParameter(url, 'open', isOpen);
			//return url;
		} else {
			//return '?open=' + isOpen;
			url = itsmo.util.addParameter(url, 'open', isOpen);
		}
		return url;
	} else {
		if(itsmo.vars.earlierKeyword == val) {
			return query;
		} else {
			if(val != '') {
				//url += '?map_freeword=' + encodeURIComponent(val);
				//url += '&open=' + isOpen;
				url = itsmo.util.addParameter(url, 'map_freeword', encodeURIComponent(val));
				url = itsmo.util.addParameter(url, 'open', isOpen);
				//return url;
			} else {
				//return '?open=' + isOpen;
				url = itsmo.util.addParameter(url, 'open', isOpen);
			}
			return url;
		}
	}

	if(val == '' && query != '' && q_baseurl != '') {
		if(val == '') {
			// url += '?lat=' + latLon.lat;
			// url += '&lon=' + latLon.lon;
			// url += '&zoom=' + zoomLvl;
			//return '?open=' + isOpen;
			url = itsmo.util.addParameter(url, 'open', isOpen);
			return url;
		}
		else{
			url += query;
		}
	} else if(val != ''){
		//url += '?map_freeword=' + encodeURIComponent(val);
		url = itsmo.util.addParameter(url, 'map_freeword', encodeURIComponent(val));
		// url += '&lat=' + latLon.lat;
		// url += '&lon=' + latLon.lon;
		// url += '&zoom=' + zoomLvl;
		//url += '&open=' + isOpen;
		url = itsmo.util.addParameter(url, 'open', isOpen);
	} else {
		// url += '?lat=' + latLon.lat;
		// url += '&lon=' + latLon.lon;
		// url += '&zoom=' + zoomLvl;
		//url += '?open=' + isOpen;
		url = itsmo.util.addParameter(url, 'open', isOpen);
	}
	return url;
};

itsmo.map.getParameterByName = function(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};
// close toast
itsmo.map.closeToastGPS = function() {
	$('.toast-gps').hide();
};
