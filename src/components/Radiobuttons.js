import React from 'react'

function Radiobuttons(props) {
  return (
    <div className='flex justify-center gap-10'>
        <div className="flex form-check form-check-inline align-center">
        <input className="form-check-input mr-2" onChange={props.handleChange} type="radio" name="gender" id="inlineRadio1" value="male" checked={props.data?.gender==='male'} required/>
        <label className="form-check-label" htmlFor="inlineRadio1">Male</label>
        </div>
        <div className="flex form-check form-check-inline align-center">
        <input className="form-check-input mr-2" onChange={props.handleChange} type="radio" name="gender" id="inlineRadio2" value="female" checked={props.data?.gender==='female'} required/>
        <label className="form-check-label" htmlFor="inlineRadio2">Female</label>
        </div>
        <div className="flex form-check form-check-inline align-center">
        <input className="form-check-input mr-2" onChange={props.handleChange} type="radio" name="gender" id="inlineRadio3" value="others" checked={props.data?.gender==='others'} required/>
        <label className="form-check-label" htmlFor="inlineRadio3">Others</label>
        </div>
    </div>
  )
}

export default Radiobuttons