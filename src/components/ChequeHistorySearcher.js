import React, { Component, Fragment } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import _ from "lodash";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Searcher } from "@openimis/fe-core";
import { fetchCheckModificationHistory } from "../actions"
import {
  withModulesManager,
  formatMessageWithValues,
  formatDateFromISO,
} from "@openimis/fe-core";


const styles = (theme) => ({});

class ChequeHistorySearcher extends Component {
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
    this.props.fetchCheckModificationHistory(prms);
  }

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
      "cmr_cs.description",
      "cmr_cs.checkupdatedate",
      "cmr_cs.user"
    ];
    return result;
  };

  sorts = () => {
    var result = [
      ["chequeImportLineCode", true],
      ["description", true],
      ["updatedDate", true],
      ["user", false]
    ];
    return result;
  };

  itemFormatters = () => {
    var result = [
      (c) => c.chequeImportLine.chequeImportLineCode,
      (c) => c.description,
      (c) => formatDateFromISO(this.props.modulesManager, this.props.intl, c.updatedDate),
      (c) => c.user.loginName,

    ];
    return result;
  };

  render() {
    const {
      intl,
      fetchedHistoryModification,
      fetchingHistoryModification,
      errorHistoryModification,
      historyModification,
      historyModificationInfo,
      actions,
      onDoubleClick,
    } = this.props;
    let count = !!this.state.random && this.state.random.value;
    if (!count) {
      count = historyModification.length;
    }
    return (
      <Fragment>
        <Searcher
          module="claim"
          items={historyModification}
          fetchingItems={fetchingHistoryModification}
          fetchedItems={fetchedHistoryModification}
          itemsPageInfo={historyModificationInfo}
          errorItems={errorHistoryModification}
          tableTitle={formatMessageWithValues(intl, "cmr_cs", "historyTitle", { count })}
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
        />
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
    fetchingHistoryModification: state.cmr_cs.fetchingHistoryModification,
    errorHistoryModification: state.cmr_cs.errorHistoryModification,
    fetchedHistoryModification: state.cmr_cs.fetchedHistoryModification,
    historyModification: state.cmr_cs.historyModification,
    historyModificationInfo: state.cmr_cs.historyModificationInfo
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ fetchCheckModificationHistory }, dispatch);
};

export default withModulesManager(
  connect(mapStateToProps, mapDispatchToProps)(injectIntl(withTheme(withStyles(styles)(ChequeHistorySearcher)))),
);