import React from "react";
import { Link } from "react-router-dom";
import { Button, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import '../css/NotLoggedIn.css'; // Import nowego pliku CSS

const NotLoggedIn = () => {
    return (
      <Container className="d-flex flex-column justify-content-center align-items-center vh-100 notloggedin-background">
        <div className="notloggedin-card">
          <h2>You have to be logged in to access this page</h2>
          <p className="notloggedin-text">Please log in to continue.</p>
          <Link to="/login">
            <Button variant="primary" className="mt-3">Log In</Button>
          </Link>
        </div>
      </Container>
    );
  };
  


export default NotLoggedIn;
