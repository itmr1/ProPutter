import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import {Line, Scatter} from 'react-chartjs-2';
import {PointElement, LinearScale, CategoryScale, LineElement} from 'chart.js';
import axios from 'axios';
import { toHaveFormValues } from '@testing-library/jest-dom/dist/matchers';

export const Friends = ({data}) => {
  console.log(data)
  const graph_data = {
    labels: [1,2,3,4,5,6,7,8,9,10],
    datasets: [
      {
        label: 'My First dataset',
        fill: true,
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
        pointRadius: 3,
        data: data.perf
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
  const scatter = {
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
        data: data.scat
      }
    ]
  };
  return(
    <div id='fpage'>
      <div id='titDash' >
        <h1 id='ftit'>ProPutter</h1>
      </div>
      <div id = 'friendspage'>
        <div>
        <h2>Let's see how your friend has been playing ! </h2>
        </div>
        <div id='fgraphs'>
          <div id='fperfGraph'>
              <h2>Performance Score</h2>
              <Line data={graph_data} options={options} />
          </div>
          <div id='fscattGraph'>
            <h2>Velocity vs Angle Deviation</h2>
            <Scatter data={scatter} options={options_scatter} />
          </div>
        </div>
        <div>
          <Link to={'/dashboard'}>
            <button id='backbutt'>Back to your profile</button>
          </Link>
        </div>
      </div>
    </div>



  )
}
