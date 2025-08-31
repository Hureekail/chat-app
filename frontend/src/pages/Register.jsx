import { useState, useEffect, useRef } from "react";
import { GrNext } from "react-icons/gr";
import api from "../api";
import { Input } from "../components/ui/input";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    username: "",
    password1: "",
    password2: "",
    email: "",
  });

  const navigate = useNavigate();

  const [UsernameTaken, setUsernameTaken] = useState(null); 
  const cacheRef = useRef({}); // local cache to avoid duplicate requests

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContinue = (e) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStep(step + 1);
    api.post("/api/", formData)
      .then((res) => {

      })
      .catch((err) => {
        console.error("Registration error");
      });
  };


  const passwordRules = [
    { label: "At least 8 characters", test: (pw) => pw.length >= 8 },
    { label: "Uppercase letter", test: (pw) => /[A-Z]/.test(pw) },
    { label: "Any number", test: (pw) => /\d/.test(pw) },
    { label: "Should match", test: (pw) => pw === formData.password2 },
    {
      label: "No unusual symbols or emojis",
      test: (pw) => /^[\x20-\x7E]*$/.test(pw), // only printable ASCII characters
    },
  ];

  const usernameRules = [
    { label: "At least 3 characters", test: (usr) => usr.length >= 3 },
    {
      label: "No unusual symbols or emojis",
      test: (usr) => /^[\x20-\x7E]*$/.test(usr),
    },
  ];

  const emailRules = [
    {label: "No unusual symbols or emojis", test: (email) => /^[\x20-\x7E]*$/.test(email)},
    {label: "Valid email format", test: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)},
    {label: "Maximum 50 characters", test: (email) => email.length <= 50},
  ];

  useEffect(() => {
    const username = formData.username.trim();
    if (username.length < 3) {
      setUsernameTaken(null);
      return;
    }

    if (cacheRef.current[username] !== undefined) {
      setUsernameTaken(cacheRef.current[username]);
      return;
    }

    const timeout = setTimeout(() => {
      api.get(`/api/check-username/?username=${encodeURIComponent(username)}`)
        .then((res) => {
            setUsernameTaken(res.data.is_taken);
            cacheRef.current[username] = res.data.is_taken;
        })
        .catch(() => setUsernameTaken(null));
    }, 500); // debounce delay

    return () => clearTimeout(timeout);
  }, [formData.username]);

  return (
    <div className="flex justify-center items-center mt-50">
      <div className="container bg-white shadow-lg rounded-xl p-6 w-96">

        {step === 1 && (
          <form
            onSubmit={handleContinue}
            className="space-y-4 flex flex-col items-center justify-center"
          >
            <h1>Create Username</h1>
            <div className="group mt-4 w-3/4">
              <Input
                type="text"
                placeholder="vladik_gadik1234"
                name="username"
                value={formData.username}
                onChange={onChange}
                required
              />
            </div>

            <div>
            {formData.username.length > 0 && (
                <div className="mb-4">
                    <ul className="text-sm text-red-500 list-disc list-inside">
                    {usernameRules
                        .filter((rule) => !rule.test(formData.username))
                        .map((rule) => (
                        <li key={rule.label}>{rule.label}</li>
                        ))}

                    {formData.username.length >= 3 && UsernameTaken && (
                        <li>This username is taken</li>
                    )}
                    </ul>
                </div>
            )}
            </div>

            <button
              className="press float-right flex items-center justify-end"
              type="submit"
              disabled={!formData.username || UsernameTaken === true || !usernameRules.every((rule) => rule.test(formData.username))}
            >
              Next
              <GrNext className="w-4 h-4 ml-1" />
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleContinue} className="space-y-4 flex flex-col items-center justify-center">
            <h1>Create secure password</h1>
            <div className="group mt-4 w-3/4">
              <Input
              placeholder="••••••••"
                type="password"
                name="password1"
                value={formData.password1}
                onChange={onChange}
                required
              />
            </div>
            <div className="group w-3/4">
              <Input
                placeholder="••••••••"
                type="password"
                name="password2"
                value={formData.password2}
                onChange={onChange}
                required
              />
            </div>

            {formData.password1.length > 0 &&
              passwordRules.some((rule) => !rule.test(formData.password1)) && (
                <div className="mb-4">
                  <div>Passwords should match rules:</div>
                  <h1 className="text-sm text-red-500 list-disc list-inside">
                    {passwordRules
                      .filter((rule) => !rule.test(formData.password1))
                      .map((rule) => (
                        <li key={rule.label}>{rule.label}</li>
                      ))}
                  </h1>
                </div>
              )}

            <button
              className="press float-right flex items-center justify-end"
              type="submit"
              disabled={!passwordRules.every((rule) => rule.test(formData.password1))}
            >
              Next
              <GrNext className="w-4 h-4 ml-1" />
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={onSubmit}  className="flex flex-col items-center justify-center">
            <h2 className="text-xl font-semibold text-center">Email & Verification</h2>
            <div className="group mt-4 w-3/4">
                <Input
                id="firstname"
                placeholder="my.email@gmail.com"
                type="email"
                name="email"
                value={formData.email}
                onChange={onChange}
                required
                />

            </div>

            {formData.email.length > 0 &&
              emailRules.some((rule) => !rule.test(formData.email)) && (
                <div className="mb-4">
                  <div>Email should match rules:</div>
                  <h1 className="text-sm text-red-500 list-disc list-inside">
                    {emailRules
                      .filter((rule) => !rule.test(formData.email))
                      .map((rule) => (
                        <li key={rule.label}>{rule.label}</li>
                      ))}
                  </h1>
                </div>
              )}
              
            <button
              className="press float-right flex items-center justify-end mt-4"
              type="submit"
              disabled={!emailRules.every((rule) => rule.test(formData.email))}
            >
              Next
              <GrNext className="w-4 h-4 ml-1" />
            </button>
          </form>
        )}

        {step === 4 && (
          <div className="text-center">
            <p className="mb-4">Please check your email to verify your account.</p>
          </div>
        )}
      </div>
    </div>
  ); 
}
