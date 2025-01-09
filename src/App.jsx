import axios from 'axios'
import { useState } from 'react'

const baseUrl = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;

function App() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignIn, setIsSignIn] = useState(false);
  const [products, setProducts] = useState([]);
  const [chosenProduct, setChosenProduct] = useState(null);


  const signIn = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${baseUrl}/admin/signin/`, {
        username: email,
        password: password
      })

      const { token, expired } = response.data;
      console.log(token, expired);
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

  const checkIsSignIn = async () => {
    try {
      await axios.post(`${baseUrl}/api/user/check`)
      console.log('驗證成功');
      getProducts();
    }
    catch {
      console.log('驗證失敗，即將回到登入頁面');
    }
  }

  const getProducts = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/${apiPath}/admin/products`)
      setProducts(response.data.products);
    }
    catch {
      console.log('資料取得失敗')
    }
  }




  return (
    <>
      {isSignIn ? (
        <div className='container my-5'>
          <button type='button' className='btn btn-secondary' onClick={() => checkIsSignIn()}>驗證帳號並載入資訊</button>
          <div className='row'>
            <div className="col-6 py-3">
              <h2>產品列表</h2>
              <table className='table'>
                <thead>
                  <tr>
                    <th>產品名稱</th>
                    <th>原價</th>
                    <th>售價</th>
                    <th>是否啟用</th>
                    <th>查看細節</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((item) => (<tr key={item.id}>
                    <td>{item.title}</td>
                    <td>{item.origin_price}</td>
                    <td>{item.price}</td>
                    <td>{item.is_enabled === 1 ? '是' : '否'}</td>
                    <td><button type='button' className='btn btn-success' onClick={() => setChosenProduct(item)}>查看細節</button></td>
                  </tr>))}
                </tbody>
              </table>
            </div>
            <div className="col-6 py-3">
              <h2>單一產品細節</h2>
              {chosenProduct?
                      <div className="card">
                        <img src={chosenProduct.imageUrl} className="card-img-top" alt={chosenProduct.title}/>
                        <div className="card-body text-start">
                            <h5 className="card-title">{chosenProduct.title}<span className="badge text-bg-primary ms-2">{chosenProduct.category}</span></h5>
                            <p className="card-text">商品描述：{chosenProduct.description}</p>
                            <p className="card-text">商品內容：{chosenProduct.content}</p>
                            <p className="card-text"><del className='text-secondary'>{chosenProduct.origin_price}</del>元/{chosenProduct.price}元</p>
                            <p className='h5'>更多圖片：</p>
                            {chosenProduct.imagesUrl.map((item,index) =>
                            item ? 
                                    <img key={index} src={item} className="img-thumbnail" alt={chosenProduct.title}/>
                                    : null
                            )}
                            </div>
                      </div>:<div>請選擇一個產品查看</div>}
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
