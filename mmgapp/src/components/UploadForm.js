import React, { Fragment, useState } from "react"
import axios from "axios"
import PhotoBlock from "../components/PhotoBlock"

const UploadForm = props => {
  const [selectedFile, setSelectedFile] = useState()
   
  const inspectionID = props.inspectionID
  
  const handleFile = event => {
    setSelectedFile({ file: event.target.files })
  }

  const handleUpload = event => {
    //event.preventDefault()

    props.setDisplayAlert('Do not hit "UPLOAD" button again ! Upload in progress', 3)

    const formData = new FormData()

    const files = selectedFile.file

    for (let i = 0; i < files.length; i++) {
      formData.append(`files[]`, files[i])
      //console.log(files[i], "hello  ---$$$")
    }

    axios({
      url: "/upload",
      method: "POST",
      data: formData
    })
      .then(res => {
        for (var i = 0; i < res.data.length; i++) {
          const _id = res.data[i]._id
          const inspection_id = inspectionID
          const file_name = res.data[i].file_name
          const mime_type = res.data[i].mime_type
          console.log("file_name", file_name)
          props.setUploads(prev => prev.concat({ _id, enable: true, file_name, inspection_id, mime_type }))
        }
      })
      .catch(err => {
        //console.log(err.response.data)
      })
  }

  const downloadDoc = (_id, file_name) => event => {
    event.preventDefault()

    fetch("/download/" + _id, {
      method: "GET",
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": "attachment"
      }
    })
      .then(response => response.blob())
      .then(blob => {
        // Create blob link to download
        const url = window.URL.createObjectURL(new Blob([blob]))
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", file_name)

        // Append to html link element page
        document.body.appendChild(link)

        // Start download
        link.click()

        // Clean up and remove the link
        link.parentNode.removeChild(link)
      })
  }

  function getExtension(file_name) {
    var parts = file_name.split(".")
    return parts[parts.length - 1]
  }

  function showMimeIcon(file_name) {
    const iconTypes = [
      { ext: "jpeg", icon: "file-image-o" },
      { ext: "jpg", icon: "file-image-o" },
      { ext: "bmp", icon: "file-image-o" },
      { ext: "png", icon: "file-image-o" },
      { ext: "jif", icon: "file-image-o" },
      { ext: "mp4", icon: "file-movie-o" },
      { ext: "avi", icon: "file-movie-o" },
      { ext: "mpg", icon: "file-movie-o" },
      { ext: "txt", icon: "file-text-o" },
      { ext: "xlsx", icon: "file-excel-o" },
      { ext: "xls", icon: "file-excel-o" },
      { ext: "doc", icon: "file-word-o" },
      { ext: "docx", icon: "file-word-o" },
      { ext: "ppt", icon: "file-powepoint-o" },
      { ext: "pdf", icon: "file-pdf-o" },
      { ext: "pptx", icon: "file-pdf-o" },
      { ext: "zip", icon: "file-zip-o" }
    ]

    const fileExtension = getExtension(file_name)
    const iconType = iconTypes.find(x => x.ext === fileExtension.toLowerCase()).icon
    const iconFont = iconType ? iconType : "fa-fa-file" // file type not registered
    return "fa fa-" + iconFont + " addSpace"
  }

  const deleteUpload = id => {
    const newUploadTable = [...props.uploads]
    const index = newUploadTable.findIndex(r => r._id === id)
    const uploadItem = newUploadTable.find(r => r._id === id)
    newUploadTable[index] = { ...uploadItem, enable: false }
    //console.log(newUploadTable)
    props.setUploads(newUploadTable)
  }

  return (
    <Fragment>
      <PhotoBlock uploadTable={props.uploads} downloadDoc={downloadDoc} />
      <div>
        <form>
          <label>Select File </label>
          <input type="file" multiple name="file" onChange={handleFile} />
          <button type="button" onClick={handleUpload}>
            Upload Documents
          </button>
        </form>
      </div>

      <h5>Documents</h5>
      <table id="uploadFiles">
        <tbody>
          {props.uploads
            .filter(y => y.enable)
            .map(x => (
              <tr key={x._id}>
                <td>
                  <button
                    className="button-delete small-button"
                    onClick={() => {
                      deleteUpload(x._id)
                    }}
                  >
                    &times;
                  </button>
                  <a href="/#" onClick={downloadDoc(x._id, x.file_name)}>
                    <i className={showMimeIcon(x.file_name)} />
                    {x.file_name}
                  </a>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Fragment>
  )
}

export default UploadForm
