import axios from "axios";
import NavBar from "./NavBar";
import { Link } from "react-router-dom";

function Logout(props) {
  function logout() {
    try {
      axios
        .post("http://localhost:5000/logout")
        .then((response) => {
          props.token();
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    } finally {
      console.log("Logout attempt");
    }
  }

  return (
    <li className="navbar-item">
      <Link className="navbar-link" onClick={logout} to="/">
        Logout
      </Link>
    </li>
  );
}

export default Logout;
