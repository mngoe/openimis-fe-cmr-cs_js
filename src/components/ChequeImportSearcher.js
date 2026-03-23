import React, { Component, Fragment } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import _ from "lodash";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Searcher } from "@openimis/fe-core";
import { fetchChequesImport } from "../actions"
import {
    withModulesManager,
    formatMessageWithValues
} from "@openimis/fe-core";

const styles = (theme) => ({});

class ChequeImportSearcher extends Component {

    state = {
        pageSize: 20,
        afterCursor: null,
        beforeCursor: null,
        uploadState: null,
        showModal: false,
        contentModal: "cmr_cs.currentlyImporting",
        random: null
    }

    constructor(props) {
        super(props);
        this.rowsPerPageOptions = props.modulesManager.getConf(
            "fe-cmr-cs",
            "cmr_cs.rowsPerPageOptions",
            [10, 20, 50, 100],
        );
        this.defaultPageSize = props.modulesManager.getConf("fe-cmr-cs", "cmr_cs.defaultPageSize", 20);
    }

    fetch = (prms) => {
        this.props.fetchChequesImport(prms);
    };

    forcedFilters() {
        return !this.props.forcedFilters ? [] : [...this.props.forcedFilters.filter((f) => f.id !== "random")];
    }

    query = (state) => {
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
            prms.push(`orderBy: ["chequeimportline", "?"]`);
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
    }

    headers = () => {
        var result = [
            "cmr_cs.importId",
            "cmr_cs.importDate",
            "cmr_cs.storedFile",
        ];
        return result;
    };

    itemFormatters = () => {
        var result = [
            e => e.idChequeImport,
            e => e.importDate,
            e => e.storedFile,
        ];
        return result;
    };

    render() {
        const {
            intl,
            myChequesImport,
            myChequesImportPageInfo,
            fetchingChequesImport,
            fetchedMyChequesImport,
            errorChequesImport,
            defaultFilters,
        } = this.props;
        let count = !!this.state.random && this.state.random.value;
        if (!count) {
            count = myChequesImportPageInfo.totalCount;
        }
        return (
            <Fragment>
                <Searcher
                    module="cmr_cs"
                    defaultFilters={defaultFilters}
                    items={myChequesImport}
                    count={count}
                    rowsPerPageOptions={this.rowsPerPageOptions}
                    itemsPageInfo={myChequesImportPageInfo}
                    defaultPageSize={this.defaultPageSize}
                    fetch={this.fetch}
                    fetchingItems={fetchingChequesImport}
                    fetchedItems={fetchedMyChequesImport}
                    errorItems={errorChequesImport}
                    itemFormatters={this.itemFormatters}
                    headers={this.headers}
                    filtersToQueryParams={this.query}
                    defaultOrderBy="chequeimportline"
                    tableTitle={formatMessageWithValues(intl, "CmrCS", "cmr_cs.tableImport",
                        { count: count })}
                />
            </Fragment>
        )
    }

}

const mapStateToProps = state => ({
    fetchingChequesImport: state.cmr_cs.fetchingChequesImport,
    errorChequesImport: state.cmr_cs.errorChequesImport,
    fetchedMyChequesImport: state.cmr_cs.fetchedMyChequesImport,
    myChequesImport: state.cmr_cs.myChequesImport,
    myChequesImportPageInfo: state.cmr_cs.myChequesImportPageInfo,
});



const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchChequesImport }, dispatch);
};

export default withModulesManager(
    connect(mapStateToProps, mapDispatchToProps)(injectIntl(withTheme(withStyles(styles)(ChequeImportSearcher)))),
);