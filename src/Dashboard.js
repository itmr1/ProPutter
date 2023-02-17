import React, {useEffect, useState} from 'react';
import { SearchBar } from './SearchBar';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {Chart} from 'chart.js';
import {Line, Scatter} from 'react-chartjs-2';
import {PointElement, LinearScale, CategoryScale, LineElement} from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement);

export const Dashboard = ({onVariableChange, ip}) => {
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [scatter, setScatter] = useState({
    datasets: [
      {
        data: []
      }
    ]
  });
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();
  const [average, setAverage] = useState([]);
  const [dataFriend, setDataFriend] = useState([]);
  const [check, setCheck] = useState([]);
  useEffect(() => {
    const fetchData = async ()=>{
        try {
            const res = await axios.get(''+ip+'/data/sensor')
            if (res == []){
              setData([0,0,0,0,0,0,0,0,0,0])
            }
            else{
              setData(res.data)
            }
            console.log(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    fetchData()
    const interval=setInterval(()=>{
        fetchData()
       },1000)


       return()=>clearInterval(interval)
  }, [])


  useEffect(() => {
    const fetchData2 = async ()=>{
        try {
            const res = await axios.get(''+ip+'/data/performance')
            if (res.data == []){
              setData2([0,0,0,0,0])
            }
            else{
              setData2(res.data)
            }
            console.log(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    fetchData2()
    const interval=setInterval(()=>{
        fetchData2()
       },3000)


       return()=>clearInterval(interval)
  }, [])


  useEffect(() => {
    const fetchscatterData = async ()=>{
      var scatter_data = []
        try {
            const res = await axios.get(''+ip+'/data/scatter')
            // setScatter(res.data)
            // console.log(res.data)
            let temp = res.data
            if (temp == []){
              scatter_data.push({'x':0, 'y':0})
            }
            temp.forEach(element => {
              let speed = element[0]
              let angle = element[1]*180/3.14
              scatter_data.push({'x':angle, 'y':speed})
            });
        } catch (error) {
            console.log(error)
        }
        setScatter(
          {
            datasets: [
              {
                label: 'My Scatter Plot',
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: 'rgba(75,192,192,1)',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 3,
                pointHitRadius: 10,
                responsive: true,
                data: scatter_data
              }
            ]
          }
        )
    }

    fetchscatterData()
    const interval=setInterval(()=>{
        fetchscatterData()
       },3000)


       return()=>clearInterval(interval)
  }, [])



  useEffect(() => {
    const fetchaverageData = async ()=>{
        try {
            const res = await axios.get(''+ip+'/data/averages')
            if (res.data == []){
              setAverage([0,0,0,0,0])
            }
            else{
              setAverage(res.data)
            }

            console.log(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    fetchaverageData()
    const interval=setInterval(()=>{
        fetchaverageData()
       },1000)


       return()=>clearInterval(interval)
  }, [])

  useEffect(() => {
    const fetchFriends = async ()=>{
        try {
            const res = await axios.get(''+ip+'/data/getfriends')
            if (res.data == []){
              setFriends(['none'])
            }
            else{
              const delimiter = ','
              console.log(res.data[0]['friends'].split(delimiter).slice(0, -1))
              setFriends(res.data[0]['friends'].split(delimiter).slice(0, -1))
              console.log(res.data[0]['friends'])
            }
        } catch (error) {
            console.log(error)
        }
    }
    fetchFriends()
    const interval=setInterval(()=>{
        fetchFriends()
       },3000)


       return()=>clearInterval(interval)
  }, [])
  function ListItem(props) {
    return <p>{props.value}</p>;
  }
  const graph_data = {
    labels: [1,2,3,4,5,6,7,8,9,10],
    datasets: [
      {
        label: 'My First dataset',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(249, 180,45,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: 'rgb(230, 230, 230)',
        pointBorderWidth: 1,
        pointRadius: 5,
        data: data2
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart.js Line Chart',
      },
    },
    scales:{
      y:{
          min: 0,
          max: 100,
          ticks:{
              stepSize: 10,
              autoSkip:false
          },
      },
      x:{
          min: 1,
          max: 10,
          ticks:{
              autoSkip:false,
              stepSize: 1,
          },
      },
  },
  };

  const options_scatter = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart.js Scatter Plot',
      },
      scales: {
        xAxes: [
          {
            type: 'linear',
            position: 'bottom',
          }
        ]
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios.post(''+ip+'/data/logout');
    navigate('/')
  }

  const handleClick = async (e, friend) => {
    var Fdata = {perf: [], scat:[]};
    e.preventDefault();
    const response = await axios.post(''+ip+'/data/frienddata',{
      name : {friend},
    });
    let updatedData = response.data;
    setDataFriend(updatedData);
    Fdata.perf = updatedData.perf
    updatedData.scat.forEach(element => {
      let speed = element[0]
      let angle = element[1]*180/3.14
      Fdata.scat.push({'x':angle, 'y':speed})
    });
    console.log(Fdata)
    //console.log(dataFriend)
    onVariableChange(Fdata)

    // onVariableChange(dataFriend)
    navigate('/friend')
  }


  return(
    <div id = 'dashboard'>
      <div id = 'titDash'>
        <h1 id='tit'>ProPutter</h1>
      </div>
      <div id = 'data'>
        <div id = 'analytics'>
          <div className='recent'>
            <div id='currV' className='stat'>
              <h2>Velocity</h2>
              <h1>{data[0]?data[0].toFixed(2):0} m/s</h1>
            </div>
            <div id='currA' className='stat'>
              <h2>Angle Deviation</h2>
              <h1>{data[1]?(data[1]*180/3.14).toFixed(2):0}°</h1>
            </div>
            <div id='currT' className='stat'>
              <h2>Temperature</h2>
              <h1>{data[2]?data[2].toFixed(2):0}</h1>
            </div>
            <div id='currH' className='stat'>
              <h2>Humidity</h2>
              <h1>{data[3]?data[3].toFixed(2):0}</h1>
            </div>
          </div>
          <div id='graphs'>
            <div id='perfGraph'>
              <h2>Performance Score</h2>
              <Line data={graph_data} options={options} />
            </div>
            <div id='scattGraph'>
              <h2>Velocity vs Angle Deviation</h2>
              <Scatter data={scatter} options={options_scatter} />
            </div>
          </div>
          <div className='averages'>
              <div id='avV' className='stat'>
                <h2>Average Velocity</h2>
                <h1>{(average[0]?.toFixed(2))}m/s</h1>
              </div>
              <div id='avA' className='stat'>
                <h2>Average Angle Deviation</h2>
                <h1>{(average[1]*180/3.14)?.toFixed(2)}</h1>
              </div>
          </div>



          <div>
            <form onSubmit={handleSubmit}>
            <button id = 'logbut' type='submit'>Logout</button>
            </form>
          </div>
        </div>
        <div id ='friends'>

          <SearchBar ip={ip}/>

          <div id='friendList'>
          <h2>Your Friends</h2>
            {friends.map((friend, index) =>
                <div className = 'butWrap'><button className = 'aFriend' onClick={(e) => handleClick(e, friend)}>{friend}</button></div>
            )}
          </div>

        </div>
      </div>


    </div>

  );
}
