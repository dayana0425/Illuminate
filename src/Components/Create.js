import React, {useState, useEffect} from "react";
import IPFS from "ipfs";
import { Alert, Form, Button } from 'react-bootstrap';
import { IdType } from "near-api-js/lib/providers/provider";

export default function Create() {
    const [titleText, setTitle] = useState("");
    const [descText, setDesc] = useState("");
    const [ipfs, setIpfs] = useState(null);

    // create ipfs node
    useEffect(() => { IPFS.create().then(setIpfs);}, []);
    
    const handleSubmit = async (event) => { //charge for posting
        event.preventDefault();
        const creation = {title: {titleText}, desc: {descText}};
        const { cid } = await ipfs.add(JSON.stringify(creation));
        
        if(titleText == "" && descText == ""){
            console.log("titleText & descText are empty.");
            return;
        }

        const url = `https://dweb.link/ipfs/${cid.toString()}`; //url
        console.log("url: " + url);
        const strCID = `${cid.toString()}`; //string CID
        console.log("cid: " + cid);
        console.log("content: " + cid);
        fetch(url)
        .then(res => res.text())
        .then(text => {
            console.log(text);
        }).catch(err => console.log(err));

        // Save CID to BlockChain
        await window.contract.addCreation({
            id: url,
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

    if (!ipfs) return <h1>Loading...</h1>;
    return (
        <div className="App">
            <div className="App-header">
                <h2>Create</h2>
            </div>
            <Alert variant="secondary">
                    <h5>
                        Have an idea? Get started here!
                    </h5>
            </Alert> 
            <div>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label> Title </Form.Label>
                        <Form.Control type="input" value={titleText} placeholder="Creation Idea Title" onChange={({ target })=>setTitle(target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label> Idea Description </Form.Label>
                        <Form.Control as="textarea" value={descText} onChange={({ target })=>setDesc(target.value)} rows={3}/>
                    </Form.Group>
                    <Button variant="primary" type="submit"> 5Ⓝ to Post Idea! </Button> {/* Will Trigger a Transaction */}
                </Form>
            </div>
        </div>);}