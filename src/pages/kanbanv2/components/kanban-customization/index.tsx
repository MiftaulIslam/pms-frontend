import { useState } from 'react'
import ColumnDndSheet from './column-dnd-sheet'
import CustomizePanel from './customize-panel'

const KanbanCustomization = () => {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <span className='cursor-pointer' onClick={() => setOpen(true)}>Customize</span>
      <CustomizePanel open={open} onClose={() => setOpen(false)} title="Customize Board" width={380}>
        <ColumnDndSheet />
      </CustomizePanel>
    </div>
  )
}

export default KanbanCustomization