import type { InputHTMLAttributes } from "react";

const Input = (props: InputHTMLAttributes<HTMLInputElement>) => (
    <input
        {...props}
        className={`rounded-md bg-white/5 px-3 py-1.5 text-sm text-white outline-none ring-1 ring-white/10 transition focus:ring-orange-500 ${props.className ?? ""}`}
    />
);

export default Input;
