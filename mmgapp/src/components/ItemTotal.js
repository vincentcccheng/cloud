import React from "react"

const ItemTotal = props => {
  // remove columns : mc_no and id in prepration for calculating total by item#

  const items1 = props.items.map(function (obj) {
    return {
      item_no: obj.item_no,
      //order_qty: obj.order_qty,
      ship_qty: obj.ship_qty
    }
  })

  // use reduce to calculate total by item#
  const items2 = items1.reduce((prev, next) => {
    if (next.item_no in prev) {
      prev[next.item_no].ship_qty = parseInt(prev[next.item_no].ship_qty) + parseInt(next.ship_qty)
    } else {
      prev[next.item_no] = next
    }
    return prev
  }, {})
  // present each item total
  const items3 = Object.keys(items2).map(item_no => items2[item_no])

  return (
    // present the table
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Ship Qty</th>
          <th>Delete Item</th>
        </tr>
      </thead>
      <tbody>
        {items3.length > 0 ? (
          items3.map(item => (
            <tr key={item.item_no}>
              <td>{item.item_no}</td>
              <td>{item.ship_qty}</td>
              <td>
                <button
                  onClick={() => {
                    props.deleteAllItems(item.item_no)
                  }}
                  //className="button muted-button"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={3}>No items</td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

export default ItemTotal
