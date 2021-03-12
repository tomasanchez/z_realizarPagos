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
    "sap/m/MessageBox",
    "../model/formatter",
  ],
  function (Controller, JSONModel, MessageBox, formatter) {
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

        // View model for displaying/enabling buttons
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
      onBeforeRendering: function () {
        // Initialize the date picker
        var oDatePicker = this.byId("paymentDP");
        oDatePicker.setDateValue(new Date());
      },

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

      /**
       * Triggered by pay button.
       *
       * Navigates to Interbanking site.
       * @function
       * @public
       * @param {sap.ui.base.Event} oEvent the press event
       */
      // eslint-disable-next-line no-unused-vars
      onPay: function (oEvent) {
        MessageBox.confirm(this.readFromI18n("paymentConfirmMSG"), {
          title: oController.readFromI18n("paymentConfirmTitle"),
          onClose: function (oAction) {
            if (oAction === MessageBox.Action.OK) {
              oController._openInterbaking();
            }
          },
        });
      },

      /**
       * Triggered by change event.
       *
       * Verifies inputs.
       * @function
       * @public
       * @param {sap.ui.base.Event} oEvent the press event
       */
      // eslint-disable-next-line no-unused-vars
      onPaymentChange: function (oEvent) {
        var bDateError = this._verifyDatePicker();
        var bInputError = this._verifyPayment();
        this._togglePayButton(!(bDateError || bInputError));
      },
      /* =========================================================== */
      /* Internal Methods                                            */
      /* =========================================================== */

      /**
       * Toggles the 'PAY' button.
       *
       * Enables/Disables the model property.
       *
       * @function
       * @private
       * @param {boolean} bActive the proeprty state
       */
      _togglePayButton: function (bActive) {
        var oViewModel = this.getModel("homeView");
        oViewModel.setProperty("/enablePayment", bActive);
      },

      /**
       * Verifies Paymet Date.
       *
       * Checks if a valid date has been selected.
       *
       * @function
       * @private
       * @returns {boolean} true if and error was detected
       */
      _verifyDatePicker: function () {
        var oDatePicker = this.byId("paymentDP");

        var dDate = oDatePicker.getDateValue();

        var bError = dDate ? false : true;

        oDatePicker.setValueState(bError ? "Error" : "None");
        oDatePicker.setValueStateText(this.readFromI18n("invalidDateMSG"));

        return bError;
      },

      /**
       * Verifies Paymet Date.
       *
       * Checks if a valid date has been selected.
       *
       * @function
       * @private
       * @returns {boolean} true if and error was detected
       */
      _verifyPayment: function () {
        var oStepInput = this.byId("paymentIN");

        var fValue = oStepInput.getValue();

        var bError = fValue <= 0;

        oStepInput.setValueState(bError ? "Error" : "None");
        oStepInput.setValueStateText(oController.readFromI18n("paymentGTzero"));

        return bError;
      },

      /**
       * Generates a navigation URL.
       *
       * Attach options to Interbanking url.
       * @function
       * @private
       * @returns {string} the URL to be redirected
       */
      _createURL: function () {
        var sBaseURL =
          "https://qasibprodpll.interbanking.com.ar/loginConfeccionB2B.do?";

        // Debugging options
        sBaseURL = this._attachOptionToURL(sBaseURL, "AtrapaErrores", "False");
        sBaseURL = this._attachOptionToURL(sBaseURL, "OutURL");
        sBaseURL = this._attachOptionToURL(
          sBaseURL,
          "CodigoComunidad",
          "30691576511"
        );
        // Open new window pop-up
        sBaseURL = this._attachOptionToURL(sBaseURL, "WindowPopUp", "False");
        // Transactions
        sBaseURL = this._attachOptionToURL(
          sBaseURL,
          "CantidadTransacciones",
          "1"
        );
        sBaseURL = this._attachOptionToURL(sBaseURL, "URL");
        // CUIT
        sBaseURL = this._attachOptionToURL(sBaseURL, "VendedorCuit1");
        // Account ID
        sBaseURL = this._attachOptionToURL(
          sBaseURL,
          "CuentaRecaudacionId1",
          "3250101104111080024"
        );
        sBaseURL = this._attachOptionToURL(
          sBaseURL,
          "Comprobante1",
          "258543705"
        );
        // Payment Date
        var sDate = this.byId("paymentDP").getDateValue().toLocaleDateString();
        sBaseURL = this._attachOptionToURL(sBaseURL, "FechaPago1", sDate);
        // Payment amount
        var sAmount = this.byId("paymentIN").getValue();
        sBaseURL = this._attachOptionToURL(sBaseURL, "Importe1", "1234");
        // Client number
        sBaseURL = this._attachOptionToURL(sBaseURL, "Observacion1", "100027");

        return sBaseURL;
      },

      _openInterbaking: function () {
        var sURL = this._createURL();

        if (!sURL)
          MessageBox.error(
            "(Error: 40040-cuentaRecaudacionId) Cuenta de Recaudación ID 0180000511000000754158 Inexistente "
          );

        else sap.m.URLHelper.redirect(sURL, true);
      },

      /**
       * Attachs an option to a URL.
       *
       * Concatenates Option=Value to a URL.
       *
       * @param {string} sURL the url to be modified
       * @param {string} sOption the option to be added
       * @param {string} sValue the corresponding option value
       */
      _attachOptionToURL: function (sURL, sOption, sValue = "") {
        return sURL[sURL.length - 1] !== "?"
          ? `${sURL}&${sOption}=${sValue}`
          : `${sURL}${sOption}=${sValue}`;
      },
      /* =========================================================== */
      /* End of Internal Methods                                     */
      /* =========================================================== */
    });
  }
);
