import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Alert } from "react-bootstrap"

const Explore = (props) => {
// Displays all works that are complete - no longer in the work in progress phase. 
// Competed Works will get stored in a datastructure and they will get display here.
// TODO: Add a page viewer. 
// TODO: Add button for read sample -> display first chapter/first subtopic of work
// TODO: Add button for buying -> display a transaction: once transaction is recieved, display full work. 
// TODO: Add a search/filter mechanism
  const [publishedWorks, changePublishedWorks] = useState([]);

  useEffect(() => {
    const getInfo = async () => {
        let pw = await window.contract.getIlluminatedWorks();
        changePublishedWorks(pw);
        console.log(pw);
    }; getInfo();
    }, []);

  return (
    <div className="App">
        <div className="App-header">
            <h2>Explore Illuminated Works</h2>
        </div>
            <Alert variant="secondary">
                    <p>
                        All completed works are displayed here. You can choose to buy the full version or read a sample. Enjoy!
                    </p>
            </Alert>
            <Container>
      { publishedWorks.map((x, i) => {
        return (
          <Row
            style={{ margin: "3vh" }}
            key={i}
            className='d-flex justify-content-center'>
            <Card>
              <Card.Title> A Book Title </Card.Title>
              <Card.Body>
                  <a href={x.split(",")[1]}> Buy </a> 
                  <br></br> 
                  <a href={x.split(",")[1]}> Read Sample </a> 
              </Card.Body>
            </Card>
          </Row>
        );
        })}
        </Container>
    </div>);
};

export default Explore;
