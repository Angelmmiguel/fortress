import React from 'react';

class Login extends React.Component {
  render() {
    return <div>
      <h3>Login</h3>
      <label>Email</label>
      <input type="text" onChange={ (e) => this.setState({ email: e.target.value })} />
      <label>Password</label>
      <input type="password" onChange={ (e) => this.setState({ password: e.target.value })} />
      <button onClick={ (e) => this.login() }>Login</button>
    </div>
  }
}

export default Login;
