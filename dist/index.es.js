import _defineProperty from '@babel/runtime/helpers/defineProperty';
import { formatServerError, parseData, pageInfo, formatGraphQLError, withModulesManager, formatMessage, MainMenuContribution, formatPageQueryWithCount, graphql, ProgressOrError, Table, formatMessageWithValues, apiHeaders, baseApiUrl } from '@openimis/fe-core';
import _extends from '@babel/runtime/helpers/extends';
import _classCallCheck from '@babel/runtime/helpers/classCallCheck';
import _createClass from '@babel/runtime/helpers/createClass';
import _inherits from '@babel/runtime/helpers/inherits';
import _possibleConstructorReturn from '@babel/runtime/helpers/possibleConstructorReturn';
import _getPrototypeOf from '@babel/runtime/helpers/getPrototypeOf';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { ImportExport, ListAlt, ScreenShare } from '@material-ui/icons';
import 'lodash';
import _assertThisInitialized from '@babel/runtime/helpers/assertThisInitialized';
import { withTheme, withStyles } from '@material-ui/core/styles';
import { bindActionCreators } from 'redux';
import { Grid, Typography, Input, Button } from '@material-ui/core';

var currency$1 = "Fcfa";
var messages_en = {
	currency: currency$1,
	"cheque.mainMenu": "Check",
	"menu.chequeImport": "Import Check",
	"menu.chequeList": "Check List",
	"Cheque.List.Header": "Check List",
	"cmr_cs.table": "Table Check ({count})",
	"cmr_cs.checknum": "Check Number",
	"cmr_cs.checkstate": "Check Status",
	"cmr_cs.tableImport": "Table Import Check ({count})",
	"cmr_cs.importId": "Import Id",
	"cmr_cs.importDate": "Import Date",
	"cmr_cs.importUser": "Import User",
	"cmr_cs.storedFile": "Import File",
	"cmr_cs.uploadFile": "Upload File",
	"cmr_cs.importChecks": "Import Checks",
	"cmr_cs.importCheckFile": "Import Check File"
};

var currency = "Fcfa";
var messages_fr = {
	currency: currency,
	"cheque.mainMenu": "Chèque",
	"menu.chequeImport": "Import Cheque",
	"menu.chequeList": "Liste Cheque",
	"Cheque.List.Header": "Liste des cheques",
	"cmr_cs.table": "Table Chèque {count}",
	"cmr_cs.checknum": "Numéro Cheque",
	"cmr_cs.checkstate": "Statut Cheque",
	"cmr_cs.tableImport": "Table Import Check ({count})",
	"cmr_cs.importId": "Import Id",
	"cmr_cs.importDate": "Import Date",
	"cmr_cs.storedFile": "Fichier Importé",
	"cmr_cs.importUser": "Import User",
	"cmr_cs.uploadFile": "Envoyer fichier",
	"cmr_cs.importChecks": "Importer les cheques",
	"cmr_cs.importCheckFile": "Importer les fichiers de cheques"
};

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$1(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function reducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    fetchingCheques: false,
    errorCheques: null,
    fetchedMyCheque: false,
    myCheques: [],
    myChequesPageInfo: {
      totalCount: 0
    },
    fetchingChequesImport: false,
    errorChequesImport: null,
    fetchedMyChequeImport: false,
    myChequesImport: [],
    myChequesImportPageInfo: {
      totalCount: 0
    },
    submittingMutation: false,
    mutation: {}
  };
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case 'CMS_CS_CHECKLIST_REQ':
      return _objectSpread$1(_objectSpread$1({}, state), {}, {
        fetchingCheques: true,
        fetchedMyCheques: false,
        myCheques: [],
        myChequesPageInfo: {
          totalCount: 0
        },
        errorCheques: null
      });

    case 'CMS_CS_CHECKLIST_RESP':
      return _objectSpread$1(_objectSpread$1({}, state), {}, {
        fetchingCheques: false,
        fetchedMyCheques: true,
        myCheques: parseData(action.payload.data.chequeimportline),
        myChequesPageInfo: pageInfo(action.payload.data.chequeimportline),
        errorCheques: formatGraphQLError(action.payload)
      });

    case 'CMS_CS_CHECKLIST_ERR':
      return _objectSpread$1(_objectSpread$1({}, state), {}, {
        fetchedMyCheques: false,
        errorCheques: formatServerError(action.payload)
      });

    case 'CMS_CS_CHECKIMPORT_REQ':
      return _objectSpread$1(_objectSpread$1({}, state), {}, {
        fetchingChequesImport: true,
        fetchedMyChequesImport: false,
        myChequesImport: [],
        myChequesImportPageInfo: {
          totalCount: 0
        },
        errorChequesImport: null
      });

    case 'CMS_CS_CHECKIMPORT_RESP':
      return _objectSpread$1(_objectSpread$1({}, state), {}, {
        fetchingChequesImport: false,
        fetchedMyChequesImport: true,
        myChequesImport: parseData(action.payload.data.chequeimport),
        myChequesImportPageInfo: pageInfo(action.payload.data.chequeimport),
        errorChequesImport: formatGraphQLError(action.payload)
      });

    case 'CMS_CS_CHECKIMPORT_ERR':
      return _objectSpread$1(_objectSpread$1({}, state), {}, {
        fetchedMyChequesImport: false,
        errorChequesImport: formatServerError(action.payload)
      });

    default:
      return state;
  }
}

