import React, { useState, useEffect, Fragment } from "react"

const DefectTable = props => {
  // remove columns : mc_no and id in prepration for calculating total by item#

  const [currentProduct, setCurrentProduct] = useState("Select")
  const [currentDefectArea, setCurrentDefectArea] = useState("")
  const [currentDefectDetail, setCurrentDefectDetail] = useState("")
  const [currentMajor, setCurrentMajor] = useState("")
  const [currentMinor, setCurrentMinor] = useState("")
  const [defectList, setDefectList] = useState([])
  const [defectLanguage, setDefectLanguage] = useState("en")

  useEffect(() => {
    fetch("/api/getDefectTable", {
      method: "GET"
      // ,
      // "headers": {
      //   "x-rapidapi-host": "fairestdb.p.rapidapi.com",
      //   "x-rapidapi-key": "apikey"
      // }
    })
      .then(response => response.json())
      .then(response => {
        setDefectList(response)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  //  prepare for the defect selection - need to associate based on each specific product and then its associted defect.
  let d = defectList
  const productDefect = []

  while (d.length > 0) {
    const first = d[0]
    productDefect.push(first)
    d = d.filter(x => (x.product !== first.product || x.defect_area !== first.defect_area) && x._id !== first._id)
  }

  const handleSelectChangeProduct = event => {
    const { value } = event.target
    setCurrentProduct(value)
    setCurrentDefectArea("Select")
    setCurrentMajor("")
    setCurrentMinor("")
  }

  const handleSelectChangeDefect = event => {
    const { value } = event.target
    setCurrentDefectArea(value)
    setCurrentDefectDetail("Select")
  }

  const handleSelectChangeDefectDetail = event => {
    const { value } = event.target
    setCurrentDefectDetail(value)
  }

  const handleCurrentMajorChange = event => {
    const { value } = event.target
    setCurrentMajor(value)
  }

  const handleCurrentMinorChange = event => {
    const { value } = event.target
    setCurrentMinor(value)
  }

  const handleChangeDefectLanguage = event => {
    const { value } = event.target
    setDefectLanguage(value)
  }

  return (
    // present the table

    <Fragment>
      <div className="defectOption">
        <select className="defectOption__language" onChange={handleChangeDefectLanguage}>
          <option value="en">English</option>
          <option value="zh">Chinese</option>
        </select>
      </div>

      <div className="defectRow">
        <div className="defectOption">
          <select className="defectOption__product" onChange={handleSelectChangeProduct}>
            <option value="Select">Select</option>
            <option value="Fashion Jewelry">Fashion Jewelry</option>
            <option value="Footwear">Footware</option>
            <option value="Handbags">Handbags</option>
            <option value="Hardlines">Hardlines</option>
            <option value="Softlines">Softlines</option>
            
          </select>
        </div>
        <div className="defectOption">
          <select className="defectOption__defectArea" onChange={handleSelectChangeDefect}>
            <option value="Select">Select</option>
            {productDefect
              .filter(y => y.product === currentProduct && y.lang === defectLanguage)
              .map(x => (
                <option key={x._id} value={x.defect_area}>
                  {x.defect_area}
                </option>
              ))}
          </select>
        </div>
        <div className="defectOption">
          <select className="defectOption__defectDetail" onChange={handleSelectChangeDefectDetail}>
            <option value="Select">Select</option>
            {defectList
              .filter(y => y.product === currentProduct && y.defect_area === currentDefectArea && y.lang === defectLanguage)
              .map(x => (
                <option key={x._id} value={x.defect_detail}>
                  {x.defect_detail}
                </option>
              ))}
          </select>
        </div>
        <div className="defectOption">
          <input className="defectOption__major" type="number" name="major" placeholder="major" value={currentMajor} min="0" max="5" onChange={handleCurrentMajorChange} />
        </div>
        <div className="defectOption">
          <input className="defectOption__minor" type="number" name="minor" placeholder="minor" value={currentMinor} min="0" max="5" onChange={handleCurrentMinorChange} />
        </div>
        <div className="defectOption">
          <form
            onSubmit={event => {
              event.preventDefault()
              const major_int = isNaN(parseInt(currentMajor)) // check if empty, return true if empty
              const minor_int = isNaN(parseInt(currentMinor)) // check if empty, return true if empty

              if (currentProduct === "Select" || currentDefectArea === "Select" || currentDefectDetail === "Select") {
                props.setDisplayAlert("Please make sure you have selected Product, Defect and Defect Detail ! ", 2)
              } else if (major_int || minor_int || (currentMajor < 1 && currentMinor < 1)) {
                props.setDisplayAlert("Please make sure you have entered either Major and Minor quantity ! ", 2)
              } else {
                props.addToDefectList(currentProduct, currentDefectArea, currentDefectDetail, currentMajor, currentMinor)
              }
            }}
          >
            <button>Add to Defect</button>
          </form>
        </div>
      </div>
    </Fragment>
  )
}

export default DefectTable
