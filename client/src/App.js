import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: 'Loading...'
    }
  }

  componentDidMount() {
    fetch('/api')
      .then((response) => {
        return response.json()
      }).then((json) => {
        this.setState({ message: json.message });
      }).catch((ex) => {
        console.log('parsing failed', ex);
      });
  }

  render() {
    return <h1>{ this.state.message }</h1>;
  }
}

export default App;
