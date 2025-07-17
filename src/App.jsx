  import { BrowserRouter, Route, Routes } from "react-router-dom";
  import "./index.css";
  import Home from "./components/Home";
  import { useEffect } from "react";
  import axios from "axios";
  import { useState } from "react";
  function App() {
    const [loading, setLoading] = useState(true);
    // let isExist = false;
    const [isExist, setIsExist] = useState(false);

    useEffect(() => {
      async function verifyUser() {
        try {
          console.log("work f")
          const { data } = await axios.get(
            "http://localhost:3002/userVerification",
            {
              withCredentials: true, // Send the cookie
            }
          );

          if (!data.status) {
            // Redirect if not authenticated
            window.location.href = "http://localhost:5173/login";
          } else {
            // console.log("Logged in as:", data.user);
            setIsExist(true);
          }
        } catch (err) {
          console.error("Verification failed", err.message);
          window.location.href = "http://localhost:5173/login";
        } finally {
          setLoading(false);
        }
      }

      verifyUser();
    }, []);

    if (loading) return <h3>Loading...</h3>;

    return (
      <>
        <BrowserRouter>
          <Routes> {isExist && <Route path="/*" element={<Home />} />}</Routes>
        </BrowserRouter>
      </>
    );
  }

  export default App;
