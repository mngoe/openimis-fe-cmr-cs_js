import {
    formatServerError, formatGraphQLError, parseData, pageInfo,
    dispatchMutationReq, dispatchMutationErr, dispatchMutationResp
} from '@openimis/fe-core';

function reducer(
    state = {
        fetchingCheques: false,
        errorCheques: null,
        fetchedMyCheque: false,
        myCheques: [],
        myChequesPageInfo: { totalCount: 0 },
        authError: null,
        fetchingChequesImport: false,
        errorChequesImport: null,
        fetchedMyChequeImport: false,
        myChequesImport: [],
        myChequesImportPageInfo: { totalCount: 0 },
        submittingMutation: false,
        mutation: {},
        duplicatesCheque: [],
        historyModification: {},
        fetchingHistoryModification: false,
        fetchedHistoryModification: false,
        errorHistoryModification: null,
        historyModificationInfo: {totalCount: 0},

        duplicateChequePageInfo: {totalCount: 0}
        },
    action,
) {
    switch (action.type) {
        case 'CMS_CS_CHECKLIST_REQ':
            return {
                ...state,
                fetchingCheques: true,
                fetchedMyCheques: false,
                myCheques: [],
                myChequesPageInfo: { totalCount: 0 },
                errorCheques: null,
            };
        case 'CMS_CS_CHECKLIST_RESP':
            return {
                ...state,
                fetchingCheques: false,
                fetchedMyCheques: true,
                myCheques: parseData(action.payload.data.chequeimportline),
                myChequesPageInfo: pageInfo(action.payload.data.chequeimportline),
                errorCheques: formatGraphQLError(action.payload)
            };
        case 'CMS_CS_CHECKLIST_ERR':
            return {
                ...state,
                fetchedMyCheques: false,
                errorCheques: formatServerError(action.payload)
            };
        case 'CMS_CS_CHECKIMPORT_REQ':
            return {
                ...state,
                fetchingChequesImport: true,
                fetchedMyChequesImport: false,
                myChequesImport: [],
                myChequesImportPageInfo: { totalCount: 0 },
                errorChequesImport: null,
            };
        case 'CMS_CS_CHECKIMPORT_RESP':
            return {
                ...state,
                fetchingChequesImport: false,
                fetchedMyChequesImport: true,
                myChequesImport: parseData(action.payload.data.chequeimport),
                myChequesImportPageInfo: pageInfo(action.payload.data.chequeimport),
                errorChequesImport: formatGraphQLError(action.payload)
            };
        case 'CMS_CS_CHECKIMPORT_ERR':
            return {
                ...state,
                fetchedMyChequesImport: false,
                errorChequesImport: formatServerError(action.payload)
            };
        case 'HISTORY_CHEQUE_REQ': {
            return {
                ...state,
                historyModification: {},
                fetchingHistoryModification: true,
                historyModificationInfo:{totalCount: 0}

            }
        }
        case 'HISTORY_CHEQUE_RESP': {
            const data = parseData(action.payload.data.ChequeUpdatedHistories);
            const sortedData = data.sort((a, b) => new Date(b.updatedDate) - new Date(a.updatedDate));
        
            return {
                ...state,
                historyModification: sortedData, 
                fetchingHistoryModification: false,
                fetchedHistoryModification: true,
                errorHistoryModification: formatGraphQLError(action.payload),
                historyModificationInfo: pageInfo(action.payload.data.ChequeUpdatedHistories) 
            };
        }
        
        case 'HISTORY_CHEQUE_ERR': {
            return {
                ...state,
                historyModification: {},
                fetchingHistoryModification: false,
                fetchedHistoryModification: false,
                errorHistoryModification: formatServerError(action.payload),
                historyModificationInfo:{totalCount: 0}


            }
        }
        case 'DUPLICATED_CHEQUE':
            return {
                ...state,
                duplicatesCheque: action.payload,
                duplicateChequePageInfo: {totalCount: action.payload.length}
            }

        default:
            return state;
    }
}

export default reducer;