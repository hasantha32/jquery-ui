define( [
	"qunit",
	"jquery",
	"./helper",
	"ui/widgets/datepicker",
	"ui/i18n/datepicker-fr",
	"ui/i18n/datepicker-he",
	"ui/i18n/datepicker-zh-CN",
	"ui/ie"
], function( QUnit, $, testHelper ) {

var beforeAfterEach = testHelper.beforeAfterEach;

QUnit.module( "datepicker: options", beforeAfterEach()  );

QUnit.test( "setDefaults", function( assert ) {
	assert.expect( 3 );
	testHelper.init( "#inp" );
	assert.equal( $.datepicker._defaults.showOn, "focus", "Initial showOn" );
	$.datepicker.setDefaults( { showOn: "button" } );
	assert.equal( $.datepicker._defaults.showOn, "button", "Change default showOn" );
	$.datepicker.setDefaults( { showOn: "focus" } );
	assert.equal( $.datepicker._defaults.showOn, "focus", "Restore showOn" );
} );

QUnit.test( "option", function( assert ) {
	assert.expect( 17 );
	var inp = testHelper.init( "#inp" ),
	inst = $.data( inp[ 0 ], testHelper.PROP_NAME );

	// Set option
	assert.equal( inst.settings.showOn, null, "Initial setting showOn" );
	assert.equal( $.datepicker._get( inst, "showOn" ), "focus", "Initial instance showOn" );
	assert.equal( $.datepicker._defaults.showOn, "focus", "Initial default showOn" );
	inp.datepicker( "option", "showOn", "button" );
	assert.equal( inst.settings.showOn, "button", "Change setting showOn" );
	assert.equal( $.datepicker._get( inst, "showOn" ), "button", "Change instance showOn" );
	assert.equal( $.datepicker._defaults.showOn, "focus", "Retain default showOn" );
	inp.datepicker( "option", { showOn: "both" } );
	assert.equal( inst.settings.showOn, "both", "Change setting showOn" );
	assert.equal( $.datepicker._get( inst, "showOn" ), "both", "Change instance showOn" );
	assert.equal( $.datepicker._defaults.showOn, "focus", "Retain default showOn" );
	inp.datepicker( "option", "showOn", undefined );
	assert.equal( inst.settings.showOn, null, "Clear setting showOn" );
	assert.equal( $.datepicker._get( inst, "showOn" ), "focus", "Restore instance showOn" );
	assert.equal( $.datepicker._defaults.showOn, "focus", "Retain default showOn" );

	// Get option
	inp = testHelper.init( "#inp" );
	assert.equal( inp.datepicker( "option", "showOn" ), "focus", "Initial setting showOn" );
	inp.datepicker( "option", "showOn", "button" );
	assert.equal( inp.datepicker( "option", "showOn" ), "button", "Change instance showOn" );
	inp.datepicker( "option", "showOn", undefined );
	assert.equal( inp.datepicker( "option", "showOn" ), "focus", "Reset instance showOn" );
	assert.deepEqual( inp.datepicker( "option", "all" ), { showAnim: "" }, "Get instance settings" );
	assert.deepEqual( inp.datepicker( "option", "defaults" ), $.datepicker._defaults,
		"Get default settings" );
} );

QUnit.test( "disabled", function( assert ) {
	assert.expect( 8 );
	var inp = testHelper.init( "#inp" );
	assert.ok( !inp.datepicker( "isDisabled" ), "Initially marked as enabled" );
	assert.ok( !inp[ 0 ].disabled, "Field initially enabled" );
	inp.datepicker( "option", "disabled", true );
	assert.ok( inp.datepicker( "isDisabled" ), "Marked as disabled" );
	assert.ok( inp[ 0 ].disabled, "Field now disabled" );
	inp.datepicker( "option", "disabled", false );
	assert.ok( !inp.datepicker( "isDisabled" ), "Marked as enabled" );
	assert.ok( !inp[ 0 ].disabled, "Field now enabled" );
	inp.datepicker( "destroy" );

	inp = testHelper.init( "#inp", { disabled: true } );
	assert.ok( inp.datepicker( "isDisabled" ), "Initially marked as disabled" );
	assert.ok( inp[ 0 ].disabled, "Field initially disabled" );
} );

QUnit.test( "change", function( assert ) {
	assert.expect( 12 );
	var inp = testHelper.init( "#inp" ),
	inst = $.data( inp[ 0 ], testHelper.PROP_NAME );
	assert.equal( inst.settings.showOn, null, "Initial setting showOn" );
	assert.equal( $.datepicker._get( inst, "showOn" ), "focus", "Initial instance showOn" );
	assert.equal( $.datepicker._defaults.showOn, "focus", "Initial default showOn" );
	inp.datepicker( "change", "showOn", "button" );
	assert.equal( inst.settings.showOn, "button", "Change setting showOn" );
	assert.equal( $.datepicker._get( inst, "showOn" ), "button", "Change instance showOn" );
	assert.equal( $.datepicker._defaults.showOn, "focus", "Retain default showOn" );
	inp.datepicker( "change", { showOn: "both" } );
	assert.equal( inst.settings.showOn, "both", "Change setting showOn" );
	assert.equal( $.datepicker._get( inst, "showOn" ), "both", "Change instance showOn" );
	assert.equal( $.datepicker._defaults.showOn, "focus", "Retain default showOn" );
	inp.datepicker( "change", "showOn", undefined );
	assert.equal( inst.settings.showOn, null, "Clear setting showOn" );
	assert.equal( $.datepicker._get( inst, "showOn" ), "focus", "Restore instance showOn" );
	assert.equal( $.datepicker._defaults.showOn, "focus", "Retain default showOn" );
} );

( function() {
	var url = window.location.search;
	url = decodeURIComponent( url.slice( url.indexOf( "swarmURL=" ) + 9 ) );

	// TODO: This test occassionally fails in IE in TestSwarm
	if ( $.ui.ie && url && url.indexOf( "http" ) === 0 ) {
		return;
	}

	QUnit.test( "invocation", function( assert ) {
		var ready = assert.async();
		var button, image,
			isOldIE = $.ui.ie && ( !document.documentMode || document.documentMode < 9 ),
			body = $( "body" );

		assert.expect( isOldIE ? 25 : 29 );

		function step0() {
			var inp = testHelper.initNewInput(),
				dp = $( "#ui-datepicker-div" );

			button = inp.siblings( "button" );
			assert.ok( button.length === 0, "Focus - button absent" );
			image = inp.siblings( "img" );
			assert.ok( image.length === 0, "Focus - image absent" );

			testHelper.onFocus( inp, function() {
				assert.ok( dp.is( ":visible" ), "Focus - rendered on focus" );
				inp.simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE } );
				assert.ok( !dp.is( ":visible" ), "Focus - hidden on exit" );
				step1();
			} );
		}

		function step1() {

			var inp = testHelper.initNewInput(),
				dp = $( "#ui-datepicker-div" );

			testHelper.onFocus( inp, function() {
				assert.ok( dp.is( ":visible" ), "Focus - rendered on focus" );
				body.simulate( "mousedown", {} );
				assert.ok( !dp.is( ":visible" ), "Focus - hidden on external click" );
				inp.datepicker( "hide" ).datepicker( "destroy" );

				step2();
			} );
		}

		function step2() {
			var inp = testHelper.initNewInput( {
					showOn: "button",
					buttonText: "Popup"
				} ),
				dp = $( "#ui-datepicker-div" );

			assert.ok( !dp.is( ":visible" ), "Button - initially hidden" );
			button = inp.siblings( "button" );
			image = inp.siblings( "img" );
			assert.ok( button.length === 1, "Button - button present" );
			assert.ok( image.length === 0, "Button - image absent" );
			assert.equal( button.text(), "Popup", "Button - button text" );

			testHelper.onFocus( inp, function() {
				assert.ok( !dp.is( ":visible" ), "Button - not rendered on focus" );
				button.trigger( "click" );
				assert.ok( dp.is( ":visible" ), "Button - rendered on button click" );
				button.trigger( "click" );
				assert.ok( !dp.is( ":visible" ), "Button - hidden on second button click" );
				inp.datepicker( "hide" ).datepicker( "destroy" );

				step3();
			} );
		}

		function step3() {
			var inp = testHelper.initNewInput( {
					showOn: "button",
					buttonImageOnly: true,
					buttonImage: "images/calendar.gif",
					buttonText: "Cal"
				} ),
				dp = $( "#ui-datepicker-div" );

			assert.ok( !dp.is( ":visible" ), "Image button - initially hidden" );
			button = inp.siblings( "button" );
			assert.ok( button.length === 0, "Image button - button absent" );
			image = inp.siblings( "img" );
			assert.ok( image.length === 1, "Image button - image present" );
			assert.ok( /images\/calendar\.gif$/.test( image.attr( "src" ) ), "Image button - image source" );
			assert.equal( image.attr( "title" ), "Cal", "Image button - image text" );

			testHelper.onFocus( inp, function() {
				assert.ok( !dp.is( ":visible" ), "Image button - not rendered on focus" );
				image.trigger( "click" );
				assert.ok( dp.is( ":visible" ), "Image button - rendered on image click" );
				image.trigger( "click" );
				assert.ok( !dp.is( ":visible" ), "Image button - hidden on second image click" );
				inp.datepicker( "hide" ).datepicker( "destroy" );

				step4();
			} );
		}

		function step4() {
			var inp = testHelper.initNewInput( {
					showOn: "both",
					buttonImage: "images/calendar.gif"
				} ),
				dp = $( "#ui-datepicker-div" );

			assert.ok( !dp.is( ":visible" ), "Both - initially hidden" );
			button = inp.siblings( "button" );
			assert.ok( button.length === 1, "Both - button present" );
			image = inp.siblings( "img" );
			assert.ok( image.length === 0, "Both - image absent" );
			image = button.children( "img" );
			assert.ok( image.length === 1, "Both - button image present" );

			// TODO: This test occasionally fails to focus in IE8 in BrowserStack
			if ( !isOldIE ) {
				testHelper.onFocus( inp, function() {
					assert.ok( dp.is( ":visible" ), "Both - rendered on focus" );
					body.simulate( "mousedown", {} );
					assert.ok( !dp.is( ":visible" ), "Both - hidden on external click" );
					button.trigger( "click" );
					assert.ok( dp.is( ":visible" ), "Both - rendered on button click" );
					button.trigger( "click" );
					assert.ok( !dp.is( ":visible" ), "Both - hidden on second button click" );
					inp.datepicker( "hide" ).datepicker( "destroy" );

					ready();
				} );
			} else {
				ready();
			}
		}

		step0();
	} );
} )();

