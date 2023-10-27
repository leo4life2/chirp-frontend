import { usePrivy } from "@privy-io/react-auth";
import Head from "next/head";
import Chirp from "../components/graphics/chirp";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";

export default function LoginPage() {
  const { login, authenticated } = usePrivy();
  const router = useRouter(); // Initialize the router hook
  const chirpRef = useRef<HTMLDivElement>(null);

  const handleLogin = () => {
    if (chirpRef.current) {
      chirpRef.current.style.animation =
        "squishAndRotate 1s ease-in-out forwards";
    }
    setTimeout(() => {
      if (authenticated) {
        router.push('/dashboard'); // Redirect to /dashboard if authenticated
      } else {
        login();
      }
    }, 1000); // Wait for animation to complete
  };

  useEffect(() => {
    if (chirpRef.current) {
      chirpRef.current.addEventListener("animationend", () => {
        if (chirpRef.current) chirpRef.current.style.animation = "";
      });
    }
  }, []);

  return (
    <>
      <Head>
        <title>Login · Chirp</title>
      </Head>

      <style jsx>{`
    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      20% {
        transform: scale(0.95);
      }
      50% {
        transform: scale(1.04);
      }
    }
    

    @keyframes squishAndRotate {
      0% {
        transform: scale(1);
      }
      10% {
        transform: scale(0.9);
      }
      50% {
        transform: scale(1.2);
      }
      100% {
        transform: scale(1) rotate(720deg);
      }
    }

    .chirp-login {
      cursor: pointer;
      transition: transform 0.3s ease-in-out;
      animation: pulse 2s infinite;
    }

    .chirp-login:hover {
      transform: scale(1.1);
    }

    .chirp-login:active {
      animation: squishAndRotate 1s ease-in-out forwards;
    }
`}</style>


      <main className="flex min-h-screen min-w-full">
        <div className="flex bg-duck-light-yellow flex-1 p-6 justify-center items-center">
          <div>
            <div className="chirp-login" onClick={handleLogin} ref={chirpRef}>
              <Chirp />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
