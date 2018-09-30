sap.ui.define([], function() {
	"use strict";

	return {
		scr2SummaryUnit: function(sPVCFTE) {
			var rText = "";

			switch (sPVCFTE) {
				case "PVC":
					rText = "CHF";
					break;
				case "FTE":
					rText = "HC";
					break;
				default:
			}
			return rText;
		}
	};

});