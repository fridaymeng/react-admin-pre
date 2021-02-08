import React from "react";
import { Statistic, Card, Row, Col } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

class HelloMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      active: 0,
      idle: 0,
    };
  }

  tick() {
    const value = (Math.random() * 100).toFixed(2);
    this.setState((state) => ({
      count: state.count + 1,
      active: value,
      idle: 100 - value,
    }));
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div>
        <div className="site-statistic-demo-card">
          <Row gutter={16}>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Active"
                  value={this.state.active}
                  precision={2}
                  valueStyle={{ color: "#3f8600" }}
                  prefix={<ArrowUpOutlined />}
                  suffix="%"
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Idle"
                  value={this.state.idle}
                  precision={2}
                  valueStyle={{ color: "#cf1322" }}
                  prefix={<ArrowDownOutlined />}
                  suffix="%"
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Count"
                  value={this.state.count}
                  valueStyle={{ color: "#111" }}
                />
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default HelloMessage;
