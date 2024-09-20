const capitalizeFirstLetter = (string) => {
  if(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  else return 'N/I'
}

const convertToLowerCaseFirstLetter = (str) => {
  if(str){

    return str.replace(/\b\w/g, (match) => match.toLowerCase());
  }
  else return 'N/I'
}
const formatLabel = (label) => {
    // Chuyển đổi 'submissionDate' thành 'Submission Date'
    return label.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\b\w/g, (c) => c.toUpperCase());
  };


export {capitalizeFirstLetter, convertToLowerCaseFirstLetter, formatLabel}