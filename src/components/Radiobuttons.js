import React from 'react'

function Radiobuttons(props) {
  return (
    <div>
        <div class="form-check form-check-inline">
        <input class="form-check-input" onChange={props.handleChange} type="radio" name="gender" id="inlineRadio1" value="male" checked={props.data?.gender==='male'}/>
        <label class="form-check-label" for="inlineRadio1">Male</label>
        </div>
        <div class="form-check form-check-inline">
        <input class="form-check-input" onChange={props.handleChange} type="radio" name="gender" id="inlineRadio2" value="female" checked={props.data?.gender==='female'}/>
        <label class="form-check-label" for="inlineRadio2">Female</label>
        </div>
        <div class="form-check form-check-inline">
        <input class="form-check-input" onChange={props.handleChange} type="radio" name="gender" id="inlineRadio3" value="others" checked={props.data?.gender==='others'}/>
        <label class="form-check-label" for="inlineRadio3">Others</label>
        </div>
    </div>
  )
}

export default Radiobuttons