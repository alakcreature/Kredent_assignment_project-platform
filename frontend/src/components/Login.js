import React, { Component } from "react";
import http from "./Https";
// import Swal from "sweetalert2"; 
import { Spin,Form, Input, Button, Checkbox,notification,Layout} from 'antd';
import { UserOutlined, LockOutlined,LoadingOutlined } from '@ant-design/icons';
import "./Login.css";


const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const openNotificationWithIcon = (type,message,d) => {
  console.log(type,message,d);
  notification[type]({
    message: message,
    description:
      d,
      duration:2.5
  });
};

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inview: "login page",
      login_email: "",
      login_password: "",
      register_email: "",
      register_password: "",
      register_user_name: "",
      loading:false,
      isformvisible:false
    };
  }

  toggle= (value)=>{
    this.setState({
      isformvisible:value,
      loading:value
    })
  }

  login = () => {
    
    console.log(this.state.login_email);
    console.log(this.state.login_password);
    this.toggle(true);
    http.post("/login", {
      email: this.state.login_email,
      password: this.state.login_password
    })
      .then(result => {
        this.toggle(false);
        // console.log(result.data);
        if (result.data.status) {
          this.props.login(result.data.token, "shubh");
        } else {
          // this.handlenotification(result.data.message);
          openNotificationWithIcon('warning',result.data.message,"Please try again.");
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  register = (values) => {
    this.toggle(true)
    console.log(values);
    http.post("/signup", {
      email: this.state.register_email,
      password: this.state.register_password,
      username: this.state.register_user_name
    })
      .then(result => {
        this.toggle(false);
        console.log(result);
        this.props.refresh();
        openNotificationWithIcon('success',result.data.message,"You can now login to see your progress.");
      })
      .catch(err => {
        console.log("Error" + err);
      });
  };

  render() {
    return (
      <div className="login-header">
        <h1>Platform</h1>
      <div className="login-container">
      <div className={"login-loader"+(this.state.isformvisible?" dblock":" dnone") }>
                  <Spin tip="Thanks for showing patience..."
                      spinning={this.state.loading}
                      size="large"
                      className="login-spinner" 
                      indicator={antIcon}>
                  </Spin>
              </div>
        {this.state.inview === "login page" ? (
          <div className="login-form">
              <Form name="normal_login" className="login-form" initialValues={{
                    remember: true,
                }} onFinish={this.login}
            >
              {/*Email zone*/}
              <Form.Item name="email" label="Email"
               rules={[
                  {
                      required: true,
                      message: 'Please input your Email!',
                  },
                  {
                      type: 'email',
                      message: 'The input is not valid E-mail!',
                  }
                  ]}
              >
                  <Input 
                      prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Enter your registered email id."
                      onChange={e => {
                          this.setState({ login_email: e.target.value });
                      }}
                  />
              </Form.Item>
              
              {/*Password zone*/}
              <Form.Item
                name="password" label="Password"
                rules={[
                {
                    required: true,
                    message: 'Please input your Password!',
                },
                ]}
              >
                <Input
                prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Enter your passsword."
                type="password"
                onChange={e => {
                    this.setState({ login_password: e.target.value });
                }}
                />
            </Form.Item>
              

              <Form.Item className="login-form-button">
                          <Button type="primary" htmlType="submit" className="login-form-btn1">
                          Log in
                          </Button >
                          {/* <p className="login-down"></p> */}
                          <Button type="primary" className="login-form-btn2" onClick={()=>{
                              this.setState({inview: "register page"});
                          }}>
                              Sign up
                          </Button>
              </Form.Item>

            </ Form>
          </div>  
        ) : (
            <div className="register-form">
            <Form
              name="register"
              onFinish={this.register}
            >
              <Form.Item
                  name="email"
                  label="E-mail"
                  rules={[
                    {
                      type: 'email',
                      message: 'The input is not valid E-mail!',
                    },
                    {
                      required: true,
                      message: 'Please input your E-mail!',
                    }
                  ]}
                  hasFeedback
                >
                  <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Enter your email id."
                   onChange={e => {
                  this.setState({ register_email: e.target.value });
                }}/>
                </Form.Item>

                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your password!',
                    },
                  ]}
                >
                  <Input.Password 
                  prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Create your password."
                  onChange={e => {
                  this.setState({ register_password: e.target.value });
                }}/>
                </Form.Item>

              <Form.Item 
                name="username" 
                label="Username" 
                rules={[
                  {
                    required: true,
                    message: 'Please input your name!',
                  }
                ]}
                hasFeedback
              >
                <Input 
                prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Your username."
                onChange={e => {
                  this.setState({ register_user_name: e.target.value });
                }}/>
              </Form.Item>

              <Form.Item className="register-btn">
                  <Button type="primary" htmlType="submit" className="login-form-btn1">
                    Sign Up
                  </Button>
                  <Button type="primary" className="login-form-btn2" onClick={() => {
                    this.setState({ inview: "login page" });
                  }}
              >
                Login
              </Button>
              </Form.Item>
            </Form>
          </div>
        )}
      </div>
      </div>
    );
  }
}



export default Login;
