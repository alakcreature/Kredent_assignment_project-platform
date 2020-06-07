import React, { Component } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { notification} from 'antd';
import './App.css';
// import Swal from "sweetalert2"; 
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import http from "./components/Https";

const openNotificationWithIcon = type => {
  notification[type]({
    message: 'Logged Out',
    description:
      'You have to login first.',
      duration:2.5
  });
};

export default class App extends Component {
  constructor() {
    super();
    var token = localStorage.getItem("token");
    var user_name = localStorage.getItem("user_name");
    //add token here if token is undefined.
    if (token && token.length > 0 && token !== "undefined") {
      // console.log("t " + token);
      http.defaults.headers.common["Authorization"] = "Bearer " + token;
      this.state = {
        isloggdin: true,
        token: token,
        user_name: { user_name },
        reload:0,
        count:0
      };
    } else {
      this.state = {
        isloggdin: false,
        token: null,
        user_name: {}
      };
    }
  }

  // componentDidMount() {
  //   var token = localStorage.getItem("token");
  //   console.log(this.state.token);
  // }

  componentDidUpdate() {
    // to check whether it is logged in or it is having an invalid token.
    console.log(this.state);
  }

  login = (token, user_name) => {
    http.defaults.headers.common["Authorization"] = "Bearer " + token;
    localStorage.setItem("user_name", user_name);
    localStorage.setItem("token", token);
    this.setState({
      isloggdin: true,
      token: token,
      user_name: user_name
    });
  };

  logout = () => {
    this.setState({
      count:0
    })
    localStorage.removeItem("token");
    localStorage.removeItem("user_name");
    this.setState({
      isloggdin: false,
      token: null,
      user_name: ""
    });
    openNotificationWithIcon('warning');
  };

  refreshPage = () =>{
    var newReload=this.state.reload+1;
    this.setState({reload:newReload});
  }

  changecount = ()=>{
    this.setState({
      count:1
    })
  }

  render() {
    return (
      <div className="main">
        <BrowserRouter>
          <Switch>
            <Route exact path="/">
              <Redirect to={{ pathname: "/dashboard" }} />
            </Route>
            <LoginWrapper exact path="/login" config={this.state}>
              <Login login={this.login} logout={this.logout} key={this.state.reload} refresh={this.refreshPage}/>
            </LoginWrapper>
            <PrivateRoute path="/dashboard" config={this.state}>
              <Dashboard logout={this.logout} key={this.state.reload} refresh={this.refreshPage} count={this.state.count} changecount={this.changecount}/>
            </PrivateRoute>
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

function PrivateRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        rest.config.isloggdin ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login"
            }}
          />
        )
      }
    />
  );
}

function LoginWrapper({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        !rest.config.isloggdin ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/dashboard"
            }}
          />
        )
      }
    />
  );
}




// import React from 'react';
// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
