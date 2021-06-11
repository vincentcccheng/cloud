import React, { useState } from "react"

const AddMCForm = props => {

  const [mc, setMC] = useState("")

  const handleInputChange = event => {
    const { value } = event.target
    setMC({ mc: value })
  }

  const validateMC = mc => {
    const found = props.mcTable.find(x => x.mc_no === mc)
    const duplicate = props.items.find(x => x.mc_no === mc)
    if (found == null) {
      displayAlert("No such MC, please check ! ",0)
    } else if (duplicate == null) {
      props.addMC({ mc: mc })
    } else {
      displayAlert("MC was already entered, please check ! ",0)
    }
  }

  const displayAlert = (msg, bar) => {
    props.setDisplayAlert(msg, bar)
  }

  return (
    <form
      onSubmit={event => {
        event.preventDefault()
        validateMC(mc.mc)
      }}
    >
      <label>Name</label>
      <input type="text" name="mc" onChange={handleInputChange} />
      <button>Add new MC</button>
    </form>
  )
}

export default AddMCForm
