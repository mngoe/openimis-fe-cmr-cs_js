import React, { } from "react";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Paper, Grid, Typography, Checkbox, FormControlLabel, MenuItem, Select, InputLabel, FormControl } from "@material-ui/core";
import {
  ControlledField,
  TextInput,
  formatMessage,
  FormattedMessage,
  PublishedComponent,
  FormPanel,
  NumberInput,
  withModulesManager,
} from "@openimis/fe-core";

const styles = (theme) => ({
  paper: theme.paper.paper,
  tableTitle: theme.table.title,
  item: theme.paper.item,
  fullHeight: {
    height: "100%",
  },
});

const chequeStatuses = [
  { value: "New", label: "New" },
  { value: "Cancel", label: "Cancel" },
  { value: "Used", label: "Used" },
];


class ChequeStatusMasterPanel extends FormPanel {

  updateAttribute = (attr, v) => {
    let edited = { ...this.props.edited };
    edited[attr] = v;
    this.props.onEditedChanged(edited);

  };

  render() {
    const {
      intl,
      classes,
      edited,
      title = "add.chequeStatus",
      titleParams = { label: "" },
      actions,
      onEditedChanged,
      chequeStatus,
      readOnly,
    } = this.props;
    return (
      <Grid container direction="row">
        <Grid container className={classes.item}>

          <Grid item xs={4} className={classes.item}>
            <TextInput
              module="cmr_cs"
              label={formatMessage(intl, "cmr_cs", "chequeStatus.checknum")}
              required={true}
              readOnly={true}
              value={!!edited && !!edited.chequeImportLineCode ? edited.chequeImportLineCode : ""}
              onChange={(v) => this.updateAttribute("checknum", v)}
            />

          </Grid>
          <Grid item xs={4} className={classes.item}>

          <PublishedComponent
              pubRef="cmr_cs.ChequeStatusPicker"
              value={!!edited && !!edited.chequeImportLineStatus ? (edited.chequeImportLineStatus).toLowerCase() : ""}
              readOnly={readOnly}
              required={true}
              onChange={(v) => this.updateAttribute("chequeImportLineStatus", v)}

            />

          </Grid>
          <Grid item xs={4} className={classes.item}>
          
              <PublishedComponent
                pubRef="core.DatePicker"
                value={!!edited && !!edited.chequeImportLineDate ? edited.chequeImportLineDate : ""}
                module="cmr_cs"
                label={formatMessage(intl, "cmr_cs", "cmr_cs.checkdate")}
                onChange={(v) => this.updateAttribute("checkdate", v)}
                readOnly={true}
                required={true}
                // maxDate={edited.dateTo < edited.dateClaimed ? edited.dateTo : edited.dateClaimed}
              />
              
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default withModulesManager(withTheme(withStyles(styles)(ChequeStatusMasterPanel)));