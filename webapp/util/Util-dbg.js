/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ui.core.util.Export");
jQuery.sap.require("sap.ui.core.util.ExportTypeCSV");
jQuery.sap.require("jquery.sap.resources");
jQuery.sap.require("testnamespace.util.Formatter");

jQuery.sap.declare("testnamespace.util.Util");

/*global sm*/

testnamespace.util.Util = {

	C_CSV_SYSTEM_NOTE_STAT: "SysRec_Systems",
	C_CSV_SYSTEM_NOTE: "SysRec_Notes",
	C_CSV_NOTE_OBJECT: "SysRec_Object_List",
	C_CSV_NOTE_REQ_NOTE: "SysRec_Prerequsite_Notes",
	C_CSV_CHARM : "SysRec_Requests_for_Change",
	C_CSV_BPCA : "SysRec_Change_Impact_Analysis",

	getResourceBundle: function() {

		if (!testnamespace.util.Util._bundle) {

			var sLocale = sap.ui.getCore().getConfiguration().getLanguage();

			var path = jQuery.sap.getModulePath("testnamespace");

			var url = path + "/i18n/i18n.properties";

			testnamespace.util.Util._bundle = jQuery.sap.resources({
				url: url,
				locale: sLocale
			});
		}

		return testnamespace.util.Util._bundle;

	},

	exportSystemData: function(element, path) {

		var oModel = element.getModel();

		var oBinding = element.getBinding("items");

		var bundle = testnamespace.util.Util.getResourceBundle();

		var oPath = "/SystemStatisticsSet";

		if (path) {
			oPath = path + oPath;
		}

		if (typeof oBinding.sFilterParams !== "undefined") {

			oPath = oPath + "?" + oBinding.sFilterParams;

			if (typeof oBinding.sSortParams !== "undefined") {

				oPath = oPath + "&" + oBinding.sSortParams;
			}

		} else {

			if (typeof oBinding.sSortParams !== "undefined") {

				oPath = oPath + "?" + oBinding.sSortParams;
			}
		}

		oModel.read(oPath, null, null, true, function(oData) {
			var model = new sap.ui.model.json.JSONModel();

			model.setData(oData.results);

			var oExport = new sap.ui.core.util.Export({

				// Type that will be used to generate the content. Own ExportType's can be created to support other formats
				exportType: new sap.ui.core.util.ExportTypeCSV({
				//	separatorChar: ";"
				}),

				// column definitions with column name and binding info for the content

				columns: [{
						name: bundle.getText("TECHNICAL_SYSTEM"),
						template: {
							content: "{SystemId}"
						}
			}, {
						name: bundle.getText("FILTER_IT_ROLE"),
						template: {
							content: "{ path: 'SystemRole', formatter: 'testnamespace.util.Formatter.getSystemRoleText' }"
						}
			}, {
						name: bundle.getText("FILTER_PRIORITY"),
						template: {
							content: "{ path: 'SystemPriority', formatter: 'testnamespace.util.Formatter.getSystemPriorityText' }"
						}
			}, {
						name: bundle.getText("SAP_NOTE_TYPE_SECURITY"),
						template: {
							content: "{SecurityCount}"
						}
			},
					{
						name: bundle.getText("SAP_NOTE_TYPE_HOTNEWS"),
						template: {
							content: "{HotnewsCount}"
						}
			},
					{
						name: bundle.getText("SAP_NOTE_TYPE_PERFORMANCE"),
						template: {
							content: "{PerformanceCount}"
						}
			},
					{
						name: bundle.getText("SAP_NOTE_TYPE_LEGAL"),
						template: {
							content: "{LegalCount}"
						}
			}, {
						name: bundle.getText("SAP_NOTE_FAVORITE"),
						template: {
							content: "{IsFavorite}"
						}
			}
			]
			});

			// download exported file

			var fileName = testnamespace.util.Util.C_CSV_SYSTEM_NOTE_STAT + "-" + testnamespace.util.Util.getCurrentDateTime();

			oExport.setModel(model);
			oExport.bindRows("/");
			
			oExport.saveFile(fileName).always(function() {
				this.destroy();
			});
		});

	},

	getCurrentDateTime: function() {

		var dt = new Date();

		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
			pattern: "yyyy-MM-dd_hh-mm-ss"
		});

		return dateFormat.format(dt, true);
	},

	exportObjectListPopup: function(oModel, path) {

		var bundle = testnamespace.util.Util.getResourceBundle();

		var oPath = "/SystemNoteObjectSet";
		if (path) {
			oPath = path + oPath;
		}
		var oExport = new sap.ui.core.util.Export({

			// Type that will be used to generate the content. Own ExportType's can be created to support other formats
			exportType: new sap.ui.core.util.ExportTypeCSV({
			//	separatorChar: ";"
			}),

			// Pass in the model created above
			models: oModel,

			// binding information for the rows aggregation
			rows: {
				path: oPath
			},

			// column definitions with column name and binding info for the content

			columns: [{
					name: bundle.getText("TECHNICAL_SYSTEM"),
					template: {
						content: "{SystemId}"
					}
			}, {
					name: bundle.getText("NOTE_NUMBER"),
					template: {
						content: "{NoteNumber}"
					}
			},
				{
					name: bundle.getText("PROGRAM_ID"),
					template: {
						content: "{ProgramId}"
					}
			},
				{
					name: bundle.getText("OBJECT_TYPE"),
					template: {
						content: "{ObjectType}"
					}
			},
				{
					name: bundle.getText("OBJECT_NAME"),
					template: {
						content: "{ObjectName}"
					}
			},
				{
					name: bundle.getText("PROGRAM_ID2"),
					template: {
						content: "{ProgramId2}"
					}
			},
				{
					name: bundle.getText("OBJECT_TYPE2"),
					template: {
						content: "{ObjectType2}"
					}
			},
				{
					name: bundle.getText("OBJECT_NAME2"),
					template: {
						content: "{ObjectName2}"
					}
			}
			]
		});

		var fileName = testnamespace.util.Util.C_CSV_NOTE_OBJECT + " " + testnamespace.util.Util.getCurrentDateTime();

		// download exported file
		oExport.saveFile(fileName).always(function() {
			this.destroy();
		});

	},

	exportRequiredNotePopup: function(oModel, path) {

		var bundle = testnamespace.util.Util.getResourceBundle();

		var oPath = "/SystemNoteRequiredNoteSet";

		if (path) {
			oPath = path + oPath;
		}

		var oExport = new sap.ui.core.util.Export({

			// Type that will be used to generate the content. Own ExportType's can be created to support other formats
			exportType: new sap.ui.core.util.ExportTypeCSV({
			//	separatorChar: ";"
			}),

			// Pass in the model created above
			models: oModel,

			// binding information for the rows aggregation
			rows: {
				path: oPath
			},

			// column definitions with column name and binding info for the content

			columns: [{
					name: bundle.getText("TECHNICAL_SYSTEM"),
					template: {
						content: "{SystemId}"
					}
			}, {
					name: bundle.getText("NOTE_NUMBER"),
					template: {
						content: "{NoteNumber}"
					}
			},
				{
					name: bundle.getText("NOTE_NUMBER_REQ"),
					template: {
						content: "{NoteNumberReq}"
					}
			},
				{
					name: bundle.getText("NOTE_TEXT"),
					template: {
						content: "{ShortText}"
					}
			}
			]
		});

		var fileName = testnamespace.util.Util.C_CSV_NOTE_REQ_NOTE + " " + testnamespace.util.Util.getCurrentDateTime();

		// download exported file
		oExport.saveFile(fileName).always(function() {
			this.destroy();
		});
	},

	exportChaRM: function(element, path) {

		var oModel = element.getModel();

		var oBinding = element.getBinding("items");

		var bundle = testnamespace.util.Util.getResourceBundle();

		var oPath = "/SystemChangeRequestSet";

		if (path) {
			oPath = path + oPath;
		}

		if (typeof oBinding.sFilterParams !== "undefined") {

			oPath = oPath + "?" + oBinding.sFilterParams;

			if (typeof oBinding.sSortParams !== "undefined") {

				oPath = oPath + "&" + oBinding.sSortParams;
			}

		} else {

			if (typeof oBinding.sSortParams !== "undefined") {

				oPath = oPath + "?" + oBinding.sSortParams;
			}
		}

		oModel.read(oPath, null, null, true, function(oData) {
			var model = new sap.ui.model.json.JSONModel();

			model.setData(oData.results);

			var oExport = new sap.ui.core.util.Export({

				// Type that will be used to generate the content. Own ExportType's can be created to support other formats
				exportType: new sap.ui.core.util.ExportTypeCSV({
				//	separatorChar: ";"
				}),
				// column definitions with column name and binding info for the content

				columns: [{
						name: bundle.getText("TECHNICAL_SYSTEM"),
						template: {
							content: "{SystemId}"
						}
			}, {
						name: bundle.getText("CHARM_ID"),
						template: {
							content: "{ObjectId}"
						}
			}, {
						name: bundle.getText("CHARM_SHORT_TEXT"),
						template: {
							content: "{ShortText}"
						}
			},
					{
						name: bundle.getText("CHARM_CREATEDBY"),
						template: {
							content: "{DisplayName}"
						}
			},
					{
						name: bundle.getText("CHARM_CREATEDAT"),
						template: {
							content: "{path: 'Createdat', formatter: 'testnamespace.util.Formatter.getDateTimeString'}"
						}
			}
			]
			});

			var fileName = testnamespace.util.Util.C_CSV_CHARM + " " + testnamespace.util.Util.getCurrentDateTime();

			oExport.setModel(model);
			oExport.bindRows("/");

			oExport.saveFile(fileName).always(function() {
				this.destroy();
			});

		});
		
	},

	exportBPCA: function(element, path) {

		var oModel = element.getModel();

		var oBinding = element.getBinding("items");

		var bundle = testnamespace.util.Util.getResourceBundle();

		var oPath = "/SystemBPCASet";

		if (path) {
			oPath = path + oPath;
		}

		if (typeof oBinding.sFilterParams !== "undefined") {

			oPath = oPath + "?" + oBinding.sFilterParams;

			if (typeof oBinding.sSortParams !== "undefined") {

				oPath = oPath + "&" + oBinding.sSortParams;
			}

		} else {

			if (typeof oBinding.sSortParams !== "undefined") {

				oPath = oPath + "?" + oBinding.sSortParams;
			}
		}

		oModel.read(oPath, null, null, true, function(oData) {
			var model = new sap.ui.model.json.JSONModel();

			model.setData(oData.results);

			var oExport = new sap.ui.core.util.Export({

				// Type that will be used to generate the content. Own ExportType's can be created to support other formats
				exportType: new sap.ui.core.util.ExportTypeCSV({
				//	separatorChar: ";"
				}),
				// column definitions with column name and binding info for the content

				columns: [{
						name: bundle.getText("TECHNICAL_SYSTEM"),
						template: {
							content: "{SystemId}"
						}
			}, {
						name: bundle.getText("BPCA_ID"),
						template: {
							content: "{ResultId}"
						}
			}, {
						name: bundle.getText("BPCA_SHORT_TEXT"),
						template: {
							content: "{ShortText}"
						}
			},
					{
						name: bundle.getText("BPCA_CREATEDBY"),
						template: {
							content: "{DisplayName}"
						}
			},
					{
						name: bundle.getText("BPCA_STARTEDDAT"),
						template: {
							content: "{path: 'Startedat', formatter: 'testnamespace.util.Formatter.getDateTimeString'}"
						}
			}
			]
			});

			var fileName = testnamespace.util.Util.C_CSV_BPCA + " " + testnamespace.util.Util.getCurrentDateTime();

			oExport.setModel(model);
			oExport.bindRows("/");

			oExport.saveFile(fileName).always(function() {
				this.destroy();
			});

		});
	},
	
	exportObjectList: function(oModel, path) {

		var bundle = testnamespace.util.Util.getResourceBundle();

		var oPath = "/SystemNoteObjectSet";
		if (path) {
			oPath = path + oPath;
		}

		oModel.read(oPath, null, null, true, function(oData) {
			var model = new sap.ui.model.json.JSONModel();

			model.setData(oData.results);
			var oExport = new sap.ui.core.util.Export({

				// Type that will be used to generate the content. Own ExportType's can be created to support other formats
				exportType: new sap.ui.core.util.ExportTypeCSV({
				//	separatorChar: ";"
				}),

				// column definitions with column name and binding info for the content

				columns: [{
						name: bundle.getText("TECHNICAL_SYSTEM"),
						template: {
							content: "{SystemId}"
						}
			}, {
						name: bundle.getText("NOTE_NUMBER"),
						template: {
							content: "{NoteNumber}"
						}
			},
					{
						name: bundle.getText("PROGRAM_ID"),
						template: {
							content: "{ProgramId}"
						}
			},
					{
						name: bundle.getText("OBJECT_TYPE"),
						template: {
							content: "{ObjectType}"
						}
			},
					{
						name: bundle.getText("OBJECT_NAME"),
						template: {
							content: "{ObjectName}"
						}
			},
					{
						name: bundle.getText("PROGRAM_ID2"),
						template: {
							content: "{ProgramId2}"
						}
			},
					{
						name: bundle.getText("OBJECT_TYPE2"),
						template: {
							content: "{ObjectType2}"
						}
			},
					{
						name: bundle.getText("OBJECT_NAME2"),
						template: {
							content: "{ObjectName2}"
						}
			}
			]
			});

			var fileName = testnamespace.util.Util.C_CSV_NOTE_OBJECT + " " + testnamespace.util.Util.getCurrentDateTime();
			
			oExport.setModel(model);
			oExport.bindRows("/");
			
			// download exported file
			oExport.saveFile(fileName).always(function() {
				this.destroy();
			});
		});

	},

	exportRequiredNote: function(oModel, path) {

		var bundle = testnamespace.util.Util.getResourceBundle();

		var oPath = "/SystemNoteRequiredNoteSet";

		if (path) {
			oPath = path + oPath;
		}

		oModel.read(oPath, null, null, true, function(oData) {
			var model = new sap.ui.model.json.JSONModel();

			model.setData(oData.results);

			var oExport = new sap.ui.core.util.Export({

				// Type that will be used to generate the content. Own ExportType's can be created to support other formats
				exportType: new sap.ui.core.util.ExportTypeCSV({
				//	separatorChar: ";"
				}),

				// column definitions with column name and binding info for the content

				columns: [{
						name: bundle.getText("TECHNICAL_SYSTEM"),
						template: {
							content: "{SystemId}"
						}
			}, {
						name: bundle.getText("NOTE_NUMBER"),
						template: {
							content: "{NoteNumber}"
						}
			},
					{
						name: bundle.getText("NOTE_NUMBER_REQ"),
						template: {
							content: "{NoteNumberReq}"
						}
			},
					{
						name: bundle.getText("NOTE_TEXT"),
						template: {
							content: "{ShortText}"
						}
			}
			]
			});

			var fileName = testnamespace.util.Util.C_CSV_NOTE_REQ_NOTE + " " + testnamespace.util.Util.getCurrentDateTime();

			oExport.setModel(model);
			oExport.bindRows("/");

			// download exported file
			oExport.saveFile(fileName).always(function() {
				this.destroy();
			});

		});

	},

	exportSystemNotes: function(element, path) {

		var oModel = element.getModel();

		var oBinding = element.getBinding("items");

		var bundle = testnamespace.util.Util.getResourceBundle();

		var oPath = "/SystemNoteSet";

		if (path) {
			oPath = path + oPath;
		}

		if (typeof oBinding.sFilterParams !== "undefined") {

			oPath = oPath + "?" + oBinding.sFilterParams;

			if (typeof oBinding.sSortParams !== "undefined") {

				oPath = oPath + "&" + oBinding.sSortParams;
			}

		} else {

			if (typeof oBinding.sSortParams !== "undefined") {

				oPath = oPath + "?" + oBinding.sSortParams;
			}
		}

		oModel.read(oPath, null, null, true, function(oData) {
			var model = new sap.ui.model.json.JSONModel();

			model.setData(oData.results);

			var oExport = new sap.ui.core.util.Export({

				// Type that will be used to generate the content. Own ExportType's can be created to support other formats
				exportType: new sap.ui.core.util.ExportTypeCSV({
				//	separatorChar: ";"
				}),
				// column definitions with column name and binding info for the content

				columns: [{
						name: bundle.getText("TECHNICAL_SYSTEM"),
						template: {
							content: "{SystemId}"
						}
			}, {
						name: bundle.getText("NOTE_NUMBER"),
						template: {
							content: "{NoteNumber}"
						}
			}, {
						name: bundle.getText("NOTE_TEXT"),
						template: {
							content: "{ShortText}"
						}
			},
					{
						name: bundle.getText("NOTE_RELEASE_DATE"),
						template: {
							content: "{path: 'ReleaseDate', formatter: 'testnamespace.util.Formatter.getReleaseDate'}"
						}
			},
					{
						name: bundle.getText("NOTE_THEMK"),
						template: {
							content: "{Themk}"
						}
			},
					{
						name: bundle.getText("NOTE_PRIORITY"),
						template: {
							content: "{path: 'Priority', formatter: 'testnamespace.util.Formatter.getPriorityText'}"
						}
			},
					{
						name: bundle.getText("NOTE_CATEGORY"),
						template: {
							content: "{path: 'Category', formatter: 'testnamespace.util.Formatter.getCategoryText'}"
						}
			},
					{
						name: bundle.getText("NOTE_SEC_CATEGORY"),
						template: {
							content: "{path:'SecCategory', formatter: 'testnamespace.util.Formatter.getSecurityCategoryText'}"
						}
			},
					{
						name: bundle.getText("NOTE_STATUS"),
						template: {
							content: "{path: 'Status', formatter: 'testnamespace.util.Formatter.getStatusText'}"
						}
			},
					{
						name: bundle.getText("NOTE_CORRECTION_TYPES"),
						template: {
							content: "{path: 'CorrectionTypes', formatter: 'testnamespace.util.Formatter.getCorrectionText'}"
						}
			},
					{
						name: bundle.getText("NOTE_ATTRIBUTE"),
						template: {
							content: "{parts:[{path: 'HasKernel'},{path: 'IsIndep'}], formatter: 'testnamespace.util.Formatter.getAttributesText'}"
						}
			}
			]
			});

			var fileName = testnamespace.util.Util.C_CSV_SYSTEM_NOTE + " " + testnamespace.util.Util.getCurrentDateTime();

			oExport.setModel(model);
			oExport.bindRows("/");

			oExport.saveFile(fileName).always(function() {
				this.destroy();
			});

		});

	},

	displayMessage: function(response) {

		jQuery.sap.require("sap.m.MessageBox");

		var bundle = testnamespace.util.Util.getResourceBundle();

        try{

            var json = JSON.parse(response.body);

            var message = json.error.message.value;

            var detail = json.error.innererror.Error_Resolution.SAP_Transaction;

            sap.m.MessageBox.show(message, {
                icon: sap.m.MessageBox.Icon.ERROR,
                title: bundle.getText("MSG_ERROR"),
                details: detail
            });

        }catch(err){
// xml
            var xmlDoc = $.parseXML( response.body );
            var $xml = $( xmlDoc );
            var $title = $xml.find( "message" );
            sap.m.MessageBox.show($title.text(), {
                icon: sap.m.MessageBox.Icon.ERROR,
                title: bundle.getText("MSG_ERROR")
            });

        }
	},

	displayError: function(responseText) {
		var json = JSON.parse(responseText);
		var message = json.error.message.value;

		var detail = json.error.innererror.Error_Resolution.SAP_Transaction;

		jQuery.sap.require("sap.m.MessageBox");

		var bundle = testnamespace.util.Util.getResourceBundle();

		sap.m.MessageBox.show(message, {
			icon: sap.m.MessageBox.Icon.ERROR,
			title: bundle.getText("MSG_ERROR"),
			details: detail
		});
	}
};