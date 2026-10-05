import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import {
    formatMessage,
    formatMessageWithValues,
    withModulesManager,
    withHistory,
    journalize,
    historyPush
} from "@openimis/fe-core";
import { updateChequeStatus } from "../actions";
import ChequeForm from "../components/ChequeForm";

const styles = theme => ({
    page: theme.page,
    fullHeight: {
        height: "100%",
      },
});

class ChequeStatusPage extends Component {

    save = (chequeStatus) => {
            this.props.updateChequeStatus(
              this.props.modulesManager,
              chequeStatus,
              formatMessageWithValues(this.props.intl, "cmr_cs", "updateChequeStatus.mutationLabel",chequeStatus.chequeImportLineCode),
            );
          
    };

    render() {
        const { intl, classes, modulesManager, history, cheque_code } = this.props; 
        return (
            <div className={classes.page}>
                <ChequeForm             
                    cheque_code={cheque_code}
                    save={this.save}
                    add={this.add}
                    back={(e) => historyPush(modulesManager, history, "cmr_cs.ChequeStatus")}
                />
            </div>
        )
    }

}

const mapStateToProps = (state, props) => ({
    cheque_code: props.match.params.cheque_code,
});

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ updateChequeStatus, journalize }, dispatch);
};

export default withHistory(
    withModulesManager(connect(mapStateToProps, mapDispatchToProps)(injectIntl(withTheme(withStyles(styles)(ChequeStatusPage)))))
);