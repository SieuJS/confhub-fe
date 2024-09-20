
import { baseURL } from './api/baseApi';
import useFilter from './useFilter';
const useSuggest = () => {
const {filterConferences} = useFilter()

    const findSimilarConferences = (conferencesData, conference) => {
        const similarConferences = filterConferences(conferencesData, {'search': [conference.information.name]})
        if(similarConferences.length > 0){
          similarConferences[0].similar = {
            source: similarConferences[0].information.source
          }
        }
        for (let i = 0; i < conferencesData.length; i++) {
          const conf = conferencesData[i];
      
          // Check if ranks match and at least one fieldOfResearch matches
          if (((conf.information.rank === conference.information.rank && conf.information.source === conference.information.source) ||
              conf.information.fieldOfResearch.some(field => conference.information.fieldOfResearch.includes(field)) ||
              conf.information.name === conference.information.name && conf.information.acronym === conference.information.acronym && conf.information.source !== conference.information.source
            ) &&
              conf.id !== conference.id &&
              conf.organizations.some(org => org.status === 'new' && new Date(org.start_date) > new Date())
            ) {
      
            // Add similar object with rank and fieldOfResearch to the conference
            conf.similar = {
              rank: conference.information.rank,
              fieldOfResearch: conference.information.fieldOfResearch,
            };
      
            similarConferences.push(conf);
      
            // Break loop if we have found 10 conferences
            if (similarConferences.length >= 12) {
              break;
            }
          }
        }
      
        
      
        // Return up to 10 conferences (or less if there are fewer matches)
        return similarConferences.slice(0, 12);
      };
      const getTopViewList = async () => {
        try {
          const response = await fetch(`${baseURL}/conference/top/view?amount=12`,{
            method: 'GET'
          });
          const data = await response.json();
          //Gửi action để cập nhật state
          return data.topViewArr
        } catch (error) {
    
          console.error('Error fetching data:', error);
        }
      }
      
  return {
    findSimilarConferences,
    getTopViewList
  }
}

export default useSuggest