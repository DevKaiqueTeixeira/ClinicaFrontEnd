import { AlertCircle, Eye, EyeOff, Lock } from "lucide-react";
import { forwardRef, type InputHTMLAttributes, useId, useState } from "react";

export interface PasswordFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="space-y-1">
        <label htmlFor={inputId} className="ml-1 block text-xs font-semibold text-slate-700">
          {label}
        </label>
        <div className="relative">
          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-700/80" />
          <input
            ref={ref}
            id={inputId}
            type={showPassword ? "text" : "password"}
            className={[
              "w-full rounded-xl border bg-white/90 px-3 py-2.5 pl-9 pr-10 text-sm text-slate-900 transition",
              "placeholder:text-slate-400 focus:border-teal-500",
              error ? "border-red-400" : "border-slate-200",
              className,
            ].join(" ")}
            {...props}
          />
          <button
            type="button"
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-700"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {error ? (
          <p className="flex items-center gap-1 text-xs font-medium text-red-600">
            <AlertCircle size={14} />
            <span>{error}</span>
          </p>
        ) : null}
      </div>
    );
  }
);

PasswordField.displayName = "PasswordField";

export default PasswordField;
