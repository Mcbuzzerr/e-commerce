import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

function ProtectedRoute(props) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const history = useHistory();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            history.push("/login");
        } else {
            // Verify token on the server-side and set isAuthenticated accordingly
            fetch("/api/verify-token", {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.isAuthenticated) {
                        setIsAuthenticated(true);
                    } else {
                        localStorage.removeItem("token");
                        history.push("/login");
                    }
                })
                .catch((error) => console.error(error));
        }
    }, []);

    return isAuthenticated ? <Route {...props} /> : null;
}