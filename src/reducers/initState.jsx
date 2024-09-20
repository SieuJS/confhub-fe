export const initialState = {
  user: null,
  isLogin: true,
  loading: false,
  error: null,
  
  conferences: [],
  conference: null,
  pendingConferences: [],
  pendingConf: null,

  updatingConferences: [],

  notifications: [],
  messages: [],
  isCrawlingConfs: [],

  isFollow: false,//????

  popularConf: [], //conference có nhiều follow

  //filter
  maxpage: 0,
  amount: 0,
  filterOptions: [],
  optionsSelected: {
    location: [],
    rank: [], 
    for: [], 
    source: [], 
    acronym: [], 
    type: [],
    conferenceDate: [],
    submissionDate: [],
    search: [],
    impactfactor: [],
    rating: [],
    category: [],
    owner: [],
    region: []
  },

  optionsSelectedAdmin: {
    location: [],
    rank: [], 
    for: [], 
    source: [], 
    acronym: [], 
    type: [],
    conferenceDate: [],
    submissionDate: [],
    search: [],
    impactfactor: [],
    rating: [],
    category: [],
    owner: [],
    region: []
  },

  optionsSelectedFollow: {
    location: [],
    rank: [], 
    for: [], 
    source: [], 
    acronym: [], 
    type: [],
    conferenceDate: [],
    submissionDate: [],
    search: [],
    impactfactor: [],
    rating: [],
    category: [],
    owner: [],
    region: []
  },

  optionsSelectedOwn: {
    location: [],
    rank: [], 
    for: [], 
    source: [], 
    acronym: [], 
    type: [],
    conferenceDate: [],
    submissionDate: [],
    search: [],
    impactfactor: [],
    rating: [],
    category: [],
    owner: [],
    region: []
  },
  priorityKeywords: {},

  pageParam: 0,
  paramsFilter: {
    homepage: "",
    follow: "",
    post: "",
  },


  optionFilter: [],
  resultKeywordFilter: [],
  resultFilter: [],
  inputFilter: '',
  actionWithKeyword:'alo',

  userLocation: null,



  listFollowed: [],
  //filter in auth page
  filterAuth: [],
  filterOptionsAuth:  {
    locations: [],
    ranks: [],
    fors: [],
    sources: [],
    acronyms: [],
    types: [],
    date: [],
    submissionDate: [],
    search: [],
    impactfactor: [],
    rating: [],
    category: [],
  },
  
  //postedConf
  postedConferences: [],

  //feedbacks
  feedbacks: [],

  //notes
  notes: [],

  //ADMIN MANAGEMENT
  users: [],
  userAccount: null,

  settings: {},

  dataUpload: {
    data: [],
    headers: []
  },
  headersExport: [],

  userLog: [],
  etlLog: [],
  currentUsers: [],

  socketID: null,
  
  inProgressLoading: [],
  inBufferProgressLoading: [],
  isImporting: false,
  isCrawlingConImported: false,
  existedConf: [],

  allCrawlJobs: [],
  

  searchByKeyworResult: ''
};

