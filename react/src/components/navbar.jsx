import { CaretDown, List, MagnifyingGlass } from "@phosphor-icons/react";
import { useContext, useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth-context";
import "./navbar.css"


export const NavigationBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, logoutUser } = useContext(AuthContext);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);
    const navigate = useNavigate();

    const goToLogin = () => {
        navigate("/login");
    };

    const goToHome = () => {
        navigate("/");
    };

    const logout = () => {
        if (window.confirm('Are you sure you want to log out?')) {
            logoutUser();
            goToHome();
        }
    };

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleSearch = () => {
        if (search.trim()) {
            navigate(`/courses?search=${encodeURIComponent(search)}`);
        } else {
            navigate('/courses');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                buttonRef.current && !buttonRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <>
            <div className="navbar">
                <div className="logo" onClick={goToHome}>E-learn</div>
                <div className="menu">
                    <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} > Home </NavLink>
                    <div className="nav-link" onClick={toggleDropdown} ref={buttonRef} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '96px', height: '60px' }}>
                        <p> Courses </p>
                        <CaretDown size={18} color="#606060" style={{ paddingTop: '5px', marginLeft: '5px' }} />
                    </div>
                    <NavLink to="/contact" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} > Contact </NavLink>
                </div>
                <div className="searchbar">
                    <input type="text" placeholder="Search courses" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={handleKeyDown} />
                    <MagnifyingGlass className="magnifier" size={32} onClick={handleSearch} />
                </div>
                <div className="login" onClick={user ? logout : goToLogin}> {user ? String(user.role).charAt(0).toUpperCase() + String(user.role).slice(1) : "Log in"} </div>
                <List className="mobileMenuIcon" size={26} onClick={toggleMenu} />
                <div className="model" />
            </div>
            {isOpen && (
                <div className="dropdown" ref={dropdownRef}>
                    <NavLink to="/courses" onClick={toggleDropdown} className={({ isActive }) => isActive ? "dropdown-link active" : "dropdown-link"}> All courses </NavLink>
                    <NavLink to="/offers" onClick={toggleDropdown} className={({ isActive }) => isActive ? "dropdown-link active" : "dropdown-link"}> Offers </NavLink>
                </div>
            )}
        </>
    )
}