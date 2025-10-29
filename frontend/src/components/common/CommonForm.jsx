import React, { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  disabled,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({}); // ✅ track field errors

  // ✅ validation function
  const validateForm = () => {
    const newErrors = {};

    formControls.forEach((control) => {
      if (control.required && !formData[control.name]?.trim()) {
        newErrors[control.name] = `${
          control.label || control.name
        } is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ wrap onSubmit with validation
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(e);
    }
  };

  function renderInputsByComponentType(getControlItem) {
    const value = formData[getControlItem.name] || "";
    const hasError = errors[getControlItem.name];

    switch (getControlItem.componentType) {
      case "input":
        if (getControlItem.type === "password") {
          return (
            <div className="relative w-full">
              <Input
                name={getControlItem.name}
                placeholder={getControlItem.placeholder}
                id={getControlItem.name}
                type={showPassword ? "text" : "password"}
                value={value}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [getControlItem.name]: e.target.value,
                  })
                }
                className={hasError ? "border-red-500" : ""}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900"
              >
                {showPassword ? (
                  <EyeOffIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          );
        } else {
          return (
            <Input
              name={getControlItem.name}
              placeholder={getControlItem.placeholder}
              id={getControlItem.name}
              type={getControlItem.type}
              value={value}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [getControlItem.name]: e.target.value,
                })
              }
              className={hasError ? "border-red-500" : ""}
            />
          );
        }

      case "select":
        return (
          <Select
            onValueChange={(val) =>
              setFormData({ ...formData, [getControlItem.name]: val })
            }
            value={value}
          >
            <SelectTrigger
              className={`w-full ${hasError ? "border-red-500" : ""}`}
            >
              <SelectValue placeholder={getControlItem.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {getControlItem.options?.map((optionItem) => (
                <SelectItem key={optionItem.id} value={optionItem.id}>
                  {optionItem.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "textarea":
        return (
          <Textarea
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            value={value}
            onChange={(e) =>
              setFormData({
                ...formData,
                [getControlItem.name]: e.target.value,
              })
            }
            className={hasError ? "border-red-500" : ""}
          />
        );

      default:
        return (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.label}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(e) =>
              setFormData({
                ...formData,
                [getControlItem.name]: e.target.value,
              })
            }
            className={hasError ? "border-red-500" : ""}
          />
        );
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4">
        {formControls.map((controlItem) => (
          <div className="grid w-full gap-1.5" key={controlItem.name}>
            <Label className="mb-1">{controlItem.label}</Label>
            {renderInputsByComponentType(controlItem)}
            {errors[controlItem.name] && (
              <p className="text-red-500 text-sm">{errors[controlItem.name]}</p>
            )}
          </div>
        ))}
      </div>

      <Button type="submit" disabled={disabled} className="mt-4 w-full">
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}
