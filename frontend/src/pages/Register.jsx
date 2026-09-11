import { useState,useContext } from "react";
import { Link,useNavigate } from "react-router-dom";
import { AuthContext } from "../context/Authcontext";
import "./register.css";

function Register() {

    const [showpassword, setShowpassword] = useState(false);
    const [showConfirmPassword, setshowConfirmPassword] = useState(false);
    const [password,setPassword] = useState("")
    
    const [name,setName] = useState("")
    const [email,setEmail]=useState("")
    const [confirmPassword,setConfirmPassword]=useState("")

    const [loading,setLoading] = useState(false)
    const [error,setError] = useState("")

    const {login} = useContext(AuthContext)
    const navigate = useNavigate()

    return (
        <div className="register-page">

            <div className="register-container">

                {/* LEFT SECURITY PANEL */}

                <div className="register-security">

                    <div className="register-logo">
                        <span></span>
                        SFS
                    </div>


                    <div className="security-content">

                        <p className="security-eyebrow">
                            BUILD YOUR PRIVATE SAFE
                        </p>

                        <h1>
                            Your vault.
                            <br />
                            Your rules.
                        </h1>

                        <p>
                            Create a secure account and take control
                            of the files you keep here.
                        </p>


                        <div className="security-points">

                            <div className="security-point">

                                <span>01</span>

                                <div>
                                    <strong>
                                        PRIVATE BY DEFAULT
                                    </strong>

                                    <small>
                                        Your files stay under your control.
                                    </small>
                                </div>

                            </div>


                            <div className="security-point">

                                <span>02</span>

                                <div>
                                    <strong>
                                        PASSWORD PROTECTED
                                    </strong>

                                    <small>
                                        Your account is securely protected.
                                    </small>
                                </div>

                            </div>


                            <div className="security-point">

                                <span>03</span>

                                <div>
                                    <strong>
                                        SECURE ACCESS
                                    </strong>

                                    <small>
                                        Only authenticated users can enter.
                                    </small>
                                </div>

                            </div>

                        </div>

                    </div>


                    {/* SECURITY FOOTER */}

                    <div className="security-footer">

                        <span>
                            SECURE FILE SYSTEM
                        </span>

                        <span>
                            EST. 2026
                        </span>

                    </div>

                </div>


                {/* RIGHT REGISTER FORM */}

                <div className="register-form">

                    <div className="register-form-header">

                        <p className="register-eyebrow">
                            CREATE ACCOUNT
                        </p>

                        <h2>
                            Create your vault
                        </h2>

                        <p className="register-description">
                            Set up your secure file system account.
                        </p>

                    </div>


                    <form 
                    onSubmit = {async (e) => {
                        e.preventDefault()
                        setError("")
                        if(password !== confirmPassword){
                            setError("Passwords do not match")
                            return
                        }
                        if(password.length < 6){
                            setError("Password must be at least 6 characters")
                            return
                        }
                        setLoading(true)
                        try{
                            const response = await fetch(
                                "http://localhost:3000/api/auth/register",
                                {
                                    method : "POST",
                                    headers : {
                                        "Content-Type":"application/json"
                                    },
                                    body : JSON.stringify({
                                        name,
                                        email,
                                        password
                                    })
                                }
                            )
                            const data = await response.json()
                            if(!response.ok){
                                throw new Error(data.message)
                            }
                            navigate("/login")
                        }catch(error){
                            setError(error.message)
                        }finally{
                            setLoading(false)
                        }
                    }}
                    
                    >

                        {/* NAME */}

                        <div className="register-group">

                            <label>
                                Full Name
                            </label>

                            <input
                                type="text"
                                placeholder="Enter your name"
                                value = {name}
                                onChange={(e)=> setName(e.target.value)}
                                required
                            />

                        </div>


                        {/* EMAIL */}

                        <div className="register-group">

                            <label>
                                Email address
                            </label>

                            <input
                                type="email"
                                placeholder="you@example.com"
                                value = {email}
                                onChange={(e)=> setEmail(e.target.value)}
                                required
                            />

                        </div>


                        {/* PASSWORD */}

                        <div className="register-group">

                            <label>
                                Password
                            </label>

                            <div className="register-password">

                                <input
                                type={showpassword ? "text":"password"}
                                placeholder="Create your password"
                                value={password}
                                onChange={(e)=>setPassword(e.target.value)}
                                required
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowpassword(!showpassword)
                                    }
                                >
                                    {showpassword ? "Hide" : "Show"}
                                </button>

                            </div>

                        </div>
                        {password && (
                            <div className="password-strength">
                                <div className="strength-bars">
                                    <span
                                    className={
                                        password.length >=1 ? "active":"" }
                                    ></span>
                                    <span
                                    className={
                                        password.length>=6 ? "active":""
                                    }
                                    ></span>
                                    <span className={password.length>=10 ? "active":""}></span>
                                    <span
                                    className={
                                        password.length>=12 ? "active":""
                                    }
                                    ></span>
                                </div>
                                <small>
                                    {
                                        password.length < 6
                                        ? "Weak"
                                        : password.length <10
                                        ? "Fair"
                                        :password.length < 12
                                        ? "Good"
                                        : "Strong"
                                    }
                                </small>
                            </div>
                        )}


                        {/* CONFIRM PASSWORD */}

                        <div className="register-group">

                            <label>
                                Confirm Password
                            </label>

                            <div className="register-password">

                                <input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e)=>setConfirmPassword(e.target.value)}
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setshowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                >
                                    {showConfirmPassword
                                        ? "Hide"
                                        : "Show"}
                                </button>

                            </div>

                        </div>


                        {/* PASSWORD NOTE */}

                        <div className="password-note">

                            <span></span>

                            Use at least 6 characters

                        </div>


                        {/* REGISTER BUTTON */}

                        <button
                            type="submit"
                            className="register-button"
                            disabled={loading}
                        >
                            {loading ? (
                                "Creating account..."
                            ):(
                                <>
                                  Create account
                                  <span>→</span>
                                </>
                            )}
                        </button>
                        {error && (
                            <div className="register-error">
                                {error}
                            </div>
                        )}

                    </form>


                    {/* BOTTOM */}

                    <div className="register-bottom">

                        <p>
                            Already have an account?
                        </p>

                      <Link to="/login">
                        Sign in →
                      </Link>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Register;