QUnit.test( "otherMonths", function( assert ) {
	assert.expect( 8 );
	var inp = testHelper.init( "#inp" ),
		pop = $( "#ui-datepicker-div" );
	inp.val( "06/01/2009" ).datepicker( "show" );
	assert.equal( pop.find( "tbody" ).text(),

		// Support: IE <9, jQuery <1.8
		// In IE7/8 with jQuery <1.8, encoded spaces behave in strange ways
		$( "<span>\u00a0123456789101112131415161718192021222324252627282930\u00a0\u00a0\u00a0\u00a0</span>" ).text(),
		"Other months - none" );
	assert.ok( pop.find( "td" ).last().find( "*" ).length === 0, "Other months - no content" );
	inp.datepicker( "hide" ).datepicker( "option", "showOtherMonths", true ).datepicker( "show" );
	assert.equal( pop.find( "tbody" ).text(), "311234567891011121314151617181920212223242526272829301234",
		"Other months - show" );
	assert.ok( pop.find( "td" ).last().find( "span" ).length === 1, "Other months - span content" );
	inp.datepicker( "hide" ).datepicker( "option", "selectOtherMonths", true ).datepicker( "show" );
	assert.equal( pop.find( "tbody" ).text(), "311234567891011121314151617181920212223242526272829301234",
		"Other months - select" );
	assert.ok( pop.find( "td" ).last().find( "a" ).length === 1, "Other months - link content" );
	inp.datepicker( "hide" ).datepicker( "option", "showOtherMonths", false ).datepicker( "show" );
	assert.equal( pop.find( "tbody" ).text(),

		// Support: IE <9, jQuery <1.8
		// In IE7/8 with jQuery <1.8, encoded spaces behave in strange ways
		$( "<span>\u00a0123456789101112131415161718192021222324252627282930\u00a0\u00a0\u00a0\u00a0</span>" ).text(),
		"Other months - none" );
	assert.ok( pop.find( "td" ).last().find( "*" ).length === 0, "Other months - no content" );
} );

QUnit.test( "defaultDate", function( assert ) {
	assert.expect( 16 );
	var inp = testHelper.init( "#inp" ),
		date = new Date();
	inp.val( "" ).datepicker( "show" ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), date, "Default date null" );

	// Numeric values
	inp.datepicker( "option", { defaultDate: -2 } ).
		datepicker( "hide" ).val( "" ).datepicker( "show" ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	date.setDate( date.getDate() - 2 );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), date, "Default date -2" );

	date = new Date();
	inp.datepicker( "option", { defaultDate: 3 } ).
		datepicker( "hide" ).val( "" ).datepicker( "show" ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	date.setDate( date.getDate() + 3 );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), date, "Default date 3" );

	date = new Date();
	inp.datepicker( "option", { defaultDate: 1 / "a" } ).
		datepicker( "hide" ).val( "" ).datepicker( "show" ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), date, "Default date NaN" );

	// String offset values
	inp.datepicker( "option", { defaultDate: "-1d" } ).
		datepicker( "hide" ).val( "" ).datepicker( "show" ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	date.setDate( date.getDate() - 1 );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), date, "Default date -1d" );
	inp.datepicker( "option", { defaultDate: "+3D" } ).
		datepicker( "hide" ).val( "" ).datepicker( "show" ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	date.setDate( date.getDate() + 4 );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), date, "Default date +3D" );
	inp.datepicker( "option", { defaultDate: " -2 w " } ).
		datepicker( "hide" ).val( "" ).datepicker( "show" ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	date = new Date();
	date.setDate( date.getDate() - 14 );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), date, "Default date -2 w" );
	inp.datepicker( "option", { defaultDate: "+1 W" } ).
		datepicker( "hide" ).val( "" ).datepicker( "show" ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	date.setDate( date.getDate() + 21 );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), date, "Default date +1 W" );
	inp.datepicker( "option", { defaultDate: " -1 m " } ).
		datepicker( "hide" ).val( "" ).datepicker( "show" ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	date = testHelper.addMonths( new Date(), -1 );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), date, "Default date -1 m" );
	inp.datepicker( "option", { defaultDate: "+2M" } ).
		datepicker( "hide" ).val( "" ).datepicker( "show" ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	date = testHelper.addMonths( new Date(), 2 );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), date, "Default date +2M" );
	inp.datepicker( "option", { defaultDate: "-2y" } ).
		datepicker( "hide" ).val( "" ).datepicker( "show" ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	date = new Date();
	date.setFullYear( date.getFullYear() - 2 );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), date, "Default date -2y" );
	inp.datepicker( "option", { defaultDate: "+1 Y " } ).
		datepicker( "hide" ).val( "" ).datepicker( "show" ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	date.setFullYear( date.getFullYear() + 3 );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), date, "Default date +1 Y" );
	inp.datepicker( "option", { defaultDate: "+1M +10d" } ).
		datepicker( "hide" ).val( "" ).datepicker( "show" ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	date = testHelper.addMonths( new Date(), 1 );
	date.setDate( date.getDate() + 10 );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), date, "Default date +1M +10d" );

	// String date values
	inp.datepicker( "option", { defaultDate: "07/04/2007" } ).
		datepicker( "hide" ).val( "" ).datepicker( "show" ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	date = new Date( 2007, 7 - 1, 4 );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), date, "Default date 07/04/2007" );
	inp.datepicker( "option", { dateFormat: "yy-mm-dd", defaultDate: "2007-04-02" } ).
		datepicker( "hide" ).val( "" ).datepicker( "show" ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	date = new Date( 2007, 4 - 1, 2 );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), date, "Default date 2007-04-02" );

	// Date value
	date = new Date( 2007, 1 - 1, 26 );
	inp.datepicker( "option", { dateFormat: "mm/dd/yy", defaultDate: date } ).
		datepicker( "hide" ).val( "" ).datepicker( "show" ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), date, "Default date 01/26/2007" );
} );

