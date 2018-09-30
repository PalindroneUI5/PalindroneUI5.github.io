/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("testnamespace.util.Formatter");

/*global sm*/

testnamespace.util.Formatter = {

	init: function(oModel) {

        this.jsonModel = new sap.ui.model.json.JSONModel();
        this.oPrioritySet = [];
        this.oCategorySet = [];
        this.oSecurityCategorySet = [];
        this.oStatusSet = [];
        this.oSystemTypeSet = [];
        this.oSystemRoleSet = [];
        this.oSystemPrioritySet = [];
        this.oCorrectionTypeSet = [];
        this.oKernelSet = [];
        this.oReleaseSet = [];
        this.oNoteTypeSet = [];
        var that = this;
        var batchChanges = [];

        batchChanges.push(oModel.createBatchOperation("/PrioritySet", "GET"));
        batchChanges.push(oModel.createBatchOperation("/CategorySet", "GET"));
        batchChanges.push(oModel.createBatchOperation("/SecurityCategorySet", "GET"));
        batchChanges.push(oModel.createBatchOperation("/StatusSet", "GET"));
        batchChanges.push(oModel.createBatchOperation("/SystemStatisticsSet", "GET"));
        batchChanges.push(oModel.createBatchOperation("/SystemRoleSet", "GET"));
        batchChanges.push(oModel.createBatchOperation("/SystemPrioritySet", "GET"));
        batchChanges.push(oModel.createBatchOperation("/CorrectionTypeSet", "GET"));
        batchChanges.push(oModel.createBatchOperation("/KernelSet", "GET"));
        batchChanges.push(oModel.createBatchOperation("/ReleaseSet", "GET"));
        batchChanges.push(oModel.createBatchOperation("/NoteTypeSet", "GET"));

        batchChanges.push(oModel.createBatchOperation("/getSAPNoteUrl", "GET"));
        batchChanges.push(oModel.createBatchOperation("/getPatchInfoUrl", "GET"));
        batchChanges.push(oModel.createBatchOperation("/getUserStatusPath", "GET"));

        oModel.addBatchReadOperations(batchChanges);

		oModel.setUseBatch(true);

		oModel.submitBatch(function(response){
            var array = response.__batchResponses;

            that.oPrioritySet = array[0].data.results;
            that.oCategorySet = array[1].data.results;
            that.oSecurityCategorySet = array[2].data.results;
            that.oStatusSet = array[3].data.results;
            that.oSystemTypeSet = array[4].data.results;
            that.oSystemRoleSet = array[5].data.results;
            that.oSystemPrioritySet = array[6].data.results;
            that.oCorrectionTypeSet = array[7].data.results;
            that.oKernelSet = array[8].data.results;
            that.oReleaseSet = array[9].data.results;
            that.oNoteTypeSet = array[10].data.results;

            that.sapNoteUrl = array[11].data.getSAPNoteUrl.Url;
            that.patchInfoUrl = array[12].data.getPatchInfoUrl.Url;
            that.userStatusPath = array[13].data.getUserStatusPath.Url;

            var systemTypeSet = that.oSystemTypeSet;

            var systemTypes = [];

            var systemTypeCount = [];

            var i, j;

		    for (i = 0; i < systemTypeSet.length; i++) {

			    var index = systemTypes.indexOf(systemTypeSet[i].SystemType);
			    if (index === -1) {
				    systemTypes[systemTypes.length] = systemTypeSet[i].SystemType;
			    }
		    }

			var bbb = {
			    text: testnamespace.util.Util.getResourceBundle().getText("XTIT_ALL"),
			    key: "*",
			    count: systemTypeSet.length
			};
                
            systemTypeCount[systemTypeCount.length] = bbb;
                
		    for (i = 0; i < systemTypes.length; i++) {

			    var count = 0;
			    for (j = 0; j < systemTypeSet.length; j++) {

				    if (systemTypes[i] === systemTypeSet[j].SystemType) {
					    count = count + 1;
				    }
			    }
			    
			    bbb = {
			        text: systemTypes[i],
			        key : systemTypes[i],
			        count: count
			    };
                
                systemTypeCount[systemTypeCount.length] = bbb;
                
		    }
		    
		    that.jsonModel.setData({
		        PrioritySet:that.oPrioritySet,
		        CategorySet: that.oCategorySet,
		        SecurityCategorySet: that.oSecurityCategorySet,
		        StatusSet: that.oStatusSet,
		        KernelSet: that.oKernelSet,
		        ReleaseSet: that.oReleaseSet,
		        SystemStatisticsSet: that.oSystemTypeSet,
		        NoteTypeSet: that.oNoteTypeSet,
		        CorrectionTypeSet: that.oCorrectionTypeSet,
		        SystemTypeCount: systemTypeCount
		    });
		    
	//	    oModel.setUseBatch(false);
		}, function(){}, false);
 
		this.oModel = oModel;

		this.jamModel = new sap.ui.model.odata.ODataModel("/sap/bc/ui2/smi/rest_tunnel/Jam/api/v1/OData", true);
        
        this.isJamSupported = true;
        
		this.jamModel.attachMetadataFailed(function(){
		   that.isJamSupported = false;
		});

		this.picBuffer = [];
	},
    getConcatedString: function(p1, p2){
        return p1 + "-" + p2;
    },
	getModel: function() {
		return this.oModel;
	},
    getAttributesText : function(kernel, indep){
        
        var k = testnamespace.util.Formatter.getKernelText(kernel);
        var r = testnamespace.util.Formatter.getReleaseText(indep);
        
        return k + "," + r;

    },
	getCommentLongText: function(longtext) {
		// hide long text in case of mobile device

		if (sap.ui.Device.system.phone) {
			return "";
		} else {
			return longtext;
		}
	},

	showMessage: function(message) {
		sap.m.MessageToast.show(message);
	},

	getSystemTypeSet: function() {
		return this.oSystemTypeSet;
	},

	getReleaseDate: function(rDate) {

		if (rDate) {
			return rDate.toLocaleDateString();
		}

		return rDate;
	},

	getDateTimeString: function(rDate){

		if (rDate) {
			return rDate.toLocaleDateString() + " " + rDate.toLocaleTimeString();
		}

		return rDate;
	},

	getPicture: function(id) {

		if (id === "") {
			return "";
		}

		var fURL = "";
        
        var buffered = false;
        
		var formatter = testnamespace.util.Formatter;

        if(formatter.isJamSupported === false){
            return "";
        }
        
		$.each(formatter.picBuffer, function(index, value) {
			if (value.id === id) {
				fURL = value.url;
				
				buffered = true;
			}
		});
        
        if(buffered === true){
            return fURL;
        }
        
		if (fURL === "") {

			var serviceUrl = "/Members_Autocomplete?Query=%27" + id + "%27&$expand=ThumbnailImage";

			formatter.jamModel.read(serviceUrl, null, null, false, function(oData) {

				var url = oData.results[0].ThumbnailImage.__metadata.media_src;

				fURL = "/sap/bc/ui2/smi/rest_tunnel/Jam/api/v1/OData/" + url;

			}, function() {

			});

			var oPicBuffer = {
				id: id,
				url: fURL

			};
			formatter.picBuffer.push(oPicBuffer);

		}

		return fURL;
	},

	getNoteUrl: function(noteId) {
        var url = testnamespace.util.Formatter.sapNoteUrl;
        return url.replace("{1}", noteId);
	},
	getPatchInfoUrl: function(objectKey) {
        var url = testnamespace.util.Formatter.patchInfoUrl;
        return url.replace("{1}", objectKey);
	},

	getKernelText: function(kernelId) {

		return testnamespace.util.Formatter._getKernelText(kernelId);
	},

	_getKernelText: function(kernelId) {

		for (var i = 0; i < this.oKernelSet.length; i++) {

			if (this.oKernelSet[i].Id === kernelId) {
				return this.oKernelSet[i].ShortText;
			}

		}

		return kernelId;

	},

	getReleaseText: function(releaseId) {

		return testnamespace.util.Formatter._getReleaseText(releaseId);
	},

	_getReleaseText: function(releaseId) {

		for (var i = 0; i < this.oReleaseSet.length; i++) {

			if (this.oReleaseSet[i].Id === releaseId) {
				return this.oReleaseSet[i].ShortText;
			}

		}

		return releaseId;

	},
	
	getPriorityText: function(priorityId) {

		return testnamespace.util.Formatter._getPriorityText(priorityId);
	},

	_getPriorityText: function(priorityId) {

		for (var i = 0; i < this.oPrioritySet.length; i++) {

			if (this.oPrioritySet[i].Key === priorityId) {
				return priorityId + " - " + this.oPrioritySet[i].ShortText;
			}

		}

		return priorityId;

	},

	getCategoryText: function(categoryId) {

		return testnamespace.util.Formatter._getCategoryText(categoryId);
	},

	_getCategoryText: function(categoryId) {

		for (var i = 0; i < this.oCategorySet.length; i++) {

			if (this.oCategorySet[i].Key === categoryId) {
				return categoryId + " - " + this.oCategorySet[i].ShortText;
			}

		}

		return categoryId;

	},

	getSecurityCategoryText: function(categoryId) {

		return testnamespace.util.Formatter._getSecurityCategoryText(categoryId);
	},

	_getSecurityCategoryText: function(categoryId) {

		for (var i = 0; i < this.oSecurityCategorySet.length; i++) {

			if (this.oSecurityCategorySet[i].Key === categoryId) {
				return categoryId + " - " + this.oSecurityCategorySet[i].ShortText;
			}

		}

		return categoryId;

	},

	getStatusText: function(statusId) {

		return testnamespace.util.Formatter._getStatusText(statusId);
	},

	_getStatusText: function(statusId) {

		for (var i = 0; i < this.oStatusSet.length; i++) {

			if (this.oStatusSet[i].Key === statusId) {
				return this.oStatusSet[i].ShortText;
			}

		}

		return statusId;

	},

	getSystemRoleText: function(Id) {

		return testnamespace.util.Formatter._getSystemRoleText(Id);
	},

	_getSystemRoleText: function(Id) {

		for (var i = 0; i < this.oSystemRoleSet.length; i++) {

			if (this.oSystemRoleSet[i].Key === Id) {
				return this.oSystemRoleSet[i].ShortText;
			}

		}

		return Id;

	},

	getSystemPriorityText: function(Id) {

		return testnamespace.util.Formatter._getSystemPriorityText(Id);
	},

	_getSystemPriorityText: function(Id) {

		for (var i = 0; i < this.oSystemPrioritySet.length; i++) {

			if (this.oSystemPrioritySet[i].Key === Id) {
				return this.oSystemPrioritySet[i].ShortText;
			}

		}

		return Id;

	},

	getCorrectionText: function(correctionIds) {

		if (correctionIds === null) {
			return "";
		}

		return testnamespace.util.Formatter._getCorrectionText(correctionIds);

	},

	_getCorrectionText: function(correctionIds) {

		var text = "";

		for (var i = 0; i < this.oCorrectionTypeSet.length; i++) {

			if (correctionIds.indexOf(this.oCorrectionTypeSet[i].Key) !== -1) {
				if (text.length === 0) {

					text = text + this.oCorrectionTypeSet[i].ShortText;

				} else {

					text = text + "," + this.oCorrectionTypeSet[i].ShortText;

				}
			}

		}

		return text;

	},

	trimNumberLeadingZero : function(tt){

        if(tt === null){
            return "";
        }

        var tts = tt.toString();
        while (tts.substr(0,1) === "0" && tts !== ""){

          tts = tts.substr(1);

        }

        return tts;
	},

	isIntegratedAppBtnVisible: function(device) {

		if (device.isPhone || device.isTouch) {
			return false;
		}

		return true;

	},

	getSystemFavoriteValue: function(isFavorite) {

		if (isFavorite === "T") {
			return "sap-icon://favorite";
		}

		return "sap-icon://unfavorite";
	},

	getCommentStatus: function(statusFrom, statusTo) {

		return testnamespace.util.Formatter._getCommentStatus(statusFrom, statusTo);

	},

	_getCommentStatus: function(statusFrom, statusTo) {

		if(statusFrom === statusTo){
			return "";
		}

		var statusFromText, statusToText;

		for (var i = 0; i < this.oStatusSet.length; i++) {

			if (this.oStatusSet[i].Key === statusFrom) {
				statusFromText = this.oStatusSet[i].ShortText;
			}

			if (this.oStatusSet[i].Key === statusTo) {
				statusToText = this.oStatusSet[i].ShortText;
			}

		}
        
        var bundle = testnamespace.util.Util.getResourceBundle();
        
        var text = bundle.getText("TEXT_STATUS_FROM_TO");
        
        text = text.replace("{1}", statusFromText);
        
        text = text.replace("{2}", statusToText);
        
		return text;

	}
};