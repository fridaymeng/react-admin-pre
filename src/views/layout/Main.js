import { Layout } from 'antd';
import { renderRoutes } from "react-router-config";

const { Header, Footer, Sider, Content } = Layout;

const Child = ({ route }) => (
  <div>
    <Layout>
      <Header>Header</Header>
      <Layout>
        <Sider>Sider</Sider>
        <Content>
          {/* child routes won't render without this */}
          {renderRoutes(route.routes, { someProp: "these extra props are optional" })}
        </Content>
      </Layout>
      <Footer>Footer</Footer>
    </Layout>
  </div>
);
export default Child