QUnit.test( "miscellaneous", function( assert ) {
	assert.expect( 19 );
	var curYear, longNames, shortNames, date,
		dp = $( "#ui-datepicker-div" ),
		inp = testHelper.init( "#inp" );

	// Year range
	function genRange( start, offset ) {
		var i = start,
			range = "";
		for ( ; i < start + offset; i++ ) {
			range += i;
		}
		return range;
	}
	curYear = new Date().getFullYear();
	inp.val( "02/04/2008" ).datepicker( "show" );
	assert.equal( dp.find( ".ui-datepicker-year" ).text(), "2008", "Year range - read-only default" );
	inp.datepicker( "hide" ).datepicker( "option", { changeYear: true } ).datepicker( "show" );
	assert.equal( dp.find( ".ui-datepicker-year" ).text(), genRange( 2008 - 10, 21 ), "Year range - changeable default" );
	inp.datepicker( "hide" ).datepicker( "option", { yearRange: "c-6:c+2", changeYear: true } ).datepicker( "show" );
	assert.equal( dp.find( ".ui-datepicker-year" ).text(), genRange( 2008 - 6, 9 ), "Year range - c-6:c+2" );
	inp.datepicker( "hide" ).datepicker( "option", { yearRange: "2000:2010", changeYear: true } ).datepicker( "show" );
	assert.equal( dp.find( ".ui-datepicker-year" ).text(), genRange( 2000, 11 ), "Year range - 2000:2010" );
	inp.datepicker( "hide" ).datepicker( "option", { yearRange: "-5:+3", changeYear: true } ).datepicker( "show" );
	assert.equal( dp.find( ".ui-datepicker-year" ).text(), genRange( curYear - 5, 9 ), "Year range - -5:+3" );
	inp.datepicker( "hide" ).datepicker( "option", { yearRange: "2000:-5", changeYear: true } ).datepicker( "show" );
	assert.equal( dp.find( ".ui-datepicker-year" ).text(), genRange( 2000, curYear - 2004 ), "Year range - 2000:-5" );
	inp.datepicker( "hide" ).datepicker( "option", { yearRange: "", changeYear: true } ).datepicker( "show" );
	assert.equal( dp.find( ".ui-datepicker-year" ).text(), genRange( curYear, 1 ), "Year range - -6:+2" );

	// Navigation as date format
	inp.datepicker( "option", { showButtonPanel: true } );
	assert.equal( dp.find( ".ui-datepicker-prev" ).text(), "Prev", "Navigation prev - default" );
	assert.equal( dp.find( ".ui-datepicker-current" ).text(), "Today", "Navigation current - default" );
	assert.equal( dp.find( ".ui-datepicker-next" ).text(), "Next", "Navigation next - default" );
	inp.datepicker( "hide" ).datepicker( "option", { navigationAsDateFormat: true, prevText: "< M", currentText: "MM", nextText: "M >" } ).
		val( "02/04/2008" ).datepicker( "show" );
	longNames = $.datepicker.regional[ "" ].monthNames;
	shortNames = $.datepicker.regional[ "" ].monthNamesShort;
	date = new Date();
	assert.equal( dp.find( ".ui-datepicker-prev" ).text(), "< " + shortNames[ 0 ], "Navigation prev - as date format" );
	assert.equal( dp.find( ".ui-datepicker-current" ).text(),
		longNames[ date.getMonth() ], "Navigation current - as date format" );
	assert.equal( dp.find( ".ui-datepicker-next" ).text(),
		shortNames[ 2 ] + " >", "Navigation next - as date format" );
	inp.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } );
	assert.equal( dp.find( ".ui-datepicker-prev" ).text(),
		"< " + shortNames[ 1 ], "Navigation prev - as date format + pgdn" );
	assert.equal( dp.find( ".ui-datepicker-current" ).text(),
		longNames[ date.getMonth() ], "Navigation current - as date format + pgdn" );
	assert.equal( dp.find( ".ui-datepicker-next" ).text(),
		shortNames[ 3 ] + " >", "Navigation next - as date format + pgdn" );
	inp.datepicker( "hide" ).datepicker( "option", { gotoCurrent: true } ).
		val( "02/04/2008" ).datepicker( "show" );
	assert.equal( dp.find( ".ui-datepicker-prev" ).text(),
		"< " + shortNames[ 0 ], "Navigation prev - as date format + goto current" );
	assert.equal( dp.find( ".ui-datepicker-current" ).text(),
		longNames[ 1 ], "Navigation current - as date format + goto current" );
	assert.equal( dp.find( ".ui-datepicker-next" ).text(),
		shortNames[ 2 ] + " >", "Navigation next - as date format + goto current" );
} );

QUnit.test( "minMax", function( assert ) {
	assert.expect( 23 );
	var date,
		inp = testHelper.init( "#inp" ),
		dp = $( "#ui-datepicker-div" ),
		lastYear = new Date( 2007, 6 - 1, 4 ),
		nextYear = new Date( 2009, 6 - 1, 4 ),
		minDate = new Date( 2008, 2 - 1, 29 ),
		maxDate = new Date( 2008, 12 - 1, 7 );
	inp.val( "06/04/2008" ).datepicker( "show" );
	inp.simulate( "keydown", { ctrlKey: true, keyCode: $.ui.keyCode.PAGE_UP } ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), lastYear,
		"Min/max - null, null - ctrl+pgup" );
	inp.val( "06/04/2008" ).datepicker( "show" );
	inp.simulate( "keydown", { ctrlKey: true, keyCode: $.ui.keyCode.PAGE_DOWN } ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), nextYear,
		"Min/max - null, null - ctrl+pgdn" );
	inp.datepicker( "option", { minDate: minDate } ).
		datepicker( "hide" ).val( "06/04/2008" ).datepicker( "show" );
	inp.simulate( "keydown", { ctrlKey: true, keyCode: $.ui.keyCode.PAGE_UP } ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), minDate,
		"Min/max - 02/29/2008, null - ctrl+pgup" );
	inp.val( "06/04/2008" ).datepicker( "show" );
	inp.simulate( "keydown", { ctrlKey: true, keyCode: $.ui.keyCode.PAGE_DOWN } ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), nextYear,
		"Min/max - 02/29/2008, null - ctrl+pgdn" );
	inp.datepicker( "option", { maxDate: maxDate } ).
		datepicker( "hide" ).val( "06/04/2008" ).datepicker( "show" );
	inp.simulate( "keydown", { ctrlKey: true, keyCode: $.ui.keyCode.PAGE_UP } ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), minDate,
		"Min/max - 02/29/2008, 12/07/2008 - ctrl+pgup" );
	inp.val( "06/04/2008" ).datepicker( "show" );
	inp.simulate( "keydown", { ctrlKey: true, keyCode: $.ui.keyCode.PAGE_DOWN } ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), maxDate,
		"Min/max - 02/29/2008, 12/07/2008 - ctrl+pgdn" );
	inp.datepicker( "option", { minDate: null } ).
		datepicker( "hide" ).val( "06/04/2008" ).datepicker( "show" );
	inp.simulate( "keydown", { ctrlKey: true, keyCode: $.ui.keyCode.PAGE_UP } ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), lastYear,
		"Min/max - null, 12/07/2008 - ctrl+pgup" );
	inp.val( "06/04/2008" ).datepicker( "show" );
	inp.simulate( "keydown", { ctrlKey: true, keyCode: $.ui.keyCode.PAGE_DOWN } ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), maxDate,
		"Min/max - null, 12/07/2008 - ctrl+pgdn" );

	// Relative dates
	date = new Date();
	date.setDate( date.getDate() - 7 );
	inp.datepicker( "option", { minDate: "-1w", maxDate: "+1 M +10 D " } ).
		datepicker( "hide" ).val( "" ).datepicker( "show" );
	inp.simulate( "keydown", { ctrlKey: true, keyCode: $.ui.keyCode.PAGE_UP } ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), date,
		"Min/max - -1w, +1 M +10 D - ctrl+pgup" );
	date = testHelper.addMonths( new Date(), 1 );
	date.setDate( date.getDate() + 10 );
	inp.val( "" ).datepicker( "show" );
	inp.simulate( "keydown", { ctrlKey: true, keyCode: $.ui.keyCode.PAGE_DOWN } ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), date,
		"Min/max - -1w, +1 M +10 D - ctrl+pgdn" );

	// With existing date
	inp = testHelper.init( "#inp" );
	inp.val( "06/04/2008" ).datepicker( "option", { minDate: minDate } );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), new Date( 2008, 6 - 1, 4 ), "Min/max - setDate > min" );
	inp.datepicker( "option", { minDate: null } ).val( "01/04/2008" ).datepicker( "option", { minDate: minDate } );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), minDate, "Min/max - setDate < min" );
	inp.datepicker( "option", { minDate: null } ).val( "06/04/2008" ).datepicker( "option", { maxDate: maxDate } );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), new Date( 2008, 6 - 1, 4 ), "Min/max - setDate < max" );
	inp.datepicker( "option", { maxDate: null } ).val( "01/04/2009" ).datepicker( "option", { maxDate: maxDate } );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), maxDate, "Min/max - setDate > max" );
	inp.datepicker( "option", { maxDate: null } ).val( "01/04/2008" ).datepicker( "option", { minDate: minDate, maxDate: maxDate } );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), minDate, "Min/max - setDate < min" );
	inp.datepicker( "option", { maxDate: null } ).val( "06/04/2008" ).datepicker( "option", { minDate: minDate, maxDate: maxDate } );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), new Date( 2008, 6 - 1, 4 ), "Min/max - setDate > min, < max" );
	inp.datepicker( "option", { maxDate: null } ).val( "01/04/2009" ).datepicker( "option", { minDate: minDate, maxDate: maxDate } );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), maxDate, "Min/max - setDate > max" );

	inp.datepicker( "option", { yearRange: "-0:+1" } ).val( "01/01/" + new Date().getFullYear() );
	assert.ok( dp.find( ".ui-datepicker-prev" ).hasClass( "ui-state-disabled" ), "Year Range Test - previous button disabled at 1/1/minYear" );
	inp.datepicker( "setDate", "12/30/" + new Date().getFullYear() );
	assert.ok( dp.find( ".ui-datepicker-next" ).hasClass( "ui-state-disabled" ), "Year Range Test - next button disabled at 12/30/maxYear" );

	inp.val( "" ).datepicker( "option", {
		minDate: new Date( 1900, 0, 1 ),
		maxDate: "-7Y",
		yearRange: "1900:-7"
	} );
	assert.ok( dp.find( ".ui-datepicker-next" ).hasClass( "ui-state-disabled" ), "Year Range Test - relative - next button disabled" );
	assert.ok( !dp.find( ".ui-datepicker-prev" ).hasClass( "ui-state-disabled" ), "Year Range Test - relative - prev button enabled" );

	inp.val( "" ).datepicker( "option", {
		minDate: new Date( 1900, 0, 1 ),
		maxDate: "1/25/2007",
		yearRange: "1900:2007"
	} );
	assert.ok( dp.find( ".ui-datepicker-next" ).hasClass( "ui-state-disabled" ), "Year Range Test - absolute - next button disabled" );
	assert.ok( !dp.find( ".ui-datepicker-prev" ).hasClass( "ui-state-disabled" ), "Year Range Test - absolute - prev button enabled" );
} );

