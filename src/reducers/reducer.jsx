import * as actionTypes from './../actions/actionTypes'

const appReducer = (state, action) => {
    switch (action.type) {
        case actionTypes.LOADING:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case actionTypes.ERROR_MESSAGE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case actionTypes.LOGIN_SUCCESS:
            return {
                ...state,
                user: action.payload,
            };
        case actionTypes.LOGIN_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case actionTypes.SET_IS_LOGIN:
            return {
                ...state,
                isLogin: action.payload,
            };
        case actionTypes.LOGOUT_USER:
            return {
                ...state,
                user: null,
                isLogin: false
            };
        case actionTypes.REGISTRATION_REQUEST:
            return {
                ...state,
                loading: true,
                user: null,
                error: null,
            };

        case actionTypes.REGISTRATION_SUCCESS:
            return {
                ...state,
                loading: false,
                user: action.payload,
                error: null,
            };

        case actionTypes.REGISTRATION_FAILURE:
            return {
                ...state,
                loading: false,
                user: null,
                error: action.payload,
            };
        case actionTypes.GET_OPTIONS_FILTER:
            return {
                ...state,
                filterOptions: { ...state.filterOptions, ...action.payload }
            };
        case actionTypes.ADD_FILTER: {
            const { filterList, label, keywords } = action.payload;
            
      return {
        ...state,
        loading: false,
        [filterList]: {
          ...state[filterList],
          [label]: [
            ...new Set([...state[filterList][label], ...keywords]),
          ],
        },
      };
        }
        case actionTypes.SET_PARAMS:
            return {
                ...state,
                pageParam: action.payload
            };
        case actionTypes.ADD_FILTER_DATE:
            return {
                ...state,
                loading: false,
                [action.payload.filter]: {
                    ...state[action.payload.filter],
                    [action.payload.label]: [...action.payload.keyword],
                },
            }
        case actionTypes.REMOVE_FILTER:
            return {
                ...state,
                [action.payload.fromFilter]: action.payload.updatedList,
                loading: false,
            }
        case actionTypes.CLEAR_FILTERS:
            return {
                ...state,
                [action.payload.fromFilter]: action.payload.updatedList,
                loading: false
            };
        case actionTypes.SET_PRIORITY_KEYWORD:
            return {
                ...state,
                priorityKeywords: action.payload,
            };

        case actionTypes.SET_SEARCH_RESULT:
            return {
                ...state,
                resultFilter: action.payload,
            };
        case actionTypes.SEARCH_KEYWORD:
            return {
                ...state,
                resultFilter: [...state.resultFilter, ...action.payload],
            };
        case actionTypes.GET_RESULT_AFTER_FILTER:
            return {
                ...state,
                appliedFilterResult: {
                    ...state.appliedFilterResult,
                    [action.payload.label]: [
                        ...state.appliedFilterResult[action.payload.label],
                        ...action.payload.results.map(item => item)
                    ]
                },
            };

        case actionTypes.SELECT_OPTION_FILTER:
            return {
                ...state,
                optionFilter: action.payload
            }
        case actionTypes.INPUT_OPTION_FILTER:
            return {
                ...state,
                resultKeywordFilter: action.payload,
            };
        case actionTypes.SET_INPUT_OPTION_FILTER:
            return {
                ...state,
                inputFilter: action.payload,
            };
        case actionTypes.GET_ALL_CONFERENCES:
            return {
                ...state,
                conferences: action.payload,
            };
        case actionTypes.GET_ONE_CONFERENCE:
            return {
                ...state,
                conference: action.payload
            };
        case actionTypes.FOLLOW:
            return {
                ...state,
                listFollowed: action.payload,
            };

        case actionTypes.UNFOLLOW:
            return {
                ...state,
                listFollowed: state.listFollowed.filter(item => item.id !== action.payload.id),
            };

        case actionTypes.GET_POSTED_CONFERENCES:
            return {
                ...state,
                postedConferences: action.payload,
            };
        case actionTypes.GET_NOTES:
            return {
                ...state,
                notes: action.payload,
            };

        case actionTypes.ADMIN_GET_USERS:
            return {
                ...state,
                users: action.payload,
            };
        case actionTypes.ADMIN_GET_USER:
            return {
                ...state,
                userAccount: action.payload,
            };
        case actionTypes.GET_PENDING_CONFERENCE:
            return {
                ...state,
                pendingConf: action.payload,
            };
        case actionTypes.GET_NOTIFICATIONS:
            return {
                ...state,
                notifications: action.payload,
            };

        case actionTypes.GET_SETTINGS:
            return {
                ...state,
                settings: action.payload,
            };
        case actionTypes.GET_FEEDBACKS:
            return {
                ...state,
                feedbacks: action.payload,
            };
        case actionTypes.GET_ALL_PENDING_CONFERENCES:
            return {
                ...state,
                pendingConferences: action.payload,
            };
        case actionTypes.SET_DATA_UPLOAD:
            return {
                ...state,
                dataUpload: {
                    data: action.payload.data,
                    headers: action.payload.headers,
                },
            };
        case actionTypes.SET_HEADERS_EXPORT:
            return {
                ...state,
                headersExport: action.payload,
            };
        case actionTypes.SET_USER_LOG:
            return {
                ...state,
                userLog: action.payload,
            };
        case actionTypes.SET_ETL_LOG:
            return {
                ...state,
                etlLog: action.payload,
            };
        case actionTypes.SET_CURRENT_USER:
            return {
                ...state,
                currentUsers: action.payload,
            };
        case actionTypes.SET_SOCKET_ID:
            return {
                ...state,
                socketID: action.payload,
            };
        case 'ADD_ID_CRAWLING':
            return {
                ...state,
                isCrawlingConfs: [...state.isCrawlingConfs, action.payload],
            };
        case 'REMOVE_ID_CRAWLING':
            return {
                ...state,
                messages: state.messages.filter(
                    conf => conf.id !== action.payload
                ),
            };
        case 'UPDATE_ID_STATUS':
            return {
                ...state,
                isCrawlingConfs: state.isCrawlingConfs.map(conf =>
                    conf.id === action.payload.confId
                        ? { ...conf, status: action.payload.newStatus }
                        : conf
                ),
            };
        case 'ADD_MESSAGE': {
            const messageExists = state.messages.some(message => message.id === action.payload.id);

            if (messageExists) {
                return {
                    ...state,
                    messages: state.messages.map(message =>
                        message.id === action.payload.id ? action.payload : message
                    ),
                };
            } else {
                return {
                    ...state,
                    messages: [...state.messages, action.payload],
                };
            }
        }
        case 'REMOVE_MESSAGE':
            return {
                ...state,
                messages: state.messages.filter(message => message.id !== action.payload),
            };
        case actionTypes.SET_USER_LOCATION:
            return {
                ...state,
                userLocation: action.payload,
            };
        case actionTypes.SET_IMPORT_LIST: {
            return {
                ...state,
                inProgressLoading: action.payload,
            }
        }
        case actionTypes.SET_STOP_IMPORTING:
            return {
                ...state,
                isImporting: action.payload
            };
        case actionTypes.UPDATE_IMPORT_LIST:
            //console.log('sss', state.inProgressLoading, action.payload)
            return {
                ...state,
                inProgressLoading: state.inProgressLoading.map((conf) =>
                    conf.crawlJob === action.payload.jobID
                        ? {
                            ...conf,
                            progress: action.payload?.job?.progress?.percentage ? action.payload?.job?.progress?.percentage : 0,
                            describe: action.payload.job?.progress?.detail,
                            error: action.payload.job?.error ? action.payload.job?.error : '',
                            status: action.payload.operationType !== 'insert' ? action.payload.job?.status : 'waiting'
                        }
                        : conf
                ),
            };
        case actionTypes.SET_BUFFER_LIST:
            return {
                ...state,
                inBufferProgressLoading: action.payload
            };
        case actionTypes.CLEAR_BUFFER_LIST:
            return {
                ...state,
                inBufferProgressLoading: []
            };
        case actionTypes.SET_CRAWL_JOBS:
            return {
                ...state,
                allCrawlJobs: action.payload,
            };
        case actionTypes.SET_EXISTED_CONF:

            return {
                ...state,
                existedConf: action.payload,
            };
        default:
            return state;
    }
};

export default appReducer