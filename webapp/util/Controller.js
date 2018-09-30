/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("testnamespace.util.Controller");sap.ui.core.mvc.Controller.extend("testnamespace.util.Controller",{getEventBus:function(){var c=sap.ui.core.Component.getOwnerIdFor(this.getView());return sap.ui.component(c).getEventBus();},getRouter:function(){return sap.ui.core.UIComponent.getRouterFor(this);}});