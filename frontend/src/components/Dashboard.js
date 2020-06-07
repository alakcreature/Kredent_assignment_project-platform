import React, { Component } from 'react'
import { 
  notification,
  Layout,
  Card,
  Modal,
  Spin,
  Form,
  Button,
  Input,
  Alert
} from 'antd';
import { LogoutOutlined,LoadingOutlined,QuestionOutlined,CheckCircleTwoTone,SettingTwoTone } from '@ant-design/icons';
import Swal from "sweetalert2"; 
import http from "./Https";
import './Dashboard.css';
const { Header, Footer, Content } = Layout;

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const openNotificationWithIcon = type => {
  notification[type]({
    message: 'Logged In',
    description:
      'Now you can see all posts.',
      duration:2.5
  });
};
const openNotification2 = (type,message) => {
  notification[type]({
    message: message,
    description:
      "",
      duration:2.5
  });
};


class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible:false,
            addloader:false,
            commentvisble:false,
            commentmodalvisible:false,
            commentloader:false,
            new_post:"",
            new_comment:"",
            post_id:"",
            username:"",
            isnewUserVisible:false,
            allposts:[]
            
        };
      }

      showModal = () => {
        this.setState({
          visible: true
        });
      };
      
      showModal2 = () => {
        this.setState({
          commentvisble: true,
        });
      };
    
      handleCancel = e => {
        // console.log(e);
        this.setState({
          visible: false,
          commentvisible:false
        });
      };

      handleCancel2 = e => {
        // console.log(e);
        this.setState({
          commentvisble: false,
        });
      };
    
      handlealert= (message) =>{
        Swal.fire({
          title: `${message}. Now grab some more.`,
          width: 600,
          padding: '3em',
          timer:3000,
          background: '#fff url(https://mcdn.wallpapersafari.com/medium/5/84/LbshI7.jpg)',
          backdrop: `
            rgba(0,0,0,0.4)
            url("https://cdnb.artstation.com/p/assets/images/images/002/134/473/original/kieran-williamson-run-anim.gif?1457702833")
            left top
            no-repeat
          `
        })
      }

      posttoggle = (value)=>{
        this.setState({
          ismodalvisible:value,
          addloader:value
        })
      }
      
      toggle=(value)=>{
        this.setState({
          commentmodalvisible:value,
          commentloader:value
        })
      }
    
      fetchallposts = () => {
        // this.handlenotification("Logged In");
        openNotificationWithIcon('success');
        this.toggle(true);
          http
            .get("/fetchallposts")
            .then(result=> {
              this.toggle(false);
              if(result.data.message==="Invalid token"){
                this.props.logout();
              }
              // console.log(result.data.data)
              this.setState({
                allposts:result.data.data.data,
                username:result.data.data.username
              })
              if(this.state.allposts.length===0){
                this.setState({
                  isnewUserVisible:true
                })
              }else{
                this.setState({
                  isnewUserVisible:false
                }) 
              }
              console.log(this.state.allposts);
            })
            .catch(err=>{
                console.log(err);
            });
      }

      addpost = (values) => {
        this.posttoggle(true);
        console.log(this.state.new_post);
          http
            .post("/addpost",{
                post_data:this.state.new_post
            })
            .then(result => {
              this.posttoggle(false);
              console.log(result);
                console.log(result.data.message);
                openNotification2('success',result.data.message);
                this.props.refresh();
            })
            .catch(err=> {
              this.posttoggle(false);
              openNotification2('error',err)
                console.log(err);
            })
      }

      addcomment = () => {
        // add comment
        console.log(this.state.new_comment);
        this.toggle(true);
        http
            .post("/addcomment",{
                new_comment:this.state.new_comment,
                post_id:this.state.post_id
            })
            .then(result => {
              this.toggle(false);
              console.log(result);
                // console.log(result.data.message);
                openNotification2('success',result.data.message);
                this.props.refresh();
            })
            .catch(err=> {
              this.toggle(true);
              openNotification2('error',err);
                console.log(err);
            })
      }

    
    onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };


    componentDidMount() {
    this.fetchallposts();
    }


    render() {
        
        return (
            <div className="dashboard_container">
              <Layout>
                <Header>
                    <div className="header">
                        <h1>Platform</h1>
                        <p className="username">Username:{this.state.username}</p>
                        <LogoutOutlined className="i" onClick={this.props.logout}/>
                    </div>
                </Header>
                <Content>
                <Modal
                        title="Add New Post"
                        visible={this.state.visible}
                        okButtonProps={{ disabled: true }}
                        onCancel={this.handleCancel}
                        >
                            <div className={"add-loading-form" +(this.state.ismodalvisible?" dblock":" dnone")}>
                                <Spin tip="Adding your post..." spinning={this.state.addloader} size="large" className="dashboard-spinner" indicator={antIcon}>
                                </Spin>
                            </div>
                            <Form
                            id="form-i"
                            className="ant-form"
                            name="basic"
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={this.addpost}
                            onFinishFailed={this.onFinishFailed}
                            >
                            <Form.Item 
                            label="Write Something..."
                            name="new_post"
                              rules={[
                              {
                                  required: true,
                                  message: 'Write your post here.',
                              },
                              ]}
                            >
                              <Input onChange={(e)=>{
                                this.setState({new_post:e.target.value})
                              }}/>
                            </Form.Item>

                            

                            <Form.Item >
                                <Button type="primary" htmlType="submit">
                                Add Post
                                </Button>
                            </Form.Item>
                            </Form>

                    </Modal>
                  <div className="site-card-wrapper">
                  <button className="add" onClick={this.showModal}>Add New Post</button>
                  <Modal
                        title="Add New Comment"
                        visible={this.state.commentvisible}
                        okButtonProps={{ disabled: true }}
                        onCancel={this.handleCancel}
                        >
                            <div className={"add-loading-form" +(this.state.commentmodalvisible?" dblock":" dnone")}>
                                <Spin tip="Adding your comment..." spinning={this.state.commentloader} size="large" className="dashboard-spinner" indicator={antIcon}>
                                </Spin>
                            </div>
                            <Form
                            id="form-i"
                            className="ant-form"
                            name="basic"
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={this.addcomment}
                            onFinishFailed={this.onFinishFailed}
                            >
                            <Form.Item 
                            label="Write Something..."
                            name="new_post"
                              rules={[
                              {
                                  required: true,
                                  message: 'Write your post here.',
                              },
                              ]}
                            >
                              <Input onChange={(e)=>{
                                this.setState({new_comment:e.target.value})
                              }}/>
                            </Form.Item>

                            

                            <Form.Item >
                                <Button type="primary" htmlType="submit">
                                Add Comment
                                </Button>
                            </Form.Item>
                            </Form>

                    </Modal>
                  {/* {this.state.allposts.length===0?<p>Add the first ever post.</p>:""} */}
                  <div className={"newUser"+(this.state.isnewUserVisible?" dblock":" dnone")}>
                    <Alert 
                        message="Warning" 
                        description="Add the first ever post." 
                        type="warning" 
                        showIcon 
                        closable
                    />
                  </div>
                  {this.state.allposts.map((item,index)=>(
                    <Card title={`Post ${index+1}`} key={index} bordered={false} style={{ width: "100%" }}>
                        <p>{item.post_data}</p>
                        <Button type="primary" style={{marginBottom:"3px"}} onClick={()=>{
                            this.setState({
                              commentvisible:true,
                              post_id:item._id
                            })
                          }}>Add new comment</Button>
                        <div className="comment-section">
                          {item.comments.length===0?
                            <p>You can add comments here.</p>:""
                          }
                          {item.comments.map((sub_item,index)=>(

                            <p key={index}>{sub_item.comment}</p>
                          ))}
                          {/* <p>Comment 1</p>
                          <p>Comment 1</p>
                          <p>Comment 1</p> */}
                        </div>
                    </Card>  
                  ))}
                  </div>
                </Content>
              </Layout>
            </div>
        )
    }
}

export default Dashboard;