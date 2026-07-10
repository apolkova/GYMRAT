import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import type { AuthResponse } from "../types/auth";

type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
};

function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const { register, handleSubmit, formState } = useForm<RegisterFormValues>();
  const { errors, isSubmitting } = formState;

  async function onSubmit(values: RegisterFormValues) {
    try {
      setError("");

      const response = await api.post<AuthResponse>("/auth/register", values);

      localStorage.setItem("gymrat_token", response.data.token);
      localStorage.setItem("gymrat_user", JSON.stringify(response.data.user));

      navigate("/dashboard");
    } catch {
      setError("Unable to create account. Please try again.");
    }
  }

  return (
    <main>
      <h1>Create Account</h1>
      <p>Start tracking your workouts.</p>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            {...register("name")}
            placeholder="Your name"
          />
        </div>

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
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
            placeholder="Password"
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Sign up"}
        </button>
      </form>
    </main>
  );
}

export default Register;