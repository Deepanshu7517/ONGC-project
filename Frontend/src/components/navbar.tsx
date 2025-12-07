import ongcLogo from "../assets/ONGC-Logo.png";
import assamAirLogo from '../assets/assamAirProductsLogo.png'
import "../css/global.css";

const Navbar = () => {
console.log(location);
  return (
    <div className="navbar fixed">
      
      <img src={ongcLogo} alt="ongcLogo" className="" />
      <img src={assamAirLogo} alt="assamAirLogo" className="" />
    </div>
  );
};

export default Navbar;
