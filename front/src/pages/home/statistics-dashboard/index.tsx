/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'src/utils/axios';
import CartDashPanel from './views/caesar';

function StatisticsDashboard() {

  const [isEngineer, setEngineer] = useState<boolean>(false);
  const [resultReceived, setResultReceived] = useState<boolean>(false);

  useEffect(() => {
    // Query the database for the current user's privileges.
    const fetchData = async () => {
      const params = { email: localStorage.getItem('email') };
      const response = await axios.post('/getEngineerStatus', params);

      // Returns 1 if the user has engineer privileges,
      // and 0 if the user does not have engineer privileges.
      if (response.data) {
        setEngineer(response.data);
      } else if (localStorage.getItem('isEngineer') == null) {
        setEngineer(false);
      }
      setResultReceived(true);
    };
    fetchData();
  }, []);


  return (
    <>
      {isEngineer
        ? <CartDashPanel />
        : resultReceived?<Redirect to='/' />:null
      }
    </>
  );
}

export default StatisticsDashboard;
