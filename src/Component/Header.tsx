import React from "react";

const Headers = () => {

    return(
        <nav className="navbar">

        <div style={{ color: "#0799c1", fontSize: "50px", marginRight: "100px" }}>
          <b>EasyMed</b>
        </div>
        <ul className="nav-links">
          <li><a href="/" >Home</a></li>
        </ul>
        <ul className="nav-links">
          <li><a href="#" >First Aid</a></li>
        </ul>
        <ul className="nav-links">
          <li><a href="#" >Contact Us</a></li>
        </ul>
        <div className="login-btn">
          <a href="/login">Login</a>
        </div>
        <div className="login-btn">
          <a href="/signUp">Sign Up</a>
        </div>
      </nav>
    )
}

export default Headers;