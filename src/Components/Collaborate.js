import React, { useState, useEffect } from "react";
import { Alert, Container, Row, Card, Button, Modal, Form } from "react-bootstrap";
import IPFS from "ipfs";

const Collaborate = (props) => {
    //ipfs setup
    const [ipfs, setIpfs] = useState(null);
    useEffect(() => { IPFS.create().then(setIpfs);}, []);

    // blockchain comms
    const [creations, changeCreations] = useState([]);
    const [content, changeContent] = useState([]);
    const [currIndex, changeIndex] = useState(0);

    //modal state
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // entry state
    const [entryTitle, setTitle] = useState("");
    const [entryText, setDesc] = useState("");

    useEffect(() => {
        const getInfo = async () => {
        let allCreations = await window.contract.getAllCreations();
        changeCreations(allCreations);
        let contentArray = await fetchAll(allCreations);
        changeContent(contentArray);
    }; getInfo();}, []);

    const fetchAll = async (urls) => {
        const res = await Promise.all(urls.map(u => fetch(u)))
        const jsons = await Promise.all(res.map(r => r.json()))
        return jsons;
    }

    const handleSubmit = async (event) => { //charge for posting
        event.preventDefault();
        const entry = {title: {entryTitle}, text: {entryText}};
        const { cid } = await ipfs.add(JSON.stringify(entry));
        const eid = cid;
        console.log("eid- --- " +  eid) 
        if(entryText == "" && entryTitle == ""){
            console.log("titleText & entryText are empty.");
            return;
        }

        const url = `https://dweb.link/ipfs/${eid.toString()}`; //url
        console.log("eid url: " + url);

        fetch(url)
        .then(res => res.text())
        .then(text => {
            console.log("eid content: " + text);
        }).catch(err => console.log(err));

        // Save EID to BlockChain
        console.log("cid " + currIndex);
        await window.contract.addEntryToCreation({
            cid: creations[currIndex],
            eid: url,
        });

        // Write Code to Send NEAR To Recipient
        await window.contract.transferNearTokens({
            account: "illuminate.testnet",
            amount: window.utils.format.parseNearAmount("5"),
        });

        // Send Alert once transaction is finished. 
        alert("Idea Posted! 5Ⓝ was subtracted from your account.");
        window.location.reload(); // save CID to blockchain and content to ipfs
    };

    if (!ipfs) return <h1>Loading...</h1>
    return (
        <div className="App">
            <div className="App-header">
                <h2>Collaborate</h2>
            </div>
                <Alert variant="secondary">
                        <h5>
                            Are you a writer? Be a collaborator to works in progress.
                        </h5>
                </Alert> 
                <Container>
                    {(content.length > 0 ? content.map((x,i) =>{
                        return(
                            <Row style={{ margin: "3vh" }}
                                    key={i}
                                    onClick={(e)=>{changeIndex(i)}} // keeps track of current index
                                    className='d-flex justify-content-center'>
                                    <Card>
                                        <Card.Title>Creation #{i}, Title: {x.title.titleText} </Card.Title>
                                            <Card.Body> 
                                            Description: {x.desc.descText}
                                            <br></br>
                                            </Card.Body>
                                    <Button onClick={handleShow}>5Ⓝ to Collaborate!</Button>
                                    <Modal backdrop='static' show={show} onHide={handleClose}>
                                        <Modal.Header>
                                            <Modal.Title>Submit Entry</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <Form>
                                                <Form.Group className="mb-3">
                                                    <Form.Label> Entry Title </Form.Label>
                                                    <Form.Control 
                                                        type="input" 
                                                        value={entryTitle} 
                                                        placeholder="Add Title to Entry"
                                                        onChange={({ target })=>setTitle(target.value)}/>
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Label> Entry Text </Form.Label>
                                                    <Form.Control 
                                                        as="textarea" 
                                                        value={entryText} 
                                                        onChange={({ target })=>setDesc(target.value)}
                                                        rows={3}/>
                                                </Form.Group>
                                            </Form>
                                        </Modal.Body>
                                        <Modal.Footer>
                                        <Button variant="secondary" onClick={handleClose}>
                                            Close
                                        </Button>
                                        <Button type= "submit" variant="primary" onClick={(e)=>handleSubmit(e)}>
                                            5Ⓝ to Submit Entry!
                                        </Button>
                                        </Modal.Footer>
                                    </Modal>
                                </Card>
                            </Row>)}): "Loading...")}
                    </Container>
        </div>);
};

export default Collaborate;