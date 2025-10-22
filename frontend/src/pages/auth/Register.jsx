import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import CommonForm from "@/components/common/CommonForm";
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/auth-slice";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

const initialState = {
  userName: "",
  email: "",
  password: "",
};

export default function Register() {
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function onSubmit(event) {
    event.preventDefault();
    setLoading(true);
    dispatch(registerUser(formData)).then((data) => {
      setLoading(false);
      if (data.payload?.success) {
        toast.success("Registration Successful 🎉", {
          description: "You can now log in to your account.",
        });
        navigate("/auth/login");
      } else {
        toast.error("Registration Failed ❌", {
          description: data.payload?.message || "Something went wrong.",
        });
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create a new account
        </h1>
        <p className="mt-2">
          Already have an account?
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/login"
          >
            Sign in
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={registerFormControls}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        buttonText={
          loading ? (
            <div className="flex items-center justify-center gap-2">
              <Spinner className="size-4" />
              Signing Up...
            </div>
          ) : (
            "Sign Up"
          )
        }
        disabled={loading}
      />
    </div>
  );
}
