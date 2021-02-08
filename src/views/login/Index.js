import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useHistory } from "react-router-dom";

const NormalLoginForm = () => {
  const history = useHistory();
  const onFinish = (values) => {
    history.push("/app/list")
    console.log('values: ', values);
  };

  return (
    <div style={{
      padding: "120px 0 0"
    }}>
      <div style={{
      width: "400px",
      padding: "20px 60px 80px",
      margin: "0 auto",
      background: "#fafafa",
      borderRadius: "10px",
      boxShadow: "2px 2px 5px #ddd",
      border: "1px solid #ddd"
    }}>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <h3 style={{
            margin: "30px 0 20px 0"
          }}>Business Management System</h3>
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="admin"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="admin"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <a className="login-form-forgot" href="">
              Forgot password
            </a>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
            <span style={{
              margin: "0 0 0 6px"
            }}>Or</span> <a href="">register now!</a>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default NormalLoginForm;