import React, { Fragment } from "react"

const PhotoBlock = props => {
  return (
    <Fragment>
      <h5>Photos</h5>
      <div className="photoBorder">
        {
          //console.log(props.uploadTable),
          props.uploadTable.filter(x => x.enable && x.mime_type==="image/jpeg").length > 0
            ? props.uploadTable
                .filter(y => y.enable && y.mime_type==="image/jpeg")
                .map(x => (
                  <a key={x._id} href="/#" onClick={props.downloadDoc(x._id, x.file_name)}>
                    <div className="photoBlock">
                      <img src={"/download/" + x._id} alt="" /> {x.file_name}
                    </div>
                  </a>
                ))
            : "No photos"
        }
      </div>
    </Fragment>
  )
}

export default PhotoBlock