var RIGHT_ADD = 111002;
var RIGHT_SUBMIT = 111007;

function _createSuper$2(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$2(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct$2() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var CmrCseMainMenu = /*#__PURE__*/function (_Component) {
  _inherits(CmrCseMainMenu, _Component);

  var _super = _createSuper$2(CmrCseMainMenu);

  function CmrCseMainMenu() {
    _classCallCheck(this, CmrCseMainMenu);

    return _super.apply(this, arguments);
  }

  _createClass(CmrCseMainMenu, [{
    key: "render",
    value: function render() {
      var rights = this.props.rights;
      var entries = [];

      if (!!rights.filter(function (r) {
        return r >= RIGHT_ADD && r <= RIGHT_SUBMIT;
      }).length) {
        // RIGHT_SEARCH is shared by HF & HQ staff)
        entries.push({
          text: formatMessage(this.props.intl, "cheque", "menu.chequeImport"),
          icon: /*#__PURE__*/React.createElement(ImportExport, null),
          route: "/cheque/import"
        });
        entries.push({
          text: formatMessage(this.props.intl, "cheque", "menu.chequeList"),
          icon: /*#__PURE__*/React.createElement(ListAlt, null),
          route: "/cheque/list"
        });
      }

      if (!entries.length) return null;
      return /*#__PURE__*/React.createElement(MainMenuContribution, _extends({}, this.props, {
        header: formatMessage(this.props.intl, "cheque management", "cheque.mainMenu"),
        icon: /*#__PURE__*/React.createElement(ScreenShare, null),
        entries: entries
      }));
    }
  }]);

  return CmrCseMainMenu;
}(Component);

var mapStateToProps$2 = function mapStateToProps(state) {
  return {
    rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : []
  };
};

var CmrCsModuleMainMenu = withModulesManager(injectIntl(connect(mapStateToProps$2)(CmrCseMainMenu)));

function fetchCheques() {
  var payload = formatPageQueryWithCount("chequeimportline", null, ["idChequeImportLine", "chequeImportLineCode", "chequeImportLineDate", "chequeImportLineStatus"]);
  return graphql(payload, 'CMS_CS_CHECKLIST');
}
function fetchChequesImport() {
  var payload = formatPageQueryWithCount("chequeimport", null, ["idChequeImport", "importDate", "storedFile"]);
  return graphql(payload, 'CMS_CS_CHECKIMPORT');
}

function _createSuper$1(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$1(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct$1() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var styles$1 = function styles(theme) {
  return {
    page: theme.page
  };
};

var ChequeListPage = /*#__PURE__*/function (_Component) {
  _inherits(ChequeListPage, _Component);

  var _super = _createSuper$1(ChequeListPage);

  function ChequeListPage() {
    var _this;

    _classCallCheck(this, ChequeListPage);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      page: 0,
      pageSize: 20,
      afterCursor: null,
      beforeCursor: null
    });

    _defineProperty(_assertThisInitialized(_this), "query", function () {
      var prms = [];
      prms.push("first: ".concat(_this.state.pageSize));

      if (!!_this.state.afterCursor) {
        prms.push("after: \"".concat(_this.state.afterCursor, "\""));
      }

      if (!!_this.state.beforeCursor) {
        prms.push("before: \"".concat(_this.state.beforeCursor, "\""));
      }

      prms.push("orderBy: [\"chequeImportLineCode\"]");

      _this.props.fetchCheques(prms);
    });

    return _this;
  }

  _createClass(ChequeListPage, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.query();
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          intl = _this$props.intl,
          classes = _this$props.classes,
          fetchingCheques = _this$props.fetchingCheques,
          errorCheques = _this$props.errorCheques;
          _this$props.fetchedMyCheques;
          var myCheques = _this$props.myCheques,
          myChequesPageInfo = _this$props.myChequesPageInfo;
      var headers = ["cmr_cs.checknum", "cmr_cs.checkstate"];
      var itemFormatters = [function (e) {
        return e.chequeImportLineCode;
      }, function (e) {
        return e.chequeImportLineStatus;
      }];
      return /*#__PURE__*/React.createElement("div", {
        className: classes.page
      }, /*#__PURE__*/React.createElement(ProgressOrError, {
        progress: fetchingCheques,
        error: errorCheques
      }), /*#__PURE__*/React.createElement(Table, {
        module: "cmr_cs",
        header: formatMessageWithValues(intl, "CmrCS", "cmr_cs.table", {
          count: myChequesPageInfo.totalCount
        }),
        headers: headers,
        itemFormatters: itemFormatters,
        items: myCheques,
        withPagination: true,
        page: this.state.page,
        pageSize: this.state.pageSize,
        count: myChequesPageInfo.totalCount,
        onChangePage: this.onChangePage,
        onChangeRowsPerPage: this.onChangeRowsPerPage,
        rowsPerPageOptions: this.rowsPerPageOptions
      }));
    }
  }]);

  return ChequeListPage;
}(Component);

