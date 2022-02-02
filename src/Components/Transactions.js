import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Container, Row, Col, Card } from "react-bootstrap";
import { async } from "regenerator-runtime";

const Transactions = (props) => {
  const [creations, changeCreations] = useState([]);
  const [votedCreations, changeVotes] = useState([]);
  const [votedEntries, changeEntryVotes] = useState([]);

  useEffect(() => {
    const getInfo = async () => {
      let userCreations = await window.contract.getCreations({
        user: window.accountId
      });
      let userVotes = await window.contract.getAllVotedForCreations({
        user: window.accountId 
      });
      let entryVotes = await window.contract.getAllVotedForEntries({
        user: window.accountId
      });
      changeVotes(userVotes);
      changeCreations(userCreations);
      changeEntryVotes(entryVotes);
    };
    getInfo();
  }, []);
  return (
    <Container>
      {creations.map((x, i) => {
        return (
          <Row
            style={{ margin: "3vh" }}
            key={i}
            className='d-flex justify-content-center'>
            <Card>
              <Card.Title>Trasaction #{i}-SC: Submitted a Creation</Card.Title>
              <Card.Body>Creation Submission - 5 Near Tokens - Creation URL: <a href={x}>{x}</a></Card.Body>
            </Card>
          </Row>
        );
        })}
        {votedCreations.map((x, i) => {
        return (
          <Row
            style={{ margin: "3vh" }}
            key={i}
            className='d-flex justify-content-center'>
            <Card>
              <Card.Title>Trasaction #{i}-VC: Voted for Creation</Card.Title>
              <Card.Body>Vote Submission - 5 Near Tokens</Card.Body>
            </Card>
          </Row>
        );
        })}
        {votedEntries.map((x, i) => {
          return (
            <Row
              style={{ margin: "3vh" }}
              key={i}
              className='d-flex justify-content-center'>
              <Card>
                <Card.Title>Trasaction #{i}-VE: Voted for Entry</Card.Title>
                <Card.Body>Vote Submission - 5 Near Tokens</Card.Body>
              </Card>
            </Row>
          );
        })}
    </Container>
  );
};

Transactions.propTypes = {};
export default Transactions;