QUnit.test( "setDate", function( assert ) {
	assert.expect( 24 );
	var inl, alt, minDate, maxDate, dateAndTimeToSet, dateAndTimeClone,
		inp = testHelper.init( "#inp" ),
		date1 = new Date( 2008, 6 - 1, 4 ),
		date2 = new Date();
	assert.ok( inp.datepicker( "getDate" ) == null, "Set date - default" );
	inp.datepicker( "setDate", date1 );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), date1, "Set date - 2008-06-04" );
	date1 = new Date();
	date1.setDate( date1.getDate() + 7 );
	inp.datepicker( "setDate", +7 );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), date1, "Set date - +7" );
	date2.setFullYear( date2.getFullYear() + 2 );
	inp.datepicker( "setDate", "+2y" );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), date2, "Set date - +2y" );
	inp.datepicker( "setDate", date1, date2 );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), date1, "Set date - two dates" );
	inp.datepicker( "setDate" );
	assert.ok( inp.datepicker( "getDate" ) == null, "Set date - null" );

	// Relative to current date
	date1 = new Date();
	date1.setDate( date1.getDate() + 7 );
	inp.datepicker( "setDate", "c +7" );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), date1, "Set date - c +7" );
	date1.setDate( date1.getDate() + 7 );
	inp.datepicker( "setDate", "c+7" );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), date1, "Set date - c+7" );
	date1.setDate( date1.getDate() - 21 );
	inp.datepicker( "setDate", "c -3 w" );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), date1, "Set date - c -3 w" );

	// Inline
	inl = testHelper.init( "#inl" );
	date1 = new Date( 2008, 6 - 1, 4 );
	date2 = new Date();
	testHelper.equalsDate( assert, inl.datepicker( "getDate" ), date2, "Set date inline - default" );
	inl.datepicker( "setDate", date1 );
	testHelper.equalsDate( assert, inl.datepicker( "getDate" ), date1, "Set date inline - 2008-06-04" );
	date1 = new Date();
	date1.setDate( date1.getDate() + 7 );
	inl.datepicker( "setDate", +7 );
	testHelper.equalsDate( assert, inl.datepicker( "getDate" ), date1, "Set date inline - +7" );
	date2.setFullYear( date2.getFullYear() + 2 );
	inl.datepicker( "setDate", "+2y" );
	testHelper.equalsDate( assert, inl.datepicker( "getDate" ), date2, "Set date inline - +2y" );
	inl.datepicker( "setDate", date1, date2 );
	testHelper.equalsDate( assert, inl.datepicker( "getDate" ), date1, "Set date inline - two dates" );
	inl.datepicker( "setDate" );
	assert.ok( inl.datepicker( "getDate" ) == null, "Set date inline - null" );

	// Alternate field
	alt = $( "#alt" );
	inp.datepicker( "option", { altField: "#alt", altFormat: "yy-mm-dd" } );
	date1 = new Date( 2008, 6 - 1, 4 );
	inp.datepicker( "setDate", date1 );
	assert.equal( inp.val(), "06/04/2008", "Set date alternate - 06/04/2008" );
	assert.equal( alt.val(), "2008-06-04", "Set date alternate - 2008-06-04" );

	// With minimum/maximum
	inp = testHelper.init( "#inp" );
	date1 = new Date( 2008, 1 - 1, 4 );
	date2 = new Date( 2008, 6 - 1, 4 );
	minDate = new Date( 2008, 2 - 1, 29 );
	maxDate = new Date( 2008, 3 - 1, 28 );
	inp.val( "" ).datepicker( "option", { minDate: minDate } ).datepicker( "setDate", date2 );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), date2, "Set date min/max - setDate > min" );
	inp.datepicker( "setDate", date1 );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), minDate, "Set date min/max - setDate < min" );
	inp.val( "" ).datepicker( "option", { maxDate: maxDate, minDate: null } ).datepicker( "setDate", date1 );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), date1, "Set date min/max - setDate < max" );
	inp.datepicker( "setDate", date2 );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), maxDate, "Set date min/max - setDate > max" );
	inp.val( "" ).datepicker( "option", { minDate: minDate } ).datepicker( "setDate", date1 );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), minDate, "Set date min/max - setDate < min" );
	inp.datepicker( "setDate", date2 );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), maxDate, "Set date min/max - setDate > max" );
	dateAndTimeToSet = new Date( 2008, 3 - 1, 28, 1, 11, 0 );
	dateAndTimeClone = new Date( 2008, 3 - 1, 28, 1, 11, 0 );
	inp.datepicker( "setDate", dateAndTimeToSet );
	assert.equal( dateAndTimeToSet.getTime(), dateAndTimeClone.getTime(), "Date object passed should not be changed by setDate" );
} );

QUnit.test( "altField", function( assert ) {
	assert.expect( 11 );

	var done = assert.async(),
		inp = testHelper.init( "#inp" ),
		alt = $( "#alt" );

	// No alternate field set
	alt.val( "" );
	inp.val( "06/04/2008" ).datepicker( "show" );
	inp.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	assert.equal( inp.val(), "06/04/2008", "Alt field - dp - enter" );
	assert.equal( alt.val(), "", "Alt field - alt not set" );

	// Alternate field set
	alt.val( "" );
	inp.datepicker( "option", { altField: "#alt", altFormat: "yy-mm-dd" } ).
		val( "06/04/2008" ).datepicker( "show" );
	inp.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	assert.equal( inp.val(), "06/04/2008", "Alt field - dp - enter" );
	assert.equal( alt.val(), "2008-06-04", "Alt field - alt - enter" );

	// Move from initial date
	alt.val( "" );
	inp.val( "06/04/2008" ).datepicker( "show" );
	inp.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	assert.equal( inp.val(), "07/04/2008", "Alt field - dp - pgdn" );
	assert.equal( alt.val(), "2008-07-04", "Alt field - alt - pgdn" );

	// Alternate field set - closed
	alt.val( "" );
	inp.val( "06/04/2008" ).datepicker( "show" );
	inp.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE } );
	assert.equal( inp.val(), "06/04/2008", "Alt field - dp - pgdn/esc" );
	assert.equal( alt.val(), "", "Alt field - alt - pgdn/esc" );

	// Clear date and alternate
	alt.val( "" );
	inp.val( "06/04/2008" ).datepicker( "show" );
	inp.simulate( "keydown", { ctrlKey: true, keyCode: $.ui.keyCode.END } );
	assert.equal( inp.val(), "", "Alt field - dp - ctrl+end" );
	assert.equal( alt.val(), "", "Alt field - alt - ctrl+end" );

	// HTML instead of selector
	alt.val( "" );
	try {
		inp.datepicker( "option", {
			altField: "<img onerror='window.globalAltField=true' src='/404' />",
			altFormat: "yy-mm-dd"
		} ).val( "06/04/2008" ).datepicker( "show" );
		inp.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	} catch ( e ) {}

	setTimeout( function() {
		assert.equal( window.globalAltField, undefined, "altField treated as a selector" );
		delete window.globalAltField;
		done();
	}, 500 );
} );

