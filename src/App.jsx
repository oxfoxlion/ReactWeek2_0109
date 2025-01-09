import axios from 'axios'
import { useState } from 'react'

const baseUrl = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;

function App() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignIn, setIsSignIn] = useState(false);
  const [products,setProducts] = useState([]);


    const signIn = async (e)=>{
      e.preventDefault();

        try {
          const response = await axios.post(`${baseUrl}/admin/signin/`, {
            username: email,
            password: password
          })
  
          const {token,expired} = response.data;
          console.log(token,expired);
          document.cookie = `shaoToken=${token}; expires=${new Date(expired)}`;
          axios.defaults.headers.common['Authorization'] = token;

          alert('登入成功');
          setIsSignIn(true);
        }
        catch {
          alert('登入失敗');
          setEmail("");
          setPassword("");
        }

    }

    const checkIsSignIn = async()=>{
      try{
        await axios.post(`${baseUrl}/api/user/check`)
        console.log('驗證成功');
      }
      catch{
        console.log('驗證失敗，即將回到登入頁面');
        setIsSignIn(false); 
      }
    }
    
    const getProducts = async()=>{
      try{
        const response = await axios.get(`${baseUrl}/api/${apiPath}/admin/products`)
        console.log(response.data);
      }
      catch{
        console.log('資料取得失敗')
      }
    }
    



  return (
    <>
      {isSignIn ? (
        <div className='container my-5'>
          <button type='button' className='btn btn-secondary' onClick={()=>checkIsSignIn()}>驗證使用者是否登入</button>
          <button type='button' className='btn btn-secondary' onClick={()=>getProducts()}>取得產品資料</button>
          <div className='row'>
            <div className="col-6">
              <table>

              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className='container my-5'>
          <h2 className='text-center'>請先登入</h2>
          <form className='text-center w-25 mx-auto p-3'>
            <div className="my-2">
            <label htmlFor="email" className='form-label'>Email</label>
            <input value={email} type='email' id="email" className='form-control' onChange={(e) => setEmail(e.target.value)}></input>
            </div>
            <div className="my-2">
            <label htmlFor="password" className='form-label'>Password</label>
            <input value={password} type='password' id='password' className='form-control' onChange={(e) => setPassword(e.target.value)}></input>
            </div>
            <button className='btn btn-primary' onClick={signIn}>登入</button>
          </form>
        </div>
      )}


    </>
  )
}

export default App
