import React, { Component } from "react";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { injectIntl } from 'react-intl';
import { fetchCheckModificationHistory } from "../actions";
import ChequeHistorySearcher from "../components/ChequeHistorySearcher";
import { 
    ProgressOrError, 
    Table, 
    PagedDataHandler, 
    Helmet,
    formatMessage,
    historyPush,
    formatMessageWithValues, 
    FormattedMessage } from "@openimis/fe-core";
import { Button } from "@material-ui/core"
const CHEQUE_FILTER_KEY = "cheque.Filter";

const styles = (theme) => ({
    page: theme.page,
  });

class ChequeHistoryPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
          defaultFilters: props.modulesManager.getConf("fe-cmr-cs", "cmr_cs.defaultFilters", {
            // "chequeStatus": {
            //   "value": "New",
            //    "filter": "chequeImportLineStatus: \"New\"",
            // },
          }),
        };
      }
    componentDidMount() {
        this.query();
        // const storedData = localStorage.getItem('duplicatesCheque');
        // if (storedData) {
        //   const parsedData = JSON.parse(storedData);
        //   this.props.fetchDuplicatesCheque(parsedData);
        // }
    }



    query = () => {
        let prms = [];
        prms.push(`first: ${this.state.pageSize}`);
        if (!!this.state.afterCursor) {
            prms.push(`after: "${this.state.afterCursor}"`)
        }
        if (!!this.state.beforeCursor) {
            prms.push(`before: "${this.state.beforeCursor}"`)
        }
        this.props.fetchCheckModificationHistory(prms);
    }

    onDoubleClick = (i, newTab = false) => {
        historyPush(this.props.modulesManager, this.props.history, "cmr_cs.ChequeStatus",[i.chequeImportLineCode],false);
    };
    canSubmitAll = () => true;
    handleDuplicateNavigation = () => {
        historyPush(this.props.modulesManager, this.props.history, "cmr_cs.DuplicateChequeListPage",[], null)
    }

    render() {
        const { 
            intl,
            classes,
            fetchingCheques,
            errorCheques,
            fetchedMyCheques,
            myCheques,
            myChequesPageInfo
        } = this.props;
    
      
               return (
            <div className={classes.page}>
            <Helmet title={formatMessage(this.props.intl, "cmr_cs", "cmr_cs.ChequeListHeader")} />
                <ChequeHistorySearcher
                defaultFilters={this.state.defaultFilters}
                cacheFiltersKey="claimReviewsPageFiltersCache"
                filterPaneContributionsKey={CHEQUE_FILTER_KEY}
                onDoubleClick={this.onDoubleClick}
                />
            </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    fetchingHistoryModification: state.cmr_cs.fetchingHistoryModification,
    errorHistoryModification: state.cmr_cs.errorHistoryModification,
    fetchedHistoryModification: state.cmr_cs.fetchedHistoryModification,
    historyModification: state.cmr_cs.historyModification
});



const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchCheckModificationHistory }, dispatch);
};

export default injectIntl(withTheme(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ChequeHistoryPage))));