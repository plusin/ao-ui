import InventorySlot from '../../../../../Common/InventorySlot/inventory-slot'
import './extra-slot-line.scss'

const getImageForState = state => {
  if (state) {
    return require('../../../../../../assets/Icons/inventory-extra/main_inv_check_off.png')
  }
  else {
    return require('../../../../../../assets/Icons/inventory-extra/main_inv_check_on.png')
  }
}
export default function ExtraSlotLine({locked, inventory, start}) {
  return (
    <div className='locked-line'>
      <img className='extra-slot' src={getImageForState(locked)}/>
      {
        inventory.slice(start, start+6).map( (item,index) => (
          <InventorySlot key={index} content={item} locked={locked}/>
        ))
      }
    </div>
  )
}