var React = require('react');

class Register extends React.Component {
	render() {
	return (
      <html>
        <head></head>
        <body>
          <div>
          <h2>Register</h2>
            <form className="register-form" method="POST" action="/users/new">
              <input name="email" type="text" placeholder="email"/>
              <input name="password" type="password" placeholder="password"/>
              <input name="DOB" type="date" placeholder="date of birth"/>
            <input type="submit" value="Submit" />
          </form>
          </div>
        </body>
      </html>
    )
	}
}

module.exports = Register;