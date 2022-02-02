import React, { useState, useEffect } from "react";
import { Alert, Container, Row, Col, Card, Button, Collapse } from "react-bootstrap";

    const Vote = (props) => {
        const [creations, changeCreations] = useState([]);
        const [content, changeContent] = useState([]);
        const [currIndex, changeIndex] = useState(0);
        const [votes, changeVotes] = useState([]);
        const [entries, changeEntries] = useState([]);
        const [entriesContent, changeEntriesContent] = useState([]);
        const [entryVotes, changeEntryVotes] = useState([]);
        const [currEntryIndex, changeEntryIndex] = useState(0);

        // voting for entries
        const [open, setOpen] = useState(false);

        useEffect(() => {
            const getInfo = async () => {
            let userCreations = await window.contract.getAllCreations();
            changeCreations(userCreations);
            let contentArray = await fetchAll(userCreations);
            let votesArray = await fetchAllVotes(userCreations);
            changeContent(contentArray);
            changeVotes(votesArray);
            let entryArray = await fetchAllEntries(userCreations);
            changeEntries(entryArray);
            let entryContent = await Promise.all(entryArray.map(u => fetchAll(u)));
            changeEntriesContent(entryContent);
            let entryVotesArray = await Promise.all(entryArray.map(u => fetchAllEntryVotes(u)));
            changeEntryVotes(entryVotesArray);
        }; getInfo();}, []);

        const fetchAll = async (urls) => {
            const res = await Promise.all(urls.map(u => fetch(u)))
            const jsons = await Promise.all(res.map(r => r.json()))
            return jsons;
        }

        const fetchAllVotes = async (urls) => {
            const res = await Promise.all(urls.map(u => window.contract.getAllCreationVotes({cid: u}) ))
            return res;
        }

        const fetchAllEntryVotes = async (urls) => {
            const res = await Promise.all(urls.map(u => window.contract.getAllEntryVotes({eid: u}) ))
            return res;
        }

        const fetchAllEntries= async (urls) => {
            const res = await Promise.all(urls.map(u => window.contract.getEntries({cid: u}) ))
            return res;
        }

        const handlePublish = async (event) => {
            let publish = await window.contract.publish({
                cid: creations[0], 
                eid: entries[0][0]
            });

            alert("Work is Published!");
            window.location.reload();
        }

        const handleEntryVote = async (event) => {
            console.log("handle EntryVote");
            console.log(currIndex)
            console.log(currEntryIndex)
            console.log(entries[currIndex][currEntryIndex]);
            await window.contract.handleEntryVote({ // user => voted entries, entries => votes
                user: window.accountId,
                eid: entries[currIndex][currEntryIndex]
            });

            await window.contract.transferNearTokens({
                account: "illuminate.testnet",
                amount: window.utils.format.parseNearAmount("5")
            });

            alert("Vote Completed! 5Ⓝ was subtracted from your account.");
            window.location.reload(); // save CID to blockchain and content to ipfs
        }

        const handleVote = async (event) => {
            await window.contract.handleVote({
                user: window.accountId,
                cid: creations[currIndex]
            });

            await window.contract.transferNearTokens({
                account: "illuminate.testnet",
                amount: window.utils.format.parseNearAmount("5"),
            });

            alert("Vote Completed! 5Ⓝ was subtracted from your account.");
            window.location.reload(); // save CID to blockchain and content to ipfs
        }

        return (
            <div className="App">
                <div className="App-header">
                    <h2>Vote</h2>
                </div>
                    <Alert variant="secondary">
                        <h5>
                            Not a writer? You can help by voting for your favorite written works.          
                        </h5>
                    </Alert>
                    <Container>
                    {(content.length > 0 ? content.map((x,i) =>{
                        return(
                            <Row
                                style={{ marginBottom: '1vh' }}
                                key={i}
                                onClick={(e)=>{changeIndex(i)}} // keeps track of current index
                                className='d-flex justify-content-center'>
                                    <Card>
                                    <Card.Title>Creation #{i}, Title: {x.title.titleText} </Card.Title>
                                    <Card.Body> 
                                    Description: {x.desc.descText}
                                    <br></br>
                                    Votes: {votes[i]}
                                    </Card.Body>
                                    <Col>
                                    <Button onClick={(e)=>{handleVote(e)}}>5Ⓝ to Vote!</Button>
                                    <Button style={{ marginLeft: "1vh" }} 
                                            variant="secondary"
                                            onClick={() => setOpen(!open)}
                                            aria-controls="example-collapse-text"
                                            aria-expanded={open}
                                            > View Entries </Button>
                                    <Button
                                    onClick={(e)=>{handlePublish(e)}} 
                                    variant="danger" style={{ marginLeft: "1vh" }}>Publish</Button>
                                    </Col>
                                    <br></br>
                                    <Collapse style={{ margin: "3vh" }} in={open}>
                                        <div id="example-collapse-text">
                                        {(entriesContent[i] !== undefined) ? entriesContent[i].map((u,k) => {
                                            return(
                                            <Row
                                                onClick={(e)=>{changeEntryIndex(k)}}
                                                key={k}>
                                                <Card style={{ marginBottom: '1vh', flex:1, backgroundColor:'lightBlue'}}>
                                                <Card.Title>Entry #{k}, Title: {u.title.entryTitle} </Card.Title>
                                                    <Card.Body> 
                                                    {u.text.entryText}
                                                    <br></br>
                                                    </Card.Body>
                                                    <h6 style={{ marginLeft: '1vh'}}> Votes: {entryVotes[i] !== undefined ? entryVotes[i][k] : ""}</h6>
                                                    <Col>
                                                        <Button onClick={(e)=>{handleEntryVote(e)}} variant= "primary" style={{ marginBottom: '1vh'}}>5Ⓝ to Vote!</Button>
                                                    </Col>
                                                </Card>
                                            </Row>
                                            );}) : "Loading..."}
                                        </div>
                                    </Collapse>
                                </Card>
                            </Row>
                        )
                    }): "Loading...")}
                    </Container>
            </div>);
        };

export default Vote;