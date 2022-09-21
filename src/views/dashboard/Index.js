import React from "react";
import { Statistic, Card, Row, Col } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Countdown } = Statistic;
class HelloMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      active: 0,
      idle: 0,
      deadline: Date.now() + 1000 * 60 * 60 * 24 * 1,
      data: [],
      path: "",
    };
    this.handleFile = this.handleFile.bind(this);
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

  handleFile(file) {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      console.log(e.target.result);
    };
    // readAsBinaryString：按字节读取文件内容，结果用ArrayBuffer对象表示
    // readAsArrayBuffer：按字节读取文件内容，结果为文件的二进制串
    // readAsDataURL：读取文件内容，结果用data:url的字符串形式表示
    // readAsText：按字符读取文件内容，结果用字符串形式表示
    fileReader.readAsArrayBuffer(file);
  }

  render() {
    return (
      <div>
        <div className="site-statistic-demo-card">
          <Row gutter={16}>
            <Col span={6}>
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
            <Col span={6}>
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
            <Col span={6}>
              <Card>
                <Statistic
                  title="Count"
                  value={this.state.count}
                  valueStyle={{ color: "#111" }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Countdown
                  format="HH:mm:ss:SSS"
                  title="Deadline"
                  value={this.state.deadline}
                />
              </Card>
            </Col>
          </Row>
          <div
            style={{
              background: "#fff",
              padding: "20px",
              margin: "10px 0 0 0",
            }}
          >
            <Upload beforeUpload={this.handleFile}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </div>
        </div>
      </div>
    );
  }
}

export default HelloMessage;
