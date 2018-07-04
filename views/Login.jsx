var React = require('react');

class Login extends React.Component {
	render() {
	return (
      <html>
        <head></head>
        <body>
          <div>
          <h2>Login</h2>
            <form className="login-form" method="POST" action="/users/login">
		      <input name="email" type="text" placeholder="email"/>
              <input name="password" type="password" placeholder="password"/>
            <input type="submit" value="Submit" />
          </form>
          </div>
        </body>
      </html>

	)
	}
}

module.exports = Login;