var mapStateToProps$1 = function mapStateToProps(state) {
  return {
    fetchingCheques: state.cmr_cs.fetchingCheques,
    errorCheques: state.cmr_cs.errorCheques,
    fetchedMyCheques: state.cmr_cs.fetchedMyCheques,
    myCheques: state.cmr_cs.myCheques,
    myChequesPageInfo: state.cmr_cs.myChequesPageInfo
  };
};

var mapDispatchToProps$1 = function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchCheques: fetchCheques
  }, dispatch);
};

var ChequeListPage$1 = injectIntl(withTheme(withStyles(styles$1)(connect(mapStateToProps$1, mapDispatchToProps$1)(ChequeListPage))));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var CREATECHEQUE_URL = "".concat(baseApiUrl, "/cheque/importfile");

var styles = function styles(theme) {
  return {
    page: theme.page
  };
};

var file = '';

function handleChange(event) {
  file = event.target.files[0];
  console.log(file);
}

function handleSubmit(event) {
  console.log(file);
  event.preventDefault();
  var formData = new FormData();
  console.log("Submit");
  formData.append('file', file);
  formData.append('fileName', file.name);
  console.log(formData);

  try {
    fetch("".concat(CREATECHEQUE_URL, "/upload"), {
      headers: apiHeaders,
      body: formData,
      method: "POST",
      credentials: "same-origin"
    }).then(function (response) {
      if (response.status >= 400) {
        throw new Error("Unknown error");
      }

      var payload = response.json();
      console > log(payload);
    });
  } catch (error) {
    console.error(error);
    console > log(error);
  }
}

