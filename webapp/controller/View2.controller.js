sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/model/json/JSONModel',
	'jquery.sap.global',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/m/Dialog',
	'sap/m/Button',
	"testnamespace/controller/BaseController"
], function(Controller, JSONModel, jQuery, Filter, FilterOperator, Dialog, Button) {
	"use strict";

	return Controller.extend("testnamespace.controller.View2", {

		onInit: function(evt) {
			this.oModel = new JSONModel(jQuery.sap.getModulePath("sap.ui.demo.mock", "/secondViewSummary.json"));
			this.getView().setModel(this.oModel, "screen2Summary");

			//get thata for create new model if these datas exist
			this.modelNewThema = sap.ui.getCore().getModel("globalModelNewThema");
			if (typeof this.modelNewThema !== "undefined") {
				//pass value to excelGrid23
				////////this.getView().setModel(this.localsystemsModel, "localsystemsModel");
			}
		},
		
		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		}

	});
});