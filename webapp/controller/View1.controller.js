sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/model/json/JSONModel',
	'jquery.sap.global',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/m/Dialog',
	'sap/m/Button',
	"sap/m/MessageToast",
	"testnamespace/controller/BaseController"
], function(Controller, JSONModel, jQuery, Filter, FilterOperator, Dialog, Button, MessageToast, BaseController) {
	"use strict";

	return Controller.extend("testnamespace.controller.View1", {

		onInit: function(evt) {
			this.buttonIdPattern = "__yearButton";
			this.themaName = "";
			this.yearStart = "";
			this.yearEnd = "";

			this.count = 0;

			this.oModel = new JSONModel(jQuery.sap.getModulePath("sap.ui.demo.mock", "/firstData.json"));
			this.getView().setModel(this.oModel, "screen1TableModel");

		},

		onAfterRendering: function() {
			// sap.ui.getCore().byId("createButton").addStyleClass("sap.ui.commons.ButtonStyle.Accept");
		},

		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		onGoPress: function() {
			this.getRouter().navTo("View2");
		},

		onDialogInputLiveChange: function(oEvent) {
			this.themaName = oEvent.getParameter("newValue");
			if (this.themaName == 111 || this.themaName == 121 || this.themaName == 113) {
				sap.ui.getCore().byId("themeDescriptionId").setText("Test desciption");
			} else {
				sap.ui.getCore().byId("themeDescriptionId").setText("                  ");
			}

			if (this.themaName !== "") {
				sap.ui.getCore().byId("msThemaName").setType("Success");
				var tN = "Thema: " + this.themaName;
				sap.ui.getCore().byId("msThemaName").setText(tN);
			} else {
				sap.ui.getCore().byId("msThemaName").setType("Warning");	
				sap.ui.getCore().byId("msThemaName").setText("Type thema name.");
			}

			if (this.themaName !== "" && this.yearStart !== "" && this.yearStart !== "") {
				sap.ui.getCore().byId("__createButton").setEnabled(true);
				sap.ui.getCore().byId("__createButton").setType("Accept");
			} else {
				sap.ui.getCore().byId("__createButton").setEnabled(false);
				sap.ui.getCore().byId("__createButton").setType("Default");
			}
		},

		onDialogSuggest: function(event) {
			var value = event.getParameter("suggestValue");
			var filters = [];
			if (value) {
				filters = [new sap.ui.model.Filter([
					new sap.ui.model.Filter("ThemeNo", function(sText) {
						return (sText || "").toUpperCase().indexOf(value.toUpperCase()) > -1;
					}),
					new sap.ui.model.Filter("ThemeDescription", function(sDes) {
						return (sDes || "").toUpperCase().indexOf(value.toUpperCase()) > -1;
					})
				], false)];
			}

			event.getSource().getBinding("suggestionItems").filter(filters);
			event.getSource().suggest();
		},

		onYearPress: function(oEvent) {
			this.count = this.count + 1;
			var pressedButtonId = oEvent.getParameter("id"),
				pressedButtonNumer = Number(pressedButtonId.substr(12, 15)),
				buttonId,
				i;

			if (this.count === 1) {
				for (i = 1; i < pressedButtonNumer; i++) {
					buttonId = this.buttonIdPattern + i;
					// sap.ui.getCore().byId(buttonId).setProperty("enabled", false);
				}
				buttonId = this.buttonIdPattern + pressedButtonNumer;
				sap.ui.getCore().byId(buttonId).setType("Emphasized");
				// sap.ui.getCore().byId(buttonId).addStyleClass("yearButtonChecked");

				this.yearStart = sap.ui.getCore().byId(buttonId).getText();
				this.firstPressedButton = pressedButtonNumer;
			} else if (this.count === 2) {
				buttonId = this.buttonIdPattern + pressedButtonNumer;
				this.yearEnd = sap.ui.getCore().byId(buttonId).getText();

		
				sap.ui.getCore().byId("msYearsRange").setType("Success");
				var tN = "Years: " + this.yearStart + " - " + this.yearEnd;
				sap.ui.getCore().byId("msYearsRange").setText(tN);
		
				// sap.ui.getCore().byId("vbMsYearsRange").setVisible(false);

				var pressedButtonNumerInc = pressedButtonNumer;
				pressedButtonNumerInc++;
				for (var j = this.firstPressedButton; j < 31; j++) {
					buttonId = this.buttonIdPattern + j;
					if (j <= pressedButtonNumer) {
						sap.ui.getCore().byId(buttonId).setType("Emphasized");
						// sap.ui.getCore().byId(buttonId).addStyleClass("yearButtonChecked");
					} else {
						// sap.ui.getCore().byId(buttonId).setProperty("enabled", false);
					}
				}

				// shoudl create button should be enabled?
				if (this.themaName !== "") {
					sap.ui.getCore().byId("__createButton").setEnabled(true);
					sap.ui.getCore().byId("__createButton").setType("Accept");
				}

			} else {
				this._clearYears();
			}
		},

		_clearYears: function() {
			sap.ui.getCore().byId("__createButton").setEnabled(false);
			sap.ui.getCore().byId("__createButton").setType("Default");
			this.count = 0;
			this.yearStart = "";
			this.yearEnd = "";

	sap.ui.getCore().byId("msYearsRange").setType("Warning");	
				sap.ui.getCore().byId("msYearsRange").setText("Click start and end year to set the range!");

			// sap.ui.getCore().byId("vbMsYearsRange").setVisible(true);

			for (var i = 1; i < 31; i++) {
				var buttonId = this.buttonIdPattern + i;
				sap.ui.getCore().byId(buttonId).setType("Default");
				sap.ui.getCore().byId(buttonId).setProperty("enabled", true);
				sap.ui.getCore().byId(buttonId).removeStyleClass("yearButtonChecked");
			}

		},

		onCreatePress: function(oEvent) {
			//open dialog
			this.that = this;
			var currentDate = new Date();
			var currentYear = currentDate.getFullYear();

			if (!this.dialog) {
				this.dialog = sap.ui.xmlfragment("testnamespace.view.dialog1", this.getView().getController());
				this.dialog.setContentHeight("100%");
				this.dialog.setContentWidth("25%");
			}
			this.dialog.open();

			this.oModel = new JSONModel(jQuery.sap.getModulePath("sap.ui.demo.mock", "/themas.json"));
			var oView = this.getView();
			oView.setModel(this.oModel, "themasModel");
			this.oSF = oView.byId("dialogInputId");

			//numbers on years buttons generation
			var buttonId;
			for (var i = 1; i < 31; i++) {
				buttonId = this.buttonIdPattern + i;
				sap.ui.getCore().byId(buttonId).setProperty("text", currentYear);
				currentYear++;
			}

			//pass searched value to dialog input field
			// sap.ui.getCore().byId("dialogInputId").setProperty("value", this.sQuery);
			sap.ui.getCore().byId("dialogInputId").setValue(this.sQuery);
			//  this.themaName = this.sQuery;
			// if (this.sQuery !== "") {
			// 	sap.ui.getCore().byId("vbMsThemaName").setVisible(false);
			// }

			//set description of theme if exist
			if (this.sQuery == 111 || this.sQuery == 121 || this.sQuery == 113) {
				sap.ui.getCore().byId("themeDescriptionId").setText("Test desciption");
			} else {
				sap.ui.getCore().byId("themeDescriptionId").setText("                  ");
			}

		},

		onDialogPressCreate: function(oEvent) {
			if (this.themaName !== "" && this.yearStart !== "" && this.yearEnd !== "") {

				this.dialog.close();
				// this.dialogFrafment.destroy(true);
				this.modelNewThema = new sap.ui.model.json.JSONModel();
				this.modelNewThema.setData({
					themaName: this.themaName,
					yearStart: this.yearStart,
					yearEnd: this.yearEnd
				});
				sap.ui.getCore().setModel(this.modelNewThema, "globalModelNewThema");

				this._clearYears();
				this.getRouter().navTo("View2New");

			} else {
				sap.m.MessageToast.show("Name and years range are mandatory!");

			}

		},

		onCloseDialog: function(oEvent) {
			this.dialog.close();
			this._clearYears();
			//	sap.ui.getCore().byId("dialogInputId");
			//this.dialogFrafment.destroy(true);
			this.modelNewThema.destroy(true);
		},

		onLiveChange: function(oEvent) {
			this.sQuery = oEvent.getParameter("newValue");

			if (this.sQuery && this.sQuery.length > 0) {
				var oFilter1 = new Filter("Molecule", FilterOperator.Contains, this.sQuery);
				var oFilter2 = new Filter("Theme", FilterOperator.Contains, this.sQuery);
				var oFilter3 = new Filter("Committee", FilterOperator.Contains, this.sQuery);
				var oFilter4 = new Filter("LSPC Date", FilterOperator.Contains, this.sQuery);
				var oFilter5 = new Filter("LSPC Agenda", FilterOperator.Contains, this.sQuery);
				var oFilter6 = new Filter("Phase", FilterOperator.Contains, this.sQuery);
				var oFilter7 = new Filter("DTA", FilterOperator.Contains, this.sQuery);
				var oFilter8 = new Filter("Approved", FilterOperator.Contains, this.sQuery);
				var oFilter9 = new Filter("Total", FilterOperator.Contains, this.sQuery);
				var allFilter = new sap.ui.model.Filter([oFilter1, oFilter2, oFilter3, oFilter4, oFilter5, oFilter6, oFilter7, oFilter8,
					oFilter9
				]);
			}
			this._applySearch(allFilter, this.sQuery);
			// }

			this.byId("createButton").setProperty("text", this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(
				"screen1Create") + " " + this.sQuery);

		},

		onSearch: function(oEvent) {
			this.sQuery = oEvent.getParameter("query");

			if (this.sQuery && this.sQuery.length > 0) {
				var oFilter1 = new Filter("Molecule", FilterOperator.Contains, this.sQuery);
				var oFilter2 = new Filter("Theme", FilterOperator.Contains, this.sQuery);
				var oFilter3 = new Filter("Committee", FilterOperator.Contains, this.sQuery);
				var oFilter4 = new Filter("LSPC Date", FilterOperator.Contains, this.sQuery);
				var oFilter5 = new Filter("LSPC Agenda", FilterOperator.Contains, this.sQuery);
				var oFilter6 = new Filter("Phase", FilterOperator.Contains, this.sQuery);
				var oFilter7 = new Filter("DTA", FilterOperator.Contains, this.sQuery);
				var oFilter8 = new Filter("Approved", FilterOperator.Contains, this.sQuery);
				var oFilter9 = new Filter("Total", FilterOperator.Contains, this.sQuery);
				var allFilter = new sap.ui.model.Filter([oFilter1, oFilter2, oFilter3, oFilter4, oFilter5, oFilter6, oFilter7, oFilter8,
					oFilter9
				]);
			}
			this._applySearch(allFilter, this.sQuery);
			// }

		},
		_applySearch: function(oTableSearchState) {
			var oTable = this.byId("idTable");
			//oViewModel = this.getView().getModel("screen1TableModel");
			oTable.getBinding("items").filter(oTableSearchState, "Application");
			// changes the noDataText of the list in case there are no filter 
			if (typeof oTableSearchState !== "undefined") {
				if (oTableSearchState.length !== 0) {
					if (oTable.getItems().length === 0) {
						// this.byId("createButton").setProperty("visible", true);
						this.byId("createButton").setProperty("text", this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(
							"screen1Create") + " " + this.sQuery);
						// oViewModel.setProperty("/tableNoDataText", this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(
						// 	"worklistNoDataWithSearchText"));
					} else {
						// this.byId("createButton").setProperty("visible", false);
					}
				} else {
					// this.byId("createButton").setProperty("visible", false);
				}
			} else {
				// this.byId("createButton").setProperty("visible", false);
			}
		}

	});
});