import React, { useState, useEffect } from "react"

const EditItemForm = props => {
  const [item, setItem] = useState(props.currentItem)

  useEffect(() => {
    setItem(props.currentItem)
  }, [props])
  // You can tell React to skip applying an effect if certain values haven’t changed between re-renders. [ props ]

  const handleInputChange = event => {
    const { value } = event.target
    setItem({ ...item, ship_qty: value })
  }

  return (
    <form
      onSubmit={event => {
        event.preventDefault()

        props.updateItem(item.id, item)
      }}
    >
      <label>Ship Qty</label>
      <input type="text" name="ship_qty" value={item.ship_qty} onChange={handleInputChange} />
      <button>Update qty</button>
      {/* add type=button below to avoid form submisson message  */}
      <button type="button" onClick={() => props.setEditing(false)} className="button muted-button">
        Cancel
      </button>
    </form>
  )
}

export default EditItemForm
