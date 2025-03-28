import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthContext, AuthProvider } from "./context/auth-context";
import { useContext, useEffect, useState } from "react";
import { NavigationBar } from "./components/navbar";
import { Contact } from "./pages/contact";
import { Courses } from "./pages/courses";
import { Chat } from "./components/chat";
import { Offers } from "./pages/offers";
import { Signup } from "./pages/signup";
import { Login } from "./pages/login";
import { Info } from "./pages/info";
import { Home } from "./pages/home";
import ProtectedRoute from "./components/protected-route";

function App() {
    const [role, setRole] = useState("");

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
    
                    localStorage.setItem("latitude", latitude);
                    localStorage.setItem("longitude", longitude);

                    console.log("Latitude: ", latitude);
                    console.log("Longitude: ", longitude);
                },
                (error) => {
                    console.error("Error getting geolocation: ", error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    }, []);

    return (
        <div>
            <AuthProvider>
            <BrowserRouter>
                <RouteChangeHandler update={setRole} />
                <NavigationBar />
                <div style={{ padding: '60px 50px 0 50px'}}>
                    <Routes>
                        <Route exact path='/' element={<Home />}/>
                        <Route exact path='/contact' element={<Contact />}/>
                        <Route exact path='/courses' element={<Courses />}/>
                        <Route exact path='/courses/:categ' element={<Courses />}/>
                        <Route exact path='/offers' element={<Offers />}/>
                        <Route exact path='/info/:id' element={<Info />}/>
                        <Route exact path='/login' element={<ProtectedRoute><Login /></ProtectedRoute>}/>
                        <Route exact path='/signup' element={<ProtectedRoute><Signup /></ProtectedRoute>}/>
                    </Routes>
                </div>
                {role === 'student' && <Chat />}
            </BrowserRouter>
            </AuthProvider>
        </div>
    );
}

const RouteChangeHandler = ({update}) => {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    update(user?.role);
    // eslint-disable-next-line
  }, [location.pathname]);

  return null;
};

export default App;
