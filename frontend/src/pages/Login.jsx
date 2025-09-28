import { useState } from 'react';
import { GrNext } from "react-icons/gr";
import api from '../api';
import { Input } from "../components/ui/input";
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: "",
    });

    const [error, setError] = useState("");

    const navigate = useNavigate();

    const isEmail = (value) => /\S+@\S+\.\S+/.test(value);

    const onChange = (e) => {
        setError("");

        const { name, value } = e.target;

        if (name === "usernameOrEmail") {
        if (isEmail(value)) {
            setFormData({ ...formData, email: value.toLowerCase(), username: "" });
        } else {
            setFormData({ ...formData, username: value, email: "" });
        }
        } else {
        setFormData({ ...formData, [name]: value });
        }
  };

    const onSubmit = async (e) => {
      e.preventDefault();
      try {
        const loginRes = await api.post("/api/login/", formData);
        const userRes = await api.get("/api/user/");
        localStorage.setItem("user_id", userRes.data.pk);
        localStorage.setItem("username", userRes.data.username);
        localStorage.setItem("email", userRes.data.email);
        navigate('/main');
      } catch (err) {
        setError("User with provided credentials not found or email not verified.");
      }
    };
    
    return (
        <div className="flex justify-center items-center mt-50">
      <div className="container bg-white shadow-lg rounded-xl p-6 w-96">

        
          <form
            onSubmit={onSubmit}
            className="space-y-4 flex flex-col items-center justify-center"
          >
            <h1 className='text-xl font-semibold text-center'>Login</h1>
            <div className="group mt-4 w-3/4">
              <Input
                type="text"
                placeholder="email or username"
                name="usernameOrEmail"
                value={formData.username || formData.email}
                onChange={onChange}
                required
              />
            </div>
            <div className="group mt-4 w-3/4">
              <Input
                type="password"
                placeholder="********"
                name="password"
                value={formData.password}
                onChange={onChange}
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              className="press float-right flex items-center justify-end"
              type="submit"
              disabled={(formData.email.length < 4 && formData.username.length < 3) ||  formData.password.length < 8}
            >
              Next
              <GrNext className="w-4 h-4 ml-1" />
            </button>
          </form>
        </div>
    </div>
    )
}

export default Login;