import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: 'Loading...',
      email: '',
      password: ''
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

  login() {
    fetch('/api/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: this.state.email,
          password: this.state.password
        })
      }
    ).then((response) => {
      return response.json();
    }).then((json) => {
      this.setState({ message: 'Authenticated!' });
    }).catch((ex) => {
      console.log('parsing failed', ex);
    });
  }

  register() {
    fetch('/api/register',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: this.state.email,
          password: this.state.password
        })
      }
    ).then((response) => {
      return response.json();
    }).then((json) => {
      this.setState({ message: 'Registered!' });
    }).catch((ex) => {
      console.log('parsing failed', ex);
    });
  }

  render() {
    return <div>
      <h1>{ this.state.message }</h1>
      <div>
        <h3>Login</h3>
        <label>Email</label>
        <input type="text" onChange={ (e) => this.setState({ email: e.target.value })} />
        <label>Password</label>
        <input type="password" onChange={ (e) => this.setState({ password: e.target.value })} />
        <button onClick={ (e) => this.login() }>Login</button>
      </div>
      <div>
        <h3>Register</h3>
        <label>Email</label>
        <input type="text" onChange={ (e) => this.setState({ email: e.target.value })} />
        <label>Password</label>
        <input type="password" onChange={ (e) => this.setState({ password: e.target.value })} />
        <button onClick={ (e) => this.register() }>Register</button>
      </div>
    </div>;
  }
}

export default App;
