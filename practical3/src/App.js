import React, {useState,useEffect} from 'react';
function App()
{
  const[currentTime,setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(()=>{
      setCurrentTime(new Date());
    },1000);
    return () => clearInterval(timer);
  }, []);
  const formattedDate = currentTime.toLocaleDateString();
  const formattedTime = currentTime.toLocaleTimeString();
   return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Welcome to CHARUSAT!!!!</h1>
      <h2>It is {formattedDate}</h2>
      <h2>It is {formattedTime}</h2>
    </div>
  );
}
export default App;