import React from 'react'

function Radiobuttons(props) {
  return (
    <div>
        <div className="form-check form-check-inline">
        <input className="form-check-input" onChange={props.handleChange} type="radio" name="gender" id="inlineRadio1" value="male" checked={props.data?.gender==='male'}/>
        <label className="form-check-label" htmlFor="inlineRadio1">Male</label>
        </div>
        <div className="form-check form-check-inline">
        <input className="form-check-input" onChange={props.handleChange} type="radio" name="gender" id="inlineRadio2" value="female" checked={props.data?.gender==='female'}/>
        <label className="form-check-label" htmlFor="inlineRadio2">Female</label>
        </div>
        <div className="form-check form-check-inline">
        <input className="form-check-input" onChange={props.handleChange} type="radio" name="gender" id="inlineRadio3" value="others" checked={props.data?.gender==='others'}/>
        <label className="form-check-label" htmlFor="inlineRadio3">Others</label>
        </div>
    </div>
  )
}

export default Radiobuttons