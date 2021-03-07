import { renderRoutes } from "react-router-config";
import { Link } from "react-router-dom";
import { Layout, Menu, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import "./Main.scss";

const { Header, Sider, Content } = Layout;

const { SubMenu } = Menu;

const Child = ({ route }) => (
  <div>
    <Layout>
      <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
        <div className="logo">Pro Management</div>
        <div className="login-out">
          <Button type="primary">
            <Link to="/">退出</Link>
          </Button>
        </div>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
          <Menu.Item key="1">nav 1</Menu.Item>
          <Menu.Item key="2">nav 2</Menu.Item>
          <Menu.Item key="3">nav 3</Menu.Item>
        </Menu>
      </Header>
      <Layout style={{ padding: "0 0", marginTop: 64 }}>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            style={{ height: "100%", borderRight: 0 }}
          >
            <SubMenu key="sub1" icon={<UserOutlined />} title="subnav 1">
              <Menu.Item key="1">
                <Link to="/app/list">Dashbord</Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="/app/data">Nodes Data</Link>
              </Menu.Item>
              <Menu.Item key="3">
                <Link to="/app/datav3">datav3</Link>
              </Menu.Item>
              <Menu.Item key="4">
                <Link to="/app/connection">connection</Link>
              </Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Content
          className="site-layout-background"
          style={{
            padding: 15,
            margin: 0,
            minHeight: 900,
          }}
        >
          {/* child routes won't render without this */}
          {renderRoutes(route.routes, {
            someProp: "these extra props are optional",
          })}
        </Content>
      </Layout>
    </Layout>
  </div>
);
export default Child;