QUnit.test( "autoSize", function( assert ) {
	assert.expect( 15 );
	var inp = testHelper.init( "#inp" );
	assert.equal( inp.prop( "size" ), 20, "Auto size - default" );
	inp.datepicker( "option", "autoSize", true );
	assert.equal( inp.prop( "size" ), 10, "Auto size - mm/dd/yy" );
	inp.datepicker( "option", "dateFormat", "m/d/yy" );
	assert.equal( inp.prop( "size" ), 10, "Auto size - m/d/yy" );
	inp.datepicker( "option", "dateFormat", "D M d yy" );
	assert.equal( inp.prop( "size" ), 15, "Auto size - D M d yy" );
	inp.datepicker( "option", "dateFormat", "DD, MM dd, yy" );
	assert.equal( inp.prop( "size" ), 29, "Auto size - DD, MM dd, yy" );

	// French
	inp.datepicker( "option", $.extend( { autoSize: false }, $.datepicker.regional.fr ) );
	assert.equal( inp.prop( "size" ), 29, "Auto size - fr - default" );
	inp.datepicker( "option", "autoSize", true );
	assert.equal( inp.prop( "size" ), 10, "Auto size - fr - dd/mm/yy" );
	inp.datepicker( "option", "dateFormat", "m/d/yy" );
	assert.equal( inp.prop( "size" ), 10, "Auto size - fr - m/d/yy" );
	inp.datepicker( "option", "dateFormat", "D M d yy" );
	assert.equal( inp.prop( "size" ), 18, "Auto size - fr - D M d yy" );
	inp.datepicker( "option", "dateFormat", "DD, MM dd, yy" );
	assert.equal( inp.prop( "size" ), 28, "Auto size - fr - DD, MM dd, yy" );

	// Hebrew
	inp.datepicker( "option", $.extend( { autoSize: false }, $.datepicker.regional.he ) );
	assert.equal( inp.prop( "size" ), 28, "Auto size - he - default" );
	inp.datepicker( "option", "autoSize", true );
	assert.equal( inp.prop( "size" ), 10, "Auto size - he - dd/mm/yy" );
	inp.datepicker( "option", "dateFormat", "m/d/yy" );
	assert.equal( inp.prop( "size" ), 10, "Auto size - he - m/d/yy" );
	inp.datepicker( "option", "dateFormat", "D M d yy" );
	assert.equal( inp.prop( "size" ), 16, "Auto size - he - D M d yy" );
	inp.datepicker( "option", "dateFormat", "DD, MM dd, yy" );
	assert.equal( inp.prop( "size" ), 23, "Auto size - he - DD, MM dd, yy" );
} );

QUnit.test( "daylightSaving", function( assert ) {
	assert.expect( 25 );
	var inp = testHelper.init( "#inp" ),
		dp = $( "#ui-datepicker-div" );
	assert.ok( true, "Daylight saving - " + new Date() );

	// Australia, Sydney - AM change, southern hemisphere
	inp.val( "04/01/2008" ).datepicker( "show" );
	$( ".ui-datepicker-calendar td", dp ).eq( 6 ).find( "a" ).simulate( "click" );
	assert.equal( inp.val(), "04/05/2008", "Daylight saving - Australia 04/05/2008" );
	inp.val( "04/01/2008" ).datepicker( "show" );
	$( ".ui-datepicker-calendar td", dp ).eq( 7 ).find( "a" ).simulate( "click" );
	assert.equal( inp.val(), "04/06/2008", "Daylight saving - Australia 04/06/2008" );
	inp.val( "04/01/2008" ).datepicker( "show" );
	$( ".ui-datepicker-calendar td", dp ).eq( 8 ).find( "a" ).simulate( "click" );
	assert.equal( inp.val(), "04/07/2008", "Daylight saving - Australia 04/07/2008" );
	inp.val( "10/01/2008" ).datepicker( "show" );
	$( ".ui-datepicker-calendar td", dp ).eq( 6 ).find( "a" ).simulate( "click" );
	assert.equal( inp.val(), "10/04/2008", "Daylight saving - Australia 10/04/2008" );
	inp.val( "10/01/2008" ).datepicker( "show" );
	$( ".ui-datepicker-calendar td", dp ).eq( 7 ).find( "a" ).simulate( "click" );
	assert.equal( inp.val(), "10/05/2008", "Daylight saving - Australia 10/05/2008" );
	inp.val( "10/01/2008" ).datepicker( "show" );
	$( ".ui-datepicker-calendar td", dp ).eq( 8 ).find( "a" ).simulate( "click" );
	assert.equal( inp.val(), "10/06/2008", "Daylight saving - Australia 10/06/2008" );

	// Brasil, Brasilia - midnight change, southern hemisphere
	inp.val( "02/01/2008" ).datepicker( "show" );
	$( ".ui-datepicker-calendar td", dp ).eq( 20 ).find( "a" ).simulate( "click" );
	assert.equal( inp.val(), "02/16/2008", "Daylight saving - Brasil 02/16/2008" );
	inp.val( "02/01/2008" ).datepicker( "show" );
	$( ".ui-datepicker-calendar td", dp ).eq( 21 ).find( "a" ).simulate( "click" );
	assert.equal( inp.val(), "02/17/2008", "Daylight saving - Brasil 02/17/2008" );
	inp.val( "02/01/2008" ).datepicker( "show" );
	$( ".ui-datepicker-calendar td", dp ).eq( 22 ).find( "a" ).simulate( "click" );
	assert.equal( inp.val(), "02/18/2008", "Daylight saving - Brasil 02/18/2008" );
	inp.val( "10/01/2008" ).datepicker( "show" );
	$( ".ui-datepicker-calendar td", dp ).eq( 13 ).find( "a" ).simulate( "click" );
	assert.equal( inp.val(), "10/11/2008", "Daylight saving - Brasil 10/11/2008" );
	inp.val( "10/01/2008" ).datepicker( "show" );
	$( ".ui-datepicker-calendar td", dp ).eq( 14 ).find( "a" ).simulate( "click" );
	assert.equal( inp.val(), "10/12/2008", "Daylight saving - Brasil 10/12/2008" );
	inp.val( "10/01/2008" ).datepicker( "show" );
	$( ".ui-datepicker-calendar td", dp ).eq( 15 ).find( "a" ).simulate( "click" );
	assert.equal( inp.val(), "10/13/2008", "Daylight saving - Brasil 10/13/2008" );

	// Lebanon, Beirut - midnight change, northern hemisphere
	inp.val( "03/01/2008" ).datepicker( "show" );
	$( ".ui-datepicker-calendar td", dp ).eq( 34 ).find( "a" ).simulate( "click" );
	assert.equal( inp.val(), "03/29/2008", "Daylight saving - Lebanon 03/29/2008" );
	inp.val( "03/01/2008" ).datepicker( "show" );
	$( ".ui-datepicker-calendar td", dp ).eq( 35 ).find( "a" ).simulate( "click" );
	assert.equal( inp.val(), "03/30/2008", "Daylight saving - Lebanon 03/30/2008" );
	inp.val( "03/01/2008" ).datepicker( "show" );
	$( ".ui-datepicker-calendar td", dp ).eq( 36 ).find( "a" ).simulate( "click" );
	assert.equal( inp.val(), "03/31/2008", "Daylight saving - Lebanon 03/31/2008" );
	inp.val( "10/01/2008" ).datepicker( "show" );
	$( ".ui-datepicker-calendar td", dp ).eq( 27 ).find( "a" ).simulate( "click" );
	assert.equal( inp.val(), "10/25/2008", "Daylight saving - Lebanon 10/25/2008" );
	inp.val( "10/01/2008" ).datepicker( "show" );
	$( ".ui-datepicker-calendar td", dp ).eq( 28 ).find( "a" ).simulate( "click" );
	assert.equal( inp.val(), "10/26/2008", "Daylight saving - Lebanon 10/26/2008" );
	inp.val( "10/01/2008" ).datepicker( "show" );
	$( ".ui-datepicker-calendar td", dp ).eq( 29 ).find( "a" ).simulate( "click" );
	assert.equal( inp.val(), "10/27/2008", "Daylight saving - Lebanon 10/27/2008" );

	// US, Eastern - AM change, northern hemisphere
	inp.val( "03/01/2008" ).datepicker( "show" );
	$( ".ui-datepicker-calendar td", dp ).eq( 13 ).find( "a" ).simulate( "click" );
	assert.equal( inp.val(), "03/08/2008", "Daylight saving - US 03/08/2008" );
	inp.val( "03/01/2008" ).datepicker( "show" );
	$( ".ui-datepicker-calendar td", dp ).eq( 14 ).find( "a" ).simulate( "click" );
	assert.equal( inp.val(), "03/09/2008", "Daylight saving - US 03/09/2008" );
	inp.val( "03/01/2008" ).datepicker( "show" );
	$( ".ui-datepicker-calendar td", dp ).eq( 15 ).find( "a" ).simulate( "click" );
	assert.equal( inp.val(), "03/10/2008", "Daylight saving - US 03/10/2008" );
	inp.val( "11/01/2008" ).datepicker( "show" );
	$( ".ui-datepicker-calendar td", dp ).eq( 6 ).find( "a" ).simulate( "click" );
	assert.equal( inp.val(), "11/01/2008", "Daylight saving - US 11/01/2008" );
	inp.val( "11/01/2008" ).datepicker( "show" );
	$( ".ui-datepicker-calendar td", dp ).eq( 7 ).find( "a" ).simulate( "click" );
	assert.equal( inp.val(), "11/02/2008", "Daylight saving - US 11/02/2008" );
	inp.val( "11/01/2008" ).datepicker( "show" );
	$( ".ui-datepicker-calendar td", dp ).eq( 8 ).find( "a" ).simulate( "click" );
	assert.equal( inp.val(), "11/03/2008", "Daylight saving - US 11/03/2008" );
} );

var beforeShowThis = null,
	beforeShowInput = null,
	beforeShowInst = null,
	beforeShowDayThis = null,
	beforeShowDayOK = true,
	onUpdateDatepickerThis = null,
	onUpdateDatepickerInst = null;

function beforeAll( input, inst ) {
	beforeShowThis = this;
	beforeShowInput = input;
	beforeShowInst = inst;
	return { currentText: "Current" };
}

