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

	return Controller.extend("testnamespace.controller.View2New", {

		onInit: function(evt) {
			this.oModel = new JSONModel(jQuery.sap.getModulePath("sap.ui.demo.mock", "/secondViewSummary.json"));
			this.getView().setModel(this.oModel, "screen2Summary");

			//get thata for create new model if these datas exist
			this.modelNewThema = sap.ui.getCore().getModel("globalModelNewThema");
			if (typeof this.modelNewThema !== "undefined") {
				//pass value to excelGrid23
				this.getView().setModel(this.modelNewThema, "localModelNewThema");

			this.byId("ccExcel1id").setProperty("thema", this.modelNewThema);
				this.byId("ccExcel2id").setProperty("thema", this.modelNewThema);
				

			}
		},
		
		onNavView1: function(){
			this.getRouter().navTo("View1");
		},

		onAfterRendering: function() {
			this.byId("themaNameid").setProperty("title", this.modelNewThema.getData().themaName);
			this.byId("dateOfReqId").setProperty("title", this.getTodaysDate());

		},

		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		getTodaysDate: function() {
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth() + 1; //January is 0!
			var yyyy = today.getFullYear();

			if (dd < 10) {
				dd = '0' + dd;
			}

			if (mm < 10) {
				mm = '0' + mm;
			}
			today = dd + '.' + mm + '.' + yyyy;
			return today;
		}

	});
});