/**
 * Home Controller.
 *
 * Methods of Home View.
 *
 * @file This files describes Home View controller.
 * @author Tomas A. Sanchez
 * @since 03.08.2021
 */
/* eslint-disable no-warning-comments */
sap.ui.define(
  [
    "profertil/realizarPagos/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
  ],
  function (Controller, JSONModel, formatter) {
    "use strict";
    // Bind this shortcut
    var oController;

    return Controller.extend("profertil.realizarPagos.controller.Home", {
      /**
       * Formmater JS split-code.
       * @memberOf com.profertil.view.Remitos
       */
      formatter: formatter,

      /* =========================================================== */
      /* lifecycle methods                                           */
      /* =========================================================== */

      /**
       * Called when the Interbanking controller is instantiated.
       * @memberOf profertil.view.Home
       */
      onInit: function () {
        oController = this;

        var oViewModel = new JSONModel({
          showPaymentForm: true,
          enablePayment: false,
        });

        oController.setModel(oViewModel, "homeView");

        // Add the Interbanking page to the flp routing history
        this.addHistoryEntry(
          {
            title: this.getResourceBundle().getText("title"),
            icon: "sap-icon://simple-payment",
            intent: "#Interbanking-display",
          },
          true
        );
      },
      /**
       * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
       * (NOT before the first rendering! onInit() is used for that one!).
       * @memberOf com.profertil.view.Remitos
       */
      // onBeforeRendering: function () {
      // },

      /**
       * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
       * This hook is the same one that SAPUI5 controls get after being rendered.
       * @memberOf com.profertil.view.Remitos
       */
      //onAfterRendering: function () {
      //},

      /**
       * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
       * @memberOf com.profertil.view.Remitos
       */
      //	onExit: function() {
      //
      //	}

      /* =========================================================== */
      /* event handlers                                              */
      /* =========================================================== */
    });
  }
);
