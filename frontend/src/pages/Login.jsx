import { useState,useContext } from "react";
import { Link,useNavigate } from "react-router-dom";
import { AuthContext } from "../context/Authcontext";
import "./login.css"

function Login(){
    const [showPassword,setshowPassword] = useState(false)
    const [loading,setLoading] = useState(false)
    const [error,setError]=useState("")

    const {login} = useContext(AuthContext)
    const navigate = useNavigate()
    return(
       <div className="login-page">
        <div className="login-container">
            <div className="login-brand">
                <div className="brand-logo">
                    <span></span>
                    SFS
                </div>
                <div className="brand-content">
                    <p className="brand-eyebrow">
                        SECURE FILE SYSTEM
                    </p>
                    <h2>
                        Your Files.
                        <br/>
                        Your Control.
                    </h2>
                    <p className="brand-description">
                     A private space to securely manage
                     and access your Files.
                    </p>
                </div>
                <div className="brand-footer">
                    <span>PRIVATE STORAGE</span>
                    <span>
                        SECURE ACCESS
                    </span>
                </div>
            </div>
            <div className="login-form">
                <p className="form-eyebrow">
                    WELCOME BACK
                </p>
                <h1>Sign In</h1>
                <p className="form-description">
                    Access your secure file system.
                </p>
                <form onSubmit={
                    async (e) => {
                        e.preventDefault()
                        setError("")
                        setLoading(true)
                        const email = e.target.email.value
                        const password = e.target.password.value
                        try{
                            const response = await fetch(
                                "http://localhost:3000/api/auth/login",
                                {
                                    method : "POST",
                                    headers : {
                                        "Content-Type":"application/json"
                                    },
                                    body : JSON.stringify({
                                        email,
                                        password
                                    })
                                }
                            )
                            const data = await response.json()
                            if(!response.ok){
                                throw new Error(data.message)
                            }
                            login(data.token)
                            navigate("/dashboard")
                        }catch(error){
                            setError(error.message)
                        }finally{
                            setLoading(false)
                        }
                    }
                }>
                    <div className="form-group">
                        <label>Email address</label>
                        <input
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        />
                    </div>
                    <div className="form-group">
                        <div className="password-label">
                            <label>Password</label>
                        </div>
                        <div className="password-input">
                            <input
                            type={showPassword ? "text":"password"}
                            name="password"
                            placeholder="Enter your Password"
                            />
                            <button type="button"
                            onClick={()=>setshowPassword(!showPassword)}
                            >
                              {showPassword?"Hide":"Show"}
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="login-button"
                    disabled={loading}>
                    {loading ?(
                        <>
                        <span className="spinner"></span>
                        Authenticating...
                        </>
                    ):(
                        <>
                         Sign In
            <span>→</span>
                        </>
                    )}
                    </button>
                </form>
                {error && (
                    <div className="login-error">
                        {error}
                    </div>
                )}
                <div className="form-bottom">
                    <p>
                        Don't have an account?
                    </p>
                   <Link to="/register">
                   Create account →
                   </Link>
                </div>
            </div>
        </div>
       </div>
          
    )
}

export default Login