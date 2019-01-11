import React, {Component} from "react";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import "./App.css";
import Routes from "./Routes";
import 'react-web-tabs/dist/react-web-tabs.css';
import makanow from './containers/images/makanow.png';
import activitylog from './containers/images/activitylog.png';
import logout from './containers/images/logout.png';
import menu from './containers/images/menu.png';
import Img from "react-image";

class App extends Component {

    constructor(){
        super();
        this.state={
            displayLogout: false
        }
        this.logout = this.logout.bind(this);
    }

    logout() {
        sessionStorage.setItem("UserData", '');
        sessionStorage.clear();
        this.setState({displayLogout: false});
    }

    render() {

        if(sessionStorage.getItem("userData")){

            let user = JSON.parse(sessionStorage.getItem("userData"));

            return (
                <div className="App container">
                    <div class="sidenav">
                        <div className="title_img">
                            <Img style = {{width: 200, height: 200}} src={makanow} resizeMode="contain" />
                        </div>
                        <div className="title_img">
                            <a href="/MainPage">
                                <Img style = {{width: 20, height: 20}} src={menu} resizeMode="contain"/> Menu</a>
                        </div>
                        <div className="title_img">
                            <a href="/ActivityLog">
                                <Img style = {{width: 20, height: 20}} src={activitylog} resizeMode="contain"/> Activity Log</a>
                        </div>
                        <div className="title_img">
                            <a href="" onClick={this.logout}>
                                <Img style = {{width: 20, height: 20}} src={logout} resizeMode="contain" />Logout</a>
                        </div>
                    <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/><br/>
                        <br/>
                        <br/><br/>
                        <br/>
                        <br/><br/>
                        <br/>
                        <br/><br/>
                        <br/>
                        <div className="h3">
                        <h3 align="center">Manager {user.firstName}</h3>
                        </div>
                    </div>

                   {/* <Navbar fluid collapseOnSelect>
                        <Navbar.Header>
                            <Navbar.Brand>
                                Welcome, Manager {user.firstName}!
                            </Navbar.Brand>
                            <Navbar.Toggle />
                        </Navbar.Header>
                        <Navbar.Collapse>
                        <Nav pullRight>
                            <NavItem href="/MainPage">Home</NavItem>
                            <NavItem href="/ActivityLog">Activity Log</NavItem>
                            <LinkContainer to="/">
                                <NavItem onClick={this.logout}>Logout</NavItem>
                            </LinkContainer>
                        </Nav>
                        </Navbar.Collapse>
                    </Navbar>*/}

                    <Routes />
                </div>
            );
        }

        return (
            <div className="App container">
                <Routes />
            </div>
        );
    }
}


export default App;