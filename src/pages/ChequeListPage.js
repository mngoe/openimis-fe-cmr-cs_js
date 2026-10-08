import React, { Component } from "react";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { injectIntl } from 'react-intl';
import { fetchCheques, fetchCheckModificationHistory } from "../actions";
import ChequeSearcher from "../components/ChequeSearcher";
import {
    ProgressOrError,
    Table,
    PagedDataHandler,
    Helmet,
    formatMessage,
    historyPush,
    formatMessageWithValues,
    FormattedMessage
} from "@openimis/fe-core";
import { Button } from "@material-ui/core"
const CHEQUE_FILTER_KEY = "cheque.Filter";

const styles = (theme) => ({
    page: theme.page,
});

class ChequeListPage extends Component {

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
        this.props.fetchCheques(prms);
    }

    onDoubleClick = (i, newTab = false) => {
        historyPush(this.props.modulesManager, this.props.history, "cmr_cs.ChequeStatus", [i.chequeImportLineCode], false);
    };
    canSubmitAll = () => true;
    handleDuplicateNavigation = () => {
        historyPush(this.props.modulesManager, this.props.history, "cmr_cs.DuplicateChequeListPage", [], null)
    }
    handleHistoryNavigation = () => {
        historyPush(this.props.modulesManager, this.props.history, "cmr_cs.ChequeHistoryPage", [], null)
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
        const actions = [
            {
                action: this.handleHistoryNavigation,
                label: formatMessage(this.props.intl, "cmr_cs", "history"),
                enabled: this.canSubmitAll
            },

        ];

        return (
            <div className={classes.page}>
                <Helmet title={formatMessage(this.props.intl, "cmr_cs", "cmr_cs.ChequeListHeader")} />
                <ChequeSearcher
                    defaultFilters={this.state.defaultFilters}
                    actions={actions}
                    cacheFiltersKey="claimReviewsPageFiltersCache"
                    filterPaneContributionsKey={CHEQUE_FILTER_KEY}
                    onDoubleClick={this.onDoubleClick}
                />
            </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    fetchingCheques: state.cmr_cs.fetchingCheques,
    errorCheques: state.cmr_cs.errorCheques,
    fetchedMyCheques: state.cmr_cs.fetchedMyCheques,
    myCheques: state.cmr_cs.myCheques,
    myChequesPageInfo: state.cmr_cs.myChequesPageInfo,
    duplicatesCheque: state.cmr_cs.duplicatesCheque,
    historyModification: state.cmr_cs.historyModification
});



const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchCheques, fetchCheckModificationHistory }, dispatch);
};

export default injectIntl(withTheme(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ChequeListPage))));