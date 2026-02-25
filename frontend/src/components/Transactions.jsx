import React from 'react'

const Transactions = () => {
    const handleSubmit=()=>{

    }
  return (
    <div>
        <form onSubmit={handleSubmit}>
            <label>Amount: 
                <input type="number" />
            </label>
            <label>Type: 
                
                <select >
                    <option value="debit">Debit</option>
                    <option value="credit">Credit</option>
                </select>
            </label>
            <label>Category: 
                <input type="number" />
            </label>
        </form>
      
    </div>
  )
}

export default Transactions