function beforeDay( date ) {
	beforeShowDayThis = this;
	beforeShowDayOK &= ( date > new Date( 2008, 1 - 1, 26 ) &&
		date < new Date( 2008, 3 - 1, 6 ) );
	return [ ( date.getDate() % 2 === 0 ), ( date.getDate() % 10 === 0 ? "day10" : "" ),
		( date.getDate() % 3 === 0 ? "Divisble by 3" : "" ) ];
}

function onUpdateDatepicker( inst ) {
	onUpdateDatepickerThis = this;
	onUpdateDatepickerInst = inst;
	inst.dpDiv.append( $( "<div>" ).addClass( "on-update-datepicker-test" ) );
}

QUnit.test( "callbacks", function( assert ) {
	assert.expect( 18 );

	// Before show
	var dp, day20, day21,
		inp = testHelper.init( "#inp", { beforeShow: beforeAll } ),
		inst = $.data( inp[ 0 ], "datepicker" );
	assert.equal( $.datepicker._get( inst, "currentText" ), "Today", "Before show - initial" );
	inp.val( "02/04/2008" ).datepicker( "show" );
	assert.equal( $.datepicker._get( inst, "currentText" ), "Current", "Before show - changed" );
	assert.ok( beforeShowThis.id === inp[ 0 ].id, "Before show - this OK" );
	assert.ok( beforeShowInput.id === inp[ 0 ].id, "Before show - input OK" );
	assert.deepEqual( beforeShowInst, inst, "Before show - inst OK" );
	inp.datepicker( "hide" ).datepicker( "destroy" );

	// Before show day
	inp = testHelper.init( "#inp", { beforeShowDay: beforeDay } );
	dp = $( "#ui-datepicker-div" );
	inp.val( "02/04/2008" ).datepicker( "show" );
	assert.ok( beforeShowDayThis.id === inp[ 0 ].id, "Before show day - this OK" );
	assert.ok( beforeShowDayOK, "Before show day - dates OK" );
	day20 = dp.find( ".ui-datepicker-calendar td:contains('20')" );
	day21 = dp.find( ".ui-datepicker-calendar td:contains('21')" );
	assert.ok( !day20.is( ".ui-datepicker-unselectable" ), "Before show day - unselectable 20" );
	assert.ok( day21.is( ".ui-datepicker-unselectable" ), "Before show day - unselectable 21" );
	assert.ok( day20.is( ".day10" ), "Before show day - CSS 20" );
	assert.ok( !day21.is( ".day10" ), "Before show day - CSS 21" );
	assert.ok( !day20.attr( "title" ), "Before show day - title 20" );
	assert.ok( day21.attr( "title" ) === "Divisble by 3", "Before show day - title 21" );
	inp.datepicker( "hide" ).datepicker( "destroy" );

	inp = testHelper.init( "#inp", { onUpdateDatepicker: onUpdateDatepicker } );
	inst = $.data( inp[ 0 ], "datepicker" );
	dp = $( "#ui-datepicker-div" );
	inp.val( "02/04/2008" ).datepicker( "show" );
	assert.ok( onUpdateDatepickerThis.id === inp[ 0 ].id, "On update datepicker - this OK" );
	assert.deepEqual( onUpdateDatepickerInst, inst, "On update datepicker - inst OK" );
	assert.ok( dp.find( "div.on-update-datepicker-test" ).length === 1, "On update datepicker - custom element" );
	inp.datepicker( "setDate", "02/05/2008" );
	assert.ok( dp.find( "div.on-update-datepicker-test" ).length === 1, "On update datepicker - custom element after setDate" );
	inp.datepicker( "refresh" );
	assert.ok( dp.find( "div.on-update-datepicker-test" ).length === 1, "On update datepicker - custom element after refresh" );
	inp.datepicker( "hide" ).datepicker( "destroy" );
} );

QUnit.test( "beforeShowDay - tooltips with quotes", function( assert ) {
	assert.expect( 1 );
	var inp, dp;
	inp = testHelper.init( "#inp", {
		beforeShowDay: function() {
			return [ true, "", "'" ];
		}
	} );
	dp = $( "#ui-datepicker-div" );

	inp.datepicker( "show" );
	assert.equal( dp.find( ".ui-datepicker-calendar td:contains('9')" ).attr( "title" ), "'" );
	inp.datepicker( "hide" ).datepicker( "destroy" );
} );

QUnit.test( "localisation", function( assert ) {
	assert.expect( 24 );
	var dp, month, day, date,
		inp = testHelper.init( "#inp", $.datepicker.regional.fr );
	inp.datepicker( "option", { dateFormat: "DD, d MM yy", showButtonPanel:true, changeMonth:true, changeYear:true } ).val( "" ).datepicker( "show" );
	dp = $( "#ui-datepicker-div" );
	assert.equal( $( ".ui-datepicker-close", dp ).text(), "Fermer", "Localisation - close" );
	$( ".ui-datepicker-close", dp ).simulate( "mouseover" );
	assert.equal( $( ".ui-datepicker-prev", dp ).text(), "Précédent", "Localisation - previous" );
	assert.equal( $( ".ui-datepicker-current", dp ).text(), "Aujourd'hui", "Localisation - current" );
	assert.equal( $( ".ui-datepicker-next", dp ).text(), "Suivant", "Localisation - next" );
	month = 0;
	$( ".ui-datepicker-month option", dp ).each( function() {
		assert.equal( $( this ).text(), $.datepicker.regional.fr.monthNamesShort[ month ],
			"Localisation - month " + month );
		month++;
	} );
	day = 1;
	$( ".ui-datepicker-calendar th", dp ).each( function() {
		assert.equal( $( this ).text(), $.datepicker.regional.fr.dayNamesMin[ day ],
			"Localisation - day " + day );
		day = ( day + 1 ) % 7;
	} );
	inp.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	date = new Date();
	assert.equal( inp.val(), $.datepicker.regional.fr.dayNames[ date.getDay() ] + ", " +
		date.getDate() + " " + $.datepicker.regional.fr.monthNames[ date.getMonth() ] +
		" " + date.getFullYear(), "Localisation - formatting" );
} );

QUnit.test( "noWeekends", function( assert ) {
	assert.expect( 31 );
	var i, date;
	for ( i = 1; i <= 31; i++ ) {
		date = new Date( 2001, 1 - 1, i );
		assert.deepEqual( $.datepicker.noWeekends( date ), [ ( i + 1 ) % 7 >= 2, "" ],
			"No weekends " + date );
	}
} );

QUnit.test( "iso8601Week", function( assert ) {
	assert.expect( 12 );
	var date = new Date( 2000, 12 - 1, 31 );
	assert.equal( $.datepicker.iso8601Week( date ), 52, "ISO 8601 week " + date );
	date = new Date( 2001, 1 - 1, 1 );
	assert.equal( $.datepicker.iso8601Week( date ), 1, "ISO 8601 week " + date );
	date = new Date( 2001, 1 - 1, 7 );
	assert.equal( $.datepicker.iso8601Week( date ), 1, "ISO 8601 week " + date );
	date = new Date( 2001, 1 - 1, 8 );
	assert.equal( $.datepicker.iso8601Week( date ), 2, "ISO 8601 week " + date );
	date = new Date( 2003, 12 - 1, 28 );
	assert.equal( $.datepicker.iso8601Week( date ), 52, "ISO 8601 week " + date );
	date = new Date( 2003, 12 - 1, 29 );
	assert.equal( $.datepicker.iso8601Week( date ), 1, "ISO 8601 week " + date );
	date = new Date( 2004, 1 - 1, 4 );
	assert.equal( $.datepicker.iso8601Week( date ), 1, "ISO 8601 week " + date );
	date = new Date( 2004, 1 - 1, 5 );
	assert.equal( $.datepicker.iso8601Week( date ), 2, "ISO 8601 week " + date );
	date = new Date( 2009, 12 - 1, 28 );
	assert.equal( $.datepicker.iso8601Week( date ), 53, "ISO 8601 week " + date );
	date = new Date( 2010, 1 - 1, 3 );
	assert.equal( $.datepicker.iso8601Week( date ), 53, "ISO 8601 week " + date );
	date = new Date( 2010, 1 - 1, 4 );
	assert.equal( $.datepicker.iso8601Week( date ), 1, "ISO 8601 week " + date );
	date = new Date( 2010, 1 - 1, 10 );
	assert.equal( $.datepicker.iso8601Week( date ), 1, "ISO 8601 week " + date );
} );

