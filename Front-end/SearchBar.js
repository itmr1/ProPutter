import React, {useState, useEffect} from 'react'
import axios from 'axios';

export const SearchBar = ({ip}) => {
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);

//100.26.244.166

  const onChangeSearch = (newValue) => {
    setSearch(newValue.target.value);
  };
  const onSearch = (value) => {
    setSearch(value);
  }
  // useEffect(() => {
  //   const fetchData = async ()=>{
  //       try {
  //           const res = await axios.get('http://100.26.244.166:4000/data/sensor')
  //           setData(res.data)
  //           console.log(res.data)
  //       } catch (error) {
  //           console.log(error)
  //       }
  //   }
  //   fetchData()
  //   const interval=setInterval(()=>{
  //       fetchData()
  //      },1000)


  //      return()=>clearInterval(interval)
  // }, [])
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(''+ip+'/data/addfriend',{
        name : search
      });
    }
    catch (error) {
      console.log(error);
    }

  };

  return (
    <div className='search-bar'>
      <h2>Search Friend</h2>
      <div className='search-input'>
        <div>
        <input value = {search} type = 'search' placeholder="Search"id='search' name='search' onChange={onChangeSearch}/>
        </div>
        <div>
        <form onSubmit={handleSubmit}>
        <button type='submit'> Add Friend </button>
        </form>
        </div>
      </div>
        {/* <div className='dropdown'>
        {data
            .filter((item) => {
              const searchTerm = value.toLowerCase();
              const fullName = item.full_name.toLowerCase();

              return (
                searchTerm &&
                fullName.startsWith(searchTerm) &&
                fullName !== searchTerm
              );
            })
            .slice(0, 10)
            .map((item) => (
              <div
                onClick={() => onSearch(item.full_name)}
                className="dropdown-row"
                key={item.full_name}
              >
                {item.full_name}
              </div>
            ))} */}
        {/* </div> */}

    </div>
  );

}
