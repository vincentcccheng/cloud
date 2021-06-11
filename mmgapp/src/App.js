import React, { useState, Fragment, useEffect } from "react"
import axios from "axios"

import AddMCForm from "./components/AddMCForm"
import EditItemForm from "./components/EditItemForm"
import ItemTable from "./components/ItemTable"
import ItemTotal from "./components/ItemTotal"
import DefectTable from "./components/DefectTable"
import DefectList from "./components/DefectList"
import ShowAlert from "./components/ShowAlert"
import CheckForm from "./components/CheckForm"
import UploadForm from "./components/UploadForm"
import SearchKey from "./components/SearchKey"
import MainMenu from "./components/MainMenu"
import { v4 as uuidv4 } from "uuid"
import DatePicker from "react-datepicker"

const App = () => {
  const initialFormState = { id: null, mc_no: "", item_no: "", order_qty: "", ship_qty: "" }
  // const initialFormState  = { id: uuidv4(), mc_no: 'mc#1',  item_no: 'item#1', order_qty: 100, ship_qty: 100 }
  const initialInspectionID = { mc: "", iteration: "select", type: "select" }

  // Setting state
  const [items, setItems] = useState([])
  const [editing, setEditing] = useState(false)
  const [currentItem, setCurrentItem] = useState(initialFormState)
  const [defects, setDefects] = useState([])
  const [alert, setAlert] = useState("")
  const [alertBar, setAlertBar] = useState(0)
  const [mcTable, setMCTable] = useState([])
  const [checkList, setCheckList] = useState(checkListTable)
  const [inspectionDate, setInspectionDate] = useState(new Date())
  const [inspectionID, setInspectionID] = useState(initialInspectionID)
  const [uploads, setUploads] = useState([])
  
  // Data

  useEffect(() => {
    fetch("/api/getAllMC", {
      method: "GET"
      // ,
      // "headers": {
      //   "x-rapidapi-host": "fairestdb.p.rapidapi.com",
      //   "x-rapidapi-key": "apikey"
      // }
    })
      .then(response => response.json())
      .then(response => {
        setMCTable(response)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  // // Get Inspection Result (checkList)
  // useEffect(() => {
  //   fetch("/api/load", {
  //     method: "GET"
  //     // ,
  //     // "headers": {
  //     //   "x-rapidapi-host": "fairestdb.p.rapidapi.com",
  //     //   "x-rapidapi-key": "apikey"
  //     // }
  //   })
  //     .then(response => response.json())
  //     .then(response => {
  //       //console.log(response['result']['checkList'])
  //       setCheckList(response["result"]["checkList"])
  //       setItems(response["result"]["items"])
  //     })
  //     .catch(err => {
  //       console.log(err)
  //     })
  // }, [])

  // CRUD operations
  const addMC = mc => {
    
    mcTable.map(mc_row => (mc_row.mc_no === mc.mc ? ((mc_row.id = uuidv4()), setItems(prev => prev.concat(mc_row))) : null))
  }

  const deleteAllItems = item_no => {
    setEditing(false)
    setItems(items.filter(item => item.item_no !== item_no))
  }

  const deleteItem = id => {
    setEditing(false)
    setItems(items.filter(item => item.id !== id))
  }

  const updateItem = (id, updatedItem) => {
    setEditing(false)
    setItems(items.map(item => (item.id === id ? updatedItem : item)))
  }

  const editRow = item => {
    setEditing(true)
    setCurrentItem({ id: item.id, mc_no: item.mc_no, item_no: item.item_no, order_qty: item.order_qty, ship_qty: item.ship_qty })
  }

  const addToDefectList = (product, defect_area, defect_detail, major, minor) => {
    //setEditing(false)
    setDefects(prev => prev.concat({ id: uuidv4(), product, defect_area, defect_detail, major, minor }))
  }

  const deleteDefect = id => {
    setEditing(false)
    setDefects(defects.filter(defect => defect.id !== id))
  }

  const setDisplayAlert = (alert, bar) => {
    setAlertBar(bar)
    setAlert(alert)
    setTimeout(function () {
      setAlert("")
    }, 3000)
  }

  const handleCheckItemChange = (id, change) => {
    const newCheckList = [...checkList]
    const index = newCheckList.findIndex(r => r.id === id)
    newCheckList[index] = change
    setCheckList(newCheckList)
    //setCheckList([...checkList], { id: change })
  }

  const handleSave = () => {
    //const formData = new FormData()
    //formData.append('checkList', checkList)
    console.log(checkList, "checklist$$$")

    axios({
      url: "/api/save",
      //url: "/api/edit",
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      data: JSON.stringify({ _id: inspectionID, checkList: checkList, items: items, defects: defects, uploads: uploads })
    })
      .then(res => {
        //console.log("Saved")
        setDisplayAlert("Saved Successfully! ",0)
      })
      .catch(err => {
        console.log(err.response.data)
        setDisplayAlert("There was an error in saving, please contact the admin !!",0)
      })
  }

  const handleSearch = () => {
    axios({
      url: "/api/search",
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      data: JSON.stringify({ _id: inspectionID })
    })
      .then(response => response.data)
      .then(response => {
        setCheckList(response["checkList"])
        setItems(response["items"])


        if (response["defects"] === undefined) {
          setDefects([])
        }
        else {    
          console.log(response["defects"])
          setDefects(response["defects"])
        }

        if (response["uploads"] === undefined) {
          setUploads("")
        }
        else {    
          console.log(response["uploads"])
          setUploads(response["uploads"])
        }
        
      })
      .catch(err => {
        //console.log(err)
        setDisplayAlert("No such Inspection ID, please try again !",0)

      })
  }

  return (
    <div className="container">
      <h1>Macy's Inspection Result Capture</h1>

      <div className="flex-row">
        <div className="flex-large">
          <Fragment>
            <MainMenu handleSave={handleSave} handleSearch={handleSearch} />
          </Fragment>
        </div>
      </div>

      {alertBar === 0 ? (
        <div className="flex-row">
          <div className="flex-large">
            <ShowAlert alert={alert} />
          </div>
        </div>
      ) : null}

      <div className="flex-row">
        <div className="flex-large">
          <Fragment>
            <h2>Search Inspection</h2>
            <SearchKey addMC={addMC} mcTable={mcTable} items={items} setDisplayAlert={setDisplayAlert} inspectionID={inspectionID} setInspectionID={setInspectionID} />
          </Fragment>
        </div>
      </div>

      {/* Inspection Date  */}
      <div className="flex-row">
        <div className="flex-large">
          Inspection Date : <DatePicker dateFormat="MM/dd/yy" selected={inspectionDate} onChange={date => setInspectionDate(date)} />
        </div>
      </div>

      <div className="flex-row">
        <div className="flex-large">
          {editing ? (
            <Fragment>
              <h2>Edit Ship Qty</h2>
              <EditItemForm editing={editing} setEditing={setEditing} currentItem={currentItem} updateItem={updateItem} />
            </Fragment>
          ) : (
            <Fragment>
              <h2>Add MC</h2>
              <AddMCForm addMC={addMC} mcTable={mcTable} items={items} setDisplayAlert={setDisplayAlert} />
            </Fragment>
          )}
        </div>
        <div className="flex-large">
          <h2>Item Breakdown</h2>
          <ItemTable items={items} editRow={editRow} deleteItem={deleteItem} />
        </div>
      </div>
      <div className="flex-row">
        <div className="flex-large">
          <h2>Group By Items</h2>
          <ItemTotal items={items} deleteAllItems={deleteAllItems} />
        </div>
      </div>

      <div className="flex-row">
        <div className="flex-large">
          <h2>Defects</h2>
          <DefectTable items={items} setEditing={setEditing} addToDefectList={addToDefectList} setDisplayAlert={setDisplayAlert} />
        </div>
      </div>

      {alertBar === 2 ? (
        <div className="flex-row">
          <div className="flex-large">
            <ShowAlert alert={alert} />
          </div>
        </div>
      ) : null}

      <div className="flex-row">
        <div className="flex-large">
          <DefectList defects={defects} setEditing={setEditing} deleteDefect={deleteDefect} />
        </div>
      </div>

      <div className="flex-row">
        <div className="flex-large">
          <CheckForm checkList={checkList} handleCheckItemChange={handleCheckItemChange} />
        </div>
      </div>

      <div className="flex-row">
        <div className="flex-large">
          {alertBar === 3 ? (
            <div className="flex-row">
              <div className="flex-large">
                <ShowAlert alert={alert} />
              </div>
            </div>
          ) : null}
          <UploadForm setDisplayAlert={setDisplayAlert} inspectionID={inspectionID} setUploads={setUploads} uploads={uploads} />
        </div>
      </div>
    </div>
  )
}

const checkListTable = [
  { id: 1, section: "A1", category: "Material", item: "Color", result: "Select" },
  { id: 2, section: "A2", category: "Material", item: "Quality", result: "Select" },
  { id: 3, section: "A3", category: "Material", item: "Hand Feel", result: "Select" },
  { id: 4, section: "A4", category: "Material", item: "Finish / Print", result: "Select" }
]

export default App
