import React from "react";
class HelloMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      second: 0,
    };
  }

  tick() {
    this.setState((state) => ({
      seconds: state.seconds + 1,
    }));
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return <div>{this.state.second}</div>;
  }
}

export default HelloMessage;
