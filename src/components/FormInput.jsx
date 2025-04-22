import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const FormInput = ({
                              id,
                              label,
                              type = "text",
                              icon,
                              placeholder,
                              required = false,
                              endIcon = null,
                              onEndIconClick = null
                          }) => {
    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <div className="relative">
                {icon && (
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            {icon}
          </span>
                )}
                <Input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    required={required}
                    className={`glass-card ${icon ? 'pl-10' : ''} ${endIcon ? 'pr-10' : ''}`}
                />
                {endIcon && (
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={onEndIconClick}
                    >
                        {endIcon}
                    </button>
                )}
            </div>
        </div>
    );
};