QUnit.test( "parseDate", function( assert ) {
	assert.expect( 26 );
	testHelper.init( "#inp" );
	var currentYear, gmtDate, fr, settings, zh;
	assert.ok( $.datepicker.parseDate( "d m y", "" ) == null, "Parse date empty" );
	testHelper.equalsDate( assert, $.datepicker.parseDate( "d m y", "3 2 01" ),
		new Date( 2001, 2 - 1, 3 ), "Parse date d m y" );
	testHelper.equalsDate( assert, $.datepicker.parseDate( "dd mm yy", "03 02 2001" ),
		new Date( 2001, 2 - 1, 3 ), "Parse date dd mm yy" );
	testHelper.equalsDate( assert, $.datepicker.parseDate( "d m y", "13 12 01" ),
		new Date( 2001, 12 - 1, 13 ), "Parse date d m y" );
	testHelper.equalsDate( assert, $.datepicker.parseDate( "dd mm yy", "13 12 2001" ),
		new Date( 2001, 12 - 1, 13 ), "Parse date dd mm yy" );
	testHelper.equalsDate( assert, $.datepicker.parseDate( "y-o", "01-34" ),
		new Date( 2001, 2 - 1, 3 ), "Parse date y-o" );
	testHelper.equalsDate( assert, $.datepicker.parseDate( "yy-oo", "2001-347" ),
		new Date( 2001, 12 - 1, 13 ), "Parse date yy-oo" );
	testHelper.equalsDate( assert, $.datepicker.parseDate( "oo yy", "348 2004" ),
		new Date( 2004, 12 - 1, 13 ), "Parse date oo yy" );
	testHelper.equalsDate( assert, $.datepicker.parseDate( "D d M y", "Sat 3 Feb 01" ),
		new Date( 2001, 2 - 1, 3 ), "Parse date D d M y" );
	testHelper.equalsDate( assert, $.datepicker.parseDate( "d MM DD yy", "3 February Saturday 2001" ),
		new Date( 2001, 2 - 1, 3 ), "Parse date dd MM DD yy" );
	testHelper.equalsDate( assert, $.datepicker.parseDate( "DD, MM d, yy", "Saturday, February 3, 2001" ),
		new Date( 2001, 2 - 1, 3 ), "Parse date DD, MM d, yy" );
	testHelper.equalsDate( assert, $.datepicker.parseDate( "'day' d 'of' MM (''DD''), yy",
		"day 3 of February ('Saturday'), 2001" ), new Date( 2001, 2 - 1, 3 ),
		"Parse date 'day' d 'of' MM (''DD''), yy" );
	currentYear = new Date().getFullYear();
	testHelper.equalsDate( assert, $.datepicker.parseDate( "y-m-d", ( currentYear - 2000 ) + "-02-03" ),
			new Date( currentYear, 2 - 1, 3 ), "Parse date y-m-d - default cutuff" );
	testHelper.equalsDate( assert, $.datepicker.parseDate( "y-m-d", ( currentYear - 2000 + 10 ) + "-02-03" ),
			new Date( currentYear + 10, 2 - 1, 3 ), "Parse date y-m-d - default cutuff" );
	testHelper.equalsDate( assert, $.datepicker.parseDate( "y-m-d", ( currentYear - 2000 + 11 ) + "-02-03" ),
			new Date( currentYear - 89, 2 - 1, 3 ), "Parse date y-m-d - default cutuff" );
	testHelper.equalsDate( assert, $.datepicker.parseDate( "y-m-d", "80-02-03", { shortYearCutoff: 80 } ),
		new Date( 2080, 2 - 1, 3 ), "Parse date y-m-d - cutoff 80" );
	testHelper.equalsDate( assert, $.datepicker.parseDate( "y-m-d", "81-02-03", { shortYearCutoff: 80 } ),
		new Date( 1981, 2 - 1, 3 ), "Parse date y-m-d - cutoff 80" );
	testHelper.equalsDate( assert, $.datepicker.parseDate( "y-m-d", ( currentYear - 2000 + 60 ) + "-02-03", { shortYearCutoff: "+60" } ),
			new Date( currentYear + 60, 2 - 1, 3 ), "Parse date y-m-d - cutoff +60" );
	testHelper.equalsDate( assert, $.datepicker.parseDate( "y-m-d", ( currentYear - 2000 + 61 ) + "-02-03", { shortYearCutoff: "+60" } ),
			new Date( currentYear - 39, 2 - 1, 3 ), "Parse date y-m-d - cutoff +60" );
	gmtDate = new Date( 2001, 2 - 1, 3 );
	gmtDate.setMinutes( gmtDate.getMinutes() - gmtDate.getTimezoneOffset() );
	testHelper.equalsDate( assert, $.datepicker.parseDate( "@", "981158400000" ), gmtDate, "Parse date @" );
	testHelper.equalsDate( assert, $.datepicker.parseDate( "!", "631167552000000000" ), gmtDate, "Parse date !" );

	fr = $.datepicker.regional.fr;
	settings = { dayNamesShort: fr.dayNamesShort, dayNames: fr.dayNames,
		monthNamesShort: fr.monthNamesShort, monthNames: fr.monthNames };
	testHelper.equalsDate( assert, $.datepicker.parseDate( "D d M y", "Lun. 9 avr. 01", settings ),
		new Date( 2001, 4 - 1, 9 ), "Parse date D M y with settings" );
	testHelper.equalsDate( assert, $.datepicker.parseDate( "d MM DD yy", "9 Avril Lundi 2001", settings ),
		new Date( 2001, 4 - 1, 9 ), "Parse date d MM DD yy with settings" );
	testHelper.equalsDate( assert, $.datepicker.parseDate( "DD, MM d, yy", "Lundi, Avril 9, 2001", settings ),
		new Date( 2001, 4 - 1, 9 ), "Parse date DD, MM d, yy with settings" );
	testHelper.equalsDate( assert, $.datepicker.parseDate( "'jour' d 'de' MM (''DD''), yy", "jour 9 de Avril ('Lundi'), 2001", settings ),
		new Date( 2001, 4 - 1, 9 ), "Parse date 'jour' d 'de' MM (''DD''), yy with settings" );

	zh = $.datepicker.regional[ "zh-CN" ];
	testHelper.equalsDate( assert, $.datepicker.parseDate( "yy M d", "2011 十一月 22", zh ),
		new Date( 2011, 11 - 1, 22 ), "Parse date yy M d with zh-CN" );
} );

QUnit.test( "parseDateErrors", function( assert ) {
	assert.expect( 18 );
	testHelper.init( "#inp" );
	var fr, settings;
	function expectError( expr, value, error ) {
		try {
			expr();
			assert.ok( false, "Parsed error " + value );
		}
		catch ( e ) {
			assert.equal( e, error, "Parsed error " + value );
		}
	}
	expectError( function() { $.datepicker.parseDate( null, "Sat 2 01" ); },
		"Sat 2 01", "Invalid arguments" );
	expectError( function() { $.datepicker.parseDate( "d m y", null ); },
		"null", "Invalid arguments" );
	expectError( function() { $.datepicker.parseDate( "d m y", "Sat 2 01" ); },
		"Sat 2 01 - d m y", "Missing number at position 0" );
	expectError( function() { $.datepicker.parseDate( "dd mm yy", "Sat 2 01" ); },
		"Sat 2 01 - dd mm yy", "Missing number at position 0" );
	expectError( function() { $.datepicker.parseDate( "d m y", "3 Feb 01" ); },
		"3 Feb 01 - d m y", "Missing number at position 2" );
	expectError( function() { $.datepicker.parseDate( "dd mm yy", "3 Feb 01" ); },
		"3 Feb 01 - dd mm yy", "Missing number at position 2" );
	expectError( function() { $.datepicker.parseDate( "mm dd yy", "2 1 01" ); },
		"2 1 01 - dd mm yy", "Missing number at position 4" );
	expectError( function() { $.datepicker.parseDate( "d m y", "3 2 AD01" ); },
		"3 2 AD01 - d m y", "Missing number at position 4" );
	expectError( function() { $.datepicker.parseDate( "d m yy", "3 2 AD01" ); },
		"3 2 AD01 - dd mm yy", "Missing number at position 4" );
	expectError( function() { $.datepicker.parseDate( "y-o", "01-D01" ); },
		"2001-D01 - y-o", "Missing number at position 3" );
	expectError( function() { $.datepicker.parseDate( "yy-oo", "2001-D01" ); },
		"2001-D01 - yy-oo", "Missing number at position 5" );
	expectError( function() { $.datepicker.parseDate( "D d M y", "D7 3 Feb 01" ); },
		"D7 3 Feb 01 - D d M y", "Unknown name at position 0" );
	expectError( function() { $.datepicker.parseDate( "D d M y", "Sat 3 M2 01" ); },
		"Sat 3 M2 01 - D d M y", "Unknown name at position 6" );
	expectError( function() { $.datepicker.parseDate( "DD, MM d, yy", "Saturday- Feb 3, 2001" ); },
		"Saturday- Feb 3, 2001 - DD, MM d, yy", "Unexpected literal at position 8" );
	expectError( function() { $.datepicker.parseDate( "'day' d 'of' MM (''DD''), yy",
		"day 3 of February (\"Saturday\"), 2001" ); },
		"day 3 of Mon2 ('Day7'), 2001", "Unexpected literal at position 19" );
	expectError( function() { $.datepicker.parseDate( "d m y", "29 2 01" ); },
		"29 2 01 - d m y", "Invalid date" );
	fr = $.datepicker.regional.fr;
	settings = { dayNamesShort: fr.dayNamesShort, dayNames: fr.dayNames,
		monthNamesShort: fr.monthNamesShort, monthNames: fr.monthNames };
	expectError( function() { $.datepicker.parseDate( "D d M y", "Mon 9 Avr 01", settings ); },
		"Mon 9 Avr 01 - D d M y", "Unknown name at position 0" );
	expectError( function() { $.datepicker.parseDate( "D d M y", "Lun. 9 Apr 01", settings ); },
		"Lun. 9 Apr 01 - D d M y", "Unknown name at position 7" );
} );

