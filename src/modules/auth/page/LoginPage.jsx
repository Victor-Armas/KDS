import { useState } from "react";
import { useAuthLogin } from "../hooks/useAuthLogin";
import LoginBackground from "../components/LoginBackground";
import LoginHeader from "../components/LoginHeader";
import LoginCard from "../components/LoginCard";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginMutation, isLoading, error } = useAuthLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center font-sans overflow-hidden">
      <LoginBackground />

      <div className="relative z-10 w-full max-w-md px-6">
        <LoginHeader />

        <LoginCard
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          isLoading={isLoading}
          handleSubmit={handleSubmit}
          error={error}
        />

        {/* Detalle decorativo */}
        <div className="flex justify-center mt-8">
          <div className="h-[2px] w-16 bg-mostaza rounded-full" />
        </div>
      </div>
    </div>
  );
}
