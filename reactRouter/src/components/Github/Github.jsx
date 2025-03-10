import React from "react";
import { useLoaderData } from 'react-router-dom'

function Github() {
     const data = useLoaderData()
    // const [data, setData] = useState([])
    // useEffect(() => {
    //  fetch('https://api.github.com/users/Sha777nk')
    //  .then(response => response.json())
    //  .then(data => {
    //     console.log(data);
    //     setData(data)
    //  })
    // }, [])
    
  return (
    <div className='text-center m-4 bg-gray-600 text-white p-4 text-3xl '>Github followers: {data.followers}
    
    <div className="flex justify-center items-center ">
    <h1 text-lg>Hii,I am</h1>
    <img src={data.avatar_url} alt="Git picture" width={300} />
    <h1 text-white >Shashank</h1>
    </div>
    </div>
  )
}

export default Github

export const githubInfoLoader = async () => {
    const response = await fetch('https://api.github.com/users/Sha777nk')
    return response.json()
}