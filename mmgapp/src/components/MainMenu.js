import React from "react"
//import React, { useState } from "react"

const MainMenu = props => {
  // const [key, setKey] = useState("")


  const handleClick = event => {
  const id = event.target.id
    //console.log(id)
    if (id ==="save") {
        props.handleSave()
    } 
    if (id ==="delete") {
      props.handleDelete()
    }  
    if (id ==="search") {
      props.handleSearch()
    }  


  }
 

  return (
 
      <div className="mainMenu">
        <button id="save"  onClick={handleClick}>Save</button>
        <button id="search"  onClick={handleClick}>Search</button>    
        <button id="delete" onClick={handleClick}>Delete</button>
      </div>
 
  )
}

export default MainMenu 

