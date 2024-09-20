import { useLocation } from "react-router-dom";

const Footer = () => {
    const location = useLocation()
    if(
        location.pathname.includes('user') ||
        location.pathname.includes('admin') ||
        location.pathname.includes('login') || 
        location.pathname.includes('signup')) {
            return null
        }
    return (
        <div className="mt-5">
            <footer className="position-absolute w-100 d-flex align-items-center flex-column justify-content-center text-center mt-5 py-5 bg-teal-light">
                <div className="py-5">
                    <p className="mt-4"><strong>Graduation Thesis: Conference Searching</strong> </p>
                    <p className='my-2'>&copy; 2024 University of Science - VNUHCM. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default Footer;