QUnit.test( "Ticket #7244: date parser does not fail when too many numbers are passed into the date function", function( assert ) {
	assert.expect( 4 );
	var date;
	try {
		date = $.datepicker.parseDate( "dd/mm/yy", "18/04/19881" );
		assert.ok( false, "Did not properly detect an invalid date" );
	}catch ( e ) {
		assert.ok( "invalid date detected" );
	}

	try {
		date = $.datepicker.parseDate( "dd/mm/yy", "18/04/1988 @ 2:43 pm" );
		assert.equal( date.getDate(), 18 );
		assert.equal( date.getMonth(), 3 );
		assert.equal( date.getFullYear(), 1988 );
	} catch ( e ) {
		assert.ok( false, "Did not properly parse date with extra text separated by whitespace" );
	}
} );

QUnit.test( "formatDate", function( assert ) {
	assert.expect( 16 );
	testHelper.init( "#inp" );
	var gmtDate, fr, settings;
	assert.equal( $.datepicker.formatDate( "d m y", new Date( 2001, 2 - 1, 3 ) ),
		"3 2 01", "Format date d m y" );
	assert.equal( $.datepicker.formatDate( "dd mm yy", new Date( 2001, 2 - 1, 3 ) ),
		"03 02 2001", "Format date dd mm yy" );
	assert.equal( $.datepicker.formatDate( "d m y", new Date( 2001, 12 - 1, 13 ) ),
		"13 12 01", "Format date d m y" );
	assert.equal( $.datepicker.formatDate( "dd mm yy", new Date( 2001, 12 - 1, 13 ) ),
		"13 12 2001", "Format date dd mm yy" );
	assert.equal( $.datepicker.formatDate( "yy-o", new Date( 2001, 2 - 1, 3 ) ),
		"2001-34", "Format date yy-o" );
	assert.equal( $.datepicker.formatDate( "yy-oo", new Date( 2001, 2 - 1, 3 ) ),
		"2001-034", "Format date yy-oo" );
	assert.equal( $.datepicker.formatDate( "D M y", new Date( 2001, 2 - 1, 3 ) ),
		"Sat Feb 01", "Format date D M y" );
	assert.equal( $.datepicker.formatDate( "DD MM yy", new Date( 2001, 2 - 1, 3 ) ),
		"Saturday February 2001", "Format date DD MM yy" );
	assert.equal( $.datepicker.formatDate( "DD, MM d, yy", new Date( 2001, 2 - 1, 3 ) ),
		"Saturday, February 3, 2001", "Format date DD, MM d, yy" );
	assert.equal( $.datepicker.formatDate( "'day' d 'of' MM (''DD''), yy",
		new Date( 2001, 2 - 1, 3 ) ), "day 3 of February ('Saturday'), 2001",
		"Format date 'day' d 'of' MM ('DD'), yy" );
	gmtDate = new Date( 2001, 2 - 1, 3 );
	gmtDate.setMinutes( gmtDate.getMinutes() - gmtDate.getTimezoneOffset() );
	assert.equal( $.datepicker.formatDate( "@", gmtDate ), "981158400000", "Format date @" );
	assert.equal( $.datepicker.formatDate( "!", gmtDate ), "631167552000000000", "Format date !" );
	fr = $.datepicker.regional.fr;
	settings = { dayNamesShort: fr.dayNamesShort, dayNames: fr.dayNames,
		monthNamesShort: fr.monthNamesShort, monthNames: fr.monthNames };
	assert.equal( $.datepicker.formatDate( "D M y", new Date( 2001, 4 - 1, 9 ), settings ),
		"lun. avr. 01", "Format date D M y with settings" );
	assert.equal( $.datepicker.formatDate( "DD MM yy", new Date( 2001, 4 - 1, 9 ), settings ),
		"lundi avril 2001", "Format date DD MM yy with settings" );
	assert.equal( $.datepicker.formatDate( "DD, MM d, yy", new Date( 2001, 4 - 1, 9 ), settings ),
		"lundi, avril 9, 2001", "Format date DD, MM d, yy with settings" );
	assert.equal( $.datepicker.formatDate( "'jour' d 'de' MM (''DD''), yy",
		new Date( 2001, 4 - 1, 9 ), settings ), "jour 9 de avril ('lundi'), 2001",
		"Format date 'jour' d 'de' MM (''DD''), yy with settings" );
} );

// TODO: Fix this test so it isn't mysteriously flaky in Browserstack on certain OS/Browser combos
// test("Ticket 6827: formatDate day of year calculation is wrong during day lights savings time", function(){
// 	expect( 1 );
// 	var time = $.datepicker.formatDate("oo", new Date("2010/03/30 12:00:00 CDT"));
// 	equal(time, "089");
// });

QUnit.test( "Ticket 7602: Stop datepicker from appearing with beforeShow event handler", function( assert ) {
	assert.expect( 3 );

	var inp, dp;

	inp = testHelper.init( "#inp", {
		beforeShow: function() {
		}
	} );
	dp = $( "#ui-datepicker-div" );
	inp.datepicker( "show" );
	assert.equal( dp.css( "display" ), "block", "beforeShow returns nothing" );
	inp.datepicker( "hide" ).datepicker( "destroy" );

	inp = testHelper.init( "#inp", {
		beforeShow: function() {
			return true;
		}
	} );
	dp = $( "#ui-datepicker-div" );
	inp.datepicker( "show" );
	assert.equal( dp.css( "display" ), "block", "beforeShow returns true" );
	inp.datepicker( "hide" );
	inp.datepicker( "destroy" );

	inp = testHelper.init( "#inp", {
		beforeShow: function() {
			return false;
		}
	} );
	dp = $( "#ui-datepicker-div" );
	inp.datepicker( "show" );
	assert.equal( dp.css( "display" ), "none", "beforeShow returns false" );
	inp.datepicker( "destroy" );
} );

QUnit.test( "Ticket #15284: escaping text parameters", function( assert ) {
	assert.expect( 7 );

	var done = assert.async();

	var qf = $( "#qunit-fixture" );

	window.uiGlobalXss = [];

	var inp = testHelper.init( "#inp", {
		showButtonPanel: true,
		showOn: "both",
		prevText: "<script>uiGlobalXss = uiGlobalXss.concat( [ 'prevText XSS' ] )</script>",
		nextText: "<script>uiGlobalXss = uiGlobalXss.concat( [ 'nextText XSS' ] )</script>",
		currentText: "<script>uiGlobalXss = uiGlobalXss.concat( [ 'currentText XSS' ] )</script>",
		closeText: "<script>uiGlobalXss = uiGlobalXss.concat( [ 'closeText XSS' ] )</script>",
		buttonText: "<script>uiGlobalXss = uiGlobalXss.concat( [ 'buttonText XSS' ] )</script>",
		appendText: "<script>uiGlobalXss = uiGlobalXss.concat( [ 'appendText XSS' ] )</script>"
	} );

	var dp = $( "#ui-datepicker-div" );

	testHelper.onFocus( inp, function() {
		assert.equal( dp.find( ".ui-datepicker-prev" ).text().trim(),
			"<script>uiGlobalXss = uiGlobalXss.concat( [ 'prevText XSS' ] )</script>",
			"prevText escaped" );
		assert.equal( dp.find( ".ui-datepicker-next" ).text().trim(),
			"<script>uiGlobalXss = uiGlobalXss.concat( [ 'nextText XSS' ] )</script>",
			"nextText escaped" );
		assert.equal( dp.find( ".ui-datepicker-current" ).text().trim(),
			"<script>uiGlobalXss = uiGlobalXss.concat( [ 'currentText XSS' ] )</script>",
			"currentText escaped" );
		assert.equal( dp.find( ".ui-datepicker-close" ).text().trim(),
			"<script>uiGlobalXss = uiGlobalXss.concat( [ 'closeText XSS' ] )</script>",
			"closeText escaped" );

		assert.equal( qf.find( ".ui-datepicker-trigger" ).text().trim(),
			"<script>uiGlobalXss = uiGlobalXss.concat( [ 'buttonText XSS' ] )</script>",
			"buttonText escaped" );
		assert.equal( qf.find( ".ui-datepicker-append" ).text().trim(),
			"<script>uiGlobalXss = uiGlobalXss.concat( [ 'appendText XSS' ] )</script>",
			"appendText escaped" );

		assert.deepEqual( window.uiGlobalXss, [], "No XSS" );

		delete window.uiGlobalXss;
		inp.datepicker( "hide" ).datepicker( "destroy" );
		done();
	} );
} );

} );
