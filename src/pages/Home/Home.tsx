import React, { useEffect, useState } from "react";
import styled from 'styled-components';

import HomeStyle from '../../styles/HomeStyle.module.scss'
import GlobalStyle from '../../styles/GlobalStyle.module.scss'

import { Navigate } from "react-router-dom";


function Home(){
    return (
        <div className={GlobalStyle.PageContainer}>

          <div className={GlobalStyle.Logo}></div>
        </div>
        
  );
};


export default Home;