var React = require("react");

class Delete extends React.Component {
  render() {
    return (
      <html>
        <head/>
        <body>
          <form
            className="pokemon-form"
            method="POST"
            action={"/pokemon/"+ this.props.pokemon.id + "?_method=DELETE"}
          >
          <div>
            <img src= {this.props.pokemon.img}/>
            <h1>Deleting: {this.props.pokemon.name}</h1>
            <ul className="pokemon-list">
              <li className="pokemon-attribute">
                name: {this.props.pokemon.name}
              </li>
              <li className="pokemon-attribute">
                id: {this.props.pokemon.id}
              </li>
              <li className="pokemon-attribute">
                num: {this.props.pokemon.num}
              </li>
              <li className="pokemon-attribute">
                height: {this.props.pokemon.height}
              </li>
              <li className="pokemon-attribute">
                weight: {this.props.pokemon.weight}
              </li>
            </ul>
          </div>
            <input value="DELETE POKEMON" type="submit" />
          </form>
        </body>
      </html>
    );
  }
}

module.exports = Delete;
