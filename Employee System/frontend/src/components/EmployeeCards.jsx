import React from "react";
import axios from 'axios'
import './EmployeeCards.css'
import { useState, useEffect } from "react";
import { createuserapi, deleteuserapi, getuserapi, updateuserapi } from "../service/api";
const EmployeeCards = () => {

  const [user, setUsers] = useState([])
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    empId: '',
    mobile:'',
    age:'',
    designation:''
  })
  const [isEdit, setIsEdit] = useState(false)

  const [userID, setUserId] = useState('')

  async function getUserData() {
    try {
      const response = await axios.get(getuserapi)
      console.log(response.data.user)

      setUsers(response.data.user)

    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getUserData()
  }, [])


  function changeHandler(e) {

    let { name, value } = e.target


    setNewUser((preItem) => {
      return { ...preItem, [name]: value }
    })

  }

  async function createUser() {
    try {
      const response = await axios.post(createuserapi, newUser)
      console.log(response)
      getUserData()
    } catch (error) {
      console.log(error)
    }
  }
  async function updatedUser() {
    try {
      const response = await axios.put(`${updateuserapi}/${userID}`, newUser)
      getUserData()
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }

  function submitHandler(e) {
    e.preventDefault()
    // console.log(e)
    if (isEdit) {
      updatedUser()
    } else {
      createUser()
    }
    // console.log(newUser)
    setNewUser({
      name: '',
      email: '',
      empId: '',
      mobile:'',
      age:'',
      designation:''
    })



  }
  async function deleteHandler(userID) {
    try {
      console.log(userID)
      const response = await axios.delete(`${deleteuserapi}/${userID}`)
      getUserData()
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }
  async function editHandler(userID) {
    console.log(userID)
    setUserId(userID)
    setIsEdit(true)

  }


  return (
    <div className="container">
      <h1>Employee System App</h1>
      <form onSubmit={submitHandler}>
        <label>Name:
          <input required value={newUser.name} onChange={changeHandler} name='name' placeholder='Name' type="text" /><br /><br></br>
        </label>
        <label>E-mail:
          <input required value={newUser.email} onChange={changeHandler} name='email' placeholder='Email' type="email" /><br /><br />
        </label>
        <label>Employee ID:
          <input  required value={newUser.empId} onChange={changeHandler} name='empId' placeholder='EmpId' type="text" /><br /><br />
        </label>
        <label>Mobile:
          <input required value={newUser.mobile} onChange={changeHandler} name='mobile' placeholder="mobile" type="tel" /><br/><br/>
        </label>
         <label>Age:
          <input required value={newUser.age} onChange={changeHandler} name='age' placeholder="age" type="number" min={20}/><br/><br/>
        </label>
         <label>Designation:
          <input required value={newUser.designation} onChange={changeHandler} name='designation' placeholder="Designation" type="text"/><br/><br/>
        </label>
        <button type='submit'>{isEdit ? 'Update' : 'Create'}</button>
      </form>


      <div className="employee-list">
        {
          user.map((item, i) => {
            return <div className="employee-card" key={i}>
              <p><span>Name:</span> {item.name}</p>
              <p><span>Email:</span> {item.email}</p>
              <p><span>Employee ID:</span> {item.empId}</p>
              <p><span>Mobile:</span> {item.mobile}</p>
              <p><span>Age:</span> {item.age}</p>
              <p><span>Designation:</span> {item.designation}</p>
              <div className="btn-group">
                <button onClick={() => deleteHandler(item._id)} >Delete</button>
                <button onClick={() => editHandler(item._id)}>Edit</button>
              </div>
              <hr />
            </div>
          })
        }
      </div>
    </div>
  )
}

export default EmployeeCards