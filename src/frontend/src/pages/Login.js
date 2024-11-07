import '../styles/styles.css'
import Header from '../components/Header'
import Home from './Home'

const Login = () => {
    return (
       <div className='login'>
        <h1>Login</h1>
        <form>
            <label>Username</label>
            <input type="text" required></input>
            <label>Password</label>
            <input type="password" required></input>
            <button type="submit" onClick="">Login</button>
        </form>
       </div> 
    )

}


export default Login;