import React from "react";
import { Alert } from "react-bootstrap"
import { BrowserRouter as Router } from "react-router-dom";

const Contribute = (props) => {
  return (
    <div className="App">
        <div className="App-header">
            <h2>Create, Collaborate, and Vote. </h2>
        </div>
            <Alert variant="secondary">
                    <h5>How can I contribute?</h5>
                    <p>
                        On Illuminate you can contribute in multiple ways as long as you have NEAR tokens. <br></br>
                        You can choose to <b>create</b> content ideas to propose the content you want to read and for writers to collaborate on. <br></br>
                        You can <b>collaborate</b> on works in progress by submitting entries to existing works. You can submit entries for <i>all</i> aspects of an existing work! <br></br> 
                        And you can <b>vote</b> for entries that you want to make the final cut. <br></br>
                        You need NEAR tokens to be able to post creation ideas, post collaboration entries, and to vote. Think of it as an initial investment. <br></br>
                    </p>
                    <h5>What's in it for me?</h5>
                    <p>
                        All contributors of a completed work who make the final cut are added to a pool. Once the work gets added to the explore page and users choose to buy the work then all contributors will get compensated.
                        For a work to be considered completed. It needs atleast 100 approvals. 
                    </p>
            </Alert>
            <Router>
                <ul>
                    <li><a href="/create">Create</a></li>
                    <li><a href="/collaborate">Collaborate</a></li>
                    <li><a href="/vote">Vote</a></li>
                </ul>
            </Router>
    </div>);
};

export default Contribute;