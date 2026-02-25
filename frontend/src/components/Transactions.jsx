import React from 'react'
import { useState } from 'react'
const Transactions = () => {
    const handleSubmit=()=>{
        const [amount,setAmount]=useState(0)
        const [type,setType]=useState("")
        const [category,setCategory]=useState("")
    }
  return (
    <div>
        <form onSubmit={handleSubmit}>
            <label>Amount: 
                <input type="number" />
            </label>
            <label>Type: 
                
                <select value={type} onChange={(e)=>setType(e.target.value)}>
                    <option value="debit">Debit</option>
                    <option value="credit">Credit</option>
                </select>
            </label>
            <label>Category: 
                <select value={category} onChange={(e)=>setCategory(e.target.value)}>
                    <option value="marketing">Marketing</option>
                    <option value="development">Development</option>
                    <option value="testing">Testing</option>
                    <option value="legal">Legal</option>
                </select>
            </label>
        </form>
      
    </div>
  )
}

export default Transactions
