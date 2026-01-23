import React, { Component, Fragment } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import _ from "lodash";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Searcher } from "@openimis/fe-core";
import { fetchChequeSummaries } from "../actions"
import ChequeFilter from "./ChequeFilter";
import {
  withModulesManager,
  formatMessageWithValues,
  formatMessage,
  formatDateFromISO,
} from "@openimis/fe-core";

const styles = (theme) => ({});

class ChequeSearcher extends Component {
  state = {
    random: null,
  };

  constructor(props) {
    super(props);
    this.rowsPerPageOptions = props.modulesManager.getConf(
      "fe-cmr-cs",
      "cmr_cs.rowsPerPageOptions",
      [10, 20, 50, 100],
    );
    this.defaultPageSize = props.modulesManager.getConf("fe-cmr-cs", "cmr_cs.defaultPageSize", 10);
    this.highlightAmount = parseInt(props.modulesManager.getConf("fe-cmr-cs", "cmr_cs.highlightAmount", 0));
  }


  fetch = (prms) => {
    this.props.fetchChequeSummaries(this.props.modulesManager, prms, !!this.claimAttachments);
  };

  rowIdentifier = (r) => r.uuid;

  forcedFilters() {
    return !this.props.forcedFilters ? [] : [...this.props.forcedFilters.filter((f) => f.id !== "random")];
  }

  filtersToQueryParams = (state) => {
    let prms = Object.keys(state.filters)
      .filter((f) => !!state.filters[f]["filter"])
      .map((f) => state.filters[f]["filter"]);
    let forced = this.forcedFilters();
    let random = state.filters["random"];
    if (forced.length > 0) {
      prms.push(...forced.map((f) => f.filter));
    }
    if (!!random) {
      prms.push(`first: ${random.value}`);
      prms.push(`orderBy: ["dateClaimed", "?"]`);
      this.setState({ random });
    } else {
      //prms.push(`orderBy: ["${state.orderBy}"]`);
      this.setState({ random: null });
    }
    if (!forced.length && !random) {
      prms.push(`first: ${state.pageSize}`);
      if (!!state.afterCursor) {
        prms.push(`after: "${state.afterCursor}"`);
      }
      if (!!state.beforeCursor) {
        prms.push(`before: "${state.beforeCursor}"`);
      }
    }
    return prms;
  };

  headers = () => {
    var result = [
      "cmr_cs.checknum",
      "cmr_cs.checkstate",
      "cmr_cs.checkdate",
    ];
    return result;
  };

  sorts = () => {
    var result = [
      ["chequeImportLineCode", true],
      ["chequeImportLineStatus", true],
      ["chequeImportLineDate", false]
    ];
    return result;
  };

  itemFormatters = () => {
    var result = [
      (c) => c.chequeImportLineCode,
      (c) => formatMessage(this.props.intl, "cmr_cs", (c.chequeImportLineStatus).toLowerCase()),
      (c) => formatDateFromISO(this.props.modulesManager, this.props.intl, c.chequeImportLineDate),
    ];
    return result;
  };
  rowLocked = (selection, claim) => !!claim.clientMutationId;
  rowHighlighted = (selection, claim) => !!this.highlightAmount && claim.claimed > this.highlightAmount;
  rowHighlightedAlt = (selection, claim) =>
    !!this.highlightAltInsurees &&
    selection.filter((c) => _.isEqual(c.insuree, claim.insuree)).length &&
    !selection.includes(claim);

  render() {
    const {
      intl,
      myCheques,
      myChequesPageInfo,
      fetchingCheques,
      fetchedMyCheques,
      errorCheques,
      FilterExt,
      filterPaneContributionsKey,
      actions,
      defaultFilters,
      cacheFiltersKey,
      onDoubleClick,
      cheques,
      duplicatesCheque, 
      duplicate,
      actionsContributionKey,
    } = this.props;
    let count = !!this.state.random && this.state.random.value;
    if (!count) {
      count = myChequesPageInfo.totalCount;
    }
    return (
      <Fragment>
        <Searcher
          module="claim"
          defaultFilters={defaultFilters}
          cacheFiltersKey={cacheFiltersKey}
          FilterPane={defaultFilters=="none" ?null: ChequeFilter}
          FilterExt={FilterExt}
          filterPaneContributionsKey={filterPaneContributionsKey}
          items={!!duplicate ? duplicatesCheque : myCheques}
          defaultOrderBy="-chequeImportLineDate"
          itemsPageInfo={myChequesPageInfo}
          fetchingItems={fetchingCheques}
          fetchedItems={fetchedMyCheques}
          errorItems={errorCheques}
          tableTitle={!!duplicate? formatMessageWithValues(intl, "cmr_cs", "duplicateTableList", { count }): formatMessageWithValues(intl, "cmr_cs", "table", { count })}
          rowsPerPageOptions={this.rowsPerPageOptions}
          defaultPageSize={this.defaultPageSize}
          fetch={this.fetch}
          rowIdentifier={this.rowIdentifier}
          filtersToQueryParams={this.filtersToQueryParams}
          rowLocked={this.rowLocked}
          rowHighlighted={this.rowHighlighted}
          rowHighlightedAlt={this.rowHighlightedAlt}
          headers={this.headers}
          itemFormatters={this.itemFormatters}
          actions={actions}
          sorts={this.sorts}
          onDoubleClick={onDoubleClick}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  fetchingCheques: state.cmr_cs.fetchingCheques,
  errorCheques: state.cmr_cs.errorCheques,
  fetchedMyCheques: state.cmr_cs.fetchedMyCheques,
  myCheques: state.cmr_cs.myCheques,
  duplicatesCheque: state.cmr_cs.duplicatesCheque,
  myChequesPageInfo: state.cmr_cs.myChequesPageInfo,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ fetchChequeSummaries }, dispatch);
};

export default withModulesManager(
  connect(mapStateToProps, mapDispatchToProps)(injectIntl(withTheme(withStyles(styles)(ChequeSearcher)))),
);