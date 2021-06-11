import React from "react"

const ItemTable = props => {
  const sortTable = sort => {
    var table, rows, switching, i, x, y, shouldSwitch
    table = document.getElementById("itemTable")
    switching = true
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
      //start by saying: no switching is done:
      switching = false
      rows = table.rows
      /*Loop through all table rows (except the
      first, which contains table headers):*/
      for (i = 1; i < rows.length - 1; i++) {
        //start by saying there should be no switching:
        shouldSwitch = false
        /*Get the two elements you want to compare,
      one from current row and one from the next:*/
        x = rows[i].getElementsByTagName("TD")[sort]
        y = rows[i + 1].getElementsByTagName("TD")[sort]
        //check if the two rows should switch place:
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true
          break
        }
      }
      if (shouldSwitch) {
        /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i])
        switching = true
      }
    }
  }

  return (
    <table id="itemTable">
      <thead>
        <tr>
          <th>MC#</th>
          <th>Item</th>
          <th>Order Qty</th>
          <th>Ship Qty</th>
          <th>
            <button
              onClick={() => sortTable(1)}
              //className="button muted-button"
            >
              By Item
            </button>
          </th>
          <th>
            <button
              onClick={() => sortTable(0)}
              //className="button muted-button"
            >
              By MC
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        {props.items.length > 0 ? (
          props.items.map(item => (
            <tr key={item.id}>
              <td>{item.mc_no}</td>
              <td>{item.item_no}</td>
              <td>{item.order_qty}</td>
              <td>{item.ship_qty}</td>
              <td>
                <button
                  onClick={() => {
                    props.editRow(item)
                  }}
                  className="button muted-button"
                >
                  Edit
                </button>
              </td>
              <td>
                <button onClick={() => props.deleteItem(item.id)} className="button muted-button">
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

export default ItemTable
