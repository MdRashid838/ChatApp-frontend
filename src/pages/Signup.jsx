import { useState } from "react";
import API from "../api/axios"
import {useNavigate} from "react-router-dom"
function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/signup", form);
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <form
        onSubmit={handleSignup}
        className="bg-slate-900 p-10 rounded-3xl w-[450px] border border-slate-700"
      >
        <h1 className="text-4xl font-bold mb-8 text-center">
          Signup
        </h1>

        <input
          type="text"
          placeholder="Name"
          className="w-full p-4 rounded-xl bg-slate-800 mb-4"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Username"
          className="w-full p-4 rounded-xl bg-slate-800 mb-4"
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-4 rounded-xl bg-slate-800 mb-4"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-4 rounded-xl bg-slate-800 mb-6"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button className="w-full bg-green-600 p-4 rounded-xl font-bold hover:bg-green-700 transition-all">
          Create Account
        </button>
      </form>
    </div>
  );
}

export default Signup;