
import React, { Component } from "react";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { injectIntl } from 'react-intl';
import { fetchCheques } from "../actions";
import ChequeSearcher from "../components/ChequeSearcher";
import {
    ProgressOrError,
    Table,
    PagedDataHandler,
    Helmet,
    formatMessage,
    formatMessageWithValues,
    FormattedMessage
} from "@openimis/fe-core";

const CHEQUE_FILTER_KEY = "cheque.Filter";

const styles = (theme) => ({
    page: theme.page,
});

class duplicatesChequeListPage extends Component {

    constructor(props) {
        super(props);
        // this.state = {
        //     defaultFilters: props.modulesManager.getConf("fe-cmr-cs", "cmr_cs.defaultFilters", {
        //         "chequeStatus": {
        //             "value": "New",
        //             "filter": "chequeImportLineStatus: \"New\"",
        //         },
        //     }),
        // };
    }
    componentDidMount() {
        // this.query();
        const storedData = localStorage.getItem('duplicatesCheque');

    }



    // query = () => {
    //     let prms = [];
    //     prms.push(`first: ${this.state.pageSize}`);
    //     if (!!this.state.afterCursor) {
    //         prms.push(`after: "${this.state.afterCursor}"`)
    //     }
    //     if (!!this.state.beforeCursor) {
    //         prms.push(`before: "${this.state.beforeCursor}"`)
    //     }
    //     this.props.fetchCheques(prms);
    // }
    canSubmitAll = () => true;

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
                <ChequeSearcher
                    defaultFilters={"none"}
                    cacheFiltersKey="claimReviewsPageFiltersCache"
                    filterPaneContributionsKey={CHEQUE_FILTER_KEY}
                    duplicate={true}
                />
            </div>
        )
    }
}

const mapStateToProps = state => ({
    fetchingCheques: state.cmr_cs.fetchingCheques,
    errorCheques: state.cmr_cs.errorCheques,
    fetchedMyCheques: state.cmr_cs.fetchedMyCheques,
    myCheques: state.cmr_cs.myCheques,
    myChequesPageInfo: state.cmr_cs.myChequesPageInfo,
    duplicatesCheque: state.cmr_cs.duplicatesCheque
});



const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchCheques }, dispatch);
};

export default injectIntl(withTheme(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(duplicatesChequeListPage))));
