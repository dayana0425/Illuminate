import React from "react";
import { Alert } from "react-bootstrap"

const Home = (props) => {

  return (
    <div className="App">
        <div className="App-header">
            <h2>Welcome to Illuminate!</h2>
        </div>
            <Alert variant="secondary">
                    <p>
                        Illuminate is a platform built on the NEAR blockchain that promotes quality, collaborative and decentralized written content!
                    </p>
                    <h5> Quality </h5>
                    <p>
                        Quality written content is incentivized with NEAR tokens.
                    </p>
                    <h5> Collaborative </h5>
                    <p>
                        The content on Illuminate is not written by a single author but multiple authors that were voted upon by users.
                    </p>
                    <h5> Decentralized </h5>
                    <p>
                        The content on Illuminate is decentralized meaning that all contributions to a work that gets published are decided not by a publishing house but through a true democracy voting system.
                    </p>
            </Alert>
    </div>);
};

export default Home;
