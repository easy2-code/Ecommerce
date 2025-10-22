import CommonForm from "@/components/common/CommonForm";
import { loginFormControls } from "@/config";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "@/store/auth-slice";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

const initialState = {
  email: "",
  password: "",
};

export default function Login() {
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function onSubmit(e) {
    e.preventDefault();

    // ✅ Client-side validation
    if (!formData.email || !formData.password) {
      toast.error("Email and password are required ❌");
      return;
    }

    setLoading(true);

    dispatch(loginUser(formData))
      .unwrap()
      .then((data) => {
        // ✅ Successful login
        if (data?.user) {
          toast.success("Login successful 🎉", {
            description: `Welcome back, ${data.user.email}!`,
          });

          // Redirect based on role
          if (data.user.role === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/shop/home");
          }
        }
      })
      .catch((errorMessage) => {
        toast.error(errorMessage || "Login failed ❌");
      })
      .finally(() => setLoading(false));
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sign in to your account
        </h1>
        <p className="mt-2">
          Don't have an account?
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/register"
          >
            Sign up
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={loginFormControls}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        buttonText={
          loading ? (
            <div className="flex items-center justify-center gap-2">
              <Spinner className="size-4" />
              Signing In...
            </div>
          ) : (
            "Sign In"
          )
        }
        disabled={loading}
      />
    </div>
  );
}
