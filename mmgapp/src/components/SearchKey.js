import React, { useState } from "react"

const SearchKey = props => {
  const [key, setKey] = useState(props.inspectionID)

  const handleKeyChange = event => {
    const id = event.target.id
    const { value } = event.target

    switch (id) {
      case "mc":
        setKey({ ...key, mc: value })
        props.setInspectionID({ ...key, mc: value })
        break
      case "iteration":
        setKey({ ...key, iteration: value })
        props.setInspectionID({ ...key, iteration: value })
        break
      case "type":
        setKey({ ...key, type: value })
        props.setInspectionID({ ...key, type: value })
        break
      default:
        break
    }
  }

  const validateMC = mc => {
    const found = props.mcTable.find(x => x.mc_no === mc)
    const duplicate = props.items.find(x => x.mc_no === mc)
    if (found == null) {
      displayAlert("No such MC, please check ! ", 0)
    } else if (duplicate == null) {
      props.addMC({ mc: mc })
    } else {
      displayAlert("MC was already entered, please check ! ", 0)
    }
  }

  const displayAlert = (msg, bar) => {
    props.setDisplayAlert(msg, bar)
  }

  return (
    <form
      onSubmit={event => {
        event.preventDefault()
        validateMC(key.mc)
      }}
    >
      {key.mc ? (
        <h5 className="searchKey_alert">
          {key.mc}-{key.iteration}-{key.type}
        </h5>
      ) : null}

      <div className="searchKey">
        <label>MC No.</label>
        <input type="text" name="mc" id="mc" onChange={handleKeyChange} />
        <label>Iteration</label>

        <input type="number" name="iteration" id="iteration" placeholder="interation" min="1" max="9" onChange={handleKeyChange} />

        <label>Type</label>

        <select name="type" id="type" onChange={handleKeyChange}>
          <option value="Select">Select</option>
          <option value="Final">Final</option>
          <option value="1stLine">1st Line</option>
          <option value="2ndLine">2nd Line</option>
          <option value="3rdLine">3rd Line</option>
        </select>

        {/* <button>Search</button> */}
      </div>
    </form>
  )
}

export default SearchKey
