import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import New from "./pages/new/New";
import Single from "./pages/single/Single";
import Links from "./pages/link/Links";
import Landing from "./pages/landing/Landing";
import VerifyPage from './VerifyPage';
import SuccessPage from './SuccessPage'
import Pay from "./Pay";
import ProtectedRoute from "./component/utlis/ProtectedRoute";
import Utm from "./pages/utm/Utm";
import Edit from "./pages/editlink/Edit";
export default function App() {
  return (
    <Routes>
      <Route path="/" >
        <Route index element={<Landing />} />
        <Route path="dashboard" element={<ProtectedRoute>
          <Dashboard/>
        </ProtectedRoute>}/>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="pay" element={<Pay />} />
        <Route path="links/">
          <Route index element={<Links />} />
          <Route path=":linkId" element={<Single />} />
          <Route path="add" element={<New />} />
          <Route path='utm' element={<Utm />} />
          <Route path='update/:linkId' element={<Edit/>}/>
        </Route>
      
        <Route path="verify" element={<VerifyPage />} />
      </Route>

      <Route path="/success" element={<SuccessPage/>}/>
    </Routes>
  );
}