var ChequeImportPage = /*#__PURE__*/function (_Component) {
  _inherits(ChequeImportPage, _Component);

  var _super = _createSuper(ChequeImportPage);

  function ChequeImportPage() {
    var _this;

    _classCallCheck(this, ChequeImportPage);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      page: 0,
      pageSize: 20,
      afterCursor: null,
      beforeCursor: null
    });

    _defineProperty(_assertThisInitialized(_this), "query", function () {
      var prms = [];
      prms.push("first: ".concat(_this.state.pageSize));

      if (!!_this.state.afterCursor) {
        prms.push("after: \"".concat(_this.state.afterCursor, "\""));
      }

      if (!!_this.state.beforeCursor) {
        prms.push("before: \"".concat(_this.state.beforeCursor, "\""));
      }

      prms.push("orderBy: [\"code\"]");

      _this.props.fetchChequesImport(prms);
    });

    return _this;
  }

  _createClass(ChequeImportPage, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.query();
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          intl = _this$props.intl,
          classes = _this$props.classes,
          fetchingChequesImport = _this$props.fetchingChequesImport,
          errorChequesImport = _this$props.errorChequesImport;
          _this$props.fetchedMyChequesImport;
          var myChequesImport = _this$props.myChequesImport,
          myChequesImportPageInfo = _this$props.myChequesImportPageInfo;
      var headers = ["cmr_cs.importId", "cmr_cs.importDate", "cmr_cs.storedFile"];
      var itemFormatters = [function (e) {
        return e.idChequeImport;
      }, function (e) {
        return e.importDate;
      }, function (e) {
        return e.storedFile;
      }];
      return /*#__PURE__*/React.createElement("div", {
        className: classes.page
      }, /*#__PURE__*/React.createElement(ProgressOrError, {
        progress: fetchingChequesImport,
        error: errorChequesImport
      }), /*#__PURE__*/React.createElement("h1", null, formatMessageWithValues(intl, "CmrCS", "cmr_cs.importCheckFile")), /*#__PURE__*/React.createElement(Grid, {
        container: true,
        spacing: 2,
        direction: "column"
      }, /*#__PURE__*/React.createElement(Grid, {
        item: true
      }, /*#__PURE__*/React.createElement(Typography, {
        variant: "h6"
      }, formatMessageWithValues(intl, "CmrCS", "cmr_cs.importChecks"))), /*#__PURE__*/React.createElement(Grid, {
        item: true
      }, /*#__PURE__*/React.createElement("form", {
        noValidate: true
      }, /*#__PURE__*/React.createElement(Grid, {
        container: true,
        spacing: 1,
        direction: "column"
      }, /*#__PURE__*/React.createElement(Grid, {
        item: true
      }, /*#__PURE__*/React.createElement(Input, {
        required: true,
        id: "import-button",
        inputProps: {
          accept: ".csv, application/csv, text/csv"
        },
        type: "file",
        onChange: handleChange
      })), /*#__PURE__*/React.createElement(Grid, {
        item: true
      }, /*#__PURE__*/React.createElement(Button, {
        variant: "contained",
        color: "primary",
        onClick: handleSubmit
      }, formatMessageWithValues(intl, "CmrCS", "cmr_cs.uploadFile"))))))), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(Table, {
        module: "cmr_cs",
        header: formatMessageWithValues(intl, "CmrCS", "cmr_cs.tableImport", {
          count: myChequesImportPageInfo.totalCount
        }),
        headers: headers,
        itemFormatters: itemFormatters,
        items: myChequesImport,
        withPagination: true,
        page: this.state.page,
        pageSize: this.state.pageSize,
        count: myChequesImportPageInfo.totalCount,
        onChangePage: this.onChangePage,
        onChangeRowsPerPage: this.onChangeRowsPerPage,
        rowsPerPageOptions: this.rowsPerPageOptions
      }));
    }
  }]);

  return ChequeImportPage;
}(Component);

var mapStateToProps = function mapStateToProps(state) {
  return {
    fetchingChequesImport: state.cmr_cs.fetchingChequesImport,
    errorChequesImport: state.cmr_cs.errorChequesImport,
    fetchedMyChequesImport: state.cmr_cs.fetchedMyChequesImport,
    myChequesImport: state.cmr_cs.myChequesImport,
    myChequesImportPageInfo: state.cmr_cs.myChequesImportPageInfo
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchChequesImport: fetchChequesImport
  }, dispatch);
};

var ChequeImportPage$1 = injectIntl(withTheme(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ChequeImportPage))));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var ROUTE_CMR_CS_LIST = "cheque/list";
var ROUTE_CMR_CS_IMPORT = "cheque/import";
var DEFAULT_CONFIG = {
  "translations": [{
    key: "en",
    messages: messages_en
  }, {
    key: "fr",
    messages: messages_fr
  }],
  "reducers": [{
    key: 'cmr_cs',
    reducer: reducer
  }],
  "core.MainMenu": [CmrCsModuleMainMenu],
  "core.Router": [{
    path: ROUTE_CMR_CS_LIST,
    component: ChequeListPage$1
  }, {
    path: ROUTE_CMR_CS_IMPORT,
    component: ChequeImportPage$1
  }]
};
var CmrCsModule = function CmrCsModule(cfg) {
  return _objectSpread(_objectSpread({}, DEFAULT_CONFIG), cfg);
};

export { CmrCsModule };
//# sourceMappingURL=index.es.js.map
