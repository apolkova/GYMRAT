import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import type { AuthResponse } from "../types/auth";

type LoginFormValues = {
  email: string;
  password: string;
};

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const { register, handleSubmit, formState } = useForm<LoginFormValues>();
  const { errors, isSubmitting } = formState;

  async function onSubmit(values: LoginFormValues) {
    try {
      setError("");

      const response = await api.post<AuthResponse>("/auth/login", values);

      localStorage.setItem("gymrat_token", response.data.token);
      localStorage.setItem("gymrat_user", JSON.stringify(response.data.user));

      navigate("/dashboard");
    } catch {
      setError("Invalid email or password.");
    }
  }

  return (
    <main className="auth-page">
      <section className="card auth-card">
        <div className="page-header">
          <h1>Login</h1>
          <p>Welcome back to GymRat.</p>
        </div>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              {...register("email", {
                required: "Email is required",
              })}
              placeholder="you@example.com"
            />
            {errors.email && <p className="error">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              {...register("password", {
                required: "Password is required",
              })}
              placeholder="Password"
            />
            {errors.password && (
              <p className="error">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="muted">
          Don&apos;t have an account? <Link to="/register">Create one</Link>
        </p>
      </section>
    </main>
  );
}

export default Login;