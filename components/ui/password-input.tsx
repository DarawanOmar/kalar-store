import * as React from "react";

import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { IconType } from "react-icons/lib";
import { LucideIcon } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  Icon?: IconType | LucideIcon;
  classParent?: string;
  isform?: boolean;
}

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, classParent, type, Icon, isform, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    return (
      <div className={cn("relative w-full", classParent)}>
        {Icon && (
          <span className="absolute start-2 inset-y-0 flex items-center">
            <Icon
              size={21}
              className={cn("text-primary ms-1", {
                "size-7": type === "file",
              })}
            />
          </span>
        )}
        <input
          {...props}
          ref={ref}
          type={showPassword ? "text" : "password"}
          value={props.value === 0 ? "" : props.value}
          className={cn(
            "flex h-10 w-full rounded-xl border border-soft_red  bg-gray px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-foreground focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            { "ps-10": Icon },
            { "bg-muted rounded-xl  ": isform },
            className
          )}
          onChange={(e) => {
            if (type === "number" && props.onChange) {
              props.onChange({
                target: { value: +e.target.valueAsNumber },
              } as any);
            } else {
              props.onChange && props.onChange(e);
            }
          }}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          title={showPassword ? "Hide password" : "Show password"}
          className="absolute left-3 top-1/2 -translate-y-1/2 transform text-foreground outline-none"
        >
          {showPassword ? (
            <EyeOff className="size-5 text-primary" />
          ) : (
            <Eye className="size-5 text-primary" />
          )}
        </button>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };

// import { cn } from "@/lib/utils";
// import { Eye, EyeOff } from "lucide-react";
// import React, { useState } from "react";
// import { Input, InputProps } from "./input";

// const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
//   ({ className, type, Icon, ...props }, ref) => {
//     const [showPassword, setShowPassword] = useState(false);

//     return (
//       <div className="relative w-full">
//         {Icon && (
//           <span className="absolute start-2 inset-y-0 flex items-center">
//             <Icon
//               size={21}
//               className={cn("text-foreground/40 ms-1", {
//                 "size-7": type === "file",
//               })}
//             />
//           </span>
//         )}

//         <Input
//           type={showPassword ? "text" : "password"}
//           className={cn("pe-10", { "ps-10": Icon }, className)}
//           ref={ref}
//           {...props}
//         />
//         <button
//           type="button"
//           onClick={() => setShowPassword(!showPassword)}
//           title={showPassword ? "Hide password" : "Show password"}
//           className="absolute left-3 top-1/2 -translate-y-1/2 transform text-muted-foreground outline-none"
//         >
//           {showPassword ? (
//             <EyeOff className="size-5" />
//           ) : (
//             <Eye className="size-5" />
//           )}
//         </button>
//       </div>
//     );
//   }
// );

// PasswordInput.displayName = "PasswordInput";

// export { PasswordInput };
