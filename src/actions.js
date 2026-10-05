import {
    graphql, formatPageQueryWithCount, formatMutation, graphqlMutation,
} from "@openimis/fe-core";
import { RSAA } from "redux-api-middleware";



function getApiUrl() {
    let _baseApiUrl = process.env.REACT_APP_API_URL ?? "/api";
    if (_baseApiUrl.indexOf("/") !== 0) {
        _baseApiUrl = `/${_baseApiUrl}`;
    }
    return _baseApiUrl;
}

export const baseApiUrl = getApiUrl();
export function fetchCheques(mm, filters) {
    const payload = formatPageQueryWithCount(
        "chequeimportline",
        filters,
        ["idChequeImportLine", "chequeImportLineCode", "chequeImportLineDate", "chequeImportLineStatus"]
    );
    return graphql(payload, 'CMS_CS_CHECKLIST');
}


export function fetchChequeSummaries(mm, filters) {
    var projections = [
        "idChequeImportLine",
        "chequeImportLineCode",
        "chequeImportLineDate",
        "chequeImportLineStatus"
    ];
    const payload = formatPageQueryWithCount("chequeimportline", filters, projections);
    return graphql(payload, "CMS_CS_CHECKLIST");
}

export function fetchChequesImport(filters) {
    const payload = formatPageQueryWithCount(
        "chequeimport",
        filters,
        ["idChequeImport", "importDate", "storedFile"]
    );
    return graphql(payload, 'CMS_CS_CHECKIMPORT');
}

export function updateChequeStatus(mm, chequeStatus, clientMutationLabel, idChequeImportLine, chequeImportLineStatus) {
    let mutation = formatMutation("updateChequeStatus", formatChequeStatusGQL(mm, chequeStatus), clientMutationLabel, idChequeImportLine, chequeImportLineStatus);
    var requestedDateTime = new Date();
    chequeStatus.clientMutationId = mutation.clientMutationId;
    return graphql(mutation.payload, ["CMS_CS_CHECKIMPORT_REQ", "CMS_CS_UPDATE_CHECKIMPORT_RESP", "CMS_CS_CHECKIMPORT_ERR"], {
        clientMutationId: mutation.clientMutationId,
        clientMutationLabel, idChequeImportLine,
        requestedDateTime
    });
}

export function formatChequeStatusGQL(mm, chequeStatus) {
    return `
      ${!!chequeStatus.chequeImportLineStatus ? `chequeImportLineStatus: "${capitalizeFirstLetter(chequeStatus.chequeImportLineStatus)}"` : ""}
      ${!!chequeStatus.idChequeImportLine ? `idChequeImportLine: ${chequeStatus.idChequeImportLine}` : ""}
    `;
}

function capitalizeFirstLetter(String){
    if(!String){
        return ''
    }
    return String.charAt(0).toUpperCase() +String.slice(1)
}

export function fetchCheckModificationHistory(filters) {

    const validFilters = !!filters && Array.isArray(filters) && filters.length
        ? filters.join(", ")
        : "";
    const payload = `
    query {
        ChequeUpdatedHistories(${validFilters}) {
            totalCount
            edges {
                node {
                    id
                    idChequeUpdated
                    chequeImportLine {
                        id
                        idChequeImportLine
                        chequeImportLineCode
                    }
                    user {
                        loginName
                    }
                    updatedDate
                    description
                }
            }
            pageInfo {
                endCursor
                hasNextPage
                hasPreviousPage
                startCursor
            }
        }
    }
`;

    console.log("payload cheque table ", filters)
    return graphql(payload, 'HISTORY_CHEQUE')
}
