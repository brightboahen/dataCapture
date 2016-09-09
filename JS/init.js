(function () {
	'use strict';

	/**
	 * This function is responsible for capturing data (based on mappings.js) and sending data (with use of DataReporter class).
	 *
	 * @name init
	 */
	function init () {
		/**
		 * Creates an instance of DataCapture Class and initialises it
		 * */
		var dataCaptureObj = new DataClass.DataCapture(mappings,new classes.DataReporter());
		dataCaptureObj.init();
	}

	document.addEventListener('DOMContentLoaded', init, false);

}());
