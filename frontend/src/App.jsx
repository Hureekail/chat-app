import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { Provider } from 'react-redux';
import { GlobalAlert } from "./components/Alert";
import Start from "./pages/Start";
import store from "./store";
import Register from "./pages/Register";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import ProtectedRoute from "./components/ProtectedRoute";
import Main from "./pages/Main";

function App() {
  return (
      <Provider store={store}>
          <Router>
              <GlobalAlert />
              <Routes>
                <Route path="/" element={<Start />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/verify-email/:key" element={<VerifyEmail />} />

                  <Route path="/main" element={<Main/>} />

              </Routes>
          </Router>
      </Provider>
  );
}

export default App;