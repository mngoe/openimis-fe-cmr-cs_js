import React, { Component } from "react";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { injectIntl } from 'react-intl';
import {
  Grid,
  Typography,
  Button,
  Divider,
  Input,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { formatMessageWithValues, formatDateFromISO, baseApiUrl, apiHeaders } from "@openimis/fe-core";
import ChequeImportSearcher from "../components/ChequeImportSearcher";

const CREATECHEQUE_URL = `${baseApiUrl}/cs/importfile`;

const styles = theme => ({
  page: theme.page,
});

let file = '';

function handleChange(event) {
  file = event.target.files[0];
}




class ChequeImportPage extends Component {
  state = {
    showModal: false,
  }

  constructor(props) {
    super(props);
    this.isMountedFlag = false; 
  }

  componentDidMount() {
    this.isMountedFlag = true;
  }

  componentWillUnmount() {
    this.isMountedFlag = false; 
  }

  handleClose = () => {
    if (this.isMountedFlag) { 
      this.setState({ showModal: false, uploadState: null });
    }
  }

  transformChequeData(data) {
    return data.map(item => {
      return {
        chequeImportLineCode: item[1],
        chequeImportLineDate: item[3],
        chequeImportLineStatus: item[2],
      };
    });

  }

  handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    try {
      this.setState({ showModal: true });
      this.setState({ contentModal: "cmr_cs.currentlyImporting" });
      const reponseUpload = async () => {
        fetch(`${CREATECHEQUE_URL}/upload`, {
          headers: apiHeaders,
          body: formData,
          method: "POST",
          credentials: "same-origin",
        }).then(response => {
          if (response.status >= 400) {
            throw new Error("Unknown error");
          }
          response.json().then(reponseJson => {

            if (this.isMountedFlag) {
              if (reponseJson.success == true) {
                const cheque = this.transformChequeData(reponseJson.updatedCheques);
                this.setState({
                  uploadState: cheque
                });
                this.setState({ showModal: true });
                if (!!reponseJson && reponseJson.updatedCheques.length > 0) {
                  this.setState({ contentModal: "cmr_cs.DuplicateImport" });
                } else {
                  this.setState({ contentModal: "cmr_cs.checkImported" });
                }
              }
            }
          });
        });
      }
      reponseUpload();
    } catch (error) {
      console.error(error);
      console.log(error)
    }
  }

  render() {
    const {
      intl,
      classes,
    } = this.props;
    return (
      <div className={classes.page}>
        <h1>{formatMessageWithValues(intl, "CmrCS", "cmr_cs.importCheckFile")}</h1>

        <Grid container spacing={2} direction="column">
          <Grid item>
            <Typography variant="h6">{formatMessageWithValues(intl, "CmrCS", "cmr_cs.importChecks")}</Typography>
          </Grid>
          <Grid item>
            <form onSubmit={(event) => this.handleSubmit(event)}>
              <Grid container spacing={1} direction="column">
                <Grid item>
                  <Input
                    required
                    id="import-button"
                    inputProps={{
                      accept: ".csv, application/csv, text/csv",
                    }}
                    type="file"
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                  >
                    {formatMessageWithValues(intl, "CmrCS", "cmr_cs.uploadFile")}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
        <Dialog open={this.state.showModal} onClose={this.handleClose} >
          <DialogTitle>{formatMessageWithValues(intl, "CmrCS", "cmr_cs.importCheckFile")}</DialogTitle>
          <Divider />
          <DialogContent>
          {this.state.uploadState != null ?
              <>
                <DialogContentText>
                  {formatMessageWithValues(intl, "CmrCS", this.state.contentModal)}
                </DialogContentText>
                {this.state.uploadState.map((cheque, index) => (
                  <DialogContentText key={index}>
                    Code: {cheque.chequeImportLineCode}, Date: {formatDateFromISO( this.props.modulesManager, intl, cheque.chequeImportLineDate)}, Status: {cheque.chequeImportLineStatus}
                  </DialogContentText>
                ))}
              </>
              :
              <DialogContentText>
                {formatMessageWithValues(intl, "CmrCS", this.state.contentModal)}
              </DialogContentText>
            }
             </DialogContent>
        </Dialog>
        <hr />
        <ChequeImportSearcher/>
      </div>
    )
  }
}

export default injectIntl(withTheme(withStyles(styles)(ChequeImportPage)));