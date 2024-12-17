/**
 * Created by Barry Chen
 * 260952566
 */
import NavBar from "../../components/NavBar";
import { Outlet } from "react-router-dom";
import "./style.css";

export default function AppLayout() {
  return (
    <div className="layout-wrapper">
      <NavBar />
      <div className="content-page">
        <Outlet />
      </div>
    </div>
  );
}
