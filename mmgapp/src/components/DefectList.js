import React from "react"

const DefectList = props => {
  return (
    // present the table
    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th>Defect</th>
          <th>Defect Detail</th>
          <th>Major</th>
          <th>Minor</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {props.defects.length > 0 ? (
          props.defects.map(x => (
            <tr key={x.id}>
              <td>{x.product}</td>
              <td>{x.defect_area}</td>
              <td>{x.defect_detail}</td>
              <td>{x.major}</td>
              <td>{x.minor}</td>
              <td>
                <button
                  className="button-delete"
                  onClick={() => {
                    props.deleteDefect(x.id)
                  }}
                >
                  &times;
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={3}>No Defects</td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

export default DefectList
