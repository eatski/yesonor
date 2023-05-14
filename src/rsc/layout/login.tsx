"use client";
import { signIn } from "next-auth/react";
import components from "@/styles/components.module.scss";

export const Login = () => {
    return <button className={components.buttonPure} onClick={() => {
        signIn();
    }}>
        ログイン
    </button>
}