import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [name,setName] = useState('');
  const [datetime,setDatetime] = useState('');
  const [description,setDescription]=useState('');
  const [transactions,setTransactions]=useState([]);
  useEffect(()=>{
    getTransactions().then(setTransactions);
  },[]);

  async function getTransactions(){
    const url='http://localhost:4040/api/transactions';
    const response=await fetch(url);
    return await response.json();
  }

  function addNewTransaction(ev) {
    ev.preventDefault();
  
    const url ='http://localhost:4040/api/transaction';
    const price=name.split(' ')[0];
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ 
        price,
        name:name.substring(price.length+1),
        description,
        datetime,
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(json => {
        setName('');
        setDatetime('');
        setDescription('');
        console.log('Result:', json);
        // Handle the result as needed
      })
      .catch(error => {
        console.error('Error:', error.message);
        // Handle errors, e.g., display an error message to the user
      });
  }
  let balance =0;
  for (const transaction of transactions){
    balance=balance+transaction.price;
  }

  balance=balance.toFixed(2);
  const fraction=balance.split('.')[1];
  return (
    <main>
      <h1>{balance}<span>{fraction}</span></h1>
      <form onSubmit={addNewTransaction}>
        <div className="basic">
          <input type="text"
          value={name}
          onChange={ev => setName(ev.target.value)}
          placeholder={'+200 new TV'}/>
          <input value={datetime} 
          onChange={ev=>setDatetime(ev.target.value)}
          type="datetime-local"/>
        </div>
        <div className="description">
          <input type="text" value={description} 
          onChange={ev=>setDescription(ev.target.value)}
          placeholder={'description'}/>
        </div>
        <button type="submit">Add New transaction</button>
        {transactions.length}
        
      </form>
      <div className="transactions">
        {transactions && transactions.length > 0 && transactions.map(transaction => (
          <div key={transaction.id} className="transaction">
            <div className="left">
              <div className="name">{transaction.name}</div>
              <div className="description">{transaction.description}</div>
            </div>
            <div className="right">
              <div className={`price ${transaction.price < 0 ? 'red' : 'green'}`}>
                {transaction.price}
              </div>
              <div className="datetime">{transaction.datetime}</div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;
