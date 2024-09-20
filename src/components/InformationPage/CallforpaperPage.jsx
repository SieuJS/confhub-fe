import React from "react";
import useScreenSize from "../../hooks/useScreenSize";

const CallforpaperPage = ({conference}) => {
  const {windowWidth} = useScreenSize()
  const processText = (text) => {
    // Split text by \n
    const lines = text.split('\n');

    // Render lines with appropriate line breaks
    return lines.map((line, index) => {
      if (line === '' && index > 0 && lines[index - 1] === '') {
        // Ignore consecutive empty lines beyond the first two
        return null;
      }
      return (
        <React.Fragment key={index}>
          {line}
          {index < lines.length - 1 && <br />}
          {line === '' && lines[index + 1] === '' && <br />}
        </React.Fragment>
      );
    }).filter(element => element !== null);
  };
  return (
    <div className={windowWidth > 768 ? 'm-0 p-4': 'px-2 py-4'}>
      <div className={`bg-white ${windowWidth > 768 ? 'p-5 m-5': 'py-5 px-2 m-2'}`}>
        <h3 className='ms-3 fs-3 fw-bold text-teal-normal'>Call for paper</h3>
        {
          conference
            ?
            <>
             <div className="px-3">
               <p className="text-justify fs-5">
               {processText(conference.callForPaper)}
               </p>
             </div>
            </>
            :
            <span>Please refresh page.</span>
        }
      </div>
    </div>
  )
}

export default CallforpaperPage