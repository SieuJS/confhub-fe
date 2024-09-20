import { Card, Container, Row } from "react-bootstrap";
import { useState } from "react";
import submission from "../assets/imgs/submission.png";
import locationIcon from "../assets/imgs/location.png";
import confDateIcon from "../assets/imgs/confDate.png";
import saveIcon from "../assets/imgs/follow.png";

const test = [
  {
    con_id: 1,
    acronym: "KDD",
    con_name:
      "ACM International Conference on Knowledge Discovery and Data Mining",
    location: "Vietnam",
    submission_date: "30/10/2023",
    conference_date: "30/12/2023",
    follow: false,
  },
  {
    con_id: 2,
    acronym: "KDD",
    con_name:
      "ACM International Conference on Knowledge Discovery and Data Mining",
    location: "Vietnam",
    submission_date: "30/10/2023",
    conference_date: "30/12/2023",
    follow: true,
  },
  {
    con_id: 3,
    acronym: "KDD",
    con_name:
      "ACM International Conference on Knowledge Discovery and Data Mining",
    location: "Vietnam",
    submission_date: "30/10/2023",
    conference_date: "30/12/2023",
    follow: false,
  },
  {
    con_id: 4,
    acronym: "KDD",
    con_name:
      "ACM International Conference on Knowledge Discovery and Data Mining",
    location: "Vietnam",
    submission_date: "30/10/2023",
    conference_date: "31/12/2023",
    follow: true,
  },
  {
    con_id: 5,
    acronym: "KDD",
    con_name:
      "ACM International Conference on Knowledge Discovery and Data Mining",
    location: "Vietnam",
    submission_date: "30/10/2023",
    conference_date: "30/12/2023",
    follow: false,
  },
];

const Result = () => {
  const [events, setEvents] = useState(test);
  return (
    <Container className="d-flex flex-column p-0 mt-5" style={{ width: "1260px" }}>
      <div className="my-2">
        <span className="h5 fw-bold">Conferences</span> ({events.length})
      </div>
      {events.map((conf, index) => (
        <div
          className="mb-4 p-2 d-flex "
          style={{
            height: "180px",
            backgroundColor: "#C2F1EB",
            borderRadius: "20px",
            flexDirection: "row",
            fontFamily: "Roboto",
          }}
        >
          <div className="">
            <div
              className="ml-5 my-4 h1 fw-bolder d-flex 
              align-items-center justify-content-center"
              style={{
                width: "120px",
                height: "120px",
                backgroundColor: "#ffff",
                marginLeft: "30px",
                borderRadius: "20px",
              }}
            >
              {conf.acronym}
            </div>
          </div>

          <div
            className="my-4 px-5"
            style={{ position: "relative", height: "100%", width: "100%" }}
          >
            <div>
              <div
                style={{
                  fontFamily: "Roboto",
                  fontSize: "22px",
                  display: index === 0 ? "flex" : "block",
                }}
              >
                {/* upcoming confs */}
                {index === 0 && (
                  <div
                    className="align-items-center justify-content-center "
                    style={{
                      width: "140px",
                      height: "36px",
                      display: "flex",
                      borderRadius: "10px",
                      color: "white",
                      backgroundColor: "#FFB13B",
                      marginRight: "10px",
                    }}
                  >
                    <strong>Upcoming</strong>
                  </div>
                )}

                <strong>{conf.con_name}</strong>
              </div>
              <div
                className="py-3"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  fontSize: "18px",
                  width: "662px",
                }}
              >
                <div>
                  <img
                    src={submission}
                    alt="submission icon"
                    style={{ paddingRight: "8px" }}
                  />
                  Submission Date: <strong>{conf.submission_date}</strong>
                </div>
                <div>
                  <img
                    src={confDateIcon}
                    alt="submission icon"
                    style={{ paddingRight: "8px" }}
                  />
                  Conference Date: <strong>{conf.conference_date}</strong>
                </div>
              </div>
              <div style={{ fontSize: "18px" }}>
                <img
                  src={locationIcon}
                  alt="location icon"
                  style={{ paddingRight: "8px" }}
                />
                Location: <strong>{conf.location}</strong>
              </div>
              <button
                style={{
                  width: "136px",
                  height: "40px",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: "#ffff",
                  position: "absolute",
                  bottom: "35px",
                  right: "50px",
                  display: "flex",
                  flexDirection: "row",
                  padding: "8px",
                  justifyContent: "space-between",
                }}
              >
                <img src={saveIcon} alt="save icon" />
                <p
                  style={{
                    fontSize: "18px",
                  }}
                >
                  <strong>Unfollow</strong>
                </p>
              </button>
            </div>
          </div>
        </div>
      ))}
    </Container>
  );
};

export default Result;