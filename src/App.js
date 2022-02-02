import "regenerator-runtime/runtime";
import React from "react";
import { login, logout } from "./utils";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./global.css";
import getConfig from "./config";
const { networkId } = getConfig(process.env.NODE_ENV || "development");

// Bootstrap Components
import { Container, Row, Nav, Navbar, Card } from "react-bootstrap";

// image
import Logo from "./assets/IlluminateLogo.svg";

// components
import Transactions from "./Components/Transactions";
import Home from "./Components/Home";
import Explore from "./Components/Explore";
import Create from "./Components/Create";
import Contribute from "./Components/Contribute";
import Collaborate from "./Components/Collaborate";
import Vote from "./Components/Vote";

export default function App() {
  return (
    <Router>
      <Navbar bg='light' expand='lg'>
        <Container>
          <Navbar.Brand href='/'>
            <img src={Logo}></img>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav'/>
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='me-auto'></Nav>
            <Nav.Link href= '/'> Home </Nav.Link>
            <Nav.Link href= '/explore'> Explore </Nav.Link>
            <Nav.Link href= '/contribute'> Contribute </Nav.Link>
            <Nav.Link href='/transactions'> Transactions </Nav.Link>
            <Nav.Link onClick={window.walletConnection.isSignedIn() ? logout : login}> { window.walletConnection.isSignedIn() ? window.accountId : "Login" } </Nav.Link>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container>
        {window.walletConnection.isSignedIn() ? (
          <Row
            className='d-flex justify-content-center'
            style={{ marginTop: "10px" }}>
            <Switch>
              {/* Home Page */}
              <Route exact path='/'> 
                <Home/>
              </Route>
              {/* Explore Page */}
              <Route exact path='/explore'> 
                <Explore/>
              </Route>
              {/* Contribute Page */}
              <Route exact path='/contribute'> 
                <Contribute/>
              </Route>
              {/* Transactions Page */}
              <Route exact path='/transactions'>
                <Transactions />
              </Route>
              {/* Create Page */}
              <Route exact path='/create'> 
                <Create/>
              </Route> 
              {/* Collaborate Page */}
              <Route exact path='/collaborate'> 
                <Collaborate/>
              </Route> 
              {/* Vote Page */}
              <Route exact path='/vote'> 
                <Vote/>
              </Route>   
            </Switch>
          </Row>) : (
          <Row className='d-flex justify-content-center'>
            <Card>
              <Card.Body>
                {" "}
                <Card.Title>Please Sign In</Card.Title>
              </Card.Body>
            </Card>
          </Row> )}
      </Container>
    </Router>
  );
}
