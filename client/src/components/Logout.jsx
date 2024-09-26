import axios from "axios";
import { Link } from "react-router-dom";

function Logout({ removeToken }) {
  // const { removeToken } = UseToken();

  function logout() {
    try {
      axios
        .post("http://localhost:5000/logout")
        .then((response) => {
          response.data.access_token = removeToken();
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
