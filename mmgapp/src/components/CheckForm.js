import React from "react"

const CheckForm = props => {
  const handleInputChange = (id, x) => {
    const selected = ["Select", "OK", "NA", "X", "NI"]
    let index = selected.findIndex(y => y === x.result)
    if (index === 4) {
      index = 1
    } else {
      index = index + 1
    }
    const nextSelected = selected[index]
    props.handleCheckItemChange(id, { ...x, result: nextSelected })
  }

  return (
    <form
      onSubmit={event => {
        event.preventDefault()
        //  props.updateItem(item.id, item)
      }}
    >
      <h5>Basic Check List</h5>
      <table id="customers" className="fixed">
        <thead>
          <tr>
            <th>Category</th>
            <th>Item</th>
            <th>Result</th>
            <th>Drop Down Result</th>
          </tr>
        </thead>
        <tbody>
          {props.checkList.map(x => (
            <tr key={x.id}>
              <td>{x.category}</td>
              <td>{x.item}</td>
              <td
                bgcolor="white"
                onClick={() => {
                  handleInputChange(x.id, x)
                }}
              >
                {x.result}
              </td>
              <td bgcolor="white">
                <select className="checkList__select">
                  <option className="checkList__option" value="Select">
                    Select
                  </option>
                  <option className="checkList__option" value="OK">
                    OK
                  </option>
                  <option className="checkList__option" value="X">
                    X
                  </option>
                  <option className="checkList__option" value="NI">
                    NI
                  </option>
                  <option className="checkList__option" value="NA">
                    NA
                  </option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </form>
  )
}

export default CheckForm
